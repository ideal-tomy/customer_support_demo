import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ensureAiDemoCoreConfigured } from "./lib/ai-demo-core-setup";
import { setDemoExplainMode } from "./demo/demo-explain-mode";
import "./styles/scaffold.css";

ensureAiDemoCoreConfigured();

try {
  if (new URLSearchParams(window.location.search).get("explain") === "1") {
    setDemoExplainMode(true);
  }
} catch {
  /* ignore */
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
