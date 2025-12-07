import { createContext, useContext, useState, ReactNode } from "react";

// Tipos
export interface Product {
  id: string;
  name: string;
  pricePF: number;
  pricePJ: number;
  description: string;
  deliverables: string[];
  deadline: string;
  deadlineNote?: string;
  payment: string;
}

export type PersonType = "PF" | "PJ";

interface CartContextType {
  selectedProduct: Product | null;
  personType: PersonType;
  setSelectedProduct: (product: Product | null) => void;
  setPersonType: (type: PersonType) => void;
  getPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Produtos disponíveis
export const PRODUCTS: Product[] = [
  {
    id: "limpa-nome",
    name: "LIMPA NOME",
    pricePF: 1500,
    pricePJ: 1800,
    description: "Remove apontamentos nos órgãos SERASA, SPC, SCPC, BOA VISTA e CENPROT através de ação jurídica coletiva.",
    deliverables: [
      "Exclusão de apontamentos",
      "Regularização documental",
      "Relatório oficial 'Nada Consta'",
      "Suporte ativo",
      "Garantia de 6 meses",
    ],
    deadline: "30 a 60 dias úteis",
    deadlineNote: "80% dos casos entregues antes de 40 dias",
    payment: "Entrada de R$ 750,00",
  },
  {
    id: "rating-raind",
    name: "RATING / RAIND",
    pricePF: 2500,
    pricePJ: 3000,
    description: "Atualiza o rating bancário (classificação A a E), restaura Score e renda presumida, melhorando a análise interna dos bancos.",
    deliverables: [
      "Atualização de rating bancário",
      "Atualização de renda presumida",
      "Restauração da capacidade de pagamento",
      "Correção de inconsistências internas",
    ],
    deadline: "30 dias úteis",
    payment: "À vista ou 50% + 50%",
  },
  {
    id: "score",
    name: "SCORE",
    pricePF: 800,
    pricePJ: 1000,
    description: "Serviço especializado para recuperação e aumento do Score de crédito junto aos birôs de proteção ao crédito.",
    deliverables: [
      "Análise do perfil de crédito",
      "Estratégias de recuperação",
      "Acompanhamento da evolução",
      "Relatório de progresso",
    ],
    deadline: "Consultar",
    payment: "Consultar condições",
  },
  {
    id: "escavador-jusbrasil",
    name: "ESCAVADOR / JUSBRASIL",
    pricePF: 1250,
    pricePJ: 1500,
    description: "Limpa apontamentos no Google/Escavador e realiza levantamento completo de ações judiciais.",
    deliverables: [
      "Retirada de apontamentos do Google/Escavador",
      "Limpeza de informações constrangedoras",
      "Mapeamento jurídico completo",
      "Relatório técnico para bancos",
    ],
    deadline: "15 a 30 dias úteis",
    payment: "Consultar condições",
  },
];

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [personType, setPersonType] = useState<PersonType>("PF");

  const getPrice = () => {
    if (!selectedProduct) return 0;
    return personType === "PF" ? selectedProduct.pricePF : selectedProduct.pricePJ;
  };

  const clearCart = () => {
    setSelectedProduct(null);
  };

  return (
    <CartContext.Provider
      value={{
        selectedProduct,
        personType,
        setSelectedProduct,
        setPersonType,
        getPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
