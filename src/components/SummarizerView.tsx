import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Copy, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Sliders, 
  Percent, 
  Layers, 
  FileDown,
  Info
} from 'lucide-react';
import { SummaryResult } from '../types';
import { generateExtractiveSummary, tokenizeWords } from '../utils/nlp';
import { readTextFile, downloadTextFile, copyToClipboard } from '../utils/fileHelpers';
import { SAMPLE_ACADEMIC_TEXT } from '../utils/sampleData';

interface SummarizerViewProps {
  text: string;
  setText: (text: string) => void;
  summaryResult: SummaryResult | null;
  setSummaryResult: (result: SummaryResult | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const SummarizerView: React.FC<SummarizerViewProps> = ({
  text,
  setText,
  summaryResult,
  setSummaryResult,
  fileName,
  setFileName,
  showToast
}) => {
  const [ratio, setRatio] = useState<number>(0.3); // 0.2 = Short, 0.3 = Medium, 0.4 = Detailed
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = tokenizeWords(text).length;
  const charCount = text.length;

  const handleFileUpload = async (file: File) => {
    try {
      const content = await readTextFile(file);
      setText(content);
      setFileName(file.name);
      setSummaryResult(null);
      const count = tokenizeWords(content).length;
      showToast(`Loaded ${file.name} (${count.toLocaleString()} words)`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error reading .txt file', 'error');
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSummarize = () => {
    if (!text.trim()) {
      showToast('No text available. Paste text or upload a .txt file first.', 'error');
      return;
    }

    setIsProcessing(true);
    // Simulate brief processing frame for satisfying tactile responsiveness
    setTimeout(() => {
      const result = generateExtractiveSummary(text, ratio);
      setSummaryResult(result);
      setIsProcessing(false);
      showToast(`Extractive summary generated (${result.sentenceCount} key sentences selected)`, 'success');
    }, 250);
  };

  const handleCopySummary = async () => {
    if (!summaryResult?.fullSummary) return;
    const ok = await copyToClipboard(summaryResult.fullSummary);
    if (ok) {
      setCopied(true);
      showToast('Summary copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleDownloadSummary = () => {
    if (!summaryResult?.fullSummary) return;
    const outName = fileName ? `${fileName.replace(/\.txt$/i, '')}_summary.txt` : 'textguard_summary.txt';
    const content = `TEXTGUARD EXTRACTIVE SUMMARY\nGenerated: ${new Date().toLocaleString()}\nOriginal Words: ${summaryResult.originalWordCount} | Summary Words: ${summaryResult.summaryWordCount} | Reduction: ${summaryResult.compressionPercentage}%\nSelected Sentences: ${summaryResult.sentenceCount}\n${'='.repeat(60)}\n\n${summaryResult.fullSummary}\n`;
    downloadTextFile(outName, content);
    showToast(`Downloaded summary as ${outName}`, 'success');
  };

  const handleLoadSample = () => {
    setText(SAMPLE_ACADEMIC_TEXT);
    setFileName('sample_academic_ai_pedagogy.txt');
    setSummaryResult(null);
    showToast('Loaded realistic academic sample text', 'info');
  };

  const handleClear = () => {
    setText('');
    setFileName('');
    setSummaryResult(null);
    showToast('Cleared input text', 'info');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Smart Extractive Summarizer
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Frequency-Based
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Scores sentences by term frequency weighting and extracts the highest-impact ideas in original document sequence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="summarizer-sample-btn"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Try Sample</span>
          </button>
          {text && (
            <button
              id="summarizer-clear-btn"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Text Area */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Source Document
                </span>
                {fileName && (
                  <span className="max-w-[140px] truncate text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    📄 {fileName}
                  </span>
                )}
              </div>

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileInputChange}
                  accept=".txt"
                  className="hidden"
                  id="summarizer-file-input"
                />
                <button
                  id="summarizer-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .txt</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop / Text Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative mt-3 rounded-xl border transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 focus-within:border-indigo-500'
              }`}
            >
              <textarea
                id="summarizer-textarea"
                rows={14}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your academic text here, or drop a .txt research file..."
                className="w-full p-4 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none resize-y leading-relaxed font-sans"
              />
              {isDragging && (
                <div className="absolute inset-0 bg-indigo-600/10 dark:bg-indigo-900/30 backdrop-blur-xs rounded-xl flex items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 text-xs font-semibold shadow-md border border-indigo-200">
                    Drop .txt file to load
                  </div>
                </div>
              )}
            </div>

            {/* Counts Footer */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <div className="flex items-center gap-4">
                <span>
                  Words: <strong className="text-slate-800 dark:text-slate-200 font-mono">{wordCount.toLocaleString()}</strong>
                </span>
                <span>
                  Characters: <strong className="text-slate-800 dark:text-slate-200 font-mono">{charCount.toLocaleString()}</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Supports standard .txt UTF-8
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Summary Output */}
        <div className="lg:col-span-6 space-y-4">
          {/* Controls Card */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Summary Length Ratio
                </span>
              </div>
            </div>

            {/* Length selector */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <button
                id="summary-len-short"
                onClick={() => setRatio(0.2)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  ratio === 0.2
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Short (~20%)
              </button>
              <button
                id="summary-len-medium"
                onClick={() => setRatio(0.3)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  ratio === 0.3
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Medium (~30%)
              </button>
              <button
                id="summary-len-detailed"
                onClick={() => setRatio(0.4)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  ratio === 0.4
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Detailed (~40%)
              </button>
            </div>

            {/* Action button */}
            <button
              id="generate-summary-btn"
              onClick={handleSummarize}
              disabled={isProcessing || !text.trim()}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                text.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Sentences...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Summary</span>
                </>
              )}
            </button>
          </div>

          {/* Results Card */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Generated Summary</span>
                {summaryResult && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {summaryResult.compressionPercentage}% Compressed
                  </span>
                )}
              </h3>

              {summaryResult && (
                <div className="flex items-center gap-2">
                  <button
                    id="copy-summary-btn"
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Copy summary text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    id="download-summary-btn"
                    onClick={handleDownloadSummary}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                    title="Download summary as .txt"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            {/* Metrics Ribbon */}
            {summaryResult ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Original Words</div>
                  <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                    {summaryResult.originalWordCount.toLocaleString()}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Summary Words</div>
                  <div className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {summaryResult.summaryWordCount.toLocaleString()}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Reduction</div>
                  <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {summaryResult.compressionPercentage}%
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Sentences Picked</div>
                  <div className="text-sm font-bold font-mono text-purple-600 dark:text-purple-400">
                    {summaryResult.sentenceCount}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Summary Text Content Area */}
            <div className="min-h-[260px] rounded-xl bg-slate-50/70 dark:bg-slate-950/60 p-4 border border-slate-200/80 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {summaryResult ? (
                <div className="space-y-3 font-sans">
                  {summaryResult.selectedSentences.map((sentence, idx) => (
                    <p key={idx} className="leading-relaxed">
                      <span className="inline-block w-5 text-[11px] font-mono font-bold text-indigo-500 select-none">
                        {idx + 1}.
                      </span>
                      {sentence}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <FileText className="w-10 h-10 stroke-1 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xs">
                    {text.trim()
                      ? 'Ready to analyze. Click "Generate Summary" to extract the most informative sentences.'
                      : 'No text available. Paste text on the left or upload a .txt file to generate an extractive summary.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
