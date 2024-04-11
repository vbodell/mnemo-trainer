"use client";

import { useState } from "react";

import numbers from "../data/numbers.json";
import texts from "../data/texts.json";
import { ResponseChoice } from "./Presenters/Game";
import GamePresenter from "./Presenters/Game";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

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

  // TODO
  console.log(texts);
  const titles = texts.map(({ title }) => title);
  const [textTitle, setTextTitle] = useState<string>(titles[0]);
  const baseText = texts.filter((text) => text.title === textTitle)[0].text;
  const [inputText, setNewCode] = useState<string>("");

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    setNewCode(formJson["input"].toString());
    setStarted(true);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {started ? (
        // <GamePresenter
        //   responseChoices={responseChoices}
        //   gameDurationInSec={GAME_DURATION}
        // />
        <ReactDiffViewer
          oldValue={baseText}
          newValue={inputText}
          compareMethod={DiffMethod.WORDS}
        />
      ) : (
        // <form className="flex flex-col gap-5">
        //   <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        //     Pick a category
        //     <select
        //       value={gameChoice}
        //       onChange={(e) => setGameChoice(e.target.value as GameChoice)}
        //       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //     >
        //       {Object.entries(GAME_CHOICES).map(([key, val]) => (
        //         <option key={key} value={key}>
        //           {val}
        //         </option>
        //       ))}
        //     </select>
        //   </label>
        //
        //   <button
        //     className="rounded-lg p-4 bg-purple-700"
        //     onClick={() => setStarted(true)}
        //   >
        //     Let{"'"}s Go! ({GAME_DURATION}s)
        //   </button>
        <form method="post" onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Pick a title
            <select
              name="intitle"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value.toString())}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {titles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </label>
          <textarea name="input" />
          <button>Submit</button>
        </form>
      )}
    </main>
  );
}
