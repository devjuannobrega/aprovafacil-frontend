import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  authApi,
  UserResponse,
  UserRegister,
  UserLogin,
  getToken,
  removeToken,
  ApiError,
} from "@/services/api";

// Tipos exportados para uso em outros componentes
export type User = UserResponse;

export interface RegisterData {
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

export interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário ao iniciar (se houver token)
  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error) {
        // Token inválido ou expirado
        console.error("Erro ao carregar usuário:", error);
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Registro
  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      const registerData: UserRegister = {
        name: data.name,
        email: data.email,
        password: data.password,
        cpf: data.cpf?.replace(/\D/g, ""),
        phone: data.phone?.replace(/\D/g, ""),
        cep: data.cep?.replace(/\D/g, ""),
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      };

      // Registrar usuário
      await authApi.register(registerData);

      // Fazer login automático após registro
      const loginResult = await login({ email: data.email, password: data.password });

      if (loginResult.success) {
        return { success: true, message: "Cadastro realizado com sucesso!" };
      }

      return { success: true, message: "Cadastro realizado! Faça login para continuar." };
    } catch (error) {
      console.error("Erro no registro:", error);

      if (error instanceof ApiError) {
        // Tratar erros específicos
        if (error.status === 422) {
          const detail = error.data as { detail?: Array<{ msg: string }> | string };
          if (Array.isArray(detail?.detail)) {
            return { success: false, message: detail.detail[0]?.msg || "Dados inválidos" };
          }
          if (typeof detail?.detail === "string") {
            return { success: false, message: detail.detail };
          }
        }
        return { success: false, message: String(error.message) };
      }

      return { success: false, message: "Erro ao realizar cadastro. Tente novamente." };
    }
  };

  // Login
  const login = async (data: LoginData): Promise<{ success: boolean; message: string }> => {
    try {
      const { user: userData } = await authApi.login(data);
      setUser(userData);
      return { success: true, message: "Login realizado com sucesso!" };
    } catch (error) {
      console.error("Erro no login:", error);

      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 404) {
          return { success: false, message: "E-mail ou senha incorretos" };
        }
        return { success: false, message: String(error.message) };
      }

      return { success: false, message: "Erro ao fazer login. Tente novamente." };
    }
  };

  // Logout
  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  // Atualizar dados do usuário localmente
  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
