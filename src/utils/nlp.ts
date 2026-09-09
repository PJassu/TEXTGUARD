import { STOP_WORDS, FILLER_WORDS } from './stopwords';
import {
  TextStatistics,
  KeywordItem,
  SummaryResult,
  SimilarityResult,
  WritingQualityResult,
  LongSentenceItem,
  RepeatedWordItem,
  FillerWordItem,
  ExcessivePunctuationItem,
  QualitySuggestion
} from '../types';

/**
 * Tokenizes text into sentences while handling standard punctuation.
 * Keeps original sentence strings intact.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text || !text.trim()) return [];

  // Match sentences ending in ., !, or ? followed by whitespace or end of line.
  // Preserves common abbreviations like Dr., e.g., i.e.
  const rawSentences = text
    .replace(/([.?!])\s*(?=[A-Z0-9"']|$)/g, '$1|~|')
    .split('|~|')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return rawSentences;
}

/**
 * Tokenizes a text or sentence into clean lowercase words without punctuation.
 */
export function tokenizeWords(text: string): string[] {
  if (!text) return [];
  // Match consecutive word characters and hyphenated words
  const matches = text.toLowerCase().match(/\b[a-z0-9]+(?:-[a-z0-9]+)*\b/g);
  return matches || [];
}

/**
 * HashMap-style frequency counter using JavaScript Map.
 * Equivalent to Java HashMap<String, Integer> for counting word occurrences.
 * Filters out stop words if filterStopWords is true.
 */
export function calculateWordFrequencies(
  words: string[],
  filterStopWords: boolean = true
): Map<string, number> {
  const frequencyMap = new Map<string, number>();

  for (const word of words) {
    // Exclude single character tokens or pure numbers if appropriate
    if (word.length < 2) continue;
    if (filterStopWords && STOP_WORDS.has(word)) continue;

    const currentCount = frequencyMap.get(word) || 0;
    frequencyMap.set(word, currentCount + 1);
  }

  return frequencyMap;
}

/**
 * MODULE 1: SMART EXTRACTIVE SUMMARIZER
 * 
 * Algorithm:
 * 1. Splits text into sentences.
 * 2. Tokenizes all non-stop words across the text and computes frequency map.
 * 3. Normalizes word frequencies (TF = freq / maxFreq).
 * 4. Scores each sentence by summing the TF of its meaningful words.
 *    Damps by sentence length to prevent bias toward run-on sentences.
 * 5. Determines target sentence count based on selected ratio (20%, 30%, 40%).
 * 6. Selects top scoring sentences, sorts them back into original document order.
 */
export function generateExtractiveSummary(
  text: string,
  ratio: number = 0.3 // 0.2, 0.3, or 0.4
): SummaryResult {
  const sentences = splitIntoSentences(text);
  const totalWords = tokenizeWords(text).length;

  if (sentences.length === 0 || totalWords === 0) {
    return {
      originalWordCount: 0,
      summaryWordCount: 0,
      compressionPercentage: 0,
      sentenceCount: 0,
      selectedSentences: [],
      fullSummary: '',
      selectedIndices: []
    };
  }

  // If text is very short (1 or 2 sentences), return as is
  if (sentences.length <= 2) {
    const summaryWords = tokenizeWords(text).length;
    return {
      originalWordCount: totalWords,
      summaryWordCount: summaryWords,
      compressionPercentage: 0,
      sentenceCount: sentences.length,
      selectedSentences: sentences,
      fullSummary: sentences.join(' '),
      selectedIndices: sentences.map((_, i) => i)
    };
  }

  // 1. Calculate word frequencies of meaningful words
  const allWords = tokenizeWords(text);
  const freqMap = calculateWordFrequencies(allWords, true);

  let maxFreq = 1;
  for (const count of freqMap.values()) {
    if (count > maxFreq) maxFreq = count;
  }

  // 2. Score each sentence
  const scoredSentences = sentences.map((sentenceStr, index) => {
    const sentenceWords = tokenizeWords(sentenceStr);
    let rawScore = 0;
    let meaningfulWordCount = 0;

    for (const w of sentenceWords) {
      if (freqMap.has(w)) {
        const tf = (freqMap.get(w) || 0) / maxFreq;
        rawScore += tf;
        meaningfulWordCount++;
      }
    }

    // Normalized score damping by word count to avoid favoring huge run-ons
    // Length normalization formula: score / (length ^ 0.75)
    const len = Math.max(sentenceWords.length, 1);
    const normalizedScore = len > 0 ? rawScore / Math.pow(len, 0.75) : 0;

    return {
      text: sentenceStr,
      index,
      rawScore,
      normalizedScore,
      wordCount: sentenceWords.length
    };
  });

  // 3. Determine how many sentences to select
  let targetCount = Math.round(sentences.length * ratio);
  targetCount = Math.max(1, Math.min(targetCount, sentences.length - 1));

  // Sort by score descending
  const sortedByScore = [...scoredSentences].sort(
    (a, b) => b.normalizedScore - a.normalizedScore
  );

  // Take top N
  const topSelections = sortedByScore.slice(0, targetCount);

  // Re-sort selected sentences into original document order
  topSelections.sort((a, b) => a.index - b.index);

  const selectedSentences = topSelections.map(s => s.text);
  const selectedIndices = topSelections.map(s => s.index);
  const fullSummary = selectedSentences.join(' ');
  const summaryWordCount = tokenizeWords(fullSummary).length;

  const compressionPercentage =
    totalWords > 0
      ? Math.max(0, Math.round(((totalWords - summaryWordCount) / totalWords) * 100))
      : 0;

  return {
    originalWordCount: totalWords,
    summaryWordCount,
    compressionPercentage,
    sentenceCount: selectedSentences.length,
    selectedSentences,
    fullSummary,
    selectedIndices
  };
}

/**
 * MODULE 2: DOCUMENT SIMILARITY CHECKER
 * 
 * Algorithm: Cosine Similarity in Vector Space
 * 1. Tokenize both documents into lowercase words.
 * 2. Remove stop words to compare semantic content words.
 * 3. Build frequency vector Maps for Doc A and Doc B.
 * 4. Create union vocabulary: Union(A, B).
 * 5. Compute dot product: sum(countA[w] * countB[w]).
 * 6. Compute magnitudes: sqrt(sum(countA[w]^2)) and sqrt(sum(countB[w]^2)).
 * 7. Cosine Similarity = dotProduct / (magA * magB).
 * 8. Return score % and classifications.
 */
export function calculateCosineSimilarity(
  docA: string,
  docB: string
): SimilarityResult {
  const wordsA = tokenizeWords(docA);
  const wordsB = tokenizeWords(docB);

  const totalWordsA = wordsA.length;
  const totalWordsB = wordsB.length;

  if (totalWordsA === 0 || totalWordsB === 0) {
    return {
      score: 0,
      classification: 'Very Low',
      dotProduct: 0,
      magnitudeA: 0,
      magnitudeB: 0,
      commonWords: [],
      uniqueWordsA: [],
      uniqueWordsB: [],
      totalWordsA,
      totalWordsB,
      vocabularySize: 0
    };
  }

  // Frequency Maps with stop words removed
  const freqA = calculateWordFrequencies(wordsA, true);
  const freqB = calculateWordFrequencies(wordsB, true);

  // Union vocabulary
  const vocabulary = new Set<string>([...freqA.keys(), ...freqB.keys()]);

  let dotProduct = 0;
  let sumSqA = 0;
  let sumSqB = 0;

  const commonWords: { word: string; countA: number; countB: number }[] = [];
  const uniqueWordsA: { word: string; count: number }[] = [];
  const uniqueWordsB: { word: string; count: number }[] = [];

  for (const word of vocabulary) {
    const countA = freqA.get(word) || 0;
    const countB = freqB.get(word) || 0;

    dotProduct += countA * countB;
    sumSqA += countA * countA;
    sumSqB += countB * countB;

    if (countA > 0 && countB > 0) {
      commonWords.push({ word, countA, countB });
    } else if (countA > 0) {
      uniqueWordsA.push({ word, count: countA });
    } else if (countB > 0) {
      uniqueWordsB.push({ word, count: countB });
    }
  }

  const magnitudeA = Math.sqrt(sumSqA);
  const magnitudeB = Math.sqrt(sumSqB);

  let rawScore = 0;
  if (magnitudeA > 0 && magnitudeB > 0) {
    rawScore = dotProduct / (magnitudeA * magnitudeB);
  }

  // Bound to 0.0 - 1.0 and convert to percentage
  const percentageScore = Math.min(100, Math.max(0, Math.round(rawScore * 100)));

  // Classification logic:
  // 0–20% → Very Low
  // 21–40% → Low
  // 41–60% → Moderate
  // 61–80% → High
  // 81–100% → Very High
  let classification: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High' = 'Very Low';
  if (percentageScore > 80) classification = 'Very High';
  else if (percentageScore > 60) classification = 'High';
  else if (percentageScore > 40) classification = 'Moderate';
  else if (percentageScore > 20) classification = 'Low';

  // Sort lists by frequency
  commonWords.sort((a, b) => (b.countA + b.countB) - (a.countA + a.countB));
  uniqueWordsA.sort((a, b) => b.count - a.count);
  uniqueWordsB.sort((a, b) => b.count - a.count);

  return {
    score: percentageScore,
    classification,
    dotProduct: Math.round(dotProduct * 100) / 100,
    magnitudeA: Math.round(magnitudeA * 100) / 100,
    magnitudeB: Math.round(magnitudeB * 100) / 100,
    commonWords,
    uniqueWordsA,
    uniqueWordsB,
    totalWordsA,
    totalWordsB,
    vocabularySize: vocabulary.size
  };
}

/**
 * MODULE 3: TEXT ANALYZER
 * 
 * Calculates accurate document metrics:
 * - Total words
 * - Total characters
 * - Characters excluding spaces
 * - Sentences count
 * - Paragraphs count
 * - Unique words
 * - Average sentence length
 * - Longest sentence
 * - Average word length
 * - Reading time estimate (~200 wpm)
 */
export function calculateTextStatistics(text: string): TextStatistics {
  if (!text || !text.trim()) {
    return {
      totalWords: 0,
      totalChars: 0,
      charsNoSpaces: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      uniqueWords: 0,
      avgSentenceLength: 0,
      longestSentence: { text: '', wordCount: 0, sentenceNumber: 0 },
      avgWordLength: 0,
      readingTimeMinutes: 0
    };
  }

  const totalChars = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;

  // Paragraphs
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  const paragraphCount = Math.max(paragraphs.length, 1);

  // Sentences
  const sentences = splitIntoSentences(text);
  const sentenceCount = sentences.length;

  // Words
  const words = tokenizeWords(text);
  const totalWords = words.length;

  // Unique words
  const uniqueWordSet = new Set(words);
  const uniqueWords = uniqueWordSet.size;

  // Averages
  const avgSentenceLength =
    sentenceCount > 0 ? Math.round((totalWords / sentenceCount) * 10) / 10 : 0;

  let longestSentence = { text: '', wordCount: 0, sentenceNumber: 0 };
  sentences.forEach((s, idx) => {
    const count = tokenizeWords(s).length;
    if (count > longestSentence.wordCount) {
      longestSentence = {
        text: s,
        wordCount: count,
        sentenceNumber: idx + 1
      };
    }
  });

  const totalWordCharSum = words.reduce((acc, w) => acc + w.length, 0);
  const avgWordLength =
    totalWords > 0 ? Math.round((totalWordCharSum / totalWords) * 10) / 10 : 0;

  // Average reading speed is ~200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(totalWords / 200));

  return {
    totalWords,
    totalChars,
    charsNoSpaces,
    sentenceCount,
    paragraphCount,
    uniqueWords,
    avgSentenceLength,
    longestSentence,
    avgWordLength,
    readingTimeMinutes
  };
}

/**
 * MODULE 5: KEYWORD EXTRACTION
 * Extracts top keywords with frequency, percentage, and sentence occurrences.
 */
export function extractKeywords(text: string, topN: number = 15): KeywordItem[] {
  const sentences = splitIntoSentences(text);
  const words = tokenizeWords(text);
  const freqMap = calculateWordFrequencies(words, true);

  const totalMeaningfulWords = Array.from(freqMap.values()).reduce((a, b) => a + b, 0);
  if (totalMeaningfulWords === 0) return [];

  const sorted = Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return sorted.map(([word, count]) => {
    const percentage = Math.round((count / totalMeaningfulWords) * 1000) / 10;

    // Find which sentences contain this keyword
    const sentenceOccurrences: number[] = [];
    sentences.forEach((sentence, idx) => {
      const sentenceWords = tokenizeWords(sentence);
      if (sentenceWords.includes(word)) {
        sentenceOccurrences.push(idx + 1);
      }
    });

    return {
      word,
      count,
      percentage,
      sentenceOccurrences
    };
  });
}

/**
 * MODULE 4: WRITING QUALITY ANALYZER
 * 
 * Rule-based heuristic scoring (0 to 100):
 * 1. Vocabulary (lexical diversity: uniqueWords / totalWords ratio)
 * 2. Sentence Structure (penalizes sentences > 30 words and extreme uniformity)
 * 3. Repetition (detects overused non-stop words > 3% of text)
 * 4. Readability (filler words penalty, word length)
 * 5. Punctuation (excessive punctuation like !!!, ???, ...)
 */
export function analyzeWritingQuality(text: string): WritingQualityResult {
  const sentences = splitIntoSentences(text);
  const words = tokenizeWords(text);
  const totalWords = words.length;

  if (totalWords === 0 || sentences.length === 0) {
    return {
      overallScore: 100,
      categories: {
        vocabulary: 100,
        sentenceStructure: 100,
        repetition: 100,
        readability: 100,
        punctuation: 100
      },
      longSentences: [],
      repeatedWords: [],
      fillerWords: [],
      totalFillerCount: 0,
      excessivePunctuation: [],
      sentenceVariety: { avgLength: 0, stdDev: 0, varietyRating: 'Balanced' },
      suggestions: [{ type: 'info', category: 'General', text: 'Enter text to begin writing analysis.' }]
    };
  }

  // 1. Long sentences (> 30 words)
  const longSentences: LongSentenceItem[] = [];
  const sentenceLengths: number[] = [];

  sentences.forEach((s, idx) => {
    const count = tokenizeWords(s).length;
    sentenceLengths.push(count);
    if (count > 30) {
      longSentences.push({
        index: idx + 1,
        wordCount: count,
        text: s
      });
    }
  });

  // Sentence variety calculation (Standard Deviation)
  const avgLength = totalWords / sentences.length;
  const variance =
    sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) /
    sentences.length;
  const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

  let varietyRating: 'Low' | 'Balanced' | 'High' = 'Balanced';
  if (stdDev < 4 && sentences.length >= 4) varietyRating = 'Low';
  else if (stdDev > 14) varietyRating = 'High';

  // 2. Repeated Words
  const contentFreq = calculateWordFrequencies(words, true);
  const repeatedWords: RepeatedWordItem[] = [];

  for (const [word, count] of contentFreq.entries()) {
    // If a content word appears 4+ times and makes up > 2.5% of total words
    const ratio = (count / totalWords) * 100;
    if (count >= 4 && ratio >= 2.5) {
      repeatedWords.push({
        word,
        count,
        percentage: Math.round(ratio * 10) / 10
      });
    }
  }
  repeatedWords.sort((a, b) => b.count - a.count);

  // 3. Filler Words
  const lowerText = text.toLowerCase();
  const fillerMap = new Map<string, number>();
  let totalFillerCount = 0;

  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillerMap.set(filler, matches.length);
      totalFillerCount += matches.length;
    }
  }

  const fillerWords: FillerWordItem[] = Array.from(fillerMap.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);

  // 4. Excessive Punctuation
  const excessivePunctuation: ExcessivePunctuationItem[] = [];

  const multiExclamation = (text.match(/!{2,}/g) || []).length;
  if (multiExclamation > 0) {
    excessivePunctuation.push({
      type: 'Multiple Exclamations',
      pattern: '!!+',
      count: multiExclamation,
      examples: text.match(/\w+!{2,}/g) || []
    });
  }

  const multiQuestion = (text.match(/\?{2,}/g) || []).length;
  if (multiQuestion > 0) {
    excessivePunctuation.push({
      type: 'Multiple Question Marks',
      pattern: '\\?\\?+',
      count: multiQuestion,
      examples: text.match(/\w+\?{2,}/g) || []
    });
  }

  const multiEllipsis = (text.match(/\.{4,}/g) || []).length;
  if (multiEllipsis > 0) {
    excessivePunctuation.push({
      type: 'Excessive Periods/Ellipses',
      pattern: '\\.{4,}',
      count: multiEllipsis,
      examples: text.match(/\w+\.{4,}/g) || []
    });
  }

  // 5. Category Score Calculations
  // Vocabulary Score: Based on Type-Token Ratio (unique words / total words)
  const uniqueCount = new Set(words).size;
  const ttr = uniqueCount / totalWords;
  // Academic target TTR is usually 0.45 - 0.75 for essays
  let vocabScore = Math.min(100, Math.round(ttr * 140));
  vocabScore = Math.max(40, Math.min(100, vocabScore));

  // Sentence Structure Score: Penalize high percentage of long sentences (>30 words)
  const longSentenceRatio = longSentences.length / Math.max(1, sentences.length);
  let structureScore = 100 - Math.round(longSentenceRatio * 70);
  if (varietyRating === 'Low' && sentences.length >= 4) structureScore -= 10;
  structureScore = Math.max(30, Math.min(100, structureScore));

  // Repetition Score: Penalize prominent repeated words
  let repetitionScore = 100 - Math.min(50, repeatedWords.length * 12);
  repetitionScore = Math.max(35, Math.min(100, repetitionScore));

  // Readability / Filler Score: Penalize filler words
  const fillerRatio = (totalFillerCount / totalWords) * 100;
  let readabilityScore = 100 - Math.min(60, Math.round(fillerRatio * 15));
  readabilityScore = Math.max(40, Math.min(100, readabilityScore));

  // Punctuation Score: Penalize excessive informal punctuation
  const totalExcessive = excessivePunctuation.reduce((acc, p) => acc + p.count, 0);
  let punctuationScore = 100 - Math.min(60, totalExcessive * 15);
  punctuationScore = Math.max(40, Math.min(100, punctuationScore));

  // Overall Weighted Score out of 100
  const overallScore = Math.round(
    vocabScore * 0.2 +
    structureScore * 0.25 +
    repetitionScore * 0.2 +
    readabilityScore * 0.2 +
    punctuationScore * 0.15
  );

  // Suggestions generation
  const suggestions: QualitySuggestion[] = [];

  if (longSentences.length > 0) {
    suggestions.push({
      type: 'warning',
      category: 'Sentence Length',
      text: `Consider shortening ${longSentences.length} long sentence${
        longSentences.length > 1 ? 's' : ''
      } containing over 30 words.`
    });
  } else {
    suggestions.push({
      type: 'success',
      category: 'Sentence Length',
      text: 'Sentence lengths are well-proportioned with no overly long sentences.'
    });
  }

  if (repeatedWords.length > 0) {
    const topRepeated = repeatedWords.slice(0, 2).map(r => `"${r.word}" (${r.count}x)`).join(', ');
    suggestions.push({
      type: 'warning',
      category: 'Word Repetition',
      text: `Reduce frequent repetition of words like ${topRepeated} using scholarly synonyms.`
    });
  } else {
    suggestions.push({
      type: 'success',
      category: 'Word Repetition',
      text: 'Vocabulary distribution is balanced with minimal repetitive phrasing.'
    });
  }

  if (totalFillerCount > 0) {
    const topFillers = fillerWords.slice(0, 3).map(f => `"${f.word}"`).join(', ');
    suggestions.push({
      type: 'warning',
      category: 'Academic Tone',
      text: `Remove ${totalFillerCount} casual filler word${
        totalFillerCount > 1 ? 's' : ''
      } (e.g. ${topFillers}) to reinforce academic formality.`
    });
  } else {
    suggestions.push({
      type: 'success',
      category: 'Academic Tone',
      text: 'No informal filler words detected; academic tone is sharp and direct.'
    });
  }

  if (totalExcessive > 0) {
    suggestions.push({
      type: 'warning',
      category: 'Punctuation',
      text: `Clean up ${totalExcessive} instances of repeated informal punctuation (e.g., "!!", "??", "...").`
    });
  } else {
    suggestions.push({
      type: 'success',
      category: 'Punctuation',
      text: 'Standard academic punctuation used consistently.'
    });
  }

  if (varietyRating === 'Low' && sentences.length >= 4) {
    suggestions.push({
      type: 'info',
      category: 'Sentence Variety',
      text: 'Sentence length variety is low. Alternate between concise statements and compound analytical sentences.'
    });
  } else if (varietyRating === 'Balanced') {
    suggestions.push({
      type: 'success',
      category: 'Sentence Variety',
      text: 'Good rhythmic pacing with a balanced blend of sentence lengths.'
    });
  }

  return {
    overallScore,
    categories: {
      vocabulary: vocabScore,
      sentenceStructure: structureScore,
      repetition: repetitionScore,
      readability: readabilityScore,
      punctuation: punctuationScore
    },
    longSentences,
    repeatedWords,
    fillerWords,
    totalFillerCount,
    excessivePunctuation,
    sentenceVariety: {
      avgLength: Math.round(avgLength * 10) / 10,
      stdDev,
      varietyRating
    },
    suggestions
  };
}
