import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

const pageFallback = (
  <div className="grid min-h-screen place-items-center p-8 text-center font-body">
    <p>
      Something went wrong loading this page.
      <br />
      Please refresh, or reach me on LinkedIn in the meantime.
    </p>
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary name="app" fallback={pageFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
