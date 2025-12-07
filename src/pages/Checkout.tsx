import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  Shield,
  CreditCard,
  QrCode,
  Banknote,
  Clock,
  User,
  MapPin,
  Package,
} from "lucide-react";
import MercadoPagoCheckout from "@/components/MercadoPagoCheckout";
import { CustomerData, PaymentResponse } from "@/config/mercadopago";
import { PaymentMethodType } from "@/hooks/useMercadoPago";

const Checkout = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { selectedProduct, personType, getPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("credit_card");

  // Redirecionar se não estiver logado ou sem produto
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Faça login para continuar",
        description: "Você precisa estar logado para acessar o checkout.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!selectedProduct) {
      toast({
        title: "Nenhum produto selecionado",
        description: "Escolha um produto antes de continuar.",
        variant: "destructive",
      });
      navigate("/#plano");
      return;
    }
  }, [isAuthenticated, selectedProduct, navigate, toast]);

  if (!user || !selectedProduct) {
    return null;
  }

  const price = getPrice();

  // Dados do cliente para pagamento
  const customerData: CustomerData = {
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    phone: user.phone,
    cep: user.cep,
    street: user.street,
    number: user.number,
    complement: user.complement,
    neighborhood: user.neighborhood,
    city: user.city,
    state: user.state,
  };

  const handlePaymentSuccess = (payment: PaymentResponse) => {
    console.log("Pagamento aprovado:", payment);
    clearCart();
    toast({
      title: "Pagamento aprovado!",
      description: "Seu pedido foi confirmado com sucesso.",
    });
    // Poderia redirecionar para uma página de sucesso
  };

  const handlePaymentError = (error: unknown) => {
    console.error("Erro no pagamento:", error);
    toast({
      title: "Erro no pagamento",
      description: "Ocorreu um erro. Tente novamente.",
      variant: "destructive",
    });
  };

  const handlePaymentPending = (payment: PaymentResponse) => {
    console.log("Pagamento pendente:", payment);
    toast({
      title: "Pagamento pendente",
      description: "Aguardando confirmação do pagamento.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
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
      <main className="py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-2">
                Finalizar Compra
              </h1>
              <p className="text-muted-foreground">
                Revise seus dados e escolha a forma de pagamento
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Coluna Principal */}
              <div className="lg:col-span-3 space-y-6">
                {/* Dados do Cliente */}
                <div className="bg-card rounded-2xl shadow-card p-5 sm:p-6 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Seus Dados</h3>
                      <p className="text-xs text-muted-foreground">Informações do cadastro</p>
                    </div>
                    <Check className="w-5 h-5 text-success ml-auto" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nome:</span>
                      <p className="font-medium text-foreground">{user.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">E-mail:</span>
                      <p className="font-medium text-foreground">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Telefone:</span>
                      <p className="font-medium text-foreground">{user.phone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CPF:</span>
                      <p className="font-medium text-foreground">{user.cpf}</p>
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="bg-card rounded-2xl shadow-card p-5 sm:p-6 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Endereço</h3>
                      <p className="text-xs text-muted-foreground">Local de correspondência</p>
                    </div>
                    <Check className="w-5 h-5 text-success ml-auto" />
                  </div>

                  <p className="text-sm text-foreground">
                    {user.street}, {user.number}
                    {user.complement && ` - ${user.complement}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.neighborhood} - {user.city}/{user.state}
                  </p>
                  <p className="text-sm text-muted-foreground">CEP: {user.cep}</p>
                </div>

                {/* Forma de Pagamento */}
                <div className="bg-card rounded-2xl shadow-card p-5 sm:p-6 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Forma de Pagamento</h3>
                      <p className="text-xs text-muted-foreground">Escolha como pagar</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <button
                      onClick={() => setSelectedPaymentMethod("credit_card")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        selectedPaymentMethod === "credit_card"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="font-medium text-sm">Crédito</span>
                      <span className="text-xs opacity-70">Até 12x</span>
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod("debit_card")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        selectedPaymentMethod === "debit_card"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      <Banknote className="w-6 h-6" />
                      <span className="font-medium text-sm">Débito</span>
                      <span className="text-xs opacity-70">À vista</span>
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod("pix_boleto")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        selectedPaymentMethod === "pix_boleto"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      <QrCode className="w-6 h-6" />
                      <span className="font-medium text-sm">Pix/Boleto</span>
                      <span className="text-xs opacity-70">À vista</span>
                    </button>
                  </div>

                  {/* Checkout Mercado Pago */}
                  <MercadoPagoCheckout
                    customerData={customerData}
                    paymentMethod={selectedPaymentMethod}
                    amount={price}
                    productTitle={selectedProduct.name}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onPending={handlePaymentPending}
                  />
                </div>
              </div>

              {/* Sidebar - Resumo */}
              <div className="lg:col-span-2 space-y-6">
                {/* Produto Selecionado */}
                <div className="bg-card rounded-2xl shadow-card p-5 sm:p-6 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Produto</h3>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4 mb-4">
                    <h4 className="font-poppins font-bold text-lg text-primary mb-1">
                      {selectedProduct.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {personType === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Entregas */}
                  <div className="space-y-2 mb-4">
                    {selectedProduct.deliverables.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                    {selectedProduct.deliverables.length > 3 && (
                      <p className="text-xs text-muted-foreground ml-6">
                        +{selectedProduct.deliverables.length - 3} itens
                      </p>
                    )}
                  </div>

                  {/* Prazo */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Prazo: {selectedProduct.deadline}</span>
                  </div>
                </div>

                {/* Resumo do Pedido */}
                <div className="bg-card rounded-2xl shadow-card p-5 sm:p-6 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-4">Resumo do Pedido</h3>

                  <div className="space-y-3 pb-4 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{selectedProduct.name}</span>
                      <span className="text-foreground font-medium">
                        R$ {price.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <span className="text-foreground font-semibold">Total</span>
                    <span className="text-primary font-bold text-2xl">
                      R$ {price.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>

                {/* Segurança */}
                <div className="bg-primary-muted rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">Compra Segura</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>Dados criptografados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>Pagamento via Mercado Pago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>Garantia de satisfação</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
