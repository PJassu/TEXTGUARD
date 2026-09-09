import React, { useState, useRef } from 'react';
import { 
  GitCompare, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  Info, 
  Check, 
  ChevronRight, 
  ShieldAlert,
  Layers,
  BarChart2
} from 'lucide-react';
import { SimilarityResult } from '../types';
import { calculateCosineSimilarity, tokenizeWords } from '../utils/nlp';
import { readTextFile } from '../utils/fileHelpers';
import { SAMPLE_DOC_A, SAMPLE_DOC_B } from '../utils/sampleData';

interface SimilarityViewProps {
  docA: string;
  setDocA: (t: string) => void;
  docB: string;
  setDocB: (t: string) => void;
  similarityResult: SimilarityResult | null;
  setSimilarityResult: (res: SimilarityResult | null) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const SimilarityView: React.FC<SimilarityViewProps> = ({
  docA,
  setDocA,
  docB,
  setDocB,
  similarityResult,
  setSimilarityResult,
  showToast
}) => {
  const [fileA, setFileA] = useState<string>('');
  const [fileB, setFileB] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'common' | 'uniqueA' | 'uniqueB' | 'vector'>('common');

  const fileInputRefA = useRef<HTMLInputElement>(null);
  const fileInputRefB = useRef<HTMLInputElement>(null);

  const wordsCountA = tokenizeWords(docA).length;
  const wordsCountB = tokenizeWords(docB).length;

  const handleFileUpload = async (file: File, target: 'A' | 'B') => {
    try {
      const content = await readTextFile(file);
      if (target === 'A') {
        setDocA(content);
        setFileA(file.name);
      } else {
        setDocB(content);
        setFileB(file.name);
      }
      setSimilarityResult(null);
      showToast(`Loaded ${file.name} for Document ${target}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error loading file', 'error');
    }
  };

  const handleComputeSimilarity = () => {
    if (!docA.trim() || !docB.trim()) {
      showToast('Both Document A and Document B must contain text for similarity comparison.', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const result = calculateCosineSimilarity(docA, docB);
      setSimilarityResult(result);
      setIsProcessing(false);
      showToast(`Computed Cosine Similarity: ${result.score}% (${result.classification})`, 'success');
    }, 250);
  };

  const handleReset = () => {
    setDocA('');
    setDocB('');
    setFileA('');
    setFileB('');
    setSimilarityResult(null);
    showToast('Reset both documents and similarity scores', 'info');
  };

  const handleLoadSampleA = () => {
    setDocA(SAMPLE_DOC_A);
    setFileA('sample_study_ai_frameworks.txt');
    setSimilarityResult(null);
    showToast('Loaded Sample A: AI & Student Analytics', 'info');
  };

  const handleLoadSampleB = () => {
    setDocB(SAMPLE_DOC_B);
    setFileB('sample_study_predictive_learning.txt');
    setSimilarityResult(null);
    showToast('Loaded Sample B: Machine Learning in Pedagogy', 'info');
  };

  const getBadgeStyle = (classification: string) => {
    switch (classification) {
      case 'Very High':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'High':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Moderate':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Low':
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Document Similarity Checker
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Cosine Vector Space Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare word-frequency vectors between two documents to calculate mathematical token overlap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(docA || docB || similarityResult) && (
            <button
              id="similarity-reset-btn"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Comparison</span>
            </button>
          )}
        </div>
      </div>

      {/* Two Document Input Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document A Card */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                A
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Document A</h3>
              {fileA && (
                <span className="max-w-[120px] truncate text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {fileA}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                id="load-sample-a-btn"
                onClick={handleLoadSampleA}
                className="text-[11px] font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Load Sample A
              </button>

              <input
                type="file"
                ref={fileInputRefA}
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'A')}
                accept=".txt"
                className="hidden"
                id="file-input-doc-a"
              />
              <button
                id="upload-doc-a-btn"
                onClick={() => fileInputRefA.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload .txt</span>
              </button>
            </div>
          </div>

          <textarea
            id="textarea-doc-a"
            rows={10}
            value={docA}
            onChange={(e) => setDocA(e.target.value)}
            placeholder="Paste text for Document A or upload a .txt file..."
            className="w-full mt-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y font-sans"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Total Words: <strong className="font-mono text-slate-800 dark:text-slate-200">{wordsCountA.toLocaleString()}</strong>
            </span>
            <span className="text-[11px]">Primary comparison text</span>
          </div>
        </div>

        {/* Document B Card */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
                B
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Document B</h3>
              {fileB && (
                <span className="max-w-[120px] truncate text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {fileB}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                id="load-sample-b-btn"
                onClick={handleLoadSampleB}
                className="text-[11px] font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Load Sample B
              </button>

              <input
                type="file"
                ref={fileInputRefB}
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'B')}
                accept=".txt"
                className="hidden"
                id="file-input-doc-b"
              />
              <button
                id="upload-doc-b-btn"
                onClick={() => fileInputRefB.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload .txt</span>
              </button>
            </div>
          </div>

          <textarea
            id="textarea-doc-b"
            rows={10}
            value={docB}
            onChange={(e) => setDocB(e.target.value)}
            placeholder="Paste text for Document B or upload a .txt file..."
            className="w-full mt-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 leading-relaxed resize-y font-sans"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Total Words: <strong className="font-mono text-slate-800 dark:text-slate-200">{wordsCountB.toLocaleString()}</strong>
            </span>
            <span className="text-[11px]">Secondary comparison text</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col items-center justify-center pt-2">
        <button
          id="check-similarity-btn"
          onClick={handleComputeSimilarity}
          disabled={isProcessing || !docA.trim() || !docB.trim()}
          className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            docA.trim() && docB.trim()
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.99]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Calculating Cosine Dot Product...</span>
            </>
          ) : (
            <>
              <GitCompare className="w-4 h-4" />
              <span>Check Similarity</span>
            </>
          )}
        </button>

        {(!docA.trim() || !docB.trim()) && (
          <p className="text-xs text-slate-400 mt-2">
            Add text or click "Load Sample A" and "Load Sample B" above to enable comparison.
          </p>
        )}
      </div>

      {/* Results Section */}
      {similarityResult && (
        <div className="rounded-2xl border border-indigo-200/90 dark:border-indigo-900/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Main Score & Classification Card */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Text Similarity Score
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {similarityResult.score}%
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(similarityResult.classification)}`}>
                  {similarityResult.classification} Overlap
                </span>
                <span className="text-xs text-slate-500">
                  Range classification
                </span>
              </div>
            </div>

            {/* Circular / Progress visualizer */}
            <div className="w-full md:w-72 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Vector Overlap</span>
                <span className="font-mono">{similarityResult.score} / 100</span>
              </div>
              <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700"
                  style={{ width: `${Math.max(similarityResult.score, 4)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (Disjoint)</span>
                <span>50% (Moderate)</span>
                <span>100% (Identical)</span>
              </div>
            </div>
          </div>

          {/* Important Academic Integrity Disclaimer Note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Academic Notice: </strong>
              Similarity analysis detects overlapping word patterns. A high similarity score does not by itself prove plagiarism. Academic literature frequently shares standard research terminology, citations, and domain vocabulary.
            </div>
          </div>

          {/* Breakdown Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  id="tab-common-words"
                  onClick={() => setActiveTab('common')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'common'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Common Words ({similarityResult.commonWords.length})
                </button>
                <button
                  id="tab-unique-a"
                  onClick={() => setActiveTab('uniqueA')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'uniqueA'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Unique to Doc A ({similarityResult.uniqueWordsA.length})
                </button>
                <button
                  id="tab-unique-b"
                  onClick={() => setActiveTab('uniqueB')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'uniqueB'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Unique to Doc B ({similarityResult.uniqueWordsB.length})
                </button>
                <button
                  id="tab-vector-metrics"
                  onClick={() => setActiveTab('vector')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'vector'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Vector Math Metrics
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[160px]">
              {activeTab === 'common' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Content words appearing in both documents (ordered by joint frequency):
                  </p>
                  {similarityResult.commonWords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {similarityResult.commonWords.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                        >
                          <span className="font-sans font-semibold">{item.word}</span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                            (A:{item.countA}, B:{item.countB})
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No overlapping content words found.</p>
                  )}
                </div>
              )}

              {activeTab === 'uniqueA' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Words found exclusively in Document A:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {similarityResult.uniqueWordsA.slice(0, 30).map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                      >
                        <span>{item.word}</span>
                        <span className="text-[10px] text-blue-500">×{item.count}</span>
                      </span>
                    ))}
                    {similarityResult.uniqueWordsA.length > 30 && (
                      <span className="text-xs text-slate-400 self-center">
                        +{similarityResult.uniqueWordsA.length - 30} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'uniqueB' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Words found exclusively in Document B:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {similarityResult.uniqueWordsB.slice(0, 30).map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900"
                      >
                        <span>{item.word}</span>
                        <span className="text-[10px] text-purple-500">×{item.count}</span>
                      </span>
                    ))}
                    {similarityResult.uniqueWordsB.length > 30 && (
                      <span className="text-xs text-slate-400 self-center">
                        +{similarityResult.uniqueWordsB.length - 30} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'vector' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Dot Product (A · B)</div>
                    <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">
                      {similarityResult.dotProduct}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Magnitude ‖A‖</div>
                    <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">
                      {similarityResult.magnitudeA}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Magnitude ‖B‖</div>
                    <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">
                      {similarityResult.magnitudeB}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Vocabulary Size</div>
                    <div className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                      {similarityResult.vocabularySize} terms
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
