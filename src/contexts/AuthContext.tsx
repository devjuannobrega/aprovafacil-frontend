import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Tipos
export interface User {
  id: string;
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
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Chaves do localStorage
const STORAGE_KEYS = {
  USER: "aprovafacil_user",
  USERS_DB: "aprovafacil_users_db",
};

// Helper para gerar ID único
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper para hash simples de senha (mock - em produção usar bcrypt no backend)
const hashPassword = (password: string) => btoa(password);
const verifyPassword = (password: string, hash: string) => btoa(password) === hash;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setIsLoading(false);
  }, []);

  // Obter banco de dados de usuários do localStorage
  const getUsersDB = (): Array<User & { passwordHash: string }> => {
    const db = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    return db ? JSON.parse(db) : [];
  };

  // Salvar banco de dados de usuários
  const saveUsersDB = (users: Array<User & { passwordHash: string }>) => {
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  };

  // Registro
  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));

    const usersDB = getUsersDB();

    // Verificar se e-mail já existe
    if (usersDB.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: "Este e-mail já está cadastrado" };
    }

    // Verificar se CPF já existe
    if (usersDB.some((u) => u.cpf.replace(/\D/g, "") === data.cpf.replace(/\D/g, ""))) {
      return { success: false, message: "Este CPF já está cadastrado" };
    }

    // Criar novo usuário
    const newUser: User & { passwordHash: string } = {
      id: generateId(),
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      cep: data.cep,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(data.password),
    };

    // Salvar no "banco de dados"
    usersDB.push(newUser);
    saveUsersDB(usersDB);

    // Fazer login automático (remover hash da senha antes de salvar no estado)
    const { passwordHash, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));

    return { success: true, message: "Cadastro realizado com sucesso!" };
  };

  // Login
  const login = async (data: LoginData): Promise<{ success: boolean; message: string }> => {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));

    const usersDB = getUsersDB();

    // Buscar usuário por e-mail
    const foundUser = usersDB.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (!foundUser) {
      return { success: false, message: "E-mail não encontrado" };
    }

    // Verificar senha
    if (!verifyPassword(data.password, foundUser.passwordHash)) {
      return { success: false, message: "Senha incorreta" };
    }

    // Fazer login (remover hash da senha)
    const { passwordHash, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));

    return { success: true, message: "Login realizado com sucesso!" };
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
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
