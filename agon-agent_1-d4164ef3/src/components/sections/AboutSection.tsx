import React, { useState } from 'react';
import ADMonogram from '../ADMonogram';
import type { PortfolioPillar } from '../../types/portfolio';

interface AboutSectionProps {
  interests: PortfolioPillar[];
  loading: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ interests, loading }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  return (
    <section
      id="about"
      data-section="about"
      className="gsap-section relative py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-10 gsap-reveal">
          <ADMonogram size={28} />
          <div className="h-[1px] w-12 bg-gradient-to-r from-sky-400 to-transparent" />
          <span className="font-mono text-[11px] tracking-[0.34em] text-sky-400 uppercase">
            01 // ABOUT ABDULLOH
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column — Editorial Character Portrait in Words */}
          <div className="lg:col-span-7 space-y-8 gsap-reveal">
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[0.08em] leading-[1.08] metallic-text uppercase">
              STILLNESS IN THOUGHT.
              <br />
              <span className="text-slate-400 font-light">INTENTION IN ACTION.</span>
            </h2>

            <div className="space-y-5 text-base sm:text-lg text-slate-300/90 font-light leading-relaxed max-w-2xl">
              <p>
                I am <strong className="text-white font-medium">Abdulloh Dovlatboev</strong> — quiet,
                serious, disciplined, and respectful. I value intelligence, creativity,
                independence, and continuous improvement in everything I pursue.
              </p>
              <p>
                Rather than unnecessary talking, I prefer meaningful work, focused study, and
                deliberate progress. Every discipline I explore — from technology and human
                psychology to physical training on the Judo mat — sharpens clarity of mind and
                strength of character.
              </p>
            </div>

            {/* Signature Ethos Monument Quote */}
            <blockquote className="relative pl-6 sm:pl-8 py-5 border-l-2 border-[#2997FF] bg-gradient-to-r from-sky-950/25 via-slate-900/20 to-transparent rounded-r-xl">
              <p className="font-serif italic text-xl sm:text-2xl lg:text-[1.7rem] text-slate-100 leading-snug tracking-wide">
                “I believe in discipline, continuous improvement, and letting the quality of my
                work speak for itself.”
              </p>
              <footer className="mt-3 font-mono text-[10px] tracking-[0.32em] text-sky-400 uppercase">
                — ABDULLOH DOVLATBOEV
              </footer>
            </blockquote>
          </div>

          {/* Right Column — Six Authentic Domains of Focus (Architectural Ledger) */}
          <div className="lg:col-span-5 gsap-reveal">
            <div className="glass-chrome rounded-2xl border border-slate-800/90 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
              <div className="flex items-center justify-between pb-5 mb-2 border-b border-slate-800/90">
                <span className="font-mono text-[11px] tracking-[0.3em] text-slate-300 uppercase">
                  CORE INTERESTS & DISCIPLINES
                </span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-sky-400">
                  06 DOMAINS
                </span>
              </div>

              {loading ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="h-12 rounded-lg bg-slate-900/70 border border-slate-800/50 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-800/75">
                  {interests.map((item, idx) => {
                    const active = hoveredIndex === idx;
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        className="py-4 transition-all duration-300 cursor-default group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <span
                              className={`font-mono text-xs tracking-[0.2em] transition-colors ${
                                active ? 'text-sky-400' : 'text-slate-500'
                              }`}
                            >
                              {item.code}
                            </span>
                            <h3
                              className={`font-display text-sm sm:text-base tracking-[0.14em] uppercase transition-colors ${
                                active ? 'text-white' : 'text-slate-300 group-hover:text-white'
                              }`}
                            >
                              {item.title}
                            </h3>
                          </div>
                          <span
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                              active
                                ? 'bg-[#2997FF] shadow-[0_0_12px_#2997FF] scale-125'
                                : 'bg-slate-700'
                            }`}
                          />
                        </div>
                        <p
                          className={`mt-2 pl-9 text-xs sm:text-sm text-slate-400 font-light leading-relaxed transition-all duration-300 ${
                            active ? 'opacity-100 max-h-24' : 'opacity-75 max-h-20'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
