import React from 'react';

export const NeonLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0" stopColor="#00D1FF" stopOpacity="1" />
        <stop offset="1" stopColor="#8A2BE2" stopOpacity="1" />
      </linearGradient>
      <filter id="f" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#f)">
      <circle cx="50" cy="50" r="22" stroke="url(#g)" strokeWidth="6" fill="#020204" />
      <path d="M62 35l-9 30L35 40l9-6 6 8 12-7z" fill="url(#g)" opacity="0.98" />
    </g>
  </svg>
);

export default NeonLogo;
