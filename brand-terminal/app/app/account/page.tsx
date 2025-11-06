import Link from "next/link";

import { auth } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth();

  return (
    <div className="grid gap-8 rounded-2xl border border-border bg-card/80 p-8">
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Account</h2>
        <p className="text-sm text-muted-foreground">
          You&apos;re currently on the <span className="text-foreground">{session?.user.plan}</span>{" "}
          plan. Upgrade to unlock additional profile slots and the Quantum Neon preset.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium">API Access</h3>
        <p className="text-sm text-muted-foreground">
          Generate a Brand Terminal API key to trigger README syncs from GitHub Actions or your own
          scheduler. Keys are shown once—store them securely.
        </p>
        <div className="rounded-lg border border-dashed border-border px-4 py-4 text-sm text-muted-foreground">
          POST <code className="text-foreground">/api/api-keys</code> while signed in to mint your first key.
        </div>
        <Link
          href="https://brandterminal.app/docs"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition hover:border-foreground"
        >
          View API docs
        </Link>
      </section>
    </div>
  );
}
