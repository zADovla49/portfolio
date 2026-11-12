import React from 'react';
import { ArrowDown } from 'lucide-react';
import ADMonogram from '../ADMonogram';

interface HeroSectionProps {
  onExploreNext: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreNext }) => {
  return (
    <section
      id="home"
      data-section="home"
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-10 sm:pb-14 px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      {/* Subtle top-corner architectural telemetry */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between pt-2 opacity-80">
        <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-slate-400 uppercase">
          <span className="w-6 h-[1px] bg-sky-400/70" />
          <span>CHAPTER 00 // DIGITAL MONOLITH</span>
        </div>
        <div className="hidden sm:block font-mono text-[10px] tracking-[0.3em] text-slate-500 uppercase">
          ABDULLOH DOVLATBOEV
        </div>
      </div>

      {/* Central viewport window kept open so the massive 3D Chrome AD Monogram commands space */}
      <div className="my-auto pt-44 sm:pt-56 lg:pt-60 max-w-6xl w-full mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-chrome border border-slate-700/60 mb-6 reveal-up">
          <ADMonogram size={18} showFrame={false} />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.34em] text-sky-300 uppercase">
            THE DIGITAL IDENTITY
          </span>
        </div>

        <h1 className="hero-title font-display font-bold tracking-[0.22em] sm:tracking-[0.28em] text-4xl sm:text-7xl md:text-8xl lg:text-[6.6rem] leading-none metallic-text uppercase drop-shadow-[0_12px_45px_rgba(0,0,0,0.9)]">
          ABDULLOH
        </h1>

        <p className="mt-5 sm:mt-7 font-display text-xs sm:text-base md:text-lg tracking-[0.36em] sm:tracking-[0.46em] text-sky-400 uppercase font-medium">
          QUIET MIND. PRECISE EXECUTION.
        </p>

        <p className="mt-5 max-w-xl mx-auto font-sans text-sm sm:text-base md:text-lg text-slate-300/90 font-light leading-relaxed tracking-wide">
          Building knowledge. Developing skills. Creating with purpose.
        </p>
      </div>

      {/* Scroll Transition Trigger */}
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center relative z-10 mt-8">
        <button
          type="button"
          onClick={onExploreNext}
          className="group flex flex-col items-center gap-3 text-slate-400 hover:text-white transition-colors duration-300 focus:outline-none"
          aria-label="Scroll into About Abdulloh"
        >
          <span className="font-mono text-[10px] tracking-[0.36em] uppercase text-slate-400 group-hover:text-sky-400 transition-colors">
            SCROLL TO ENTER
          </span>
          <span className="relative flex items-center justify-center w-9 h-14 rounded-full border border-slate-700/80 group-hover:border-sky-400/70 glass-chrome overflow-hidden transition-all duration-300">
            <span className="absolute top-2 w-1 h-2.5 rounded-full bg-sky-400 animate-bounce" />
            <ArrowDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-300 translate-y-2 transition-transform" />
          </span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
