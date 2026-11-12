import React from 'react';

interface ADMonogramProps {
  size?: number;
  className?: string;
  animated?: boolean;
  showFrame?: boolean;
  glow?: boolean;
}

/**
 * Architectural AD Monogram — Bespoke geometric identity mark for ABDULLOH.
 * Shares exact proportional DNA with the extruded 3D WebGL chrome sculpture.
 */
export const ADMonogram: React.FC<ADMonogramProps> = ({
  size = 44,
  className = '',
  animated = false,
  showFrame = true,
  glow = false,
}) => {
  const uid = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="AD Monogram — Abdulloh Dovlatboev"
    >
      <defs>
        <linearGradient id={`chromeA_${uid}`} x1="14" y1="18" x2="64" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="38%" stopColor="#C8D4E6" />
          <stop offset="68%" stopColor="#6E7F99" />
          <stop offset="100%" stopColor="#DCE6F5" />
        </linearGradient>
        <linearGradient id={`chromeD_${uid}`} x1="58" y1="16" x2="106" y2="104" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#AFC0D8" />
          <stop offset="78%" stopColor="#52627A" />
          <stop offset="100%" stopColor="#D6E2F2" />
        </linearGradient>
        <linearGradient id={`electricCore_${uid}`} x1="60" y1="18" x2="60" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00B4FF" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#2997FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#00B4FF" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={`frameBorder_${uid}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DCE6F5" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#2997FF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.2" />
        </linearGradient>
        {glow && (
          <filter id={`glow_${uid}`} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {showFrame && (
        <>
          <polygon
            points="22,6 98,6 114,22 114,98 98,114 22,114 6,98 6,22"
            stroke={`url(#frameBorder_${uid})`}
            strokeWidth="1.2"
            fill="rgba(5, 10, 22, 0.55)"
            className={animated ? 'ad-frame-draw' : ''}
          />
          <line x1="22" y1="6" x2="32" y2="6" stroke="#2997FF" strokeWidth="1.6" />
          <line x1="88" y1="114" x2="98" y2="114" stroke="#2997FF" strokeWidth="1.6" />
        </>
      )}

      <g filter={glow ? `url(#glow_${uid})` : undefined}>
        {/* Architectural 'A' — Diagonal monolith + shared vertical precision pillar */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 94 L27.5 94 L33.8 73.5 L47.5 73.5 L47.5 94 L57 94 L57 26 L44.5 26 L16 94 Z M47.5 64 L36.8 64 L47.5 39.2 L47.5 64 Z"
          fill={`url(#chromeA_${uid})`}
          className={animated ? 'ad-glyph-pulse' : ''}
        />

        {/* Central Electric-Blue Precision Axis Blade */}
        <rect
          x="59.1"
          y="24"
          width="1.8"
          height="72"
          rx="0.9"
          fill={`url(#electricCore_${uid})`}
        />

        {/* Architectural 'D' — Chamfered luxury geometric bow */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M63 26 L86 26 L103 43 L103 77 L86 94 L63 94 L63 26 Z M72.5 35.5 L72.5 84.5 L82 84.5 L93.5 73 L93.5 47 L82 35.5 L72.5 35.5 Z"
          fill={`url(#chromeD_${uid})`}
          className={animated ? 'ad-glyph-pulse' : ''}
        />
      </g>
    </svg>
  );
};

export default ADMonogram;
