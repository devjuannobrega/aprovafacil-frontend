// Configuração da API Aprova Fácil
export const apiConfig = {
  // URL do backend
  baseUrl: import.meta.env.VITE_API_URL || "https://aprovafacil-backend.vercel.app",

  // API Key para autenticação
  apiKey: import.meta.env.VITE_API_KEY || "",

  // Configurações do produto
  product: {
    id: "limpa-nome-plano",
    title: "Plano Limpa Nome - Aprova Fácil",
    description: "Serviço completo de recuperação de crédito",
    price: 680.00,
    currency: "BRL",
  },
};

// Headers padrão para requisições
export const getHeaders = () => ({
  "Content-Type": "application/json",
  "X-API-Key": apiConfig.apiKey,
});

// Tipos para o pagamento
export interface PayerIdentification {
  type: string;
  number: string;
}

export interface Payer {
  email: string;
  first_name?: string;
  last_name?: string;
  identification?: PayerIdentification;
}

export interface PaymentRequest {
  token: string;
  transaction_amount: number;
  installments: number;
  payment_method_id: string;
  issuer_id?: string;
  payer: Payer;
  description?: string;
  external_reference?: string;
}

export interface PaymentResponse {
  success: boolean;
  payment_id: string;
  status: string;
  status_detail: string;
  external_reference?: string;
}

export interface PreferenceItem {
  id?: string;
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

export interface PreferenceRequest {
  items: PreferenceItem[];
  payer?: Payer;
  external_reference?: string;
  notification_url?: string;
}

export interface PreferenceResponse {
  success: boolean;
  preference_id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface CustomerData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  observation?: string;
}

// Funções auxiliares
export const formatCustomerToPayer = (customer: CustomerData): Payer => {
  const nameParts = customer.name.trim().split(" ");
  return {
    email: customer.email,
    first_name: nameParts[0],
    last_name: nameParts.slice(1).join(" ") || undefined,
    identification: {
      type: "CPF",
      number: customer.cpf.replace(/\D/g, ""),
    },
  };
};

// Criar preferência para Checkout Pro (Pix/Boleto)
export const createPreference = async (customerData: CustomerData): Promise<PreferenceResponse> => {
  const payer = formatCustomerToPayer(customerData);

  const preferenceRequest: PreferenceRequest = {
    items: [
      {
        id: apiConfig.product.id,
        title: apiConfig.product.title,
        description: apiConfig.product.description,
        quantity: 1,
        unit_price: apiConfig.product.price,
        currency_id: apiConfig.product.currency,
      },
    ],
    payer: payer,
    external_reference: `order_${Date.now()}_${customerData.cpf.replace(/\D/g, "")}`,
  };

  const response = await fetch(`${apiConfig.baseUrl}/api/payment/preference`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(preferenceRequest),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erro ao criar preferência de pagamento");
  }

  return response.json();
};
