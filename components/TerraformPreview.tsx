"use client";

import { useState } from "react";

type TerraformPreviewProps = {
  code: string;
};

export default function TerraformPreview({ code }: TerraformPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Basic syntax highlighting
  const highlightCode = (code: string) => {
    return code
      .split("\n")
      .map((line, idx) => {
        let highlighted = line
          // Comments
          .replace(/(#.*)$/gm, '<span class="text-slate-500">$1</span>')
          // Strings
          .replace(
            /"([^"]*)"/g,
            '<span class="text-emerald-400">"$1"</span>'
          )
          // Keywords
          .replace(
            /\b(resource|variable|provider|terraform|required_providers|source|version)\b/g,
            '<span class="text-purple-400">$1</span>'
          )
          // Types
          .replace(
            /\b(string|number|bool|list|map)\b/g,
            '<span class="text-amber-400">$1</span>'
          )
          // Booleans
          .replace(
            /\b(true|false)\b/g,
            '<span class="text-cyan-400">$1</span>'
          )
          // Numbers
          .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');

        return (
          <div key={idx} className="hover:bg-slate-700/30">
            <span className="text-slate-600 select-none w-8 inline-block text-right mr-4">
              {idx + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
        );
      });
  };

  const displayLines = isExpanded ? code : code.split("\n").slice(0, 15).join("\n");
  const hasMore = code.split("\n").length > 15;

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span className="text-amber-400">📄</span>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Terraform Preview
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors px-2 py-1 rounded hover:bg-slate-700"
          >
            📋 Copy
          </button>
          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors px-2 py-1 rounded hover:bg-slate-700"
            >
              {isExpanded ? "▲ Collapse" : "▼ Expand"}
            </button>
          )}
        </div>
      </div>

      <div
        className={`p-4 overflow-x-auto font-mono text-xs leading-relaxed ${
          isExpanded ? "max-h-[500px] overflow-y-auto" : "max-h-[300px]"
        }`}
      >
        <pre className="text-slate-300">{highlightCode(displayLines)}</pre>
        {!isExpanded && hasMore && (
          <div className="text-center text-slate-500 mt-2 pt-2 border-t border-slate-700/50">
            ... {code.split("\n").length - 15} more lines
          </div>
        )}
      </div>
    </div>
  );
}
