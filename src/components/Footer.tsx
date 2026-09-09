import React from 'react';
import { ShieldCheck, Heart, Github, GraduationCap } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xs py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-slate-900 dark:text-white">
                TEXT<span className="text-indigo-600 dark:text-indigo-400">GUARD</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart Academic Text Analyzer — Built as a college mini-project
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <button
              onClick={() => { setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('summarizer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Summarizer
            </button>
            <button
              onClick={() => { setActiveTab('similarity'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Similarity Checker
            </button>
            <button
              onClick={() => { setActiveTab('analyzer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Text Analyzer
            </button>
            <button
              onClick={() => { setActiveTab('writingQuality'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Writing Quality
            </button>
            <button
              onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              About
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="italic font-serif">
            "Analyze text. Understand content. Write better."
          </p>
        </div>
      </div>
    </footer>
  );
};
