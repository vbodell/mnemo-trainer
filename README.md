# Mnemo Trainer

Mnemo Trainer is a web application designed to help you practice and improve your mnemonic skills. It provides various tools and games to train different aspects of memory, such as memorizing numbers, lists, texts, and decks of cards.

## Features

### 🧠 Numbers
Practice your Major System or PAO (Person-Action-Object) system.
- **Modes:** Convert Number -> Person, Person -> Number, Number -> Action, etc.
- **Timed Mode:** Race against the clock to translate as many items as possible in 60 seconds.

### 📜 Lists
Memorize and recall pre-defined lists of facts.
- **Includes:** US Presidents, Swedish Kings, Prime Ministers, Populations, etc.
- **Evaluation:** Compare your input against the correct list using a diff viewer.

### 📖 Texts
Practice verbatim memorization of short texts or speeches.
- **Evaluation:** Word-by-word diff comparison to check your accuracy.

### 🃏 Practice (Deck of Cards)
A simulator for memorizing a shuffled deck of 52 cards.
- **Memorize Phase:** Click through the deck one card at a time.
- **Recall Phase:** Type back the cards in order (e.g., "AH", "2S", "KC").
- **Evaluation:** Instant feedback on your sequence accuracy.

## Analytics 📊

The application tracks your performance to help you see improvements over time. Game results (duration, score, accuracy) are streamed to **Google BigQuery** for storage and analysis.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Analytics:** Google BigQuery
- **Deployment:** Google Cloud Run

## Getting Started

### Prerequisites

- Node.js
- pnpm
- A Google Cloud Project (for Analytics)

### Installation

```bash
git clone <repository-url>
cd mnemo-trainer
pnpm install
```

### Running Locally

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Deployment

This application is designed to run on **Google Cloud Run**.

1.  Build the container:
    ```bash
    docker build -t gcr.io/[PROJECT_ID]/mnemo-trainer .
    ```
2.  Push to Container Registry:
    ```bash
    docker push gcr.io/[PROJECT_ID]/mnemo-trainer
    ```
3.  Deploy to Cloud Run:
    ```bash
    gcloud run deploy mnemo-trainer --image gcr.io/[PROJECT_ID]/mnemo-trainer --platform managed
    ```
