import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ordersApi, OrderResponse, ApiError } from "@/services/api";
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
  Loader2,
} from "lucide-react";
import MercadoPagoCheckout from "@/components/MercadoPagoCheckout";
import { PaymentMethodType } from "@/hooks/useMercadoPago";

const Checkout = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { selectedProduct, personType, getPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("credit_card");
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Guardar informações do produto para exibir após pagamento (calculado uma vez na montagem)
  const [productInfo] = useState(() => {
    if (!selectedProduct) return null;
    const price = personType === "PF" ? selectedProduct.pricePF : selectedProduct.pricePJ;
    return {
      name: selectedProduct.name,
      description: selectedProduct.description,
      deliverables: selectedProduct.deliverables,
      deadline: selectedProduct.deadline,
      price,
    };
  });

  // Redirecionar se não estiver logado ou sem produto (após carregamento)
  useEffect(() => {
    // Não redirecionar se o pagamento já foi concluído
    if (paymentCompleted) return;

    // Aguardar o carregamento do auth
    if (isAuthLoading) return;

    // Marcar que já verificamos
    if (!hasCheckedAuth) {
      setHasCheckedAuth(true);
    }

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
  }, [isAuthLoading, isAuthenticated, selectedProduct, navigate, toast, hasCheckedAuth, paymentCompleted]);

  // Criar pedido ao montar o componente
  useEffect(() => {
    const createOrder = async () => {
      if (!selectedProduct || order) return;

      setIsCreatingOrder(true);
      try {
        const newOrder = await ordersApi.create({
          items: [{ product_id: selectedProduct.id, quantity: 1 }],
          person_type: personType.toLowerCase(),
        });
        setOrder(newOrder);
      } catch (error) {
        console.error("Erro ao criar pedido:", error);
        if (error instanceof ApiError) {
          toast({
            title: "Erro ao criar pedido",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro ao criar pedido",
            description: "Tente novamente mais tarde.",
            variant: "destructive",
          });
        }
      } finally {
        setIsCreatingOrder(false);
      }
    };

    createOrder();
  }, [selectedProduct, personType, toast, order]);

  // Mostrar loading enquanto carrega auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Permitir continuar se pagamento foi concluído (mesmo sem produto selecionado)
  if (!user || (!productInfo && !paymentCompleted)) {
    return null;
  }

  // Usar productInfo que foi salvo na montagem do componente
  const price = productInfo?.price || 0;

  const handlePaymentSuccess = () => {
    // Marcar como concluído ANTES de limpar o carrinho
    setPaymentCompleted(true);
    clearCart();
  };

  const handlePaymentError = (error: unknown) => {
    console.error("Erro no pagamento:", error);
    toast({
      title: "Erro no pagamento",
      description: "Ocorreu um erro. Tente novamente.",
      variant: "destructive",
    });
  };

  const handlePaymentPending = () => {
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
                      <p className="font-medium text-foreground">{user.phone || "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CPF/CNPJ:</span>
                      <p className="font-medium text-foreground">{user.cpf || "-"}</p>
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
                    {user.street && <Check className="w-5 h-5 text-success ml-auto" />}
                  </div>

                  {user.street ? (
                    <>
                      <p className="text-sm text-foreground">
                        {user.street}, {user.number}
                        {user.complement && ` - ${user.complement}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.neighborhood} - {user.city}/{user.state}
                      </p>
                      <p className="text-sm text-muted-foreground">CEP: {user.cep}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Endereço não informado</p>
                  )}
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

                  {/* Loading ao criar pedido */}
                  {isCreatingOrder ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-muted-foreground">Preparando seu pedido...</p>
                    </div>
                  ) : order && productInfo ? (
                    /* Checkout Mercado Pago */
                    <MercadoPagoCheckout
                      orderId={order.id}
                      paymentMethod={selectedPaymentMethod}
                      amount={price}
                      productTitle={productInfo.name}
                      customerEmail={user.email}
                      customerCpf={user.cpf || ""}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onPending={handlePaymentPending}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <p className="text-muted-foreground">Erro ao criar pedido. Tente novamente.</p>
                      <Button onClick={() => window.location.reload()} variant="outline">
                        Tentar novamente
                      </Button>
                    </div>
                  )}
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

                  {productInfo && (
                    <>
                      <div className="bg-primary/5 rounded-xl p-4 mb-4">
                        <h4 className="font-poppins font-bold text-lg text-primary mb-1">
                          {productInfo.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {personType === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {productInfo.description}
                        </p>
                      </div>

                      {/* Entregas */}
                      <div className="space-y-2 mb-4">
                        {productInfo.deliverables.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-success" />
                            <span className="text-foreground">{item}</span>
                          </div>
                        ))}
                        {productInfo.deliverables.length > 3 && (
                          <p className="text-xs text-muted-foreground ml-6">
                            +{productInfo.deliverables.length - 3} itens
                          </p>
                        )}
                      </div>

                      {/* Prazo */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Prazo: {productInfo.deadline}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Resumo do Pedido */}
                <div className="bg-card rounded-2xl shadow-card p-5 sm:p-6 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-4">Resumo do Pedido</h3>

                  <div className="space-y-3 pb-4 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{productInfo?.name || "Produto"}</span>
                      <span className="text-foreground font-medium">
                        R$ {price.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    {order && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Pedido #</span>
                        <span className="text-muted-foreground font-mono">{order.id}</span>
                      </div>
                    )}
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
