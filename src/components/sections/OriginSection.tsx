import React, { useEffect, useState } from 'react';
import ADMonogram from '../ADMonogram';
import type { PortfolioPillar } from '../../types/portfolio';

interface OriginSectionProps {
  origin?: PortfolioPillar;
  loading: boolean;
}

function getNextBirthdayCountdown() {
  const now = new Date();
  const year = now.getFullYear();
  let next = new Date(year, 11, 28, 0, 0, 0); // Dec 28 local time
  const isToday = now.getMonth() === 11 && now.getDate() === 28;

  if (!isToday && now > next) {
    next = new Date(year + 1, 11, 28, 0, 0, 0);
  }

  const diff = Math.max(0, next.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isToday };
}

export const OriginSection: React.FC<OriginSectionProps> = ({ origin, loading }) => {
  const [countdown, setCountdown] = useState(() => getNextBirthdayCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getNextBirthdayCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="origin"
      aria-label="Origin — Birthday December 28th, 2013"
      className="gsap-section relative py-24 sm:py-32 lg:py-36 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10 gsap-reveal">
          <ADMonogram size={28} />
          <div className="h-[1px] w-12 bg-gradient-to-r from-sky-400 to-transparent" />
          <span className="font-mono text-[11px] tracking-[0.34em] text-sky-400 uppercase">
            ORIGIN // CHRONOLOGY
          </span>
        </div>

        <div className="gsap-reveal relative rounded-3xl glass-chrome border border-slate-800/90 overflow-hidden p-8 sm:p-12 lg:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.82)]">
          {/* Ambient Electric-Blue Precision Glow & Orbital Geometry */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-35 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(41,151,255,0.38) 0%, transparent 70%)',
            }}
          />
          <div className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center opacity-15">
            <div className="w-64 h-64 rounded-full border border-sky-400/50 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-slate-300/40 flex items-center justify-center">
                <ADMonogram size={76} showFrame={false} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-5 max-w-2xl">
              <div className="h-5 w-48 bg-slate-900/80 rounded animate-pulse" />
              <div className="h-14 w-3/4 bg-slate-900/80 rounded animate-pulse" />
              <div className="h-16 w-full bg-slate-900/80 rounded animate-pulse" />
            </div>
          ) : (
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Monumental Date Typography */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-700/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2997FF] shadow-[0_0_10px_#2997FF]" />
                  <span className="font-mono text-[10px] tracking-[0.3em] text-slate-300 uppercase">
                    {origin?.subtitle || 'PERSONAL ORIGIN · DATE OF BIRTH'}
                  </span>
                </div>

                <p className="font-mono text-xs sm:text-sm tracking-[0.42em] text-sky-400 uppercase">
                  {origin?.code || '12 · 28 · 2013'}
                </p>

                <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-[0.08em] leading-[1.08] metallic-text uppercase">
                  {origin?.title || 'DECEMBER 28TH, 2013'}
                </h2>

                <p className="text-base sm:text-lg text-slate-200/95 font-light leading-relaxed max-w-2xl">
                  {origin?.description ||
                    'My birthday is on December 28th, 2013 — marking the beginning of a journey guided early by quiet focus, curiosity, and steady self-improvement.'}
                </p>
              </div>

              {/* Right Precision Chronometer Module */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-[#030712]/85 border border-slate-800/90 p-6 sm:p-7">
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
                    <span className="font-mono text-[10px] tracking-[0.28em] text-slate-400 uppercase">
                      BIRTHDAY MONUMENT
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.25em] text-sky-400 uppercase">
                      DEC 28 · 2013
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="rounded-xl bg-slate-950/90 border border-slate-800/80 p-3.5 text-center">
                      <span className="block font-mono text-[9px] tracking-[0.24em] text-slate-500 uppercase mb-1">
                        MONTH
                      </span>
                      <span className="font-display text-lg sm:text-xl text-white tracking-[0.12em]">
                        DEC
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-950/90 border border-sky-500/35 p-3.5 text-center shadow-[0_0_24px_rgba(41,151,255,0.12)]">
                      <span className="block font-mono text-[9px] tracking-[0.24em] text-sky-400 uppercase mb-1">
                        DAY
                      </span>
                      <span className="font-display text-lg sm:text-xl text-white tracking-[0.12em]">
                        28
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-950/90 border border-slate-800/80 p-3.5 text-center">
                      <span className="block font-mono text-[9px] tracking-[0.24em] text-slate-500 uppercase mb-1">
                        YEAR
                      </span>
                      <span className="font-display text-lg sm:text-xl text-white tracking-[0.08em]">
                        2013
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    <span className="block font-mono text-[9px] tracking-[0.28em] text-slate-400 uppercase mb-2.5">
                      {countdown.isToday
                        ? 'MILESTONE ACTIVE TODAY — DECEMBER 28'
                        : 'NEXT DECEMBER 28 MILESTONE IN'}
                    </span>
                    <div className="grid grid-cols-4 gap-2 font-mono">
                      {[
                        { label: 'DAYS', val: countdown.days },
                        { label: 'HRS', val: countdown.hours },
                        { label: 'MIN', val: countdown.minutes },
                        { label: 'SEC', val: countdown.seconds },
                      ].map((unit) => (
                        <div
                          key={unit.label}
                          className="rounded-lg bg-slate-900/60 border border-slate-800/70 py-2 px-1 text-center"
                        >
                          <span className="block text-sm sm:text-base text-slate-100 font-medium">
                            {String(unit.val).padStart(2, '0')}
                          </span>
                          <span className="block text-[8px] tracking-[0.22em] text-slate-500 mt-0.5">
                            {unit.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OriginSection;
