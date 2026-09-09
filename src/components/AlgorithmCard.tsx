import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Code2, Sparkles } from 'lucide-react';

interface AlgorithmCardProps {
  title: string;
  subtitle: string;
  concept: string;
  formula?: string;
  steps: string[];
  complexity?: string;
  dataStructures?: string[];
  defaultOpen?: boolean;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  title,
  subtitle,
  concept,
  formula,
  steps,
  complexity,
  dataStructures,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900/50 dark:to-indigo-950/40 p-4 sm:p-5 shadow-xs transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5 shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {title}
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-3 h-3" />
                Viva & Project Concept
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
          aria-label={isOpen ? 'Collapse algorithm details' : 'Expand algorithm details'}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-950/60 p-3 rounded-lg border border-indigo-100 dark:border-slate-800/80">
        <span className="font-semibold text-indigo-700 dark:text-indigo-400">Core Logic: </span>
        {concept}
      </div>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-slate-800 text-xs space-y-3 animate-in fade-in duration-200">
          {formula && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Mathematical Expression:
              </div>
              <div className="p-2.5 rounded-md bg-slate-900 text-indigo-300 font-mono text-[11px] overflow-x-auto">
                {formula}
              </div>
            </div>
          )}

          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Algorithm Execution Steps:
            </div>
            <ol className="space-y-1.5 pl-4 list-decimal text-slate-600 dark:text-slate-300">
              {steps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {complexity && (
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Complexity: <strong className="text-slate-700 dark:text-slate-200">{complexity}</strong></span>
              </div>
            )}
            {dataStructures && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Data Structures:</span>
                {dataStructures.map((ds, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 font-mono text-slate-800 dark:text-slate-200 text-[10px]"
                  >
                    {ds}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
