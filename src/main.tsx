import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./pages/app/App";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <section className="w-screen h-screen flex bg-slate-200">
    <StrictMode>
      <App />
    </StrictMode>
  </section>
);
