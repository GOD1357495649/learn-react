import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SelectItemProvider } from "./context/selectItem-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SelectItemProvider>
      <App />
    </SelectItemProvider>
  </StrictMode>
);
