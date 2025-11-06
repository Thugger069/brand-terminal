import { db } from "@/lib/db";

type GithubRepoResponse = {
  name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
};

type GithubUserResponse = {
  login: string;
  name?: string | null;
  bio?: string | null;
  location?: string | null;
};

const githubApiBase = "https://api.github.com";

const githubHeaders = (token: string) => ({
  Authorization: `token ${token}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "brand-terminal",
});

const ensureAccessToken = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user?.githubAccessToken) {
    throw new Error("GitHub access token is missing for this user.");
  }

  return user.githubAccessToken;
};

export const getGithubProfileAndRepos = async ({
  githubUsername,
  userId,
}: {
  githubUsername: string;
  userId: string;
}) => {
  const token = await ensureAccessToken(userId);
  const headers = githubHeaders(token);

  const [profileResponse, repoResponse] = await Promise.all([
    fetch(`${githubApiBase}/user`, { headers }),
    fetch(`${githubApiBase}/user/repos?per_page=100&sort=updated`, { headers }),
  ]);

  if (!profileResponse.ok) {
    throw new Error(`Failed to fetch GitHub profile (${profileResponse.status}).`);
  }

  if (!repoResponse.ok) {
    throw new Error(`Failed to fetch GitHub repositories (${repoResponse.status}).`);
  }

  const profileJson = (await profileResponse.json()) as GithubUserResponse;
  const reposJson = (await repoResponse.json()) as GithubRepoResponse[];

  return {
    username: githubUsername,
    displayName: profileJson.name,
    bio: profileJson.bio,
    location: profileJson.location,
    repos: reposJson.map((repo) => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      url: repo.html_url,
    })),
  };
};

export const updateGithubReadme = async ({
  userId,
  githubUsername,
  repo,
  content,
  branch,
}: {
  userId: string;
  githubUsername: string;
  repo: string;
  content: string;
  branch?: string;
}) => {
  const token = await ensureAccessToken(userId);
  const headers = githubHeaders(token);
  const targetBranchQuery = branch ? `?ref=${encodeURIComponent(branch)}` : "";
  const readmeUrl = `${githubApiBase}/repos/${githubUsername}/${repo}/contents/README.md${targetBranchQuery}`;

  let sha: string | undefined;

  const currentResponse = await fetch(readmeUrl, { headers });

  if (currentResponse.status === 200) {
    const currentJson = await currentResponse.json();
    sha = currentJson.sha;
  } else if (currentResponse.status !== 404) {
    throw new Error(`Failed to read existing README (${currentResponse.status}).`);
  }

  const putBody = {
    message: "chore: update README via Brand Terminal",
    content: Buffer.from(content, "utf-8").toString("base64"),
    sha,
    branch,
  };

  const updateResponse = await fetch(
    `${githubApiBase}/repos/${githubUsername}/${repo}/contents/README.md`,
    {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putBody),
    },
  );

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    throw new Error(
      `Failed to update README (${updateResponse.status}): ${errorText || "Unknown error"}`,
    );
  }

  return updateResponse.json();
};
