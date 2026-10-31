import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Table as TableIcon } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Robust Markdown normalizer: ensures tables always parse into rich HTML tables
  // Prevents common markdown parser pitfalls where tables render as raw text
  const normalizeMarkdownContent = (text: string): string => {
    if (!text) return '';
    let normalized = text;

    // 1. Strip bullet points or asterisks immediately preceding table pipes (e.g. "* | col1 |" -> "| col1 |")
    normalized = normalized.replace(/^(\s*)[*+-]\s+(\|.*\|)\s*$/gm, '$2');

    // 2. Ensure blank line before any table block (| ... | followed by | --- |) if preceded by text or heading
    normalized = normalized.replace(/([^\n])\n(\|[^\n]+\|\n\|[-: |]+\|)/g, '$1\n\n$2');

    // 3. Ensure blank line after the table block before next paragraph
    normalized = normalized.replace(/(\|[^\n]+\|)\n([^\n|#*-\s])/g, '$1\n\n$2');

    return normalized;
  };

  const processedContent = normalizeMarkdownContent(content);

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full inline-block shrink-0" />
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-3.5 mb-1.5 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-blue-500 rounded-full inline-block shrink-0" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-3 mb-1">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mt-2 mb-1">
              {children}
            </h4>
          ),

          // Paragraphs & Text
          p: ({ children }) => (
            <p className="text-xs sm:text-[13px] leading-relaxed mb-2.5 text-slate-700 dark:text-slate-200">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="space-y-1 mb-3 pl-1 text-xs sm:text-[13px]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 mb-3 pl-4 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-slate-700 dark:text-slate-200 leading-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1">{children}</div>
            </li>
          ),

          // Executive High-Contrast Tables
          table: ({ children }) => (
            <div className="my-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs bg-[#f8fafc] dark:bg-[#131b2e]">
              {/* Table Top Bar */}
              <div className="px-3.5 py-1.5 bg-slate-100 dark:bg-[#0e1424] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <TableIcon className="w-3.5 h-3.5" />
                  Strategic Data Matrix
                </span>
                <span className="text-[9px] text-slate-400 font-normal">Globe AI Strategic Benchmarks</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 dark:bg-[#0e1424] border-b-2 border-blue-500/40">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 even:bg-slate-50/60 dark:even:bg-[#0e1424]/40">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 last:border-r-0 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2.5 text-slate-700 dark:text-slate-200 font-normal leading-relaxed align-top border-r border-slate-200 dark:border-slate-800 last:border-r-0 text-xs sm:text-[13px]">
              {children}
            </td>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="my-2.5 p-3 rounded-r-xl border-l-4 border-blue-500 bg-blue-500/10 dark:bg-blue-500/10 text-xs text-slate-800 dark:text-slate-200 italic shadow-xs">
              {children}
            </blockquote>
          ),

          // Inline Code & Code Blocks
          code: ({ inline, className: codeClassName, children, ...props }: any) => {
            const codeString = String(children).replace(/\n$/, '');
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const codeIndex = Math.random();
            return (
              <div className="relative my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0e1424]">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                  <span>Strategy / Copy Snippet</span>
                  <button
                    type="button"
                    onClick={() => copyCode(codeString, codeIndex)}
                    className="flex items-center gap-1 hover:text-slate-100 transition-colors"
                  >
                    {copiedCodeIndex === codeIndex ? (
                      <>
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 overflow-x-auto text-[11px] font-mono text-slate-200 leading-relaxed">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },

          // Strong / Bold
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900 dark:text-slate-100">
              {children}
            </strong>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-3 border-slate-200/80 dark:border-slate-800" />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
