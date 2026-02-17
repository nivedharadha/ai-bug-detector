"use client";

import {
  Bug,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export interface BugItem {
  line: number;
  severity: "error" | "warning";
  message: string;
}

export interface AnalysisResult {
  bugs: BugItem[];
  explanation: string;
  optimizedCode: string;
}

interface ResultsPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

function SeverityBadge({ severity }: { severity: "error" | "warning" }) {
  if (severity === "error") {
    return (
      <Badge className="border-transparent bg-destructive/15 text-destructive hover:bg-destructive/20 text-[10px] uppercase tracking-wider">
        Error
      </Badge>
    );
  }
  return (
    <Badge className="border-transparent bg-warning/15 text-warning hover:bg-warning/20 text-[10px] uppercase tracking-wider">
      Warning
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary">
        <Bug className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          No analysis yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Paste your code in the editor and click{" "}
          <span className="font-medium text-primary">Fix Bugs</span> to
          get started.
        </p>
      </div>
    </div>
  );
}

function AnalyzingState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary">
        <Sparkles className="h-7 w-7 animate-pulse text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          Analyzing your code...
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Scanning for bugs, building explanations, and optimizing.
        </p>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </Button>
  );
}

export function ResultsPanel({ result, isAnalyzing }: ResultsPanelProps) {
  if (isAnalyzing) return <AnalyzingState />;
  if (!result) return <EmptyState />;

  const optimizedLines = result.optimizedCode.split("\n");

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-0">
        {/* Section 1: Detected Bugs */}
        <section className="border-b border-border px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h2 className="text-sm font-semibold text-foreground">
              Detected Bugs
            </h2>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] text-muted-foreground"
            >
              {result.bugs.length} found
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            {result.bugs.map((bug, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 px-3 py-2.5"
              >
                <span className="mt-0.5 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  L{bug.line}
                </span>
                <p className="flex-1 text-xs text-foreground/80 leading-relaxed">
                  {bug.message}
                </p>
                <SeverityBadge severity={bug.severity} />
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Explanation */}
        <section className="border-b border-border px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold text-foreground">
              Simple Explanation
            </h2>
          </div>
          <div className="rounded-lg border border-border bg-secondary/50 px-4 py-3">
            <p className="text-xs text-foreground/80 leading-relaxed">
              {result.explanation}
            </p>
          </div>
        </section>

        {/* Section 3: Optimized Code */}
        <section className="px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Optimized Code
              </h2>
            </div>
            <CopyButton text={result.optimizedCode} />
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-muted/50">
            <div className="flex">
              {/* Line numbers */}
              <div className="flex shrink-0 flex-col border-r border-border bg-muted/80 py-3 text-right">
                {optimizedLines.map((_, i) => (
                  <span
                    key={i}
                    className="block px-3 font-mono text-[10px] leading-5 text-muted-foreground"
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
              {/* Code */}
              <pre className="flex-1 overflow-x-auto py-3 pl-4 pr-4">
                <code className="font-mono text-xs leading-5 text-foreground/90">
                  {result.optimizedCode}
                </code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
