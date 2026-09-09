import React from 'react';
import { 
  ShieldCheck, 
  Code2, 
  Cpu, 
  CheckCircle2
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const algorithms = [
    {
      name: '1. Frequency-Based Extractive Summarization',
      formula: 'SentenceScore = (1 / |S|^0.75) × ∑ [TF(w) / max(TF)]',
      desc: 'Tokenizes sentences, filters stop words, constructs term frequencies, normalizes frequencies by the maximum TF, sums content word weights per sentence, applies length damping, and selects the top k sentences according to user ratio (20%, 30%, 40%) in original document order.'
    },
    {
      name: '2. Cosine Similarity in Vector Space',
      formula: 'cos(θ) = (A · B) / (‖A‖ × ‖B‖) = ∑(A_i × B_i) / [ √(∑ A_i²) × √(∑ B_i²) ]',
      desc: 'Transforms Document A and B into term frequency vectors over their union vocabulary. Computes the normalized inner product (dot product) divided by the product of Euclidean lengths to gauge token overlap percentage (0% to 100%).'
    },
    {
      name: '3. Word Frequency Analysis (HashMap Equivalent)',
      formula: 'TF(w) = count(w) ; TTR = |UniqueWords| / |TotalWords|',
      desc: 'Constructs an O(1) hash map of lowercase alphanumeric tokens. Provides exact counts, ranking, and vocabulary richness diagnostics (Type-Token Ratio).'
    },
    {
      name: '4. Stop-Word Filtering Lexicon',
      formula: 'w ∈ TokenList where w ∉ StopWordSet',
      desc: 'Filters high-frequency functional words (e.g., "the", "and", "which", "are") using a fast O(1) hash set lookup, leaving only semantically meaningful keywords.'
    },
    {
      name: '5. Rule-Based Writing Quality Heuristics',
      formula: 'QualityScore = 0.20(Vocab) + 0.25(Structure) + 0.20(Repetition) + 0.20(Readability) + 0.15(Punctuation)',
      desc: 'Deterministic rules assessing sentence lengths (>30 words), overused words (>2.5%), informal filler words ("basically", "actually"), repeated punctuation, and standard deviation of sentence lengths.'
    }
  ];

  const dataStructures = [
    {
      name: 'JavaScript Map (HashMap Equivalent)',
      use: 'Used for storing word frequencies and vector components with O(1) insertion, retrieval, and updates.'
    },
    {
      name: 'JavaScript Set (HashSet Equivalent)',
      use: 'Used for the stop-words dictionary and union vocabulary creation with O(1) membership checks.'
    },
    {
      name: 'Arrays / Lists',
      use: 'Used for sentence boundary tracking, sorting top-scored sentences, ranking keywords, and preserving text order.'
    },
    {
      name: 'RegEx String Manipulation',
      use: 'Tokenization boundaries (\\b[a-z0-9-]+\\b), sentence splitters, punctuation cleaning, and filler word detection.'
    },
    {
      name: 'Browser File API (FileReader & Blob)',
      use: 'Asynchronous streaming of local .txt files and client-side generation of downloadable text reports.'
    }
  ];

  return (
    <div className="space-y-10 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/60 p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              System Architecture & Documentation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              TEXTGUARD — Smart Academic Text Analyzer
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          <strong>Objective:</strong> To provide students and academic researchers with an offline, browser-based utility for summarizing, comparing, and analyzing academic text without requiring external servers, databases, or proprietary AI subscriptions.
        </p>

        <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero Database</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero Login Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero External API Keys</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side</span>
          </div>
        </div>
      </div>

      {/* Core Algorithms Section */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Core Algorithms & Mathematical Formulations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic natural language processing algorithms and mathematical models.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {algorithms.map((algo, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2"
            >
              <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                {algo.name}
              </h3>
              <div className="p-2.5 rounded-lg bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto">
                {algo.formula}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {algo.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Structures & Concepts */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-600 text-white">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Data Structures & Implementation Concepts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct equivalents to classic computer science data structures.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dataStructures.map((ds, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1"
            >
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                {ds.name}
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {ds.use}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
