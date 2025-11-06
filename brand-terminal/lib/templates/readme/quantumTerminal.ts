export type GithubProfile = {
  username: string;
  displayName?: string | null;
  bio?: string | null;
  location?: string | null;
  tagline?: string | null;
};

export type GithubRepo = {
  name: string;
  description: string | null;
  stars: number;
  url: string;
};

export type ProfileThemeConfig = {
  tagline?: string | null;
  stack?: string[];
  footerBranding?: boolean;
};

const defaultStack = ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"];

const escapeMarkdown = (value: string) =>
  value.replace(/([_*`])/g, (match) => `\\${match}`).replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const renderReadmeQuantumTerminal = ({
  profile,
  repos,
  config,
}: {
  profile: GithubProfile;
  repos: GithubRepo[];
  config: ProfileThemeConfig;
}) => {
  const tagline = config.tagline ?? profile.tagline ?? profile.bio ?? "Building the future in terminal green.";
  const stackList = (config.stack?.length ? config.stack : defaultStack).map(escapeMarkdown);

  const featuredRepos = [...repos]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5)
    .map(
      (repo) =>
        `- \`${repo.stars.toString().padStart(3, " ")}★\` [${escapeMarkdown(repo.name)}](${repo.url}) — ${
          repo.description ? escapeMarkdown(repo.description) : "No description"
        }`,
    )
    .join("\n");

  const locationLine = profile.location
    ? `  location: ${escapeMarkdown(profile.location)}`
    : "  location: /dev/null";

  const footerBranding =
    config.footerBranding === false
      ? ""
      : `
---
Powered by [Brand Terminal](https://brandterminal.app) — turn your GitHub into a quantum console.`;

  return `<p align="center">
  <img src="./assets/brand-terminal-header.svg" alt="Brand Terminal header" width="100%" />
</p>

\`\`\`terminal
$ whoami
  name: ${escapeMarkdown(profile.displayName ?? profile.username)}
  alias: @${escapeMarkdown(profile.username)}
  tagline: ${escapeMarkdown(tagline)}
${locationLine}
\`\`\`

\`\`\`terminal
$ current_stack --pretty
  ${stackList.join("\n  ")}
\`\`\`

### Featured Repositories

${featuredRepos || "_No repositories found_"}

### Terminal Shortcuts

- \`⌘K\` summon command palette
- \`⌘T\` open new session
- \`⌘B\` toggle synthwave buffer
- \`exit\` to log out when mission is complete
${footerBranding}
`;
};
