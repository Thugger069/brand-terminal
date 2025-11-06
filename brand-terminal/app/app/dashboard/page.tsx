'use client';

import { useState, useTransition } from "react";

type GenerateResponse = {
  readmeMarkdown: string;
  svgHeader: string;
  githubActionYaml: string;
};

const CodePreview = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/70 p-5">
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{label}</span>
      <CopyButton value={value} />
    </div>
    <pre className="max-h-72 overflow-auto rounded-lg bg-black/60 p-4 text-xs leading-relaxed text-foreground">
      <code>{value || "// Generate to preview output"}</code>
    </pre>
  </div>
);

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-md border border-border px-3 py-1 text-xs uppercase tracking-[0.25em] text-foreground transition hover:border-foreground"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export default function DashboardPage() {
  const [tagline, setTagline] = useState("");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileSlug: "default",
            tagline: tagline.trim() || undefined,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to generate preview.");
        }

        const data = (await response.json()) as GenerateResponse;
        setResult(data);
      } catch (err) {
        setResult(null);
        setError(err instanceof Error ? err.message : "Unexpected error.");
      }
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,360px)_1fr]">
      <aside className="flex flex-col gap-6 rounded-2xl border border-border bg-card/80 p-6">
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Profile Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Tweak your default profile tagline, then generate a live preview of your README,
            SVG header, and GitHub Action.
          </p>
        </section>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.3em] text-muted-foreground">Tagline</span>
          <input
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            placeholder="Synthesizing terminal-grade experiences."
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isPending}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Generating…" : "Generate Preview"}
        </button>
        {error ? (
          <p className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Changes save automatically when you sync via the API or GitHub Action.
          </p>
        )}
      </aside>
      <section className="flex flex-col gap-6">
        <CodePreview label="README.md" value={result?.readmeMarkdown ?? ""} />
        <CodePreview label="assets/brand-terminal-header.svg" value={result?.svgHeader ?? ""} />
        <CodePreview
          label=".github/workflows/brand-terminal.yml"
          value={result?.githubActionYaml ?? ""}
        />
      </section>
    </div>
  );
}
