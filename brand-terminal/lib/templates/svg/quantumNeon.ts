type SvgProfile = {
  username: string;
  displayName?: string | null;
  tagline?: string | null;
};

type SvgConfig = {
  accentPrimary?: string;
  accentSecondary?: string;
};

export const renderSvgHeaderQuantumNeon = ({
  profile,
  config,
}: {
  profile: SvgProfile;
  config?: SvgConfig;
}) => {
  const accentPrimary = config?.accentPrimary ?? "#f472b6";
  const accentSecondary = config?.accentSecondary ?? "#38bdf8";

  return `<svg width="1200" height="400" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="neon-bg" x1="0" y1="0" x2="1200" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0b1026"/>
      <stop offset="100%" stop-color="#1f2937"/>
    </linearGradient>
    <radialGradient id="neon-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(900 180) scale(500 320)">
      <stop stop-color="${accentSecondary}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${accentSecondary}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="neon-grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(56, 189, 248, 0.25)" stroke-width="0.75"/>
    </pattern>
    <filter id="neon-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="rgba(248, 113, 113, 0.35)"/>
    </filter>
  </defs>

  <rect width="1200" height="400" fill="url(#neon-bg)"/>
  <rect width="1200" height="400" fill="url(#neon-grid)" opacity="0.35"/>
  <rect width="1200" height="400" fill="url(#neon-glow)"/>

  <g transform="translate(72, 84)" filter="url(#neon-shadow)">
    <rect width="1056" height="300" rx="20" fill="rgba(15, 23, 42, 0.7)" stroke="rgba(148, 163, 184, 0.35)" stroke-width="1.5"/>
  </g>

  <g transform="translate(96, 112)">
    <rect width="1008" height="42" rx="12" fill="rgba(17, 24, 39, 0.9)" stroke="${accentPrimary}" stroke-opacity="0.5" stroke-width="1"/>
    <circle cx="28" cy="21" r="6" fill="${accentPrimary}"/>
    <circle cx="48" cy="21" r="6" fill="${accentSecondary}"/>
    <circle cx="68" cy="21" r="6" fill="#22d3ee"/>
    <text x="96" y="26" fill="rgba(244, 244, 245, 0.9)" font-family="'Space Mono', monospace" font-size="18">
      brand-terminal — ${profile.username}@neon-grid
    </text>
  </g>

  <g transform="translate(116, 180)" font-family="'Space Mono', monospace" fill="#f8fafc">
    <text font-size="24" fill="${accentPrimary}">$ whoami --neon</text>
    <text y="38" font-size="20">name: ${profile.displayName ?? profile.username}</text>
    <text y="68" font-size="20">alias: @${profile.username}</text>
    <text y="98" font-size="20">tagline: ${profile.tagline ?? "dreaming in synthwave gradients"}</text>

    <text y="148" font-size="24" fill="${accentSecondary}">$ status --mode neon</text>
    <text y="178" font-size="20">grid: SYNTH-OPS</text>
    <text y="208" font-size="20">uptime: 25h loop</text>
    <text y="238" font-size="20">pulse: ${accentPrimary} ➜ ${accentSecondary}</text>
  </g>

  <g transform="translate(780, 160)" stroke-width="1.5">
    <path d="M40 0 C 120 20, 160 40, 200 120" stroke="${accentSecondary}" fill="none" opacity="0.8"/>
    <path d="M0 100 C 60 20, 140 20, 220 110" stroke="${accentPrimary}" fill="none" opacity="0.6"/>
    <circle cx="128" cy="92" r="10" fill="${accentPrimary}" opacity="0.85"/>
    <circle cx="188" cy="132" r="6" fill="${accentSecondary}" opacity="0.8"/>
    <path d="M70 28 L150 64 L110 144 L30 108 Z" fill="rgba(244, 114, 182, 0.18)" stroke="${accentPrimary}" stroke-opacity="0.8"/>
  </g>
</svg>`;
};
