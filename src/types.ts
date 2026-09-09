export interface TextStatistics {
  totalWords: number;
  totalChars: number;
  charsNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  uniqueWords: number;
  avgSentenceLength: number; // in words
  longestSentence: {
    text: string;
    wordCount: number;
    sentenceNumber: number;
  };
  avgWordLength: number; // in chars
  readingTimeMinutes: number;
}

export interface KeywordItem {
  word: string;
  count: number;
  percentage: number;
  sentenceOccurrences: number[];
}

export interface SentenceScore {
  text: string;
  index: number;
  originalIndex: number;
  rawScore: number;
  normalizedScore: number;
  wordCount: number;
}

export interface SummaryResult {
  originalWordCount: number;
  summaryWordCount: number;
  compressionPercentage: number;
  sentenceCount: number;
  selectedSentences: string[];
  fullSummary: string;
  selectedIndices: number[];
}

export interface SimilarityResult {
  score: number; // 0 to 100
  classification: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  dotProduct: number;
  magnitudeA: number;
  magnitudeB: number;
  commonWords: { word: string; countA: number; countB: number }[];
  uniqueWordsA: { word: string; count: number }[];
  uniqueWordsB: { word: string; count: number }[];
  totalWordsA: number;
  totalWordsB: number;
  vocabularySize: number;
}

export interface LongSentenceItem {
  index: number;
  wordCount: number;
  text: string;
}

export interface RepeatedWordItem {
  word: string;
  count: number;
  percentage: number;
}

export interface FillerWordItem {
  word: string;
  count: number;
}

export interface ExcessivePunctuationItem {
  type: string;
  pattern: string;
  count: number;
  examples: string[];
}

export interface QualitySuggestion {
  type: 'success' | 'warning' | 'info';
  category: string;
  text: string;
}

export interface WritingQualityResult {
  overallScore: number; // 0 to 100
  categories: {
    vocabulary: number; // 0-100
    sentenceStructure: number; // 0-100
    repetition: number; // 0-100
    readability: number; // 0-100
    punctuation: number; // 0-100
  };
  longSentences: LongSentenceItem[];
  repeatedWords: RepeatedWordItem[];
  fillerWords: FillerWordItem[];
  totalFillerCount: number;
  excessivePunctuation: ExcessivePunctuationItem[];
  sentenceVariety: {
    avgLength: number;
    stdDev: number;
    varietyRating: 'Low' | 'Balanced' | 'High';
  };
  suggestions: QualitySuggestion[];
}

export type ActiveTab = 
  | 'dashboard'
  | 'summarizer'
  | 'similarity'
  | 'analyzer'
  | 'writingQuality'
  | 'about';
