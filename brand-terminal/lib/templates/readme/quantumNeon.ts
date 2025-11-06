import {
  GithubProfile,
  GithubRepo,
  ProfileThemeConfig,
} from "@/lib/templates/readme/quantumTerminal";

const neonStack = ["Next.js", "TypeScript", "Neon UI", "Prisma", "PlanetScale"];

const escapeMarkdown = (value: string) =>
  value.replace(/([_*`])/g, (match) => `\\${match}`).replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const renderReadmeQuantumNeon = ({
  profile,
  repos,
  config,
}: {
  profile: GithubProfile;
  repos: GithubRepo[];
  config: ProfileThemeConfig;
}) => {
  const tagline =
    config.tagline ?? profile.tagline ?? profile.bio ?? "Booting up neon grids and midnight ideas.";
  const stackList = (config.stack?.length ? config.stack : neonStack).map(escapeMarkdown);

  const featuredRepos = [...repos]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5)
    .map(
      (repo) =>
        `- \`${repo.stars.toString().padStart(3, " ")}★\` [${escapeMarkdown(repo.name)}](${repo.url}) — ${
          repo.description ? escapeMarkdown(repo.description) : "Laser focus, no description"
        }`,
    )
    .join("\n");

  const footerBranding =
    config.footerBranding === false
      ? ""
      : `
---
Powered by [Brand Terminal](https://brandterminal.app) — Pro tier unlocks the neon grid.`;

  return `<p align="center">
  <img src="./assets/brand-terminal-header-neon.svg" alt="Brand Terminal Neon header" width="100%" />
</p>

\`\`\`ansi
$ whoami --neon
  name: ${escapeMarkdown(profile.displayName ?? profile.username)}
  alias: @${escapeMarkdown(profile.username)}
  tagline: ${escapeMarkdown(tagline)}
  grid: ${escapeMarkdown(profile.location ?? "SYNTH-SPACE-01")}
\`\`\`

\`\`\`ansi
$ status --mode neon
  stack:
    ${stackList.join("\n    ")}
  uptime: continuous
\`\`\`

### Featured Repositories

${featuredRepos || "_Awaiting first transmission_"}

### Neon Shortcuts

- \`⌘⌥P\` enter hyperdrive palette
- \`⌘E\` reroute energy to experiments
- \`shift+.\` cycle neon overlays
- \`logout --force\` when the night is done
${footerBranding}
`;
};
