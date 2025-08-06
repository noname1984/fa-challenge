import { useEffect, useState } from "react";
import type { ModelType } from "../features/models-dropdown/types";

const MODELS_URL = "https://app.fireworks.ai/api/models/mini-playground";

export default function useFetchModels() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [models, setModels] = useState<ModelType[]>([]);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(MODELS_URL);
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }

        const respData = (await response.json()) as ModelType[];
        respData.sort((model1, model2) =>
          model1.title.localeCompare(model2.title),
        );
        setModels(respData);
      } catch (error: unknown) {
        console.log("error: ", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { loading, error, models };
}
