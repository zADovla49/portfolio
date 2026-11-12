import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ADMonogram from './ADMonogram';

export type NavSectionId =
  | 'home'
  | 'about'
  | 'journey'
  | 'projects'
  | 'achievements'
  | 'contact';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (id: NavSectionId) => void;
}

const NAV_ITEMS: { id: NavSectionId; label: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'journey', label: 'JOURNEY' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'achievements', label: 'ACHIEVEMENTS' },
  { id: 'contact', label: 'CONTACT' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: NavSectionId) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 pt-4 sm:pt-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Floating Brand Pill */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="pointer-events-auto group flex items-center gap-3 px-3.5 py-2 rounded-full glass-chrome border border-slate-700/50 hover:border-sky-400/60 transition-all duration-300"
          aria-label="Return to top — Abdulloh"
        >
          <ADMonogram size={30} showFrame={false} />
          <span className="font-display text-xs tracking-[0.34em] text-slate-100 group-hover:text-white transition-colors pr-1">
            ABDULLOH
          </span>
        </button>

        {/* Minimal Floating Navigation Bar (Desktop) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex pointer-events-auto items-center gap-1 px-2.5 py-1.5 rounded-full glass-chrome border border-slate-700/50 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.24em] transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-sky-500/15 border border-sky-400/40 shadow-[0_0_20px_rgba(41,151,255,0.22)]'
                    : 'text-slate-400 hover:text-slate-100 border border-transparent'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2997FF]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Signature Status Tag (Desktop) / Menu Toggle (Mobile) */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-full glass-chrome border border-slate-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2997FF] shadow-[0_0_10px_#2997FF]" />
            <span className="font-mono text-[10px] tracking-[0.26em] text-slate-300 uppercase">
              MADE BY ABDULLOH
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full glass-chrome border border-slate-700/60 text-slate-200 hover:border-sky-400/60 transition-colors"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden pointer-events-auto mt-3 mx-auto max-w-md rounded-2xl glass-chrome border border-slate-700/60 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs tracking-[0.26em] transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-white border border-sky-400/40'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-slate-500">0{idx + 1}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono tracking-[0.24em] text-slate-400">
            <span>ABDULLOH</span>
            <span className="text-sky-400">MADE BY ABDULLOH</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
