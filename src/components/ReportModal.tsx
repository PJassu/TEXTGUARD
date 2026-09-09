import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck,
  Printer
} from 'lucide-react';
import { 
  TextStatistics, 
  SummaryResult, 
  KeywordItem, 
  WritingQualityResult, 
  SimilarityResult 
} from '../types';
import { generateFullReportText, downloadTextFile, copyToClipboard } from '../utils/fileHelpers';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName?: string;
  rawText: string;
  stats?: TextStatistics;
  summary?: SummaryResult;
  keywords?: KeywordItem[];
  quality?: WritingQualityResult;
  similarity?: SimilarityResult;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  documentName,
  rawText,
  stats,
  summary,
  keywords,
  quality,
  similarity,
  showToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportContent = generateFullReportText({
    documentName: documentName || 'Academic Analysis Session',
    rawText,
    stats,
    summary,
    keywords,
    quality,
    similarity
  });

  const handleCopy = async () => {
    const ok = await copyToClipboard(reportContent);
    if (ok) {
      setCopied(true);
      showToast('Report copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Failed to copy report', 'error');
    }
  };

  const handleDownload = () => {
    const filename = `TEXTGUARD_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    downloadTextFile(filename, reportContent);
    showToast(`Downloaded ${filename}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        id="report-modal-dialog"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                TEXTGUARD Academic Analysis Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compiled client-side diagnostics ready for print or export.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Monospace Text Report Preview */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed select-text">
          <pre className="whitespace-pre-wrap font-mono text-[11px] sm:text-xs">
            {reportContent}
          </pre>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Generated locally with 0 bytes transmitted externally</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="copy-report-btn"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>

            <button
              id="download-report-btn"
              onClick={handleDownload}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
