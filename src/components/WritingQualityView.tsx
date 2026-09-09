import React, { useRef } from 'react';
import { 
  CheckCheck, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  FileText, 
  Sliders, 
  HelpCircle,
  Hash,
  AlertCircle
} from 'lucide-react';
import { WritingQualityResult } from '../types';
import { analyzeWritingQuality, tokenizeWords } from '../utils/nlp';
import { readTextFile } from '../utils/fileHelpers';
import { SAMPLE_ACADEMIC_TEXT } from '../utils/sampleData';

interface WritingQualityViewProps {
  text: string;
  setText: (t: string) => void;
  fileName: string;
  setFileName: (n: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const WritingQualityView: React.FC<WritingQualityViewProps> = ({
  text,
  setText,
  fileName,
  setFileName,
  showToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = tokenizeWords(text).length;
  const quality: WritingQualityResult = analyzeWritingQuality(text);

  const handleFileUpload = async (file: File) => {
    try {
      const content = await readTextFile(file);
      setText(content);
      setFileName(file.name);
      showToast(`Loaded ${file.name} for quality auditing`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error reading file', 'error');
    }
  };

  const handleLoadSample = () => {
    setText(SAMPLE_ACADEMIC_TEXT);
    setFileName('sample_academic_ai_pedagogy.txt');
    showToast('Loaded realistic academic sample text', 'info');
  };

  const handleClear = () => {
    setText('');
    setFileName('');
    showToast('Cleared input text', 'info');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const categoryItems = [
    { label: 'Vocabulary & Lexical Diversity', score: quality.categories.vocabulary, desc: 'Type-token richness' },
    { label: 'Sentence Structure & Length', score: quality.categories.sentenceStructure, desc: 'Avoidance of run-ons >30 words' },
    { label: 'Repetition Control', score: quality.categories.repetition, desc: 'Non-repetitive academic synonyms' },
    { label: 'Readability & Formality', score: quality.categories.readability, desc: 'Absence of colloquial filler words' },
    { label: 'Punctuation Formality', score: quality.categories.punctuation, desc: 'Strict standard academic conventions' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Rule-Based Writing Quality Analysis
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Heuristic Rules Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Evaluates academic text against deterministic style rules: long sentences, repetition, filler words, and sentence length variety.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="quality-sample-btn"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Try Sample</span>
          </button>
          {text && (
            <button
              id="quality-clear-btn"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Area Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Manuscript / Academic Draft
            </span>
            {fileName && (
              <span className="max-w-[160px] truncate text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                📄 {fileName}
              </span>
            )}
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              accept=".txt"
              className="hidden"
              id="quality-file-input"
            />
            <button
              id="quality-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload .txt</span>
            </button>
          </div>
        </div>

        <textarea
          id="quality-textarea"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or upload text to analyze writing style, repetition, and readability..."
          className="w-full mt-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y font-sans"
        />

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Words: <strong className="font-mono text-slate-800 dark:text-slate-200">{wordCount.toLocaleString()}</strong>
          </span>
          <span className="text-[11px]">Real-time rule heuristics</span>
        </div>
      </div>

      {/* Main Score & Categories Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Score Summary & Categories */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 dark:from-slate-850 dark:to-emerald-950/20 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Writing Quality Score
            </div>
            <div className="flex items-baseline justify-center gap-1.5 mt-2">
              <span className={`text-6xl font-black font-mono tracking-tight ${getScoreColor(quality.overallScore)}`}>
                {wordCount > 0 ? quality.overallScore : '--'}
              </span>
              <span className="text-xl font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {quality.overallScore >= 85
                ? 'Excellent academic polish and rigorous prose.'
                : quality.overallScore >= 70
                ? 'Solid scholarly structure with minor stylistic adjustments needed.'
                : quality.overallScore >= 50
                ? 'Moderate issues with run-ons, repetition, or informal words.'
                : 'Significant structural refactoring recommended.'}
            </p>
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Category Diagnostics
            </div>

            {categoryItems.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {cat.label}
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {wordCount > 0 ? `${cat.score}/100` : '--'}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(cat.score)}`}
                    style={{ width: `${wordCount > 0 ? cat.score : 0}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">
                  {cat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Dynamic Diagnostic Suggestions */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rule-Based Diagnostic Suggestions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable advice generated from token scans and syntactic heuristics.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {quality.suggestions.length} items
            </span>
          </div>

          {/* Suggestions List */}
          <div className="space-y-2.5">
            {quality.suggestions.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs leading-relaxed ${
                  item.type === 'success'
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                    : item.type === 'warning'
                    ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                    : 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  {item.type === 'info' && <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </div>
                <div>
                  <span className="font-bold mr-1.5 uppercase text-[10px] tracking-wider opacity-80">
                    [{item.category}]
                  </span>
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detected Long Sentences Highlight */}
          {quality.longSentences.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Long Sentences Detected (&gt; 30 words)</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {quality.longSentences.map((ls, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 text-xs"
                  >
                    <div className="font-mono text-[10px] font-bold text-rose-700 dark:text-rose-300 mb-1">
                      Sentence #{ls.index} ({ls.wordCount} words)
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic">
                      "{ls.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Filler Words */}
          {quality.fillerWords.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-indigo-500" />
                <span>Colloquial / Filler Words Detected ({quality.totalFillerCount} total)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quality.fillerWords.map((fw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <span className="font-semibold">{fw.word}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">×{fw.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
