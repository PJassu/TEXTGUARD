import {
  TextStatistics,
  SummaryResult,
  KeywordItem,
  WritingQualityResult,
  SimilarityResult
} from '../types';

/**
 * Reads a .txt file asynchronously using the browser's FileReader API.
 * Returns the text content or throws an error.
 */
export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if filename ends with .txt or MIME type is text
    const isTxt =
      file.name.toLowerCase().endsWith('.txt') ||
      file.type === 'text/plain' ||
      file.type === '';

    if (!isTxt) {
      reject(new Error('Please upload a .txt file.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read text from file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file. Please try again.'));
    };

    reader.readAsText(file);
  });
}

/**
 * Initiates a client-side download of a .txt file using the browser Blob API.
 */
export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies string to clipboard with fallback for iframe restrictions.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Clipboard copy error:', err);
    return false;
  }
}

/**
 * Formats a comprehensive TEXTGUARD Analysis Report for download.
 */
export function generateFullReportText({
  documentName,
  rawText,
  stats,
  summary,
  keywords,
  quality,
  similarity
}: {
  documentName?: string;
  rawText: string;
  stats?: TextStatistics;
  summary?: SummaryResult;
  keywords?: KeywordItem[];
  quality?: WritingQualityResult;
  similarity?: SimilarityResult;
}): string {
  const dateStr = new Date().toLocaleString();
  const divider = '='.repeat(70);
  const subDivider = '-'.repeat(70);

  let report = `${divider}\n`;
  report += `TEXTGUARD — SMART ACADEMIC TEXT ANALYSIS REPORT\n`;
  report += `Generated: ${dateStr}\n`;
  report += `Document: ${documentName || 'Academic Document Analysis'}\n`;
  report += `Engine: 100% Local Browser Processing (Zero API / Zero Server Egress)\n`;
  report += `${divider}\n\n`;

  // 1. Text Statistics
  if (stats && stats.totalWords > 0) {
    report += `1. DOCUMENT STATISTICS\n${subDivider}\n`;
    report += `Total Words:                 ${stats.totalWords.toLocaleString()}\n`;
    report += `Total Characters:            ${stats.totalChars.toLocaleString()}\n`;
    report += `Characters (excluding spaces): ${stats.charsNoSpaces.toLocaleString()}\n`;
    report += `Sentence Count:              ${stats.sentenceCount}\n`;
    report += `Paragraph Count:             ${stats.paragraphCount}\n`;
    report += `Unique Words (Vocabulary):   ${stats.uniqueWords}\n`;
    report += `Average Sentence Length:     ${stats.avgSentenceLength} words\n`;
    report += `Average Word Length:         ${stats.avgWordLength} characters\n`;
    report += `Estimated Reading Time:      ~${stats.readingTimeMinutes} min\n`;
    if (stats.longestSentence.wordCount > 0) {
      report += `Longest Sentence (Sentence #${stats.longestSentence.sentenceNumber}, ${stats.longestSentence.wordCount} words):\n`;
      report += `  "${stats.longestSentence.text}"\n`;
    }
    report += `\n`;
  }

  // 2. Extractive Summary
  if (summary && summary.selectedSentences.length > 0) {
    report += `2. EXTRACTIVE SUMMARY\n${subDivider}\n`;
    report += `Original Word Count: ${summary.originalWordCount}\n`;
    report += `Summary Word Count:  ${summary.summaryWordCount}\n`;
    report += `Compression Ratio:   ${summary.compressionPercentage}% reduction\n`;
    report += `Sentences Selected:  ${summary.sentenceCount}\n\n`;
    report += `Summary Text:\n${summary.fullSummary}\n\n`;
  }

  // 3. Keyword Extraction
  if (keywords && keywords.length > 0) {
    report += `3. TOP ACADEMIC KEYWORDS\n${subDivider}\n`;
    keywords.slice(0, 10).forEach((kw, idx) => {
      report += `${(idx + 1).toString().padStart(2, ' ')}. ${kw.word.padEnd(20, ' ')} : ${kw.count} occurrences (${kw.percentage}% of meaningful words)\n`;
    });
    report += `\n`;
  }

  // 4. Writing Quality Analysis
  if (quality) {
    report += `4. WRITING QUALITY ANALYSIS (Rule-Based Engine)\n${subDivider}\n`;
    report += `Overall Quality Score: ${quality.overallScore} / 100\n\n`;
    report += `Category Breakdown:\n`;
    report += `  - Vocabulary (Lexical Diversity): ${quality.categories.vocabulary} / 100\n`;
    report += `  - Sentence Structure:             ${quality.categories.sentenceStructure} / 100\n`;
    report += `  - Word Repetition Control:        ${quality.categories.repetition} / 100\n`;
    report += `  - Readability & Academic Tone:    ${quality.categories.readability} / 100\n`;
    report += `  - Punctuation Formality:          ${quality.categories.punctuation} / 100\n\n`;

    if (quality.suggestions.length > 0) {
      report += `Suggestions & Insights:\n`;
      quality.suggestions.forEach(s => {
        const icon = s.type === 'success' ? '[PASS]' : s.type === 'warning' ? '[WARN]' : '[INFO]';
        report += `  ${icon} [${s.category}] ${s.text}\n`;
      });
      report += `\n`;
    }

    if (quality.longSentences.length > 0) {
      report += `Long Sentences Identified (> 30 words):\n`;
      quality.longSentences.forEach(ls => {
        report += `  - Sentence #${ls.index} (${ls.wordCount} words): "${ls.text}"\n`;
      });
      report += `\n`;
    }

    if (quality.fillerWords.length > 0) {
      report += `Casual / Filler Words Detected:\n`;
      quality.fillerWords.forEach(fw => {
        report += `  - "${fw.word}": ${fw.count} time(s)\n`;
      });
      report += `\n`;
    }
  }

  // 5. Document Similarity (if comparison was executed)
  if (similarity && similarity.totalWordsA > 0 && similarity.totalWordsB > 0) {
    report += `5. DOCUMENT SIMILARITY COMPARISON (Cosine Vector Similarity)\n${subDivider}\n`;
    report += `Similarity Score:        ${similarity.score}% (${similarity.classification})\n`;
    report += `Vector Dot Product:      ${similarity.dotProduct}\n`;
    report += `Magnitude Document A:    ${similarity.magnitudeA}\n`;
    report += `Magnitude Document B:    ${similarity.magnitudeB}\n`;
    report += `Common Semantic Terms:   ${similarity.commonWords.length}\n`;
    report += `Note: Text similarity detects mathematical token overlap and does NOT prove plagiarism.\n\n`;
  }

  report += `${divider}\n`;
  report += `END OF REPORT — TEXTGUARD (Smart Academic Text Analyzer)\n`;
  report += `${divider}\n`;

  return report;
}
