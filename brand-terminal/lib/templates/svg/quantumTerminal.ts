type SvgProfile = {
  username: string;
  displayName?: string | null;
  tagline?: string | null;
};

type SvgConfig = {
  accent?: string;
  background?: string;
};

export const renderSvgHeaderQuantumTerminal = ({
  profile,
  config,
}: {
  profile: SvgProfile;
  config?: SvgConfig;
}) => {
  const accent = config?.accent ?? "#4ade80";
  const background = config?.background ?? "#030712";

  return `<svg width="1200" height="400" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="quantum-bg" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${background}"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <radialGradient id="quantum-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 120) scale(480 260)">
      <stop stop-color="${accent}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.12)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="400" fill="url(#quantum-bg)"/>
  <rect width="1200" height="400" fill="url(#grid)" opacity="0.35"/>
  <rect width="1200" height="400" fill="url(#quantum-glow)"/>

  <g filter="url(#shadow)">
    <rect x="60" y="60" width="1080" height="280" rx="18" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(74, 222, 128, 0.25)" stroke-width="1.5"/>
  </g>

  <g transform="translate(80, 96)">
    <rect width="1040" height="36" rx="10" fill="rgba(17, 24, 39, 0.85)" stroke="rgba(74, 222, 128, 0.4)" stroke-width="1"/>
    <circle cx="24" cy="18" r="6" fill="#f87171"/>
    <circle cx="44" cy="18" r="6" fill="#fbbf24"/>
    <circle cx="64" cy="18" r="6" fill="#34d399"/>
    <text x="90" y="23" fill="rgba(203, 213, 225, 0.85)" font-family="'Fira Code', monospace" font-size="16">
      brand-terminal — ${profile.username}@github
    </text>
  </g>

  <g transform="translate(100, 160)" font-family="'Fira Code', monospace" fill="#e2e8f0">
    <text font-size="22" fill="${accent}">$ whoami</text>
    <text y="36" font-size="18">name: ${profile.displayName ?? profile.username}</text>
    <text y="64" font-size="18">alias: @${profile.username}</text>
    <text y="92" font-size="18">tagline: ${(profile.tagline && profile.tagline) || "crafting build logs in terminal green"}</text>

    <text y="140" font-size="22" fill="${accent}">$ status</text>
    <text y="168" font-size="18">mode: quantum-terminal</text>
    <text y="196" font-size="18">uptime: ∞ cycles</text>
    <text y="224" font-size="18">focus: building next-gen interfaces</text>
  </g>

  <g transform="translate(780, 160)" stroke="${accent}" stroke-width="1">
    <path d="M0 0 L120 40 L80 120 L0 80 Z" fill="rgba(74, 222, 128, 0.08)"/>
    <path d="M40 20 L140 60 L100 140 L20 100 Z" fill="none" opacity="0.65"/>
    <circle cx="52" cy="60" r="6" fill="${accent}"/>
    <circle cx="104" cy="92" r="4" fill="rgba(74, 222, 128, 0.6)"/>
    <path d="M84 28 L168 64" stroke-dasharray="4 6" opacity="0.4"/>
  </g>

  <defs>
    <filter id="shadow" x="0" y="0" width="1200" height="400" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="12" stdDeviation="24" flood-color="rgba(74, 222, 128, 0.35)"/>
    </filter>
  </defs>
</svg>`;
};
