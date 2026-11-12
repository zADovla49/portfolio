import React from 'react';
import { Shield, Terminal, Compass } from 'lucide-react';
import ADMonogram from '../ADMonogram';
import type { PortfolioPillar } from '../../types/portfolio';

interface JourneySectionProps {
  phases: PortfolioPillar[];
  loading: boolean;
}

const PHASE_ICONS = [Compass, Terminal, Shield];

export const JourneySection: React.FC<JourneySectionProps> = ({ phases, loading }) => {
  return (
    <section
      id="journey"
      data-section="journey"
      className="gsap-section relative py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-10 gsap-reveal">
          <ADMonogram size={28} />
          <div className="h-[1px] w-12 bg-gradient-to-r from-sky-400 to-transparent" />
          <span className="font-mono text-[11px] tracking-[0.34em] text-sky-400 uppercase">
            02 // MY JOURNEY
          </span>
        </div>

        <div className="max-w-4xl gsap-reveal">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[0.08em] leading-[1.08] metallic-text uppercase">
            THE PATH TOWARD
            <br />
            <span className="text-sky-400">CYBERSECURITY.</span>
          </h2>

          <p className="mt-7 text-base sm:text-xl text-slate-200/95 font-light leading-relaxed">
            My long-term goal is to become a{' '}
            <span className="text-white font-medium">cybersecurity professional</span>. I am at
            the beginning of this journey — approaching technology with genuine curiosity,
            humility, and a serious commitment to learning.
          </p>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-light leading-relaxed max-w-3xl">
            I have started learning programming and am continuously developing my technical
            foundations step by step. Every line of code studied and every interactive project
            built is part of laying strong, honest groundwork for the future.
          </p>
        </div>

        {/* Architectural Trajectory Conduit */}
        <div className="mt-16 relative gsap-reveal">
          {/* Glowing electric-blue horizontal spine on desktop */}
          <div className="hidden lg:block absolute top-10 left-8 right-8 h-[1px] bg-gradient-to-r from-sky-500/20 via-[#2997FF]/70 to-sky-500/20" />

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-60 rounded-2xl glass-chrome border border-slate-800/80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {phases.map((phase, idx) => {
                const IconComp = PHASE_ICONS[idx % PHASE_ICONS.length];
                return (
                  <div
                    key={phase.id}
                    className="relative group rounded-2xl glass-chrome border border-slate-800/90 hover:border-sky-400/60 p-7 sm:p-8 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-400/35 flex items-center justify-center text-sky-400 group-hover:shadow-[0_0_24px_rgba(41,151,255,0.35)] transition-all">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[11px] tracking-[0.3em] text-slate-500 group-hover:text-sky-400 transition-colors">
                        STAGE {phase.code}
                      </span>
                    </div>

                    <p className="font-mono text-[10px] tracking-[0.28em] text-sky-400 uppercase mb-2">
                      {phase.subtitle}
                    </p>
                    <h3 className="font-display text-lg sm:text-xl tracking-[0.12em] text-white uppercase mb-3">
                      {phase.title}
                    </h3>
                    <p className="text-sm text-slate-300/85 font-light leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
