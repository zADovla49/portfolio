import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, RefreshCw } from 'lucide-react';

import UniverseCanvas from './components/three/UniverseCanvas';
import Preloader from './components/Preloader';
import Navbar, { type NavSectionId } from './components/Navbar';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import OriginSection from './components/sections/OriginSection';
import JourneySection from './components/sections/JourneySection';
import ProjectsSection from './components/sections/ProjectsSection';
import AchievementsSection from './components/sections/AchievementsSection';
import ContactSection from './components/sections/ContactSection';
import ADMonogram from './components/ADMonogram';

import {
  fetchPortfolioBundle,
  fetchTransmissions,
  createTransmission,
  updateTransmission,
  deleteTransmission,
  getVisitorToken,
} from './lib/portfolioApi';
import type {
  PortfolioAchievement,
  PortfolioPillar,
  PortfolioProject,
  TransmissionItem,
} from './types/portfolio';

gsap.registerPlugin(ScrollTrigger);

const SECTION_ORDER: NavSectionId[] = [
  'home',
  'about',
  'journey',
  'projects',
  'achievements',
  'contact',
];

export default function App() {
  const scrollProgressRef = useRef<number>(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [preloaderDone, setPreloaderDone] = useState(false);

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [achievements, setAchievements] = useState<PortfolioAchievement[]>([]);
  const [pillars, setPillars] = useState<PortfolioPillar[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  const [transmissions, setTransmissions] = useState<TransmissionItem[]>([]);
  const [loadingTransmissions, setLoadingTransmissions] = useState(true);
  const [transmissionError, setTransmissionError] = useState<string | null>(null);

  const visitorToken = useMemo(() => getVisitorToken(), []);

  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const loadPortfolio = useCallback(async () => {
    setLoadingPortfolio(true);
    setPortfolioError(null);
    try {
      const bundle = await fetchPortfolioBundle();
      setProjects(bundle.projects);
      setAchievements(bundle.achievements);
      setPillars(bundle.pillars);
    } catch (err) {
      setPortfolioError(
        err instanceof Error ? err.message : 'Failed to load portfolio data.'
      );
    } finally {
      setLoadingPortfolio(false);
    }
  }, []);

  const loadTransmissions = useCallback(async () => {
    setLoadingTransmissions(true);
    setTransmissionError(null);
    try {
      const items = await fetchTransmissions();
      setTransmissions(items);
    } catch (err) {
      setTransmissionError(
        err instanceof Error ? err.message : 'Unable to load visitor notes.'
      );
    } finally {
      setLoadingTransmissions(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
    loadTransmissions();
  }, [loadPortfolio, loadTransmissions]);

  // Global scroll progress + active chapter spy
  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      scrollProgressRef.current = ratio;
      setScrollPercent(Math.round(ratio * 100));

      const viewportMid = window.innerHeight * 0.42;
      for (let i = SECTION_ORDER.length - 1; i >= 0; i--) {
        const id = SECTION_ORDER[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportMid) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP ScrollTrigger cinematic reveals
  useEffect(() => {
    if (reducedMotion || loadingPortfolio) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>('.gsap-reveal');
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [reducedMotion, loadingPortfolio]);

  const scrollToSection = useCallback(
    (id: NavSectionId) => {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    },
    [reducedMotion]
  );

  const handleCreateNote = async (
    sender_name: string,
    topic: string,
    message: string
  ) => {
    await createTransmission({
      sender_name,
      topic,
      message,
      client_token: visitorToken,
    });
    await loadTransmissions();
  };

  const handleUpdateNote = async (
    id: number,
    sender_name: string,
    topic: string,
    message: string
  ) => {
    await updateTransmission({
      id,
      sender_name,
      topic,
      message,
      client_token: visitorToken,
    });
    await loadTransmissions();
  };

  const handleDeleteNote = async (id: number) => {
    await deleteTransmission({
      id,
      client_token: visitorToken,
    });
    await loadTransmissions();
  };

  const interests = useMemo(
    () => pillars.filter((p) => p.section === 'interest'),
    [pillars]
  );
  const originPillar = useMemo(
    () => pillars.find((p) => p.section === 'origin'),
    [pillars]
  );
  const journeyPhases = useMemo(
    () => pillars.filter((p) => p.section === 'journey'),
    [pillars]
  );

  return (
    <div className="relative min-h-screen bg-[#020409] text-slate-100 selection:bg-sky-500/30">
      {!preloaderDone && (
        <Preloader
          ready={!loadingPortfolio}
          onComplete={() => setPreloaderDone(true)}
        />
      )}

      {/* Persistent 3D WebGL Digital Universe */}
      <UniverseCanvas
        scrollProgressRef={scrollProgressRef}
        reducedMotion={reducedMotion}
      />

      {/* Subtle Radial Vignette for Editorial Contrast */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, transparent 25%, rgba(2, 4, 9, 0.58) 100%)',
        }}
      />

      {/* Minimal Floating Navigation */}
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      {/* Right-Edge Spatial Depth Telemetry Rail (Desktop) */}
      <aside
        aria-hidden="true"
        className="hidden xl:flex fixed right-7 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 pointer-events-none"
      >
        <span className="font-mono text-[9px] tracking-[0.25em] text-slate-500">
          00
        </span>
        <div className="w-[1.5px] h-36 bg-slate-800/80 relative overflow-hidden rounded-full">
          <div
            className="w-full bg-gradient-to-b from-slate-300 to-[#2997FF] transition-all duration-150"
            style={{ height: `${scrollPercent}%` }}
          />
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] text-sky-400">
          {String(scrollPercent).padStart(2, '0')}%
        </span>
      </aside>

      {/* Main Scroll-Choreographed Spatial Experience */}
      <main className="relative z-10">
        {portfolioError && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full glass-chrome border border-rose-500/50 text-xs text-rose-200 shadow-2xl">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{portfolioError}</span>
            <button
              type="button"
              onClick={loadPortfolio}
              className="inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase text-sky-300 hover:text-white ml-2"
            >
              <RefreshCw className="w-3 h-3" /> RETRY
            </button>
          </div>
        )}

        <HeroSection onExploreNext={() => scrollToSection('about')} />

        {/* Architectural Transition Divider */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center gap-4 opacity-50">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700 to-slate-800" />
          <ADMonogram size={20} showFrame={false} />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-slate-700 to-slate-800" />
        </div>

        <AboutSection interests={interests} loading={loadingPortfolio} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center gap-4 opacity-50">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-sky-900/70 to-slate-800" />
          <ADMonogram size={20} showFrame={false} />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-sky-900/70 to-slate-800" />
        </div>

        <OriginSection origin={originPillar} loading={loadingPortfolio} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center gap-4 opacity-50">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-sky-900/70 to-slate-800" />
          <ADMonogram size={20} showFrame={false} />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-sky-900/70 to-slate-800" />
        </div>

        <JourneySection phases={journeyPhases} loading={loadingPortfolio} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center gap-4 opacity-50">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700 to-slate-800" />
          <ADMonogram size={20} showFrame={false} />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-slate-700 to-slate-800" />
        </div>

        <ProjectsSection
          projects={projects}
          loading={loadingPortfolio}
          reducedMotion={reducedMotion}
        />

        <AchievementsSection
          achievements={achievements}
          loading={loadingPortfolio}
          reducedMotion={reducedMotion}
        />

        <ContactSection
          transmissions={transmissions}
          visitorToken={visitorToken}
          loadingTransmissions={loadingTransmissions}
          transmissionError={transmissionError}
          onCreate={handleCreateNote}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
        />
      </main>
    </div>
  );
}
