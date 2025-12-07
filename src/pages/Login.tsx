import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  Mail,
  Lock
} from "lucide-react";

const Login = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  const errors = {
    email: touched.email && !validateEmail(formData.email) ? "E-mail inválido" : null,
    password: touched.password && formData.password.length < 1 ? "Digite sua senha" : null,
  };

  const isFormValid = validateEmail(formData.email) && formData.password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (!isFormValid) {
      toast({
        title: "Verifique os campos",
        description: "Preencha e-mail e senha.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const result = await login(formData);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
      });
      navigate("/");
    } else {
      toast({
        title: "Erro no login",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header simples */}
      <header className="border-b border-border bg-card">
        <div className="container px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-poppins font-bold text-xl sm:text-2xl text-primary">
                Aprova<span className="text-foreground">Fácil</span>
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-2">
                Entrar na conta
              </h1>
              <p className="text-muted-foreground">
                Acesse sua conta para continuar
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-6 sm:p-8 border border-border/50 space-y-5">
              {/* Email */}
              <div>
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    className={cn("mt-1.5 h-12 pl-10", errors.email && "border-destructive")}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    className={cn("mt-1.5 h-12 pl-10 pr-10", errors.password && "border-destructive")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Botão de Login */}
              <Button
                type="submit"
                variant="cta"
                size="xl"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Entrar
                  </>
                )}
              </Button>

              {/* Link para Cadastro */}
              <p className="text-center text-sm text-muted-foreground pt-4">
                Não tem uma conta?{" "}
                <Link to="/cadastro" className="text-primary font-medium hover:underline">
                  Criar conta
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
