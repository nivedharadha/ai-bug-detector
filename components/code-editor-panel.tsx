"use client";

import { Code2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CodeEditorPanelProps {
  code: string;
  language: string;
  isAnalyzing: boolean;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onAnalyze: () => void;
}

const PLACEHOLDER_CODE: Record<string, string> = {
  java: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int i = 0; i <= numbers.length; i++) {
            sum += numbers[i];
        }
        System.out.println("Sum: " + sum);
        
        String name = null;
        System.out.println(name.length());
    }
}`,
  python: `def calculate_average(numbers):
    total = 0
    for i in range(len(numbers) + 1):
        total += numbers[i]
    return total / len(numbers)

result = calculate_average([10, 20, 30])
print(f"Average: {result}")

my_dict = {"key": "value"}
print(my_dict["missing_key"])`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int i = 0; i <= nums.size(); i++) {
        sum += nums[i];
    }
    cout << "Sum: " << sum << endl;
    
    int* ptr = nullptr;
    cout << *ptr << endl;
    return 0;
}`,
};

export function CodeEditorPanel({
  code,
  language,
  isAnalyzing,
  onCodeChange,
  onLanguageChange,
  onAnalyze,
}: CodeEditorPanelProps) {
  const lineCount = code ? code.split("\n").length : 1;

  return (
    <div className="flex h-full flex-col">
      {/* Editor header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Editor</span>
        </div>
        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="h-8 w-[130px] border-border bg-secondary text-secondary-foreground text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Code editor area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="flex w-12 shrink-0 flex-col border-r border-border bg-muted/50 py-4 text-right">
          {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
            <span
              key={i}
              className="block px-2 font-mono text-xs leading-6 text-muted-foreground"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={PLACEHOLDER_CODE[language] || "Paste your code here..."}
          className="flex-1 resize-none bg-transparent px-4 py-4 font-mono text-sm leading-6 text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          spellCheck={false}
          aria-label="Code editor"
        />
      </div>

      {/* Footer with button */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary/60" />
          <span className="text-xs text-muted-foreground">
            {code.split("\n").filter(Boolean).length} lines
          </span>
        </div>
        <Button
          onClick={onAnalyze}
          disabled={!code.trim() || isAnalyzing}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          size="sm"
        >
          {isAnalyzing ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Analyzing...
            </>
          ) : (
            "Fix Bugs"
          )}
        </Button>
      </div>
    </div>
  );
}
