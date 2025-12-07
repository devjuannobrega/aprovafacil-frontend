// Serviço de API para comunicação com o backend

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// === TIPOS ===

// Auth
export interface UserRegister {
  name: string;
  email: string;
  password: string;
  cpf?: string;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  cpf?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Produtos
export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price_pf: string;
  price_pj: string;
  is_active: boolean;
  created_at?: string;
}

// Pedidos
export interface OrderItemCreate {
  product_id: number;
  quantity?: number;
}

export interface OrderCreate {
  items: OrderItemCreate[];
  person_type?: string;
  notes?: string;
}

export interface OrderItemResponse {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  status: string;
  person_type: string;
  subtotal: string;
  total: string;
  notes?: string;
  items: OrderItemResponse[];
  created_at?: string;
  updated_at?: string;
  paid_at?: string;
  completed_at?: string;
}

// Pagamentos
export interface PaymentPreferenceCreate {
  order_id: number;
  payment_method: string;
}

export interface PaymentPreferenceResponse {
  preference_id: string;
  init_point: string;
  sandbox_init_point?: string;
}

export interface CardPaymentCreate {
  order_id: number;
  token: string;
  installments?: number;
  payment_method_id: string;
  issuer_id?: string;
}

export interface PaymentResponse {
  payment_id: number;
  order_id?: number;
  mp_payment_id?: string;
  mp_preference_id?: string;
  method?: string;
  status: string;
  status_detail?: string;
  amount?: string;
  pix_qr_code?: string;
  pix_qr_code_base64?: string;
  boleto_url?: string;
  boleto_barcode?: string;
  created_at?: string;
  paid_at?: string;
}

// === STORAGE ===

const TOKEN_KEY = "aprovafacil_token";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// === HTTP CLIENT ===

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Tratar resposta vazia
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.detail || data?.message || "Erro na requisição";
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

// === AUTH API ===

export const authApi = {
  register: (data: UserRegister): Promise<UserResponse> =>
    request<UserResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: async (data: UserLogin): Promise<{ token: Token; user: UserResponse }> => {
    const token = await request<Token>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Salvar token e buscar dados do usuário
    setToken(token.access_token);
    const user = await authApi.getMe();

    return { token, user };
  },

  logout: (): Promise<void> => {
    const token = getToken();
    removeToken();

    if (token) {
      return request<void>("/api/auth/logout", {
        method: "POST",
      }).catch(() => {
        // Ignorar erro de logout (token pode estar expirado)
      });
    }

    return Promise.resolve();
  },

  getMe: (): Promise<UserResponse> =>
    request<UserResponse>("/api/auth/me"),

  updateMe: (data: UserUpdate): Promise<UserResponse> =>
    request<UserResponse>("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// === PRODUCTS API ===

export const productsApi = {
  list: (): Promise<ProductResponse[]> =>
    request<ProductResponse[]>("/api/products"),

  get: (id: number): Promise<ProductResponse> =>
    request<ProductResponse>(`/api/products/${id}`),

  getBySlug: (slug: string): Promise<ProductResponse> =>
    request<ProductResponse>(`/api/products/slug/${slug}`),
};

// === ORDERS API ===

export const ordersApi = {
  list: (): Promise<OrderResponse[]> =>
    request<OrderResponse[]>("/api/orders"),

  create: (data: OrderCreate): Promise<OrderResponse> =>
    request<OrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  get: (id: number): Promise<OrderResponse> =>
    request<OrderResponse>(`/api/orders/${id}`),
};

// === PAYMENT API ===

export const paymentApi = {
  createPreference: (data: PaymentPreferenceCreate): Promise<PaymentPreferenceResponse> =>
    request<PaymentPreferenceResponse>("/api/payment/preference", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  processCard: (data: CardPaymentCreate): Promise<PaymentResponse> =>
    request<PaymentResponse>("/api/payment/process", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  get: (id: number): Promise<PaymentResponse> =>
    request<PaymentResponse>(`/api/payment/${id}`),

  getByOrder: (orderId: number): Promise<PaymentResponse> =>
    request<PaymentResponse>(`/api/payment/order/${orderId}`),
};

// Export error class
export { ApiError };
