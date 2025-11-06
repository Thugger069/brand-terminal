import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getGithubProfileAndRepos, updateGithubReadme } from "@/lib/github-sync";
import { logError, logInfo } from "@/lib/log";
import { buildProfileAssets, ProfileTheme } from "@/lib/profile-assets";

const fallbackApiBase = "http://localhost:3000";

const parseBearerToken = (header: string | null) => {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token.trim();
};

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = parseBearerToken(authHeader);

  if (!token) {
    return NextResponse.json({ error: "Missing or invalid authorization header." }, { status: 401 });
  }

  let profileSlug = "default";
  let repoName: string | undefined;

  try {
    const apiKeyRecord = await db.apiKey.findUnique({
      where: { key: token },
      include: {
        user: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!apiKeyRecord) {
      return NextResponse.json({ error: "Invalid API key." }, { status: 401 });
    }

    if (!apiKeyRecord.user.githubUsername) {
      return NextResponse.json(
        { error: "GitHub account not linked for this user." },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));

    const githubUsername =
      typeof body.githubUsername === "string" && body.githubUsername.trim().length > 0
        ? body.githubUsername.trim()
        : apiKeyRecord.user.githubUsername;

    if (githubUsername !== apiKeyRecord.user.githubUsername) {
      return NextResponse.json(
        { error: "GitHub username mismatch for this API key." },
        { status: 403 },
      );
    }

    profileSlug =
      typeof body.profileSlug === "string" && body.profileSlug.trim() !== ""
        ? body.profileSlug
        : "default";

    repoName =
      typeof body.repo === "string" && body.repo.trim() !== ""
        ? body.repo.trim()
        : githubUsername;

    const profileRecord = await db.profile.findUnique({
      where: {
        userId_slug: {
          userId: apiKeyRecord.userId,
          slug: profileSlug,
        },
      },
    });

    if (!profileRecord) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const githubData = await getGithubProfileAndRepos({
      githubUsername,
      userId: apiKeyRecord.userId,
    });

    const plan =
      apiKeyRecord.user.subscription?.status === "active" ? "Pro" : ("Free" as const);
    const theme: ProfileTheme =
      profileRecord.theme === "quantum-neon" && plan === "Pro"
        ? "quantum-neon"
        : "quantum-terminal";

    const apiBaseUrl = process.env.NEXTAUTH_URL ?? fallbackApiBase;

    const assets = buildProfileAssets({
      theme,
      profile: {
        ...githubData,
        tagline: profileRecord.tagline ?? undefined,
      },
      repos: githubData.repos,
      tagline: profileRecord.tagline ?? undefined,
      plan,
      apiBaseUrl,
      profileSlug,
      repoName,
    });

    await updateGithubReadme({
      userId: apiKeyRecord.userId,
      githubUsername,
      repo: repoName,
      content: assets.readmeMarkdown,
    });

    await db.profile.update({
      where: { id: profileRecord.id },
      data: { lastPreviewAt: new Date() },
    });

    logInfo("sync_success", {
      userId: apiKeyRecord.userId,
      repo: repoName,
      profileSlug,
    });

    return NextResponse.json({
      ok: true,
      updated: true,
      repo: repoName,
      profileSlug,
    });
  } catch (error) {
    logError("sync_failed", error, { profileSlug, repo: repoName });
    return NextResponse.json({ error: "Failed to sync README." }, { status: 500 });
  }
}
