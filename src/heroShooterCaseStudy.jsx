// Case study page at /projects/hero-shooter-llm: the story behind the Steam review LLM pipeline.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import HeroShooterCaseStudy from "./components/HeroShooterCaseStudy";
import "./index.css";

const pageFallback = (
  <div className="grid min-h-screen place-items-center p-8 text-center font-body">
    <p>
      Something went wrong loading this page.
      <br />
      <a href="/">Back to the portfolio</a>
    </p>
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary name="case-study" fallback={pageFallback}>
      <HeroShooterCaseStudy />
    </ErrorBoundary>
  </StrictMode>
);
