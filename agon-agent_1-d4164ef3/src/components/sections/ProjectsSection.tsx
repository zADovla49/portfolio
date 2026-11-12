import React, { useState } from 'react';
import { ArrowUpRight, Eye, Image as ImageIcon } from 'lucide-react';
import ADMonogram from '../ADMonogram';
import type { PortfolioProject } from '../../types/portfolio';

interface ProjectsSectionProps {
  projects: PortfolioProject[];
  loading: boolean;
  reducedMotion: boolean;
}

interface TiltCardProps {
  project: PortfolioProject;
  index: number;
  reducedMotion: boolean;
}

const ProjectStage: React.FC<TiltCardProps> = ({ project, index, reducedMotion }) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [liveMode, setLiveMode] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || liveMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 9,
      ry: (px - 0.5) * 11,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const isReversed = index % 2 === 1;

  return (
    <article className="gsap-reveal grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* 3D Perspective Visual Stage */}
      <div
        className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
        style={{ perspective: '1400px' }}
      >
        <div
          onMouseMove={handleMove}
          onMouseLeave={resetTilt}
          style={{
            transform: liveMode
              ? 'none'
              : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
            transformStyle: 'preserve-3d',
          }}
          className="relative rounded-2xl overflow-hidden border border-slate-700/70 hover:border-sky-400/70 bg-[#040916] shadow-[0_30px_90px_rgba(0,0,0,0.85)] transition-transform duration-200 ease-out group"
        >
          {/* Top viewport chrome bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-slate-700" />
              <span className="w-2 h-2 rounded-full bg-slate-700" />
              <span className="w-2 h-2 rounded-full bg-[#2997FF]" />
              <span className="ml-2 font-mono text-[10px] tracking-[0.26em] text-slate-400 uppercase truncate max-w-[180px] sm:max-w-xs">
                PROJECT {project.project_number} // {project.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setLiveMode((v) => !v);
                resetTilt();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] tracking-[0.2em] uppercase border border-slate-700/80 hover:border-sky-400/70 text-slate-300 hover:text-white bg-slate-900/80 transition-colors"
            >
              {liveMode ? (
                <>
                  <ImageIcon className="w-3 h-3 text-sky-400" />
                  <span>ARTWORK</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 text-sky-400" />
                  <span>LIVE PREVIEW</span>
                </>
              )}
            </button>
          </div>

          {/* Main 16:10 Exhibition Viewport */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#030712]">
            {liveMode ? (
              <iframe
                src={project.website_url}
                title={`${project.title} Live Website Preview`}
                className="w-full h-full border-0 bg-slate-950"
                loading="lazy"
              />
            ) : (
              <>
                <img
                  src={project.preview_image}
                  alt={`${project.title} — Educational Interactive Website by Abdulloh`}
                  className="w-full h-full object-cover object-center scale-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Cinematic dark vignette + dynamic specular reflection */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#02050C] via-transparent to-[#02050C]/35" />
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(41, 151, 255, 0.22), transparent 55%)`,
                  }}
                />
                {/* Floating bottom-left index watermark */}
                <div className="pointer-events-none absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <span className="font-display text-3xl sm:text-5xl font-bold tracking-[0.18em] text-white/15 select-none">
                    {project.project_number}
                  </span>
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full glass-chrome border border-sky-400/50 text-xs font-mono tracking-[0.22em] text-white hover:bg-sky-500/20 transition-all"
                  >
                    <span>OPEN SITE</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Editorial Project Details */}
      <div className={`lg:col-span-5 space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tracking-[0.32em] text-sky-400 uppercase">
            PROJECT {project.project_number}
          </span>
          <span className="h-[1px] w-10 bg-slate-700" />
          <span className="font-mono text-[10px] tracking-[0.24em] text-slate-400 uppercase">
            {project.category}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-4xl lg:text-[2.6rem] font-semibold tracking-[0.1em] leading-tight metallic-text uppercase">
          {project.title}
        </h3>

        <p className="text-base sm:text-lg text-slate-200/95 font-light leading-relaxed">
          {project.description}
        </p>

        <p className="text-sm text-slate-400 font-light leading-relaxed border-l border-slate-800 pl-4">
          {project.extended_note}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <a
            href={project.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-white text-slate-950 font-mono text-xs font-semibold tracking-[0.26em] uppercase shadow-[0_0_35px_rgba(41,151,255,0.28)] hover:shadow-[0_0_50px_rgba(41,151,255,0.55)] transition-all duration-300"
          >
            <span>EXPLORE PROJECT</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  loading,
  reducedMotion,
}) => {
  return (
    <section
      id="projects"
      data-section="projects"
      className="gsap-section relative py-28 sm:py-36 lg:py-44 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10 gsap-reveal">
          <ADMonogram size={28} />
          <div className="h-[1px] w-12 bg-gradient-to-r from-sky-400 to-transparent" />
          <span className="font-mono text-[11px] tracking-[0.34em] text-sky-400 uppercase">
            03 // SELECTED WORKS
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 gsap-reveal">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[0.08em] leading-[1.08] metallic-text uppercase">
            MY PROJECTS.
          </h2>
          <p className="max-w-md text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            Interactive educational websites crafted with attention to structure, clarity, and
            purposeful presentation.
          </p>
        </div>

        {loading ? (
          <div className="space-y-20">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl glass-chrome border border-slate-800/80 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-24 lg:space-y-32">
            {projects.map((project, idx) => (
              <ProjectStage
                key={project.id}
                project={project}
                index={idx}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
