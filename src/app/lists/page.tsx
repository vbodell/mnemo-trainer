"use client";

import { useState } from "react";

import lists from "../../data/lists.json";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

export default function Home() {
  const [submitted, setSubmitted] = useState<boolean>(false);

  // TODO: properly extract and map data structure?
  // also include friendly names
  const listTitles = Object.keys(lists);
  const defaultListTitle = listTitles[0];
  const [listTitle, setListTitle] = useState<string>(defaultListTitle);

  const listAttributes = Object.keys(lists[listTitle][0]);
  const [listAttribute, setListAttribute] = useState<string>(listAttributes[0]);

  const listText = lists[listTitle]
    .reduce((text, listEntry) => `${text}\n${listEntry[listAttribute]}`, "")
    .toLowerCase();
  const [inputText, setInputText] = useState<string>("");

  function updateListSelect(listKey: string) {
    setListTitle(listKey);
    const listAttributes = Object.keys(lists[listKey][0]);
    setListAttribute(listAttributes[0]);
  }

  function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const inputText = formJson["input"].toString();
    setInputText(inputText.toLowerCase().replaceAll(",", "\n"));
    setSubmitted(true);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {submitted ? (
        <>
          <ReactDiffViewer
            oldValue={listText}
            newValue={inputText}
            compareMethod={DiffMethod.WORDS}
          />
          <button onClick={() => setSubmitted(false)} className="btn-primary">
            Reset
          </button>
        </>
      ) : (
        <form
          className="flex flex-col gap-6 w-1/2"
          method="post"
          onSubmit={handleSubmit}
        >
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Pick a list
            <select
              name="intitle"
              value={listTitle}
              onChange={(e) => updateListSelect(e.target.value.toString())}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {listTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select an attribute to list
            <select
              name="attribute"
              value={listAttribute}
              onChange={(e) => setListAttribute(e.target.value.toString())}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {listAttributes.map((attribute) => (
                <option key={attribute} value={attribute}>
                  {attribute}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Write each entry separated by newlines (commas will be coerced to
            newlines):
            <textarea
              rows={8}
              name="input"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Affe,Berra,Cirre..."
            ></textarea>
          </label>
          <button className="btn-primary">Submit</button>
        </form>
      )}
    </main>
  );
}
