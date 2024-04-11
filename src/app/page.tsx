"use client";

import { useState } from "react";

import numbers from "./numbers.json";
import { ResponseChoice } from "./Presenters/Game";
import GamePresenter from "./Presenters/Game";

type GameChoice =
  | "number2person"
  | "person2number"
  | "number2action"
  | "action2number"
  | "number2thing"
  | "thing2number";

const GAME_CHOICES: Record<GameChoice, string> = {
  number2person: "Number -> Person",
  person2number: "Person -> Number",
  number2action: "Number -> Action",
  action2number: "Action -> Number",
  number2thing: "Number -> Thing",
  thing2number: "Thing -> Number",
};

function getResponseChoices(gameChoice: GameChoice): ResponseChoice[] {
  return numbers.map((item) => {
    switch (gameChoice) {
      case "number2person":
        return {
          question: item.id,
          answer: item.person,
        };
      case "person2number":
        return {
          question: item.person,
          answer: item.id,
        };
      case "number2action":
        return {
          question: item.id,
          answer: item.verb,
        };
      case "action2number":
        return {
          question: item.verb,
          answer: item.id,
        };
      case "number2thing":
        return {
          question: item.id,
          answer: item.thing,
        };
      case "thing2number":
        return {
          question: item.thing,
          answer: item.id,
        };
      default:
        return {
          question: item.id,
          answer: item.person,
        };
    }
  });
}

export default function Home() {
  const [gameChoice, setGameChoice] = useState<GameChoice>("number2person");
  const responseChoices = getResponseChoices(gameChoice);

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
        <form className="flex flex-col gap-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Pick a category
            <select
              value={gameChoice}
              onChange={(e) => setGameChoice(e.target.value as GameChoice)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {Object.entries(GAME_CHOICES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val}
                </option>
              ))}
            </select>
          </label>

          <button
            className="rounded-lg p-4 bg-purple-700"
            onClick={() => setStarted(true)}
          >
            Let{"'"}s Go! ({GAME_DURATION}s)
          </button>
        </form>
      )}
    </main>
  );
}
