import { useEffect, useState } from "react";
import axios from "axios";

const useBackendHealth = (): boolean | null => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const healthUrl = baseUrl.replace(/\/api\/?$/, "/health");
        await axios.get(healthUrl);
        setIsHealthy(true);
      } catch {
        setIsHealthy(false);
      }
    };

    checkHealth();
  }, []);

  return isHealthy;
};

export default useBackendHealth;
