"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Terminal, Zap } from "lucide-react";
import { CodeEditorPanel } from "@/components/code-editor-panel";
import { ResultsPanel, type AnalysisResult } from "@/components/results-panel";

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDetail, setShowErrorDetail] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setShowErrorDetail(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Terminal className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            BugLens
          </span>
          <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            v1.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">
            AI Analysis
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left panel: Code Editor */}
        <div className="flex h-1/2 w-full flex-col border-b border-border lg:h-full lg:w-1/2 lg:border-b-0 lg:border-r">
          <CodeEditorPanel
            code={code}
            language={language}
            isAnalyzing={isAnalyzing}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onAnalyze={handleAnalyze}
          />
        </div>

        {/* Right panel: Results */}
        <div className="flex h-1/2 w-full flex-col lg:h-full lg:w-1/2">
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex shrink-0 items-center border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium text-foreground">
                Analysis Results
              </h2>
            </div>
            <div className="flex-1 overflow-hidden">
              {error ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Something went wrong, try again
                  </p>
                  <button
                    onClick={() => setShowErrorDetail((prev) => !prev)}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showErrorDetail ? (
                      <>
                        Hide Error <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        View Error <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                  {showErrorDetail && (
                    <div className="max-w-sm rounded-lg border border-border bg-secondary/50 px-4 py-3">
                      <p className="text-xs text-destructive leading-relaxed font-mono">
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <ResultsPanel result={result} isAnalyzing={isAnalyzing} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
