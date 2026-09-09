import React, { useState, useRef } from 'react';
import { 
  BarChart3, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Hash, 
  Type, 
  AlignLeft, 
  Clock, 
  Maximize2, 
  Search,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import { TextStatistics, KeywordItem } from '../types';
import { calculateTextStatistics, extractKeywords, splitIntoSentences } from '../utils/nlp';
import { readTextFile } from '../utils/fileHelpers';
import { SAMPLE_ACADEMIC_TEXT } from '../utils/sampleData';

interface TextAnalyzerViewProps {
  text: string;
  setText: (t: string) => void;
  fileName: string;
  setFileName: (n: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const TextAnalyzerView: React.FC<TextAnalyzerViewProps> = ({
  text,
  setText,
  fileName,
  setFileName,
  showToast
}) => {
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats: TextStatistics = calculateTextStatistics(text);
  const keywords: KeywordItem[] = extractKeywords(text, 15);
  const sentences = splitIntoSentences(text);

  const maxFreq = keywords.length > 0 ? keywords[0].count : 1;

  const handleFileUpload = async (file: File) => {
    try {
      const content = await readTextFile(file);
      setText(content);
      setFileName(file.name);
      setSelectedKeyword(null);
      showToast(`Loaded ${file.name} for corpus analysis`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error loading file', 'error');
    }
  };

  const handleLoadSample = () => {
    setText(SAMPLE_ACADEMIC_TEXT);
    setFileName('sample_academic_ai_pedagogy.txt');
    setSelectedKeyword(null);
    showToast('Loaded realistic academic sample text', 'info');
  };

  const handleClear = () => {
    setText('');
    setFileName('');
    setSelectedKeyword(null);
    showToast('Cleared analyzer input', 'info');
  };

  const statCards = [
    {
      label: 'TOTAL WORDS',
      value: stats.totalWords.toLocaleString(),
      sub: 'Total lexical tokens',
      icon: <Type className="w-4 h-4 text-indigo-500" />
    },
    {
      label: 'SENTENCES',
      value: stats.sentenceCount.toLocaleString(),
      sub: `${stats.avgSentenceLength} words/sentence`,
      icon: <AlignLeft className="w-4 h-4 text-blue-500" />
    },
    {
      label: 'UNIQUE WORDS',
      value: stats.uniqueWords.toLocaleString(),
      sub: stats.totalWords > 0 ? `${Math.round((stats.uniqueWords / stats.totalWords) * 100)}% lexical diversity` : '0%',
      icon: <Hash className="w-4 h-4 text-purple-500" />
    },
    {
      label: 'PARAGRAPHS',
      value: stats.paragraphCount.toLocaleString(),
      sub: 'Structural sections',
      icon: <BookOpen className="w-4 h-4 text-cyan-500" />
    },
    {
      label: 'TOTAL CHARACTERS',
      value: stats.totalChars.toLocaleString(),
      sub: `${stats.charsNoSpaces.toLocaleString()} excl. spaces`,
      icon: <Maximize2 className="w-4 h-4 text-emerald-500" />
    },
    {
      label: 'AVG WORD LENGTH',
      value: `${stats.avgWordLength} chars`,
      sub: 'Morphological complexity',
      icon: <Type className="w-4 h-4 text-amber-500" />
    },
    {
      label: 'AVG SENTENCE LENGTH',
      value: `${stats.avgSentenceLength} words`,
      sub: stats.avgSentenceLength > 25 ? 'Dense / Academic' : 'Standard pacing',
      icon: <AlignLeft className="w-4 h-4 text-rose-500" />
    },
    {
      label: 'READING TIME',
      value: `~${stats.readingTimeMinutes} min`,
      sub: 'Based on 200 wpm standard',
      icon: <Clock className="w-4 h-4 text-teal-500" />
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Text Analyzer & Corpus Statistics
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Live Metrics & Frequency Rank
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time computation of document lengths, structural counts, vocabulary richness, and interactive keyword extraction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="analyzer-sample-btn"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Try Sample</span>
          </button>
          {text && (
            <button
              id="analyzer-clear-btn"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Text Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Document Text
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
              id="analyzer-file-input"
            />
            <button
              id="analyzer-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload .txt</span>
            </button>
          </div>
        </div>

        <textarea
          id="analyzer-textarea"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or upload text to immediately calculate document statistics..."
          className="w-full mt-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y font-sans"
        />
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                {card.label}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                {card.icon}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              {card.value}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Longest Sentence Callout */}
      {stats.longestSentence.wordCount > 0 && (
        <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">
            <AlignLeft className="w-4 h-4" />
            <span>Longest Sentence in Document (Sentence #{stats.longestSentence.sentenceNumber} — {stats.longestSentence.wordCount} words)</span>
          </div>
          <p className="text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 leading-relaxed pl-2 border-l-2 border-indigo-400 mt-2">
            "{stats.longestSentence.text}"
          </p>
        </div>
      )}

      {/* Top Keywords & Keyword Explorer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Keywords Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Top Meaningful Keywords</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stop-words filtered; click any keyword to inspect occurrence contexts.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Top {keywords.length}
            </span>
          </div>

          {keywords.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {keywords.map((kw, idx) => {
                const isSelected = selectedKeyword?.word === kw.word;
                const barWidth = Math.max(8, Math.round((kw.count / maxFreq) * 100));

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedKeyword(kw)}
                    className={`group p-2 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 shadow-xs'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-850 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-[11px] font-mono font-bold text-slate-400 group-hover:text-indigo-500">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                          {kw.word}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{kw.count}×</span>
                        <span className="text-slate-400">({kw.percentage}%)</span>
                      </div>
                    </div>

                    {/* Frequency Bar */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected
                            ? 'bg-indigo-600 dark:bg-indigo-400'
                            : 'bg-indigo-400/80 dark:bg-indigo-600 group-hover:bg-indigo-500'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No keywords extracted yet. Add text to calculate frequencies.
            </div>
          )}
        </div>

        {/* Keyword Drilldown Panel */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Keyword Context Explorer</span>
            </h3>
          </div>

          {selectedKeyword ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                <div className="text-xs uppercase font-bold text-indigo-700 dark:text-indigo-300">Selected Term</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 capitalize">
                  "{selectedKeyword.word}"
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Frequency:</span>
                    <strong className="text-indigo-600 dark:text-indigo-400">{selectedKeyword.count} times</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Share of Content:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{selectedKeyword.percentage}%</strong>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Sentence Occurrences ({selectedKeyword.sentenceOccurrences.length}):
                </div>
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {selectedKeyword.sentenceOccurrences.map(sentNum => {
                    const sentenceText = sentences[sentNum - 1] || '';
                    return (
                      <div
                        key={sentNum}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs leading-relaxed"
                      >
                        <div className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                          Sentence #{sentNum}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">
                          {sentenceText}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 stroke-1" />
              <p>Click on any keyword bar on the left to reveal its percentage weight and highlight the exact sentences where it appears.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
