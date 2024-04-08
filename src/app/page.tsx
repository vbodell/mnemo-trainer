"use client";

import { useState} from "react";

import numbers from "./numbers.json";
import { ResponseChoice } from "./Presenters/Game";
import GamePresenter from "./Presenters/Game";

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
          <form className="flex flex-col gap-5">
        <label> Pick a category
            <select>
                <option value="person">Person</option>
                <option value="verb">Verb</option>
                <option value="thing">Thing</option>
            </select>
            </label>
        <button className="rounded-lg p-4 bg-purple-700" onClick={() => setStarted(true)}>
          Let{"'"}s Go! ({GAME_DURATION}s)
        </button>
            </form>
      )}
    </main>
  );
}
