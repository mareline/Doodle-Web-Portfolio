import { useRef } from "react";
import { useParallax } from "./hooks/useParallax";
import { useSparkles } from "./hooks/useSparkles";
import ErrorBoundary from "./components/ErrorBoundary";
import Page from "./components/Page";
import WompWomp from "./components/WompWomp";
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
      <WompWomp />

      <div ref={stageRef} className="relative z-10 overflow-x-clip px-5 sm:px-10">
        <Sparkles bursts={bursts} />
        <ErrorBoundary name="nav">
          <Nav onPop={handlePop} />
        </ErrorBoundary>
        <main>
          {/* Each Page fills the screen on desktop and snaps into place; its pencil note gets erased as you scroll on */}
          <Page divider="scroll down ↓" wide>
            <ErrorBoundary name="hero">
              <Hero onPop={handlePop} />
            </ErrorBoundary>
          </Page>
          <Page divider="up next: where I’ve worked">
            <ErrorBoundary name="about">
              <About onPop={handlePop} />
            </ErrorBoundary>
          </Page>
          <Page divider="now, a few things I’ve made">
            <ErrorBoundary name="work">
              <Work onPop={handlePop} />
            </ErrorBoundary>
          </Page>
          <Page divider="okay, let’s talk!">
            <ErrorBoundary name="portfolio">
              <Portfolio />
            </ErrorBoundary>
          </Page>
          <Page>
            <ErrorBoundary name="contact">
              <Contact />
            </ErrorBoundary>
          </Page>
        </main>
      </div>
    </>
  );
}
