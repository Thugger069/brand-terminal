type ActionProfile = {
  username: string;
};

export const renderGithubActionDefault = ({
  profile,
  apiBaseUrl,
  profileSlug,
  repo,
  cron,
}: {
  profile: ActionProfile;
  apiBaseUrl: string;
  profileSlug?: string;
  repo?: string;
  cron?: string;
}) => {
  const schedule = cron ?? "0 12 * * *";
  const payload = JSON.stringify(
    {
      githubUsername: profile.username,
      repo: repo ?? profile.username,
      profileSlug: profileSlug ?? "default",
    },
    null,
    2,
  );

  return `name: Brand Terminal Sync

on:
  schedule:
    - cron: '${schedule}'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Brand Terminal Sync
        run: |
          curl -sS -X POST \\
            -H "Content-Type: application/json" \\
            -H "Authorization: Bearer \${{ secrets.BRAND_TERMINAL_API_KEY }}" \\
            -d '${payload.replace(/\n/g, "\\n").replace(/'/g, "''")}' \\
            ${apiBaseUrl}/api/sync
`;
};
