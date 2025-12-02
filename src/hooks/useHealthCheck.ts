import { useEffect, useState } from "react";
import { apiConfig, getHeaders } from "@/config/mercadopago";

interface HealthStatus {
  isHealthy: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useHealthCheck = (): HealthStatus => {
  const [isHealthy, setIsHealthy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        console.log("[Health] Verificando status do backend...");
        const response = await fetch(`${apiConfig.baseUrl}/health`, {
          method: "GET",
          headers: getHeaders(),
        });

        if (response.ok) {
          console.log("[Health] Backend está saudável!");
          setIsHealthy(true);
        } else {
          console.warn("[Health] Backend retornou status:", response.status);
          setIsHealthy(false);
          setError(`Status: ${response.status}`);
        }
      } catch (err) {
        console.error("[Health] Erro ao verificar backend:", err);
        setIsHealthy(false);
        setError(err instanceof Error ? err.message : "Erro de conexão");
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
  }, []);

  return { isHealthy, isLoading, error };
};

export default useHealthCheck;
