import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth, RegisterData } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Loader2,
  MapPin,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  User,
  Mail,
  Phone,
  CreditCard,
  Lock
} from "lucide-react";

// Interface para resposta do ViaCEP
interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, "");
  if (numbers.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) return false;

  return true;
};

const validateCNPJ = (cnpj: string): boolean => {
  const numbers = cnpj.replace(/\D/g, "");
  if (numbers.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;

  // Validação do primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(numbers[12])) return false;

  // Validação do segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(numbers[13])) return false;

  return true;
};

const validateCPFOrCNPJ = (value: string): boolean => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length === 11) return validateCPF(value);
  if (numbers.length === 14) return validateCNPJ(value);
  return false;
};

const isCNPJ = (value: string): boolean => {
  return value.replace(/\D/g, "").length > 11;
};

const validatePhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, "");
  return numbers.length >= 10;
};

const validateCEP = (cep: string): boolean => {
  const numbers = cep.replace(/\D/g, "");
  return numbers.length === 8;
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const Cadastro = () => {
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    cpf: false,
    phone: false,
    cep: false,
    street: false,
    number: false,
    neighborhood: false,
    city: false,
    state: false,
  });

  // Formatadores
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Formata CPF ou CNPJ automaticamente
  const formatCPFOrCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    // CNPJ: 00.000.000/0000-00
    if (numbers.length > 11) {
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
      if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
      if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }

    // CPF: 000.000.000-00
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Buscar CEP
  const fetchCEP = async (cep: string) => {
    const numbers = cep.replace(/\D/g, "");
    if (numbers.length !== 8) return;

    setIsLoadingCEP(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado.",
          variant: "destructive",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
        complement: data.complemento || prev.complement,
      }));

      toast({
        title: "Endereço encontrado!",
        description: "Campos preenchidos automaticamente.",
      });
    } catch {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCEP(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else if (name === "cpf") {
      setFormData({ ...formData, [name]: formatCPFOrCNPJ(value) });
    } else if (name === "cep") {
      const formattedCEP = formatCEP(value);
      setFormData({ ...formData, [name]: formattedCEP });
      if (value.replace(/\D/g, "").length === 8) {
        fetchCEP(value);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  // Validações
  const cpfCnpjError = () => {
    if (!touched.cpf) return null;
    const numbers = formData.cpf.replace(/\D/g, "");
    if (numbers.length === 0) return "CPF/CNPJ obrigatório";
    if (numbers.length < 11) return "CPF/CNPJ incompleto";
    if (numbers.length === 11 && !validateCPF(formData.cpf)) return "CPF inválido";
    if (numbers.length > 11 && numbers.length < 14) return "CNPJ incompleto";
    if (numbers.length === 14 && !validateCNPJ(formData.cpf)) return "CNPJ inválido";
    return null;
  };

  const errors = {
    name: touched.name && formData.name.length < 3 ? "Nome deve ter pelo menos 3 caracteres" : null,
    email: touched.email && !validateEmail(formData.email) ? "E-mail inválido" : null,
    password: touched.password && !validatePassword(formData.password) ? "Senha deve ter pelo menos 6 caracteres" : null,
    confirmPassword: touched.confirmPassword && formData.password !== formData.confirmPassword ? "Senhas não conferem" : null,
    cpf: cpfCnpjError(),
    phone: touched.phone && !validatePhone(formData.phone) ? "Telefone inválido" : null,
    cep: touched.cep && !validateCEP(formData.cep) ? "CEP inválido" : null,
    street: touched.street && formData.street.length < 3 ? "Rua inválida" : null,
    number: touched.number && formData.number.length < 1 ? "Obrigatório" : null,
    neighborhood: touched.neighborhood && formData.neighborhood.length < 2 ? "Bairro inválido" : null,
    city: touched.city && formData.city.length < 2 ? "Cidade inválida" : null,
    state: touched.state && formData.state.length !== 2 ? "UF inválido" : null,
  };

  const isFormValid =
    formData.name.length >= 3 &&
    validateEmail(formData.email) &&
    validatePassword(formData.password) &&
    formData.password === formData.confirmPassword &&
    validateCPFOrCNPJ(formData.cpf) &&
    validatePhone(formData.phone) &&
    validateCEP(formData.cep) &&
    formData.street.length >= 3 &&
    formData.number.length >= 1 &&
    formData.neighborhood.length >= 2 &&
    formData.city.length >= 2 &&
    formData.state.length === 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      cpf: true,
      phone: true,
      cep: true,
      street: true,
      number: true,
      neighborhood: true,
      city: true,
      state: true,
    });

    if (!isFormValid) {
      toast({
        title: "Verifique os campos",
        description: "Corrija os erros antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao Aprova Fácil!",
      });
      navigate("/");
    } else {
      toast({
        title: "Erro no cadastro",
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
      <main className="flex-1 py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-2">
                Criar sua conta
              </h1>
              <p className="text-muted-foreground">
                Preencha seus dados para começar
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-6 sm:p-8 border border-border/50 space-y-5">
              {/* Dados Pessoais */}
              <div className="flex items-center gap-3 pb-2">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Dados Pessoais</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Nome */}
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  className={cn("mt-1.5 h-11", errors.name && "border-destructive")}
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">E-mail *</Label>
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
                    className={cn("mt-1.5 h-11 pl-10", errors.email && "border-destructive")}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Senha e Confirmar Senha */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      className={cn("mt-1.5 h-11 pl-10 pr-10", errors.password && "border-destructive")}
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
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repita a senha"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      className={cn("mt-1.5 h-11 pl-10 pr-10", errors.confirmPassword && "border-destructive")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Telefone e CPF */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur("phone")}
                      className={cn("mt-1.5 h-11 pl-10", errors.phone && "border-destructive")}
                      maxLength={15}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cpf">CPF / CNPJ *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="cpf"
                      name="cpf"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      value={formData.cpf}
                      onChange={handleChange}
                      onBlur={() => handleBlur("cpf")}
                      className={cn("mt-1.5 h-11 pl-10", errors.cpf && "border-destructive")}
                      maxLength={18}
                    />
                  </div>
                  {errors.cpf && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.cpf}
                    </p>
                  )}
                </div>
              </div>

              {/* Endereço */}
              <div className="flex items-center gap-3 pt-4 pb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Endereço</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* CEP e Rua */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cep">CEP *</Label>
                  <div className="relative">
                    <Input
                      id="cep"
                      name="cep"
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={handleChange}
                      onBlur={() => handleBlur("cep")}
                      className={cn("mt-1.5 h-11 pr-10", errors.cep && "border-destructive")}
                      maxLength={9}
                    />
                    {isLoadingCEP && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 animate-spin text-primary" />
                    )}
                  </div>
                  {errors.cep && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.cep}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="street">Rua *</Label>
                  <Input
                    id="street"
                    name="street"
                    placeholder="Nome da rua"
                    value={formData.street}
                    onChange={handleChange}
                    onBlur={() => handleBlur("street")}
                    className={cn("mt-1.5 h-11", errors.street && "border-destructive")}
                  />
                  {errors.street && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.street}
                    </p>
                  )}
                </div>
              </div>

              {/* Número, Complemento, Bairro */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    name="number"
                    placeholder="123"
                    value={formData.number}
                    onChange={handleChange}
                    onBlur={() => handleBlur("number")}
                    className={cn("mt-1.5 h-11", errors.number && "border-destructive")}
                    maxLength={10}
                  />
                  {errors.number && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.number}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    name="complement"
                    placeholder="Apto, Bloco..."
                    value={formData.complement}
                    onChange={handleChange}
                    className="mt-1.5 h-11"
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    placeholder="Bairro"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    onBlur={() => handleBlur("neighborhood")}
                    className={cn("mt-1.5 h-11", errors.neighborhood && "border-destructive")}
                  />
                  {errors.neighborhood && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.neighborhood}
                    </p>
                  )}
                </div>
              </div>

              {/* Cidade e Estado */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={() => handleBlur("city")}
                    className={cn("mt-1.5 h-11", errors.city && "border-destructive")}
                  />
                  {errors.city && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="UF"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={() => handleBlur("state")}
                    className={cn("mt-1.5 h-11 uppercase", errors.state && "border-destructive")}
                    maxLength={2}
                  />
                  {errors.state && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Botão de Cadastro */}
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
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Criar minha conta
                  </>
                )}
              </Button>

              {/* Link para Login */}
              <p className="text-center text-sm text-muted-foreground pt-4">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Fazer login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cadastro;
