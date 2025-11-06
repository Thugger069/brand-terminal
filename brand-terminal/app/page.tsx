import Link from "next/link";

const features = [
  {
    title: "Terminal README",
    description: "Generate a living README that looks and feels like a quantum console.",
  },
  {
    title: "SVG Header",
    description: "Render animated-inspired headers to drop into your GitHub profile instantly.",
  },
  {
    title: "Auto Sync",
    description: "Keep your profile current with GitHub Actions or the Brand Terminal API.",
  },
];

const pricing = [
  {
    tier: "Free",
    price: "$0",
    cadence: "forever",
    highlights: [
      "1 profile",
      "Quantum Terminal theme",
      "README + SVG + Action generator",
      "Brand Terminal footer",
    ],
    cta: "Start for free",
  },
  {
    tier: "Pro",
    price: "$12",
    cadence: "per month",
    highlights: [
      "Up to 5 profiles",
      "Quantum presets + Neon theme",
      "Remove branding",
      "Early access drops",
    ],
    cta: "Join the waitlist",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-24 px-6 py-24 md:px-10">
        <section className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
          <span className="rounded-full border border-border px-4 py-1 text-sm text-muted-foreground">
            Introducing Brand Terminal
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Your GitHub profile, upgraded to a quantum terminal.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Brand Terminal transforms your profile into a living console. Generate futuristic
            READMEs, neon SVG headers, and automations that keep everything synced with a single tap.
          </p>
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            <Link
              href="/app"
              className="rounded-lg bg-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-background transition hover:opacity-90"
            >
              Launch App
            </Link>
            <Link
              href="#pricing"
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition hover:bg-foreground/10"
            >
              View Pricing
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm transition hover:border-foreground/50"
            >
              <h3 className="text-lg font-medium">{feature.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </section>

        <section id="pricing" className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold">Pricing</h2>
            <p className="text-muted-foreground">
              Start free, then unlock neon presets and automated workflows with Pro.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {pricing.map((plan) => (
              <div
                key={plan.tier}
                className="flex flex-col gap-6 rounded-2xl border border-border bg-card/80 p-8 backdrop-blur-sm"
              >
                <div className="space-y-3">
                  <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                    {plan.tier}
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-semibold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2">
                      <span className="text-foreground">▹</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/app"
                  className="mt-auto inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:border-foreground hover:text-foreground"
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
