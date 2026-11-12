import React, { useEffect, useState } from 'react';
import ADMonogram from './ADMonogram';

interface PreloaderProps {
  ready: boolean;
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ ready, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const cap = ready ? 100 : 88;
        const step = ready ? 9 : 3;
        return Math.min(cap, prev + step);
      });
    }, 35);
    return () => clearInterval(interval);
  }, [ready]);

  useEffect(() => {
    if (progress >= 100 && ready && !exiting) {
      const t1 = setTimeout(() => setExiting(true), 220);
      const t2 = setTimeout(() => onComplete(), 920);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [progress, ready, exiting, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#02050C] transition-all duration-700 ease-out ${
        exiting ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(41, 151, 255, 0.12) 0%, rgba(4, 9, 22, 0.6) 45%, #02050C 80%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="relative mb-8">
          <div className="absolute -inset-6 rounded-full bg-sky-500/10 blur-2xl animate-pulse" />
          <ADMonogram size={88} animated glow />
        </div>

        <p className="font-display text-sm sm:text-base tracking-[0.48em] text-slate-100 uppercase mb-2">
          ABDULLOH
        </p>
        <p className="font-mono text-[10px] tracking-[0.34em] text-slate-400 uppercase mb-8">
          QUIET MIND · PRECISE EXECUTION
        </p>

        <div className="w-56 sm:w-64 h-[1.5px] bg-slate-800/90 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-slate-400 via-[#2997FF] to-white transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between w-56 sm:w-64 font-mono text-[10px] tracking-[0.25em] text-slate-500">
          <span>DIGITAL IDENTITY</span>
          <span className="text-sky-400">{String(progress).padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
