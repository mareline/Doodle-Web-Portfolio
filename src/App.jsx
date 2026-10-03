import { useRef } from "react";
import { useParallax } from "./hooks/useParallax";
import { useSparkles } from "./hooks/useSparkles";
import ErrorBoundary from "./components/ErrorBoundary";
import PaperDivider from "./components/PaperDivider";
import PaperLayer from "./components/PaperLayer";
import SketchFilters from "./components/SketchFilters";
import Sparkles from "./components/Sparkles";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";

export default function App() {
  const stageRef = useRef(null);
  const { bursts, handlePop } = useSparkles(stageRef);
  useParallax(stageRef);

  return (
    <>
      <SketchFilters />
      {/* Behind the content: crumpling paper dividers (Three.js) */}
      <ErrorBoundary name="paper">
        <PaperLayer />
      </ErrorBoundary>

      <div ref={stageRef} className="relative z-10 mx-auto max-w-5xl overflow-x-clip px-4 pb-10 sm:px-8">
        <Sparkles bursts={bursts} />
        <ErrorBoundary name="nav">
          <Nav onPop={handlePop} />
        </ErrorBoundary>
        <ErrorBoundary name="hero">
          <Hero onPop={handlePop} />
        </ErrorBoundary>
        <main>
          <ErrorBoundary name="about">
            <About onPop={handlePop} />
          </ErrorBoundary>
          <PaperDivider label="up next: where I’ve worked" />
          <ErrorBoundary name="work">
            <Work />
          </ErrorBoundary>
          <PaperDivider label="now, a few things I’ve made" />
          <ErrorBoundary name="portfolio">
            <Portfolio />
          </ErrorBoundary>
          <PaperDivider label="okay, let’s talk!" />
          <ErrorBoundary name="contact">
            <Contact />
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
}
