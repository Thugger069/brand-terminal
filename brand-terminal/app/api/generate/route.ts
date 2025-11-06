import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getGithubProfileAndRepos } from "@/lib/github-sync";
import { logError } from "@/lib/log";
import { buildProfileAssets, ProfileTheme } from "@/lib/profile-assets";

const fallbackApiBase = "http://localhost:3000";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const plan = session.user.plan ?? "Free";

  let profileSlug = "default";
  let tagline: string | null | undefined;

  try {
    const body = await request.json().catch(() => ({}));
    profileSlug = typeof body.profileSlug === "string" && body.profileSlug.trim() !== "" ? body.profileSlug : "default";
    tagline = typeof body.tagline === "string" ? body.tagline : undefined;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user?.githubUsername) {
      return NextResponse.json(
        { error: "GitHub account is not linked to this user." },
        { status: 400 },
      );
    }

    const profileRecord = await db.profile.upsert({
      where: {
        userId_slug: {
          userId,
          slug: profileSlug,
        },
      },
      create: {
        userId,
        slug: profileSlug,
        theme: "quantum-terminal",
        tagline,
      },
      update: tagline !== undefined ? { tagline } : {},
    });

    const githubData = await getGithubProfileAndRepos({
      githubUsername: user.githubUsername,
      userId,
    });

    const apiBaseUrl = process.env.NEXTAUTH_URL ?? fallbackApiBase;
    const theme: ProfileTheme =
      profileRecord.theme === "quantum-neon" && plan === "Pro"
        ? "quantum-neon"
        : "quantum-terminal";

    const assets = buildProfileAssets({
      theme,
      profile: {
        ...githubData,
        tagline: tagline ?? profileRecord.tagline ?? undefined,
      },
      repos: githubData.repos,
      tagline: tagline ?? profileRecord.tagline ?? undefined,
      plan,
      apiBaseUrl,
      profileSlug,
      repoName: githubData.username,
    });

    await db.profile.update({
      where: { id: profileRecord.id },
      data: { lastPreviewAt: new Date() },
    });

    return NextResponse.json(assets);
  } catch (error) {
    logError("generate_failed", error, { userId, profileSlug });
    return NextResponse.json({ error: "Failed to generate profile assets." }, { status: 500 });
  }
}
