"use client";

import { useState, useEffect } from "react";
import classNames from "classnames";

import numbers from "./numbers.json";

interface GameProps {
  responseChoices: ResponseChoice[];
  gameDurationInSec: number;
}

interface QuestionPresenterProps {
  question: string;
  choices: ResponseChoice[];
  answerSubmitted: (arg0: boolean, arg1: () => void) => void;
}

interface ResponseChoice {
  id: string;
  text: string;
}

interface ChoiceView {
  id: string;
  onClick: () => void;
  className: string;
  text: string;
  disabled: boolean;
}

interface QuestionViewProps {
  choices: ChoiceView[];
  question: string;
  choiceLayout: string;
}

function GamePresenter({ responseChoices, gameDurationInSec }: GameProps) {
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
  const question = randomOpts[randomIndex].id;

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
    }, 500);
  }

  return (
    <>
      <p>
        {score} / {answeredQuestions}
      </p>
      {gameOver ? (
        <button className="rounded-lg p-4 bg-purple-700" onClick={resetGame}>
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

function QuestionView({ question, choices, choiceLayout }: QuestionViewProps) {
  return (
    <>
      <div className="text-3xl">{question}</div>
      <div className={choiceLayout}>
        {choices.map((choice) => (
          <button
            key={choice.id}
            disabled={choice.disabled}
            onClick={choice.onClick}
            className={choice.className}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </>
  );
}

function QuestionPresenter({
  question,
  choices,
  answerSubmitted,
}: QuestionPresenterProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const hasAnswered = selectedAnswer !== "";

  function submitResponse(id: string) {
    setSelectedAnswer(id);
    answerSubmitted(isCorrectAnswer(id), () => setSelectedAnswer(""));
  }
  function isCorrectAnswer(id: string): boolean {
    return id === question;
  }
  function isSelectedAnswer(id: string): boolean {
    return id === selectedAnswer;
  }

  const choiceViews: ChoiceView[] = choices.map(({ id, text }) => ({
    id: id,
    disabled: hasAnswered,
    text: text,
    onClick: () => submitResponse(id),
    className: classNames(
      "rounded",
      "p-2",
      hasAnswered && isCorrectAnswer(id)
        ? "bg-green-700"
        : isSelectedAnswer(id)
          ? "bg-red-700"
          : "bg-purple-700",
      !hasAnswered && "bg-purple-700",
    ),
  }));
  const choiceLayout = "grid grid-cols-3 grid-rows-3 gap-2";

  return (
    <QuestionView
      question={question}
      choices={choiceViews}
      choiceLayout={choiceLayout}
    />
  );
}

export default function Home() {
  const responseChoices: ResponseChoice[] = numbers.map(({ id, person }) => ({
    id: id,
    text: person,
  }));

  const [started, setStarted] = useState<boolean>(false);
  const GAME_DURATION = 60;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {started ? (
        <GamePresenter
          responseChoices={responseChoices}
          gameDurationInSec={GAME_DURATION}
        />
      ) : (
        <button className="rounded-lg p-4 bg-purple-700" onClick={() => setStarted(true)}>
          Let{"'"}s Go! ({GAME_DURATION}s)
        </button>
      )}
    </main>
  );
}
