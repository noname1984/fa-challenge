import {
  useCallback,
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import useFetchModels from "../../hooks/useFetchModels";
import type { ModelType } from "./types";
import AppContext from "../../contexts/AppContext";

const ModelsDropdown = () => {
  const context = useContext(AppContext);
  const { loading, error, models } = useFetchModels();
  const [currentModel, setCurrentModel] = useState<ModelType | null>(null);

  useEffect(() => {
    if (!loading && models?.length > 0 && currentModel === null) {
      setCurrentModel(models[0]);
      context?.setSelectedModel(models[0].name);
    }
  }, [context, currentModel, loading, models]);

  const selectModelHandler = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const val = event.target.value;
      const model = models.find((m) => m.name === val) || null;
      setCurrentModel(model);
      context?.setSelectedModel(model?.name || "");
    },
    [models, context],
  );

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>there is an error loading models, please try again later!</div>;
  }

  return (
    <section className="m-[10px] flex flex-col w-fit h-fit">
      <label
        htmlFor="models-dropdown"
        className="text-left font-semibold text-[20px] text-blue-900"
      >
        Model
      </label>
      <select
        id="models-dropdown"
        name="models-dropdown"
        value={currentModel?.name}
        onChange={selectModelHandler}
        className="rounded-[5px] border-[#182124] border-1 border-solid h-[35px]"
      >
        {models.map((m) => (
          <option key={m.name} value={m.name}>
            {m.title}
          </option>
        ))}
      </select>
    </section>
  );
};

export default ModelsDropdown;
