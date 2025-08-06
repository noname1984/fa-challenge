import { createContext } from "react";

export type AppContextType = {
  token: string;
  model: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

const AppContext = createContext<AppContextType | null>(null);
export default AppContext;
