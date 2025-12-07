import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { productsApi, ProductResponse } from "@/services/api";

// Tipos
export interface Product {
  id: number;
  slug: string;
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
  products: Product[];
  isLoadingProducts: boolean;
  selectedProduct: Product | null;
  personType: PersonType;
  setSelectedProduct: (product: Product | null) => void;
  setPersonType: (type: PersonType) => void;
  getPrice: () => number;
  clearCart: () => void;
  getProductBySlug: (slug: string) => Product | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Dados extras dos produtos (deliverables, deadline, etc.)
// Isso pode ser movido para a API posteriormente
const PRODUCT_EXTRAS: Record<string, Omit<Product, "id" | "slug" | "name" | "pricePF" | "pricePJ" | "description">> = {
  "limpa-nome": {
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
  "rating-raind": {
    deliverables: [
      "Atualização de rating bancário",
      "Atualização de renda presumida",
      "Restauração da capacidade de pagamento",
      "Correção de inconsistências internas",
    ],
    deadline: "30 dias úteis",
    payment: "À vista ou 50% + 50%",
  },
  "score": {
    deliverables: [
      "Análise do perfil de crédito",
      "Estratégias de recuperação",
      "Acompanhamento da evolução",
      "Relatório de progresso",
    ],
    deadline: "Consultar",
    payment: "Consultar condições",
  },
  "escavador-jusbrasil": {
    deliverables: [
      "Retirada de apontamentos do Google/Escavador",
      "Limpeza de informações constrangedoras",
      "Mapeamento jurídico completo",
      "Relatório técnico para bancos",
    ],
    deadline: "15 a 30 dias úteis",
    payment: "Consultar condições",
  },
};

// Produtos fallback caso a API não esteja disponível
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "limpa-nome",
    name: "LIMPA NOME",
    pricePF: 1500,
    pricePJ: 1800,
    description: "Remove apontamentos nos órgãos SERASA, SPC, SCPC, BOA VISTA e CENPROT através de ação jurídica coletiva.",
    ...PRODUCT_EXTRAS["limpa-nome"],
  },
  {
    id: 2,
    slug: "rating-raind",
    name: "RATING / RAIND",
    pricePF: 2500,
    pricePJ: 3000,
    description: "Atualiza o rating bancário (classificação A a E), restaura Score e renda presumida, melhorando a análise interna dos bancos.",
    ...PRODUCT_EXTRAS["rating-raind"],
  },
  {
    id: 3,
    slug: "score",
    name: "SCORE",
    pricePF: 800,
    pricePJ: 1000,
    description: "Serviço especializado para recuperação e aumento do Score de crédito junto aos birôs de proteção ao crédito.",
    ...PRODUCT_EXTRAS["score"],
  },
  {
    id: 4,
    slug: "escavador-jusbrasil",
    name: "ESCAVADOR / JUSBRASIL",
    pricePF: 1250,
    pricePJ: 1500,
    description: "Limpa apontamentos no Google/Escavador e realiza levantamento completo de ações judiciais.",
    ...PRODUCT_EXTRAS["escavador-jusbrasil"],
  },
];

// Converter ProductResponse da API para Product do frontend
const mapApiProductToProduct = (apiProduct: ProductResponse): Product => {
  const extras = PRODUCT_EXTRAS[apiProduct.slug] || {
    deliverables: [],
    deadline: "Consultar",
    payment: "Consultar condições",
  };

  return {
    id: apiProduct.id,
    slug: apiProduct.slug,
    name: apiProduct.name,
    pricePF: parseFloat(apiProduct.price_pf),
    pricePJ: parseFloat(apiProduct.price_pj),
    description: apiProduct.description || "",
    ...extras,
  };
};

// Chaves do localStorage
const STORAGE_KEYS = {
  SELECTED_PRODUCT: "aprovafacil_selected_product",
  PERSON_TYPE: "aprovafacil_person_type",
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(() => {
    // Recuperar produto selecionado do localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_PRODUCT);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [personType, setPersonTypeState] = useState<PersonType>(() => {
    // Recuperar tipo de pessoa do localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.PERSON_TYPE);
    return (stored === "PJ" ? "PJ" : "PF") as PersonType;
  });

  // Salvar produto selecionado no localStorage
  const setSelectedProduct = (product: Product | null) => {
    setSelectedProductState(product);
    if (product) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_PRODUCT, JSON.stringify(product));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_PRODUCT);
    }
  };

  // Salvar tipo de pessoa no localStorage
  const setPersonType = (type: PersonType) => {
    setPersonTypeState(type);
    localStorage.setItem(STORAGE_KEYS.PERSON_TYPE, type);
  };

  // Carregar produtos da API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const apiProducts = await productsApi.list();
        const mappedProducts = apiProducts.map(mapApiProductToProduct);

        if (mappedProducts.length > 0) {
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        // Mantém os produtos fallback
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const getPrice = () => {
    if (!selectedProduct) return 0;
    return personType === "PF" ? selectedProduct.pricePF : selectedProduct.pricePJ;
  };

  const clearCart = () => {
    setSelectedProductState(null);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_PRODUCT);
    localStorage.removeItem(STORAGE_KEYS.PERSON_TYPE);
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug);
  };

  return (
    <CartContext.Provider
      value={{
        products,
        isLoadingProducts,
        selectedProduct,
        personType,
        setSelectedProduct,
        setPersonType,
        getPrice,
        clearCart,
        getProductBySlug,
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

// Exportar para uso em outros componentes
export { FALLBACK_PRODUCTS as PRODUCTS };
