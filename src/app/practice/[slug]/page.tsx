"use client";

import { useState } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import classNames from "classnames";
import { useGameTracker } from "../../../hooks/useGameTracker";

const SUITS = ["H", "D", "C", "S"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

interface Card {
  suit: string;
  value: string;
  code: string;
}

function generateDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, code: `${value}${suit}` });
    }
  }
  return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

function getCardDisplayName(card: Card): string {
  const suitIcons: Record<string, string> = {
    H: "♥",
    D: "♦",
    C: "♣",
    S: "♠",
  };
  return `${card.value}${suitIcons[card.suit]}`;
}

function getCardColor(card: Card): string {
  return card.suit === "H" || card.suit === "D" ? "text-red-600" : "text-black";
}

export default function PracticeGame({ params }: { params: { slug: string } }) {
  if (params.slug === "deck-of-cards") {
    return <DeckOfCardsGame />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold">Game not found</h1>
    </div>
  );
}

function DeckOfCardsGame() {
  const [phase, setPhase] = useState<"intro" | "memorize" | "recall" | "eval">("intro");
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");

  const tracker = useGameTracker({
    gameSlug: "deck-of-cards",
    mode: "manual_start"
  });

  const startGame = () => {
    setDeck(shuffleDeck(generateDeck()));
    setCurrentIndex(0);
    setPhase("memorize");
    tracker.startGame();
  };

  const nextCard = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPhase("recall");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("eval");
    
    // Calculate Score
    const expectedLines = deck.map((c) => c.code);
    const actualLines = userInput.toLowerCase().split('\n').map(l => l.trim());
    
    let correctCount = 0;
    expectedLines.forEach((code, idx) => {
        if (actualLines[idx] && actualLines[idx] === code.toLowerCase()) {
            correctCount++;
        }
    });

    tracker.saveResult({
        score: correctCount,
        totalItems: 52,
        metadata: { phase: "eval" }
    });
  };

  const expectedText = deck.map((c) => c.code).join("\n").toLowerCase();
  const actualText = userInput.toLowerCase(); // normalize input

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 lg:p-24">
      {phase === "intro" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Deck of Cards Practice</h1>
          <p className="mb-8 text-lg">
            Memorize a shuffled deck of 52 cards.
            <br />
            Click to advance through the cards.
            <br />
            Then, type them back in order.
          </p>
          <button onClick={startGame} className="btn-primary">
            Start Game
          </button>
        </div>
      )}

      {phase === "memorize" && (
        <div className="flex flex-col items-center justify-center h-full w-full flex-grow cursor-pointer" onClick={nextCard}>
           <div className="mb-4 text-xl text-gray-500">
            Card {currentIndex + 1} / {deck.length}
          </div>
          <div className="flex flex-col items-center justify-center border-4 border-gray-300 rounded-xl w-64 h-96 bg-white shadow-2xl select-none hover:scale-105 transition-transform">
            <span className={classNames("text-6xl font-bold", getCardColor(deck[currentIndex]))}>
              {getCardDisplayName(deck[currentIndex])}
            </span>
            <span className="mt-4 text-gray-400 text-sm">
              ({deck[currentIndex].code})
            </span>
          </div>
          <p className="mt-8 text-gray-500 animate-pulse">Click anywhere to next</p>
        </div>
      )}

      {phase === "recall" && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full md:w-2/3 lg:w-1/2 h-full">
           <h2 className="text-2xl font-bold text-center">Recall the Deck</h2>
           <p className="text-sm text-gray-600 dark:text-gray-400">
             Enter one card per line using short form (e.g., 2H, 10S, KC, AD).
             <br/>
             Case insensitive.
           </p>
          <textarea
            className="flex-grow p-4 text-lg font-mono bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="AH\n2S\n..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          ></textarea>
          <button type="submit" className="btn-primary">
            Submit
          </button>
        </form>
      )}

      {phase === "eval" && (
        <div className="w-full">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Results</h2>
              <button onClick={() => setPhase("intro")} className="btn-primary">
                Play Again
              </button>
           </div>
          <ReactDiffViewer
            oldValue={expectedText}
            newValue={actualText}
            compareMethod={DiffMethod.WORDS}
            leftTitle="Actual Deck"
            rightTitle="Your Recall"
          />
        </div>
      )}
    </main>
  );
}
