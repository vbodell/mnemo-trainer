"use client";

import { useState, useEffect } from "react";
import classNames from "classnames";

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
        <button onClick={() => setGameOver(false)}>
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
      <div>{question}</div>
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
      "border border-white rounded",
      hasAnswered && isCorrectAnswer(id)
        ? "bg-green-100"
        : isSelectedAnswer(id)
          ? "bg-red-100"
          : "bg-blue-100",
      !hasAnswered && "bg-blue-100",
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
  const opts = [
    { id: "00", person: "Alvina" },
    { id: "01", person: "Frodo" },
    { id: "02", person: "Churchill" },
    { id: "03", person: "Gustav L" },
    { id: "04", person: "Pontus" },
    { id: "05", person: "Kung David" },
    { id: "06", person: "Gollum" },
    { id: "07", person: "Bond" },
    { id: "08", person: "Sherlock" },
    { id: "09", person: "Gandalf" },
    { id: "10", person: "Millimeter" },
    { id: "11", person: "Billy" },
    { id: "12", person: "London (Petrus)" },
    { id: "13", person: "Spartacus (Paulus) " },
    { id: "14", person: "Gimli" },
    { id: "15", person: "Biff" },
    { id: "16", person: "Qui-Gon" },
    { id: "17", person: "Veronica Maggio" },
    { id: "18", person: "Carl Bodell" },
    { id: "19", person: "Tim Roth (1900)" },
    { id: "20", person: "Roger" },
    { id: "21", person: "Kevin Spacey" },
    { id: "22", person: "Farfar" },
    { id: "23", person: "Donkey Kong" },
    { id: "24", person: "Kalle Anka" },
    { id: "25", person: "Obama" },
    { id: "26", person: "Michael League" },
    { id: "27", person: "Superman" },
    { id: "28", person: "Lisbeth Salander" },
    { id: "29", person: "Roy" },
    { id: "30", person: "Ante" },
    { id: "31", person: "Joey" },
    { id: "32", person: "Richard Page" },
    { id: "33", person: "J.D." },
    { id: "34", person: "Super Mario" },
    { id: "35", person: "Emil i Lönneberga" },
    { id: "36", person: "Einstein" },
    { id: "37", person: "Tuna" },
    { id: "38", person: "Yoshi" },
    { id: "39", person: "Dyrsén" },
    { id: "40", person: "House" },
    { id: "41", person: "Kapten Jörgen" },
    { id: "42", person: "Marvin (roboten)" },
    { id: "43", person: "Frank Sinatra" },
    {
      id: "44",
      person: "William Bodell",
    },
    {
      id: "45",
      person: "Hitler",
    },
    {
      id: "46",
      person: "Märta",
    },
    {
      id: "47",
      person: "GW",
    },
    {
      id: "48",
      person: "Maya-indian",
    },
    {
      id: "49",
      person: "Askungen",
    },
    {
      id: "50",
      person: "Hans Andréasson",
    },
    {
      id: "51",
      person: "Dustin Hoffman (rainman)",
    },
    {
      id: "52",
      person: "Forrest Gump",
    },
    {
      id: "53",
      person: "Zlatan",
    },
    {
      id: "54",
      person: "Legolas",
    },
    {
      id: "55",
      person: "Doc Emmet L Brown",
    },
    {
      id: "56",
      person: "Törnrosa",
    },
    {
      id: "57",
      person: "Fagen",
    },
    {
      id: "58",
      person: "Farmor Hjördis",
    },
    {
      id: "59",
      person: "Miles Davis",
    },
    {
      id: "60",
      person: "Mamma",
    },
    {
      id: "61",
      person: "Sam Winchester",
    },
    {
      id: "62",
      person: "Pappa",
    },
    {
      id: "63",
      person: "Bobby",
    },
    {
      id: "64",
      person: "Link",
    },
    {
      id: "65",
      person: "Abraham Lincoln",
    },
    {
      id: "66",
      person: "Justin Timberlake",
    },
    {
      id: "67",
      person: "Dean Winchester",
    },
    {
      id: "68",
      person: "Erik Jonasson",
    },
    {
      id: "69",
      person: "Austin Powers",
    },
    {
      id: "70",
      person: "Johannes av korset",
    },
    {
      id: "71",
      person: "Henke Lundqvist",
    },
    {
      id: "72",
      person: "Jim Carrey",
    },
    {
      id: "73",
      person: "Vanheden",
    },
    {
      id: "74",
      person: "Chandler Bing",
    },
    {
      id: "75",
      person: "Sickan",
    },
    {
      id: "76",
      person: "Castiel",
    },
    {
      id: "77",
      person: "Jesus",
    },
    {
      id: "78",
      person: "John Travolta",
    },
    {
      id: "79",
      person: "Karlsson på taket",
    },
    {
      id: "80",
      person: "Sting",
    },
    {
      id: "81",
      person: "Leonardo DiCaprio",
    },
    {
      id: "82",
      person: "Barney Stinson",
    },
    {
      id: "83",
      person: "MJ",
    },
    {
      id: "84",
      person: "Mormor Iggy",
    },
    {
      id: "84",
      person: "Mormor Iggy",
    },
    {
      id: "85",
      person: "Marty McFly",
    },
    {
      id: "86",
      person: "Elwood Blues",
    },
    {
      id: "87",
      person: "Whitney Houston",
    },
    {
      id: "88",
      person: "Claes Eriksson",
    },
    {
      id: "89",
      person: "Oscar Bodell",
    },
    {
      id: "90",
      person: "DaVinci",
    },
    {
      id: "91",
      person: "Sofie Sundell",
    },
    {
      id: "92",
      person: "Anders Götvall",
    },
    {
      id: "93",
      person: "Jag",
    },
    {
      id: "94",
      person: "Hagrid",
    },
    {
      id: "95",
      person: "Ch",
    },
    {
      id: "96",
      person: "Hermione",
    },
    {
      id: "97",
      person: "Harry Potter",
    },
    {
      id: "98",
      person: "CS Lewis",
    },
    {
      id: "99",
      person: "David Paich",
    },
  ];

  const responseChoices: ResponseChoice[] = opts.map(({ id, person }) => ({
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
        <button onClick={() => setStarted(true)}>
          Let's Go! ({GAME_DURATION}s)
        </button>
      )}
    </main>
  );
}
