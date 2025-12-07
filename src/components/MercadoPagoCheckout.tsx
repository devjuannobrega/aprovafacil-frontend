import { useEffect, useState, useRef } from "react";
import { useMercadoPago, CardPaymentFormData, CardType, PaymentMethodType } from "@/hooks/useMercadoPago";
import {
  apiConfig,
  getHeaders,
  CustomerData,
  formatCustomerToPayer,
  PaymentResponse,
  createPreference,
} from "@/config/mercadopago";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Clock, CreditCard, QrCode, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MercadoPagoCheckoutProps {
  customerData: CustomerData;
  paymentMethod: PaymentMethodType;
  amount?: number;
  productTitle?: string;
  onSuccess?: (payment: PaymentResponse) => void;
  onError?: (error: unknown) => void;
  onPending?: (payment: PaymentResponse) => void;
}

type PaymentStatus = "idle" | "loading" | "ready" | "processing" | "approved" | "pending" | "rejected";

const MercadoPagoCheckout = ({
  customerData,
  paymentMethod,
  amount,
  productTitle,
  onSuccess,
  onError,
  onPending,
}: MercadoPagoCheckoutProps) => {
  // Usar valores padrão se não fornecidos
  const finalAmount = amount ?? apiConfig.product.price;
  const finalTitle = productTitle ?? apiConfig.product.title;
  const { toast } = useToast();
  const { isLoading, error, isSDKLoaded, createCardPaymentBrick } = useMercadoPago();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const brickControllerRef = useRef<{ unmount: () => void } | null>(null);

  // Determinar se é pagamento com cartão
  const isCardPayment = paymentMethod === "credit_card" || paymentMethod === "debit_card";

  // Criar o Card Payment Brick quando o SDK estiver carregado e for pagamento com cartão
  useEffect(() => {
    // Se não for pagamento com cartão, não criar o brick
    if (!isCardPayment) {
      // Limpar brick se existir
      if (brickControllerRef.current) {
        try {
          brickControllerRef.current.unmount();
        } catch (e) {
          console.log("[Checkout] Erro ao limpar brick:", e);
        }
        brickControllerRef.current = null;
      }
      setPaymentStatus("ready");
      return;
    }

    if (!isSDKLoaded) {
      console.log("[Checkout] Aguardando SDK...");
      return;
    }

    // Delay para garantir que o container está no DOM
    const timeoutId = setTimeout(async () => {
      const container = document.getElementById("cardPaymentBrick_container");
      if (!container) {
        console.error("[Checkout] Container não encontrado!");
        return;
      }

      console.log("[Checkout] Iniciando criação do Brick...", { paymentMethod });
      setPaymentStatus("loading");

      // Limpar brick anterior
      if (brickControllerRef.current) {
        try {
          brickControllerRef.current.unmount();
        } catch (e) {
          console.log("[Checkout] Erro ao limpar brick anterior:", e);
        }
        brickControllerRef.current = null;
      }

      const cardType: CardType = paymentMethod === "credit_card" ? "credit_card" : "debit_card";

      const controller = await createCardPaymentBrick(
        "cardPaymentBrick_container",
        finalAmount,
        handlePaymentSubmit,
        () => {
          console.log("[Checkout] Brick pronto!");
          setPaymentStatus("ready");
        },
        (err) => {
          console.error("[Checkout] Erro no Brick:", err);
          toast({
            title: "Erro",
            description: "Erro ao carregar formulário de pagamento.",
            variant: "destructive",
          });
        },
        customerData.email,
        customerData.cpf.replace(/\D/g, ""),
        cardType
      );

      if (controller) {
        brickControllerRef.current = controller;
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (brickControllerRef.current) {
        try {
          brickControllerRef.current.unmount();
        } catch (e) {
          console.log("[Checkout] Erro no cleanup:", e);
        }
      }
    };
  }, [isSDKLoaded, isCardPayment, customerData.email, customerData.cpf, createCardPaymentBrick, toast, paymentMethod]);

  // Handler do submit do pagamento
  const handlePaymentSubmit = async (formData: CardPaymentFormData) => {
    console.log("[Checkout] Processando pagamento...", formData);
    setPaymentStatus("processing");

    try {
      const payer = formatCustomerToPayer(customerData);

      const paymentRequest = {
        token: formData.token,
        transaction_amount: finalAmount,
        installments: formData.installments,
        payment_method_id: formData.payment_method_id,
        issuer_id: formData.issuer_id,
        payer: {
          email: payer.email,
          first_name: payer.first_name,
          last_name: payer.last_name,
          identification: payer.identification,
        },
        description: finalTitle,
        external_reference: `order_${Date.now()}_${customerData.cpf.replace(/\D/g, "")}`,
      };

      console.log("[Checkout] Enviando para API:", paymentRequest);

      const response = await fetch(`${apiConfig.baseUrl}/api/payment/process`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(paymentRequest),
      });

      const result = await response.json();
      console.log("[Checkout] Resposta da API:", result);

      if (!response.ok) {
        throw new Error(result.detail || "Erro ao processar pagamento");
      }

      setPaymentResult(result);

      switch (result.status) {
        case "approved":
          setPaymentStatus("approved");
          toast({
            title: "Pagamento Aprovado!",
            description: "Seu pagamento foi processado com sucesso.",
          });
          onSuccess?.(result);
          break;

        case "pending":
        case "in_process":
          setPaymentStatus("pending");
          toast({
            title: "Pagamento Pendente",
            description: "Seu pagamento está sendo processado.",
          });
          onPending?.(result);
          break;

        case "rejected":
          setPaymentStatus("rejected");
          toast({
            title: "Pagamento Recusado",
            description: getRejectMessage(result.status_detail),
            variant: "destructive",
          });
          onError?.(result);
          break;

        default:
          setPaymentStatus("rejected");
          toast({
            title: "Erro no pagamento",
            description: "Status desconhecido. Tente novamente.",
            variant: "destructive",
          });
          onError?.(result);
      }
    } catch (err) {
      setPaymentStatus("rejected");
      console.error("[Checkout] Erro:", err);
      toast({
        title: "Erro no pagamento",
        description: err instanceof Error ? err.message : "Ocorreu um erro ao processar seu pagamento.",
        variant: "destructive",
      });
      onError?.(err);
    }
  };

  // Mensagens de pagamento rejeitado
  const getRejectMessage = (statusDetail: string) => {
    const messages: Record<string, string> = {
      cc_rejected_insufficient_amount: "Saldo insuficiente no cartão.",
      cc_rejected_bad_filled_card_number: "Número do cartão incorreto.",
      cc_rejected_bad_filled_date: "Data de validade incorreta.",
      cc_rejected_bad_filled_security_code: "Código de segurança incorreto.",
      cc_rejected_bad_filled_other: "Dados do cartão incorretos.",
      cc_rejected_call_for_authorize: "Entre em contato com a operadora do cartão.",
      cc_rejected_card_disabled: "Cartão desabilitado.",
      cc_rejected_max_attempts: "Limite de tentativas excedido.",
      cc_rejected_duplicated_payment: "Pagamento duplicado.",
      cc_rejected_high_risk: "Pagamento recusado por segurança.",
    };
    return messages[statusDetail] || "Pagamento recusado. Tente outro cartão.";
  };

  // Tentar novamente
  const handleRetry = () => {
    setPaymentStatus("idle");
    setPaymentResult(null);
    // Re-trigger o useEffect
    window.location.reload();
  };

  // Loading inicial
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Inicializando pagamento...</p>
      </div>
    );
  }

  // Erro inicial
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <XCircle className="w-10 h-10 text-destructive" />
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Processando
  if (paymentStatus === "processing") {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-lg font-medium">Processando pagamento...</p>
        <p className="text-muted-foreground text-sm">Aguarde, não feche esta página.</p>
      </div>
    );
  }

  // Aprovado
  if (paymentStatus === "approved") {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-4 sm:space-y-6">
        {/* Ícone com animação */}
        <div className="relative">
          <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-success" />
          </div>
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <h3 className="font-poppins font-bold text-xl sm:text-2xl md:text-3xl text-success">
            Pagamento Aprovado!
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Parabéns! Seu pedido foi confirmado.
          </p>
        </div>

        {/* Card de confirmação */}
        <div className="w-full max-w-sm bg-success/5 border border-success/20 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Produto</span>
            <span className="font-medium text-foreground">{finalTitle}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Valor</span>
            <span className="font-medium text-foreground">R$ {finalAmount.toLocaleString("pt-BR")}</span>
          </div>
          {paymentResult && (
            <div className="flex items-center justify-between text-sm pt-2 border-t border-success/20">
              <span className="text-muted-foreground">ID da transação</span>
              <span className="font-mono text-xs text-muted-foreground">{paymentResult.payment_id}</span>
            </div>
          )}
        </div>

        {/* Próximos passos */}
        <div className="w-full max-w-sm bg-muted/50 rounded-xl p-4 sm:p-5">
          <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3">Próximos passos:</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">1</span>
              <span>Você receberá um e-mail de confirmação</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">2</span>
              <span>Nossa equipe entrará em contato em até 24h</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">3</span>
              <span>Iniciaremos o processo de limpeza do seu nome</span>
            </li>
          </ul>
        </div>

        {/* WhatsApp para dúvidas */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Dúvidas? Entre em contato pelo{" "}
          <a
            href="https://wa.me/5511999999999?text=Olá! Acabei de fazer minha compra e gostaria de informações."
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            WhatsApp
          </a>
        </p>
      </div>
    );
  }

  // Pendente
  if (paymentStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-4 sm:space-y-6">
        {/* Ícone */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-warning/10 rounded-full flex items-center justify-center">
          <Clock className="w-12 h-12 sm:w-14 sm:h-14 text-warning" />
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <h3 className="font-poppins font-bold text-xl sm:text-2xl md:text-3xl text-warning">
            Pagamento em Análise
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Seu pagamento está sendo processado.
          </p>
        </div>

        {/* Info card */}
        <div className="w-full max-w-sm bg-warning/5 border border-warning/20 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Aguardando confirmação</p>
              <p className="text-muted-foreground text-xs">Geralmente leva alguns minutos</p>
            </div>
          </div>
        </div>

        {/* O que acontece agora */}
        <div className="w-full max-w-sm bg-muted/50 rounded-xl p-4 sm:p-5">
          <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3">O que acontece agora?</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <span>Você receberá um e-mail quando o pagamento for confirmado</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <span>Não é necessário fazer nada, aguarde a confirmação</span>
            </li>
          </ul>
        </div>

        {paymentResult && (
          <p className="text-xs text-muted-foreground">
            Referência: {paymentResult.payment_id}
          </p>
        )}
      </div>
    );
  }

  // Rejeitado
  if (paymentStatus === "rejected") {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-4 sm:space-y-6">
        {/* Ícone */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-destructive/10 rounded-full flex items-center justify-center">
          <XCircle className="w-12 h-12 sm:w-14 sm:h-14 text-destructive" />
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <h3 className="font-poppins font-bold text-xl sm:text-2xl md:text-3xl text-destructive">
            Pagamento não aprovado
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Não se preocupe, você pode tentar novamente.
          </p>
        </div>

        {/* Dicas */}
        <div className="w-full max-w-sm bg-muted/50 rounded-xl p-4 sm:p-5">
          <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3">Dicas para aprovação:</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Verifique se os dados do cartão estão corretos</span>
            </li>
            <li className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Confirme se há limite disponível</span>
            </li>
            <li className="flex items-start gap-2">
              <QrCode className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Ou experimente pagar via Pix</span>
            </li>
          </ul>
        </div>

        {/* Botão tentar novamente */}
        <Button onClick={handleRetry} variant="cta" size="lg" className="w-full max-w-sm min-h-[48px]">
          Tentar novamente
        </Button>

        {/* Suporte */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Precisa de ajuda?{" "}
          <a
            href="https://wa.me/5511999999999?text=Olá! Tive um problema com meu pagamento e preciso de ajuda."
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Fale conosco
          </a>
        </p>
      </div>
    );
  }

  // Handler para Pix/Boleto - Redireciona para Checkout Pro
  const handlePixBoletoPayment = async () => {
    setIsRedirecting(true);
    try {
      toast({
        title: "Redirecionando...",
        description: "Você será redirecionado para o Mercado Pago.",
      });

      const preference = await createPreference(customerData);

      // Redirecionar para o checkout do Mercado Pago
      window.location.href = preference.init_point;
    } catch (err) {
      console.error("[Checkout] Erro ao criar preferência:", err);
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao processar pagamento.",
        variant: "destructive",
      });
      setIsRedirecting(false);
    }
  };

  // Formulário do Card Payment Brick
  const showLoading = (paymentStatus === "loading" || paymentStatus === "idle") && isCardPayment;

  return (
    <div className="space-y-4">
      {/* Conteúdo baseado no método selecionado */}
      {isCardPayment ? (
        /* Formulário do cartão */
        <div className="relative">
          {showLoading && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm sm:text-base">Carregando formulário de pagamento...</p>
            </div>
          )}
          <div
            id="cardPaymentBrick_container"
            style={{
              minHeight: paymentStatus === "ready" ? "400px" : "1px",
              opacity: paymentStatus === "ready" ? 1 : 0,
            }}
          />
        </div>
      ) : (
        /* Pix/Boleto - Botão para redirecionar */
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-xl p-4 sm:p-6 text-center">
            <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
            <h4 className="font-semibold text-base sm:text-lg text-foreground mb-2">
              Pix ou Boleto Bancário
            </h4>
            <p className="text-muted-foreground text-sm sm:text-base mb-4">
              Você será redirecionado para o Mercado Pago para escolher entre Pix ou Boleto.
            </p>
            <ul className="text-left text-xs sm:text-sm text-muted-foreground space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span><strong>Pix:</strong> Aprovação instantânea</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span><strong>Boleto:</strong> Vencimento em 3 dias úteis</span>
              </li>
            </ul>
            <Button
              onClick={handlePixBoletoPayment}
              disabled={isRedirecting}
              variant="cta"
              size="xl"
              className="w-full min-h-[52px]"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  Continuar com Pix/Boleto
                  <ExternalLink className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MercadoPagoCheckout;
