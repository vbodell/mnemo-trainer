"use client";

import { useState } from "react";

import lists from "../../data/lists.json";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

export default function Lists() {
  const [started, setStarted] = useState<boolean>(false);

  console.log(lists)
  const titles = lists.map(({title}) => title).sort();
  const [listTitle, setListTitle] = useState<string>(titles[0]);

  const listKey = lists.find((l) => l.title === listTitle)?.key;
  const placeholder = lists.find((l) => l.title === listTitle)?.placeholder;
  const entries = lists.find((l) => l.title === listTitle)?.entries;

  const cleanBaseText = mapEntriesToText(listKey, entries);
  const [inputText, setInputText] = useState<string>("");

  function mapEntriesToText(listTitle: string, entries: any[]) {
    const rulers = ["presidents", "primes", "kings"];
    const isRulerList = rulers.includes(listKey);
    return isRulerList ? mapRulersToText(entries) : mapCountriesToText(entries);
  }

  function mapRulersToText(rulers: any[]): string {
    const rows = rulers.map(e => `${e.name},${e.began_rule}`);
    return rows.join('\n').toLowerCase();
  }
  
  function mapCountriesToText(countries: any[]): string {
    const rows = countries.map(e => `${e.country},${e.population}`);
    return rows.join('\n').toLowerCase();
  }
  
  function cleanText(text: string | undefined): string {
    if (typeof text === "undefined") return "";
    let cleaned = text.toLowerCase();
    return cleaned;
  }

  function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const inputText = formJson["input"].toString();
    setInputText(cleanText(inputText));
    setStarted(true);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16 lg:p-24">
      {started ? (
        <>
          <ReactDiffViewer
            oldValue={cleanBaseText}
            newValue={inputText}
            compareMethod={DiffMethod.WORDS}
            leftTitle="Original"
            rightTitle="Submitted"
          />
          <button onClick={() => setStarted(false)} className="btn-primary">
            Reset
          </button>
        </>
      ) : (
        <form
          className="flex flex-col gap-6 w-full md:w-2/3 lg:w-1/2"
          method="post"
          onSubmit={handleSubmit}
        >
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Pick a list
            <select
              name="intitle"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value.toString())}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {titles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Write the list with values separated by comma and entries by newline.
            <textarea
              rows={8}
              name="input"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={`${placeholder}...`}
            ></textarea>
          </label>
          <button className="btn-primary">Submit</button>
        </form>
      )}
    </main>
  );
}
