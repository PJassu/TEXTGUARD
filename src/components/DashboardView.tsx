import React from 'react';
import { 
  FileText, 
  GitCompare, 
  BarChart3, 
  CheckCheck, 
  Hash, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  UploadCloud, 
  Zap, 
  FileCheck2,
  Code2
} from 'lucide-react';
import { ActiveTab } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onLoadSample: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onLoadSample
}) => {
  const featureCards = [
    {
      id: 'summarizer' as ActiveTab,
      title: 'Smart Summarizer',
      desc: 'Extractive frequency-based summarization with adjustable compression ratios (20%, 30%, 40%).',
      icon: <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: 'from-blue-500/10 to-indigo-500/10'
    },
    {
      id: 'similarity' as ActiveTab,
      title: 'Similarity Checker',
      desc: 'Vector Space Model measuring Cosine Similarity between documents with term overlap breakdowns.',
      icon: <GitCompare className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'from-purple-500/10 to-pink-500/10'
    },
    {
      id: 'analyzer' as ActiveTab,
      title: 'Text Statistics & Keywords',
      desc: 'Deep metrics including reading times, paragraph/sentence lengths, and interactive keyword frequency rank.',
      icon: <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      color: 'from-cyan-500/10 to-blue-500/10'
    },
    {
      id: 'writingQuality' as ActiveTab,
      title: 'Writing Quality Analysis',
      desc: 'Rule-based evaluation of sentence lengths (>30 words), excessive repetition, and filler words.',
      icon: <CheckCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'from-emerald-500/10 to-teal-500/10'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Upload or Paste Text',
      desc: 'Load any .txt document using standard browser File API, or paste manuscript paragraphs directly.'
    },
    {
      step: '02',
      title: 'Local Algorithmic Processing',
      desc: 'Tokenization, stop-word elimination, Map-based frequency hashing, and vector dot-products execute in RAM.'
    },
    {
      step: '03',
      title: 'Explore & Export Insights',
      desc: 'Review interactive summaries, keyword charts, quality diagnostics, or download a clean report.'
    }
  ];

  const techStack = [
    {
      name: 'Client-Side JavaScript (ES6+)',
      detail: 'Executes 100% within the browser runtime with zero backend, database, or API keys needed.'
    },
    {
      name: 'Browser File API (FileReader)',
      detail: 'Asynchronously streams local .txt files safely with zero server uploads or latency.'
    },
    {
      name: 'HashMap-Style Frequency Analysis',
      detail: 'Utilizes JavaScript Map objects to achieve O(1) term lookup and word frequency tallying.'
    },
    {
      name: 'Array / List Sentence Tokenization',
      detail: 'Performs boundary detection and indexed order preservation for coherent extractive extraction.'
    },
    {
      name: 'Cosine Similarity (Vector Space)',
      detail: 'Calculates the normalized dot product of two sparse term vectors: dot(A,B) / (|A| × |B|).'
    },
    {
      name: 'Deterministic Rule-Based Heuristics',
      detail: 'Clear, transparent rule algorithms without black-box neural hallucinations.'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/50 dark:from-slate-900/90 dark:via-slate-950 dark:to-indigo-950/60 p-6 sm:p-10 lg:p-14 shadow-sm">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            TEXT<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">GUARD</span>
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mt-2">
            Smart Academic Text Analyzer
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            "Summarize, compare, analyze and improve your academic text — completely in your browser."
          </p>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Engineered with transparent mathematical algorithms: extractive sentence scoring, vector cosine similarity, HashMap word frequencies, and rule-based quality heuristics.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              id="hero-start-analyzing"
              onClick={() => onNavigate('summarizer')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Start Analyzing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-try-sample"
              onClick={onLoadSample}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Try Sample Text</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% Client-Side Privacy</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Zero External AI API Keys</span>
          </div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Browser .txt File API</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Academic Analysis Modules
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select an algorithm module to inspect or process your research documents.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {featureCards.map(card => (
            <div
              key={card.id}
              id={`feature-card-${card.id}`}
              onClick={() => onNavigate(card.id)}
              className="group relative rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="mb-4">
                  <div className="inline-flex p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Launch Module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 p-6 sm:p-8">
        <div className="max-w-xl mb-6">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            Workflow Overview
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            How TEXTGUARD Works
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A 3-step pipeline running completely inside your browser tab without network requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {howItWorks.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs"
            >
              <div className="text-2xl font-black font-mono text-indigo-600/40 dark:text-indigo-400/40 mb-2">
                {item.step}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology & Algorithms Section */}
      <section className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Algorithmic & Engineering Foundation
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Deterministic natural language processing models and transparent mathematical algorithms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-xs"
            >
              <div className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {tech.name}
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {tech.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
