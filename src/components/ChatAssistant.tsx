import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Estilos de animação inline para o chat
const chatAnimationStyles = `
  @keyframes chatSlideIn {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes chatSlideOut {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
  }

  @keyframes chatSlideInMobile {
    0% {
      opacity: 0;
      transform: translateY(100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes chatSlideOutMobile {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(100%);
    }
  }

  @keyframes overlayFadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes overlayFadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes messageSlideIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes buttonPop {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes buttonPulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(0, 87, 255, 0.4);
    }
    50% {
      box-shadow: 0 0 0 12px rgba(0, 87, 255, 0);
    }
  }

  .chat-animate-in {
    animation: chatSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .chat-animate-out {
    animation: chatSlideOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @media (max-width: 768px) {
    .chat-animate-in {
      animation: chatSlideInMobile 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .chat-animate-out {
      animation: chatSlideOutMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  }

  .overlay-animate-in {
    animation: overlayFadeIn 0.3s ease-out forwards;
  }

  .overlay-animate-out {
    animation: overlayFadeOut 0.25s ease-out forwards;
  }

  .message-animate-in {
    animation: messageSlideIn 0.3s ease-out forwards;
  }

  .button-pop {
    animation: buttonPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }

  .button-pulse {
    animation: buttonPulse 2s ease-in-out infinite;
  }
`;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

type AnimationState = "hidden" | "entering" | "visible" | "exiting";

// Respostas mock do assistente
const mockResponses: Record<string, string> = {
  default: "Olá! Sou o assistente virtual do Limpa Nome. Como posso ajudá-lo hoje? 😊",
  oi: "Olá! Tudo bem? Estou aqui para ajudar você a limpar seu nome e recuperar seu crédito. O que gostaria de saber?",
  olá: "Olá! Tudo bem? Estou aqui para ajudar você a limpar seu nome e recuperar seu crédito. O que gostaria de saber?",
  preço: "Nosso Plano Completo Limpa Nome está com uma promoção especial de R$ 680,00 (de R$ 1.200,00). Esse valor é único, sem mensalidades! Quer saber o que está incluso?",
  valor: "Nosso Plano Completo Limpa Nome está com uma promoção especial de R$ 680,00 (de R$ 1.200,00). Esse valor é único, sem mensalidades! Quer saber o que está incluso?",
  quanto: "Nosso Plano Completo Limpa Nome está com uma promoção especial de R$ 680,00 (de R$ 1.200,00). Esse valor é único, sem mensalidades! Quer saber o que está incluso?",
  funciona: "Nosso processo é simples:\n\n1️⃣ Você faz o cadastro e pagamento\n2️⃣ Nossa equipe analisa sua situação\n3️⃣ Negociamos com todos os credores\n4️⃣ Regularizamos seu CPF\n\nTudo isso em média 30 dias!",
  prazo: "O prazo médio para limpar seu nome é de 30 dias. Mas cada caso é único e nossa equipe trabalha para resolver o mais rápido possível!",
  tempo: "O prazo médio para limpar seu nome é de 30 dias. Mas cada caso é único e nossa equipe trabalha para resolver o mais rápido possível!",
  garantia: "Sim! Oferecemos garantia de satisfação. Se não conseguirmos resolver sua situação, você recebe seu dinheiro de volta. Trabalhamos com total transparência!",
  pagamento: "Aceitamos diversas formas de pagamento:\n\n💳 Cartão de Crédito (até 12x)\n💳 Cartão de Débito\n📱 Pix (aprovação instantânea)\n📄 Boleto Bancário\n\nTodas as transações são seguras via Mercado Pago!",
  pix: "Sim, aceitamos Pix! É a forma mais rápida de pagamento, com aprovação instantânea. Basta selecionar Pix/Boleto na hora do pagamento.",
  seguro: "Sim, somos 100% seguros! Utilizamos o Mercado Pago para processar pagamentos, seus dados são criptografados e temos mais de 10.000 clientes satisfeitos.",
  score: "Sim! Além de limpar seu nome, ajudamos a aumentar seu score. Nossos clientes relatam aumento médio de 150-200 pontos após a regularização!",
};

const getMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  for (const [key, response] of Object.entries(mockResponses)) {
    if (key !== "default" && lowerMessage.includes(key)) {
      return response;
    }
  }

  // Resposta genérica para mensagens não reconhecidas
  return "Entendi sua dúvida! Para uma resposta mais detalhada, recomendo que você role a página até a seção de pagamento e preencha seus dados. Nossa equipe entrará em contato para esclarecer tudo. 😊\n\nPosso ajudar com algo mais?";
};

const ChatAssistant = ({ isOpen, onClose }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: mockResponses.default,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState<"in" | "out" | null>(null);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Gerenciar animações de entrada/saída - lógica simplificada
  useEffect(() => {
    // Limpar timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isOpen) {
      // Abrir: renderizar imediatamente e animar entrada
      setShouldRender(true);
      // Pequeno delay para garantir que o DOM está pronto antes da animação
      requestAnimationFrame(() => {
        setAnimationClass("in");
      });
    } else if (shouldRender) {
      // Fechar: animar saída e depois esconder
      setAnimationClass("out");
      timerRef.current = setTimeout(() => {
        setShouldRender(false);
        setAnimationClass(null);
      }, 300);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus no input quando abrir
  useEffect(() => {
    if (isOpen && shouldRender) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen, shouldRender]);

  // Limpar animação de nova mensagem
  useEffect(() => {
    if (newMessageId) {
      const timer = setTimeout(() => setNewMessageId(null), 500);
      return () => clearTimeout(timer);
    }
  }, [newMessageId]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessageId(userMessageId);
    setInputValue("");
    setIsTyping(true);

    // Simular delay de resposta (mock)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: getMockResponse(userMessage.content),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setNewMessageId(assistantMessageId);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Não renderizar se não deve renderizar
  if (!shouldRender) return null;

  return (
    <>
      {/* Injetar estilos de animação */}
      <style>{chatAnimationStyles}</style>

      {/* Overlay para mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40",
          "md:hidden",
          animationClass === "in" && "overlay-animate-in",
          animationClass === "out" && "overlay-animate-out"
        )}
        onClick={onClose}
      />

      {/* Chat Container */}
      <div
        className={cn(
          "fixed z-50 flex flex-col bg-card border border-border shadow-2xl",
          // Mobile: quase tela toda com margem
          "inset-4 rounded-2xl",
          // Desktop: canto inferior direito, tamanho fixo
          "md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] md:max-h-[80vh] md:rounded-2xl",
          // Animações
          animationClass === "in" && "chat-animate-in",
          animationClass === "out" && "chat-animate-out"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">Assistente Limpa Nome</h3>
              <p className="text-xs text-primary-foreground/70">Online agora</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Fechar chat"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.role === "user" ? "flex-row-reverse" : "flex-row",
                // Animar novas mensagens
                message.id === newMessageId && "message-animate-in"
              )}
              style={{
                // Animação escalonada para mensagens iniciais
                animationDelay: index === 0 && animationClass === "in" ? "0.1s" : "0s"
              }}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 h-11"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="h-11 w-11 p-0"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Assistente IA • Respostas automáticas
          </p>
        </div>
      </div>
    </>
  );
};

// Botão flutuante para abrir o chat
export const ChatButton = ({ onClick }: { onClick: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay para aparecer com animação
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{chatAnimationStyles}</style>
      <button
        onClick={onClick}
        className={cn(
          "fixed bottom-6 right-6 z-30",
          "w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary shadow-lg",
          "flex items-center justify-center",
          "hover:scale-110 active:scale-95 transition-transform duration-200",
          "button-pulse",
          isVisible ? "button-pop" : "opacity-0 scale-0"
        )}
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
      </button>
    </>
  );
};

export default ChatAssistant;
