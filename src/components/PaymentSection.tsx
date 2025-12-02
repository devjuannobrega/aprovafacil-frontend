import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Shield, Lock, ArrowRight, ArrowLeft, CreditCard, QrCode, Check, Clock, AlertCircle, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MercadoPagoCheckout from "./MercadoPagoCheckout";
import { CustomerData, PaymentResponse } from "@/config/mercadopago";
import { PaymentMethodType } from "@/hooks/useMercadoPago";
import { cn } from "@/lib/utils";

const WHATSAPP_LINK = "https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o Plano Limpa Nome.";

type Step = "form" | "payment";

// Validações em tempo real
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, "");
  return numbers.length === 11;
};

const validatePhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, "");
  return numbers.length >= 10;
};

// Componente Stepper
const Stepper = ({ currentStep }: { currentStep: Step }) => {
  const steps = [
    { id: "form", label: "Dados", number: 1 },
    { id: "payment", label: "Pagamento", number: 2 },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
      {steps.map((s, index) => (
        <div key={s.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300",
                currentStep === s.id
                  ? "bg-primary text-primary-foreground"
                  : s.number < (currentStep === "payment" ? 2 : 1)
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {s.number < (currentStep === "payment" ? 2 : 1) ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                s.number
              )}
            </div>
            <span
              className={cn(
                "text-xs sm:text-sm font-medium hidden sm:inline",
                currentStep === s.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-all duration-300",
                currentStep === "payment" ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Componente Timer de Urgência
const UrgencyTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 47,
    seconds: 33,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex items-center justify-center gap-2 text-destructive">
        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm font-semibold">Oferta expira em:</span>
        <div className="flex items-center gap-1 font-mono font-bold text-sm sm:text-lg">
          <span className="bg-destructive/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            {formatTime(timeLeft.hours)}
          </span>
          <span>:</span>
          <span className="bg-destructive/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            {formatTime(timeLeft.minutes)}
          </span>
          <span>:</span>
          <span className="bg-destructive/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            {formatTime(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
};

const PaymentSection = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<CustomerData>({
    name: "",
    phone: "",
    cpf: "",
    email: "",
    observation: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("credit_card");

  // Estados de validação em tempo real
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    cpf: false,
    email: false,
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else if (name === "cpf") {
      setFormData({ ...formData, [name]: formatCPF(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  // Validações
  const errors = {
    name: touched.name && formData.name.length < 3 ? "Nome deve ter pelo menos 3 caracteres" : null,
    phone: touched.phone && !validatePhone(formData.phone) ? "Telefone inválido" : null,
    cpf: touched.cpf && !validateCPF(formData.cpf) ? "CPF deve ter 11 dígitos" : null,
    email: touched.email && !validateEmail(formData.email) ? "E-mail inválido" : null,
  };

  const isFormValid =
    formData.name.length >= 3 &&
    validatePhone(formData.phone) &&
    validateCPF(formData.cpf) &&
    validateEmail(formData.email);

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Marca todos como touched para mostrar erros
    setTouched({ name: true, phone: true, cpf: true, email: true });

    if (!isFormValid) {
      toast({
        title: "Verifique os campos",
        description: "Por favor, corrija os erros antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setStep("payment");
  };

  const handlePaymentSuccess = (payment: PaymentResponse) => {
    console.log("Pagamento aprovado:", payment);
  };

  const handlePaymentError = (error: unknown) => {
    console.error("Erro no pagamento:", error);
  };

  const handlePaymentPending = (payment: PaymentResponse) => {
    console.log("Pagamento pendente:", payment);
  };

  return (
    <section id="pagamento" className="py-12 sm:py-16 md:py-28 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary-light/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              Finalize sua compra
            </span>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">
              {step === "form" ? "Seus Dados" : "Escolha o Pagamento"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4 sm:px-0">
              {step === "form"
                ? "Preencha seus dados para continuar"
                : "Cartão, Pix ou Boleto - você escolhe!"}
            </p>
          </div>

          {/* Stepper */}
          <Stepper currentStep={step} />

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Form / Payment */}
            <div className="lg:col-span-3 order-2 lg:order-1 bg-card rounded-2xl shadow-card p-4 sm:p-6 md:p-8 border border-border/50">
              {step === "form" ? (
                <form onSubmit={handleContinueToPayment} className="space-y-4 sm:space-y-5">
                  {/* Nome */}
                  <div>
                    <Label htmlFor="name" className="text-foreground font-medium text-sm sm:text-base">
                      Nome Completo *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      className={cn(
                        "mt-1.5 sm:mt-2 h-11 sm:h-12 text-base",
                        errors.name && "border-destructive focus-visible:ring-destructive"
                      )}
                      maxLength={100}
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Telefone e CPF */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <Label htmlFor="phone" className="text-foreground font-medium text-sm sm:text-base">
                        Telefone *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur("phone")}
                        className={cn(
                          "mt-1.5 sm:mt-2 h-11 sm:h-12 text-base",
                          errors.phone && "border-destructive focus-visible:ring-destructive"
                        )}
                        maxLength={15}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-xs sm:text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cpf" className="text-foreground font-medium text-sm sm:text-base">
                        CPF *
                      </Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleChange}
                        onBlur={() => handleBlur("cpf")}
                        className={cn(
                          "mt-1.5 sm:mt-2 h-11 sm:h-12 text-base",
                          errors.cpf && "border-destructive focus-visible:ring-destructive"
                        )}
                        maxLength={14}
                      />
                      {errors.cpf && (
                        <p className="text-destructive text-xs sm:text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.cpf}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-foreground font-medium text-sm sm:text-base">
                      E-mail *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      className={cn(
                        "mt-1.5 sm:mt-2 h-11 sm:h-12 text-base",
                        errors.email && "border-destructive focus-visible:ring-destructive"
                      )}
                      maxLength={255}
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Seleção de Método de Pagamento */}
                  <div className="pt-2">
                    <Label className="text-foreground font-medium text-sm sm:text-base mb-3 block">
                      Como deseja pagar? *
                    </Label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("credit_card")}
                        className={cn(
                          "flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px] sm:min-h-[100px]",
                          selectedPaymentMethod === "credit_card"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                        )}
                      >
                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="font-medium text-xs sm:text-sm">Crédito</span>
                        <span className="text-[9px] sm:text-xs opacity-70">Até 12x</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("debit_card")}
                        className={cn(
                          "flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px] sm:min-h-[100px]",
                          selectedPaymentMethod === "debit_card"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                        )}
                      >
                        <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="font-medium text-xs sm:text-sm">Débito</span>
                        <span className="text-[9px] sm:text-xs opacity-70">À vista</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("pix_boleto")}
                        className={cn(
                          "flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px] sm:min-h-[100px]",
                          selectedPaymentMethod === "pix_boleto"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                        )}
                      >
                        <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="font-medium text-xs sm:text-sm">Pix/Boleto</span>
                        <span className="text-[9px] sm:text-xs opacity-70">À vista</span>
                      </button>
                    </div>
                  </div>

                  {/* Botão Principal */}
                  <Button
                    type="submit"
                    variant="cta"
                    size="xl"
                    className="w-full min-h-[52px] text-base mt-6"
                  >
                    Continuar para Pagamento
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  {/* Dúvidas - Link discreto */}
                  <p className="text-center text-xs sm:text-sm text-muted-foreground pt-2">
                    Dúvidas?{" "}
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Fale conosco
                    </a>
                  </p>
                </form>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {/* Voltar para dados */}
                  <button
                    onClick={() => setStep("form")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm min-h-[44px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Editar dados
                  </button>

                  {/* Dados do cliente resumidos */}
                  <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Pagador</p>
                        <p className="font-medium text-sm sm:text-base truncate">{formData.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{formData.email}</p>
                      </div>
                      <Check className="w-5 h-5 text-success" />
                    </div>
                  </div>

                  {/* Checkout Mercado Pago */}
                  <MercadoPagoCheckout
                    customerData={formData}
                    paymentMethod={selectedPaymentMethod}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onPending={handlePaymentPending}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 order-1 lg:order-2 space-y-4 sm:space-y-6">
              {/* Timer de Urgência */}
              <UrgencyTimer />

              {/* Summary Card */}
              <div className="bg-card rounded-2xl shadow-card p-4 sm:p-6 border border-border/50">
                <h3 className="font-poppins font-semibold text-lg sm:text-xl text-foreground mb-3 sm:mb-4">
                  Resumo do Pedido
                </h3>
                <div className="space-y-2 sm:space-y-3 pb-3 sm:pb-4 border-b border-border">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-muted-foreground">Plano Completo</span>
                    <span className="text-foreground font-medium">R$ 1.200,00</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-muted-foreground">Desconto Promocional</span>
                    <span className="text-success font-medium">-R$ 520,00</span>
                  </div>
                </div>
                <div className="flex justify-between pt-3 sm:pt-4">
                  <span className="text-foreground font-semibold">Total</span>
                  <span className="text-primary font-bold text-xl sm:text-2xl">R$ 680,00</span>
                </div>

                {/* Métodos de pagamento inline */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">12x</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <QrCode className="w-4 h-4" />
                    <span className="text-xs">Pix</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className={`bg-primary-muted rounded-2xl p-4 sm:p-6 ${step === "payment" ? "hidden lg:block" : ""}`}>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base text-foreground">Compra 100% Segura</span>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success flex-shrink-0" />
                    <span>Dados criptografados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success flex-shrink-0" />
                    <span>Pagamento via Mercado Pago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success flex-shrink-0" />
                    <span>Garantia de satisfação</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
