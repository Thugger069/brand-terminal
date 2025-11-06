import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";

const githubScope = "read:user repo";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: githubScope,
        },
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        const subscription = await db.subscription.findUnique({
          where: { userId: user.id },
        });
        session.user.plan = subscription?.status === "active" ? "Pro" : "Free";
      }

      return session;
    },
  },
  events: {
    signIn: async ({ user, account, profile }) => {
      if (account?.provider !== "github") {
        return;
      }

      const githubProfile = profile as Record<string, unknown> | null;

      try {
        await db.user.update({
          where: { id: user.id },
          data: {
            githubId: account.providerAccountId,
            githubUsername:
              (githubProfile?.login as string | undefined) ??
              user.email?.split("@")[0] ??
              account.providerAccountId,
            githubAvatarUrl:
              (githubProfile?.avatar_url as string | undefined) ?? user.image ?? null,
            githubAccessToken: account.access_token,
          },
        });
      } catch (error) {
        console.error("auth_signin_update_failed", error);
        throw error;
      }
    },
  },
});
