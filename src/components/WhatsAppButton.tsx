import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá, quero simular meu crédito com o Aprova Fácil.");
    window.open(`https://wa.me/5511999999999?text=${message}`, "_blank");
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      size="lg"
      className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 shadow-hover hover:scale-110 transition-transform bg-gradient-accent"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};

export default WhatsAppButton;
