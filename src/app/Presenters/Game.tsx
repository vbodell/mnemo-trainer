import { useState, useEffect } from "react";

import QuestionPresenter from "../Presenters/QuestionPresenter";

interface GameProps {
  responseChoices: ResponseChoice[];
  gameDurationInSec: number;
}

export interface ResponseChoice {
  question: string;
  answer: string;
}

export default function GamePresenter({
  responseChoices,
  gameDurationInSec,
}: GameProps) {
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setGameOver(true),
      gameDurationInSec * 1000,
    );
    return () => clearTimeout(timeoutId);
  }, [gameOver, gameDurationInSec]);

  const shuffledOpts = [...responseChoices].sort(() => Math.random() - 0.5);
  const randomOpts = shuffledOpts.slice(0, 9);

  const randomIndex = Math.floor(Math.random() * randomOpts.length);
  const question = randomOpts[randomIndex].question;

  function resetGame() {
    setGameOver(false);
    setScore(0);
    setAnsweredQuestions(0);
  }

  function answerSubmitted(wasCorrect: boolean, clearAnswer: () => void) {
    setTimeout(() => {
      setAnsweredQuestions(answeredQuestions + 1);
      if (wasCorrect) setScore(score + 1);
      clearAnswer();
    }, 200);
  }

  return (
    <>
      <p>
        {score} / {answeredQuestions}
      </p>
      {gameOver ? (
        <button
          className="rounded-lg p-4 bg-purple-700 hover:bg-purple-600"
          onClick={resetGame}
        >
          Go again! ({gameDurationInSec}s)
        </button>
      ) : (
        <QuestionPresenter
          question={question}
          choices={randomOpts}
          answerSubmitted={answerSubmitted}
        />
      )}
    </>
  );
}
