import {
  GithubProfile,
  GithubRepo,
  ProfileThemeConfig,
  renderReadmeQuantumTerminal,
} from "@/lib/templates/readme/quantumTerminal";
import { renderReadmeQuantumNeon } from "@/lib/templates/readme/quantumNeon";
import { renderSvgHeaderQuantumTerminal } from "@/lib/templates/svg/quantumTerminal";
import { renderSvgHeaderQuantumNeon } from "@/lib/templates/svg/quantumNeon";
import { renderGithubActionDefault } from "@/lib/templates/actions/default";

export type ProfileTheme = "quantum-terminal" | "quantum-neon";

type BuildAssetsArgs = {
  theme: ProfileTheme;
  profile: GithubProfile;
  repos: GithubRepo[];
  tagline?: string | null;
  plan: "Free" | "Pro";
  apiBaseUrl: string;
  profileSlug?: string;
  repoName?: string;
  cron?: string;
};

const baseConfig = (tagline: string | null | undefined, plan: "Free" | "Pro"): ProfileThemeConfig => ({
  tagline: tagline ?? undefined,
  footerBranding: plan !== "Pro",
});

export const buildProfileAssets = ({
  theme,
  profile,
  repos,
  tagline,
  plan,
  apiBaseUrl,
  profileSlug,
  repoName,
  cron,
}: BuildAssetsArgs) => {
  const safeTagline = tagline ?? profile.tagline ?? null;
  const profileWithTagline: GithubProfile = {
    ...profile,
    tagline: safeTagline ?? undefined,
  };

  const config = baseConfig(safeTagline, plan);

  const readmeMarkdown =
    theme === "quantum-neon"
      ? renderReadmeQuantumNeon({ profile: profileWithTagline, repos, config })
      : renderReadmeQuantumTerminal({ profile: profileWithTagline, repos, config });

  const svgHeader =
    theme === "quantum-neon"
      ? renderSvgHeaderQuantumNeon({
          profile: {
            username: profile.username,
            displayName: profile.displayName,
            tagline: safeTagline ?? undefined,
          },
        })
      : renderSvgHeaderQuantumTerminal({
          profile: {
            username: profile.username,
            displayName: profile.displayName,
            tagline: safeTagline ?? undefined,
          },
        });

  const githubActionYaml = renderGithubActionDefault({
    profile: { username: profile.username },
    apiBaseUrl,
    profileSlug,
    repo: repoName,
    cron,
  });

  return {
    readmeMarkdown,
    svgHeader,
    githubActionYaml,
  };
};
