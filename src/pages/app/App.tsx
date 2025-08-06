import { useState, lazy } from "react";
import AppContext from "../../contexts/AppContext";
import { BrowserRouter, Route, Routes } from "react-router";

const PlaygroundPage = lazy(() => import("../playground/Playground"));
const TokenPage = lazy(() => import("../get-token/GetToken"));

export default function App() {
  const [token, setToken] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  return (
    <AppContext.Provider
      value={{
        token,
        model: selectedModel,
        setSelectedModel,
        setToken,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/" element={<TokenPage />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
