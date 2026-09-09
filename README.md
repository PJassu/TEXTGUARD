# TEXTGUARD — Smart Academic Text Analyzer

> "Summarize, compare, analyze and improve your academic text — completely in your browser."

A modern, responsive, 100% client-side academic text analysis platform designed for university students, educators, and technical viva presentations. Runs entirely within the browser with zero backend, database, or external AI API requirements.

---

## 🌟 Key Features

1. **Smart Extractive Summarizer**:
   - Frequency-based sentence scoring with length damping.
   - Adjustable summary length ratios: Short (20%), Medium (30%), Detailed (40%).
   - Preserves original author sentence text and natural chronological sequence.
   - Copy to clipboard & download as `.txt`.

2. **Document Similarity Checker (Cosine Vector Model)**:
   - Evaluates mathematical token overlap between two documents using the Vector Space Model.
   - Stop-word pruning and union vocabulary mapping.
   - Outputs Cosine Similarity percentage and classification (*Very Low*, *Low*, *Moderate*, *High*, *Very High*).
   - Detailed breakdown of common words, unique terms in Doc A, unique terms in Doc B, and vector metrics.
   - Ethical academic disclaimer explaining that similarity measures lexical overlap and does not prove plagiarism.

3. **Text Analyzer & Corpus Statistics**:
   - Instant calculation of total words, characters (with and without spaces), sentence count, paragraph count, unique words, average sentence length, longest sentence, average word length, and estimated reading time.
   - Top 10-15 meaningful keywords with interactive drilldown showing percentage of content and sentence context occurrences.

4. **Rule-Based Writing Quality Analysis**:
   - Deterministic rule engine calculating an overall writing score out of 100.
   - Flags long sentences (> 30 words), overused words (> 2.5%), informal filler words (*very, really, basically, actually, just*), excessive punctuation (*!!, ??, ...*), and sentence length variety.
   - Transparent category ratings: Vocabulary, Sentence Structure, Repetition, Readability, and Punctuation.

5. **Full Academic Analysis Report**:
   - Compiles text statistics, summaries, keywords, writing quality diagnostics, and similarity comparisons into an academic report.
   - One-click `.txt` download and clipboard copy.

6. **Viva & Presentation Guide**:
   - Built-in technical documentation explaining formulas, data structures, and model answers to anticipated viva questions.

---

## 🧮 Core Algorithms Explained

### 1. Extractive Frequency Summarization
$$\text{SentenceScore}(S) = \frac{1}{|S|^{0.75}} \sum_{w \in S, w \notin \text{StopWords}} \frac{\text{TF}(w)}{\max(\text{TF})}$$
* Words are tokenized, normalized to lowercase, and filtered against an academic stop-word list.
* Term frequencies ($\text{TF}$) are computed and normalized.
* Each sentence is scored based on the normalized frequency of its content words, normalized by length to prevent run-on bias.
* The top $k$ sentences are chosen and sorted back into original document order.

### 2. Cosine Similarity (Vector Space Model)
$$\cos(\theta) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \times \|\vec{B}\|} = \frac{\sum_{i=1}^n A_i B_i}{\sqrt{\sum_{i=1}^n A_i^2} \times \sqrt{\sum_{i=1}^n B_i^2}}$$
* Documents are converted into sparse term-frequency vectors over their union vocabulary.
* The dot product computes co-occurrence weights.
* Magnitudes normalize for document length.
* Output is converted into a 0%–100% similarity score.

### 3. HashMap Frequency Counting
* Implemented using modern JavaScript `Map` objects, providing $O(1)$ amortized lookup, insertion, and update equivalent to Java `java.util.HashMap`.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```
This compiles a static production build into the `dist/` folder.

---

## 🌐 Netlify Deployment Guide

TEXTGUARD is designed as a pure client-side SPA with zero server dependencies, making it 100% compatible with Netlify.

### Option A: Netlify CLI
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy dist folder
netlify deploy --prod --dir=dist
```

### Option B: Netlify Web Dashboard (GitHub / Drag & Drop)
1. Push this repository to GitHub or GitLab.
2. Log in to [Netlify](https://app.netlify.com).
3. Click **"Add new site"** → **"Import an existing project"**.
4. Configure the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **"Deploy Site"**. Your application will be live in seconds!

---

## 💻 Tech Stack & Data Structures

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Data Structures:**
  - `Map` (HashMap equivalent for $O(1)$ term frequencies)
  - `Set` (Fast $O(1)$ stop-word filtration & union vocabulary)
  - `Array` (Sentence ordering and keyword sorting)
  - `RegEx` (Tokenization, word boundaries, and punctuation detection)
  - `FileReader API` & `Blob` (Local file processing with zero network latency)
- **Zero External Dependencies:** No external AI APIs, no databases, no analytics trackers, no user accounts. 100% private and offline-capable.
