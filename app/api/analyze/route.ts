import { NextResponse } from "next/server";
import { OPENROUTER_API_KEY } from "@/lib/constants";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callModel(model: string, prompt: string) {
  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();

  if (data?.choices?.length > 0) {
    return data.choices[0].message.content;
  }

  throw new Error("No response from model");
}

interface BugItem {
  line: number;
  severity: "error" | "warning";
  message: string;
}

function parseBugs(text: string): BugItem[] {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  return lines.map((line, i) => ({
    line: i + 1,
    severity: line.toLowerCase().includes("error") ? "error" as const : "warning" as const,
    message: line.replace(/^[\d\-.*]+\s*/, "").trim(),
  }));
}

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const langLabel = language || "unknown";

    // Step 1: Detect bugs
    const bugText = await callModel(
      "google/gemma-3-12b-it:free",
      `You are a code reviewer. Analyze the following ${langLabel} code and list all bugs, one per line. For each bug, mention the line number and whether it's an error or a warning. Be concise.\n\nCode:\n${code}`
    );

    // Step 2: Explain the bugs simply
    const explanation = await callModel(
      "google/gemma-3-4b-it:free",
      `You are a coding mentor. Given the following bug report, explain the issues in simple, beginner-friendly language. Be concise and helpful, no markdown formatting.\n\nBug report:\n${bugText}`
    );

    // Step 3: Generate optimized code
    const optimizedCode = await callModel(
      "google/gemma-3-12b-it:free",
      `You are an expert ${langLabel} developer. Rewrite the following code with all bugs fixed and optimized. Return ONLY the code, no explanations, no markdown fences.\n\nOriginal code:\n${code}`
    );

    return NextResponse.json({
      bugs: parseBugs(bugText),
      explanation,
      optimizedCode,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
