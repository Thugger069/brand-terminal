import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/app");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-wide">
              Brand Terminal
            </Link>
            <span className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
              Dashboard • {session.user.plan}
            </span>
          </div>
          <nav className="mt-4 flex gap-5 text-sm text-muted-foreground">
            <Link
              href="/app/dashboard"
              className="transition hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/app/account"
              className="transition hover:text-foreground"
            >
              Account
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 md:px-10">
        {children}
      </main>
    </div>
  );
}
