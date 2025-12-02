import { useState, useEffect, useCallback } from "react";
import { apiConfig, getHeaders, CustomerData, formatCustomerToPayer } from "@/config/mercadopago";

declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale: string }) => MercadoPagoInstance;
  }
}

interface MercadoPagoInstance {
  bricks: () => BricksBuilder;
}

interface BricksBuilder {
  create: (
    brick: string,
    containerId: string,
    settings: unknown
  ) => Promise<BrickController>;
}

interface BrickController {
  unmount: () => void;
}

export interface CardPaymentFormData {
  token: string;
  issuer_id: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export type CardType = "credit_card" | "debit_card";
export type PaymentMethodType = "credit_card" | "debit_card" | "pix_boleto";

interface UseMercadoPagoReturn {
  publicKey: string | null;
  isLoading: boolean;
  error: string | null;
  isSDKLoaded: boolean;
  mpInstance: MercadoPagoInstance | null;
  createCardPaymentBrick: (
    containerId: string,
    amount: number,
    onSubmit: (formData: CardPaymentFormData) => Promise<void>,
    onReady?: () => void,
    onError?: (error: unknown) => void,
    payerEmail?: string,
    payerCPF?: string,
    cardType?: CardType
  ) => Promise<BrickController | null>;
}

export const useMercadoPago = (): UseMercadoPagoReturn => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [mpInstance, setMpInstance] = useState<MercadoPagoInstance | null>(null);

  // Buscar public key do backend
  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        console.log("[MP] Buscando public key...");
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiConfig.baseUrl}/api/payment/public-key`, {
          method: "GET",
          headers: getHeaders(),
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar public key");
        }

        const data = await response.json();
        console.log("[MP] Public key recebida:", data.public_key);
        setPublicKey(data.public_key);
      } catch (err) {
        console.error("[MP] Erro ao buscar public key:", err);
        setError("Não foi possível inicializar o pagamento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicKey();
  }, []);

  // Carregar SDK do Mercado Pago
  useEffect(() => {
    if (!publicKey) return;

    console.log("[MP] Carregando SDK...");

    // Verificar se já está carregado
    if (window.MercadoPago) {
      console.log("[MP] SDK já carregado");
      const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });
      setMpInstance(mp);
      setIsSDKLoaded(true);
      return;
    }

    // Carregar script do SDK
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;

    script.onload = () => {
      console.log("[MP] SDK carregado com sucesso");
      if (window.MercadoPago) {
        const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });
        setMpInstance(mp);
        setIsSDKLoaded(true);
      }
    };

    script.onerror = () => {
      console.error("[MP] Erro ao carregar SDK");
      setError("Erro ao carregar SDK do Mercado Pago");
    };

    document.body.appendChild(script);
  }, [publicKey]);

  // Criar Card Payment Brick
  const createCardPaymentBrick = useCallback(
    async (
      containerId: string,
      amount: number,
      onSubmit: (formData: CardPaymentFormData) => Promise<void>,
      onReady?: () => void,
      onError?: (error: unknown) => void,
      payerEmail?: string,
      payerCPF?: string,
      cardType?: CardType
    ): Promise<BrickController | null> => {
      console.log("[MP] Criando Card Payment Brick...", { containerId, amount, cardType });

      if (!mpInstance) {
        console.error("[MP] mpInstance não disponível");
        return null;
      }

      try {
        const bricksBuilder = mpInstance.bricks();

        // Configurar tipos de pagamento baseado na seleção
        const paymentMethodsConfig = cardType
          ? {
              types: {
                included: [cardType],
              },
              ...(cardType === "credit_card" && {
                creditCard: {
                  installments: {
                    maxInstallments: 12,
                    minInstallments: 1,
                  },
                },
              }),
            }
          : {
              types: {
                included: ["credit_card", "debit_card"],
              },
              creditCard: {
                installments: {
                  maxInstallments: 12,
                  minInstallments: 1,
                },
              },
            };

        const settings = {
          initialization: {
            amount: amount,
            payer: {
              email: payerEmail || "",
              identification: {
                type: "CPF",
                number: payerCPF || "",
              },
            },
          },
          customization: {
            visual: {
              style: {
                theme: "default" as const,
              },
              hidePaymentButton: false,
            },
            paymentMethods: paymentMethodsConfig,
          },
          callbacks: {
            onReady: () => {
              console.log("[MP] Card Payment Brick pronto!");
              onReady?.();
            },
            onSubmit: async (formData: CardPaymentFormData) => {
              console.log("[MP] Formulário submetido:", formData);
              await onSubmit(formData);
            },
            onError: (error: unknown) => {
              console.error("[MP] Erro no Brick:", error);
              onError?.(error);
            },
          },
        };

        console.log("[MP] Settings do Brick:", settings);

        const controller = await bricksBuilder.create(
          "cardPayment",
          containerId,
          settings
        );

        console.log("[MP] Brick criado com sucesso");
        return controller;
      } catch (err) {
        console.error("[MP] Erro ao criar Brick:", err);
        onError?.(err);
        return null;
      }
    },
    [mpInstance]
  );

  return {
    publicKey,
    isLoading,
    error,
    isSDKLoaded,
    mpInstance,
    createCardPaymentBrick,
  };
};

export default useMercadoPago;
