import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SummarizerView } from './components/SummarizerView';
import { SimilarityView } from './components/SimilarityView';
import { TextAnalyzerView } from './components/TextAnalyzerView';
import { WritingQualityView } from './components/WritingQualityView';
import { AboutView } from './components/AboutView';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ActiveTab, SummaryResult, SimilarityResult, TextStatistics, KeywordItem, WritingQualityResult } from './types';
import { SAMPLE_ACADEMIC_TEXT, SAMPLE_DOC_A, SAMPLE_DOC_B } from './utils/sampleData';
import { calculateTextStatistics, extractKeywords, analyzeWritingQuality, generateExtractiveSummary, calculateCosineSimilarity } from './utils/nlp';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('textguard_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Shared state across analysis modules
  const [text, setText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);

  // Similarity Checker state
  const [docA, setDocA] = useState<string>('');
  const [docB, setDocB] = useState<string>('');
  const [similarityResult, setSimilarityResult] = useState<SimilarityResult | null>(null);

  // Modals & Notifications
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize Dark Theme class on <html> root element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('textguard_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('textguard_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load sample text across all applicable modules
  const handleLoadSampleFromHero = () => {
    setText(SAMPLE_ACADEMIC_TEXT);
    setFileName('sample_academic_ai_pedagogy.txt');
    const summary = generateExtractiveSummary(SAMPLE_ACADEMIC_TEXT, 0.3);
    setSummaryResult(summary);

    // Also prime similarity with sample A & B
    setDocA(SAMPLE_DOC_A);
    setDocB(SAMPLE_DOC_B);
    const sim = calculateCosineSimilarity(SAMPLE_DOC_A, SAMPLE_DOC_B);
    setSimilarityResult(sim);

    setActiveTab('summarizer');
    showToast('Loaded realistic academic sample text across modules', 'success');
  };

  // Pre-calculate data for comprehensive report
  const currentStats: TextStatistics = calculateTextStatistics(text);
  const currentKeywords: KeywordItem[] = extractKeywords(text, 10);
  const currentQuality: WritingQualityResult = analyzeWritingQuality(text);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenReport={() => setIsReportModalOpen(true)}
        hasAnalyzedContent={Boolean(text.trim() || (docA.trim() && docB.trim()))}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLoadSample={handleLoadSampleFromHero}
          />
        )}

        {activeTab === 'summarizer' && (
          <SummarizerView
            text={text}
            setText={setText}
            summaryResult={summaryResult}
            setSummaryResult={setSummaryResult}
            fileName={fileName}
            setFileName={setFileName}
            showToast={showToast}
          />
        )}

        {activeTab === 'similarity' && (
          <SimilarityView
            docA={docA}
            setDocA={setDocA}
            docB={docB}
            setDocB={setDocB}
            similarityResult={similarityResult}
            setSimilarityResult={setSimilarityResult}
            showToast={showToast}
          />
        )}

        {activeTab === 'analyzer' && (
          <TextAnalyzerView
            text={text}
            setText={setText}
            fileName={fileName}
            setFileName={setFileName}
            showToast={showToast}
          />
        )}

        {activeTab === 'writingQuality' && (
          <WritingQualityView
            text={text}
            setText={setText}
            fileName={fileName}
            setFileName={setFileName}
            showToast={showToast}
          />
        )}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Global Comprehensive Analysis Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        documentName={fileName || 'Academic Analysis Session'}
        rawText={text}
        stats={currentStats}
        summary={summaryResult || undefined}
        keywords={currentKeywords}
        quality={currentQuality}
        similarity={similarityResult || undefined}
        showToast={showToast}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
