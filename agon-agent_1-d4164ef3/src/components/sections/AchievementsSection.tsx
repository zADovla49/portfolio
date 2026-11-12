import React from 'react';
import ADMonogram from '../ADMonogram';
import MedalCanvas from '../three/MedalCanvas';
import type { PortfolioAchievement } from '../../types/portfolio';

interface AchievementsSectionProps {
  achievements: PortfolioAchievement[];
  loading: boolean;
  reducedMotion: boolean;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  loading,
  reducedMotion,
}) => {
  const primary = achievements[0];

  return (
    <section
      id="achievements"
      data-section="achievements"
      className="gsap-section relative py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      {/* Subtle deep-black & electric-blue spotlight chamber backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-85"
        style={{
          background:
            'radial-gradient(circle at 30% 50%, rgba(30, 144, 255, 0.11) 0%, rgba(3, 6, 14, 0.92) 55%, #010308 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-10 gsap-reveal">
          <ADMonogram size={28} />
          <div className="h-[1px] w-12 bg-gradient-to-r from-sky-400 to-transparent" />
          <span className="font-mono text-[11px] tracking-[0.34em] text-sky-400 uppercase">
            04 // ACHIEVEMENTS — JUDO
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Prestigious 3D Silver Medal Spotlight Stage */}
          <div className="lg:col-span-6 gsap-reveal">
            <div className="relative rounded-3xl border border-slate-800/90 bg-gradient-to-b from-[#070F22]/90 via-[#03060E]/95 to-[#020409] p-4 sm:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden">
              <div className="flex items-center justify-between px-3 pt-1 pb-2 border-b border-slate-800/70">
                <span className="font-mono text-[10px] tracking-[0.3em] text-slate-400 uppercase">
                  SILVER MEDAL // UNITED STATES DEBUT
                </span>
                <span className="font-mono text-[10px] tracking-[0.3em] text-sky-400">
                  2026
                </span>
              </div>

              <MedalCanvas reducedMotion={reducedMotion} />
            </div>
          </div>

          {/* Prestigious Honor Typography */}
          <div className="lg:col-span-6 space-y-7 gsap-reveal">
            {loading || !primary ? (
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-slate-900 rounded animate-pulse" />
                <div className="h-8 w-1/2 bg-slate-900 rounded animate-pulse" />
                <div className="h-28 w-full bg-slate-900 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60">
                  <span className="w-2 h-2 rounded-full bg-slate-200 shadow-[0_0_12px_#FFFFFF]" />
                  <span className="font-mono text-[10px] tracking-[0.3em] text-slate-200 uppercase">
                    {primary.location_context}
                  </span>
                </div>

                <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-[0.08em] leading-[1.08] metallic-text uppercase">
                  {primary.event_title}
                </h2>

                <div className="py-3 px-5 rounded-xl border border-slate-700/70 bg-gradient-to-r from-slate-200/10 via-sky-500/10 to-transparent inline-block">
                  <p className="font-serif text-xl sm:text-2xl tracking-[0.18em] text-slate-100 uppercase font-semibold">
                    {primary.honor}
                  </p>
                </div>

                <p className="text-base sm:text-lg text-slate-200/95 font-light leading-relaxed">
                  {primary.summary}
                </p>

                <div className="p-6 rounded-2xl glass-chrome border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-sky-400 uppercase">
                      CURRENT PREPARATION PHASE
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.26em] text-slate-400 uppercase">
                      ~3 MONTHS DEDICATED TRAINING
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300/90 font-light leading-relaxed">
                    {primary.training_status}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
