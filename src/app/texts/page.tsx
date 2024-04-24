"use client";

import { useState } from "react";

import texts from "../../data/texts.json";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

export default function Home() {
  const [started, setStarted] = useState<boolean>(false);

  let tags = texts.map(({ tags }) => tags).flat();
  tags = Array.from(new Set(tags));
  tags.unshift("All"); // All categories magic value
  const [activeTag, setActiveTag] = useState<string>(tags[0]);

  const titles = texts
    .filter(({ tags }) => activeTag === "All" || tags.includes(activeTag))
    .map(({ title }) => title)
    .sort();
  const [textTitle, setTextTitle] = useState<string>(titles[0]);

  const baseText = texts.find((text) => text.title === textTitle)?.text;
  const cleanBaseText = cleanText(baseText);
  const [inputText, setInputText] = useState<string>("");

  function cleanText(text: string | undefined): string {
    if (typeof text === "undefined") return "";
    const replaceChars = ";:,.?".split("");
    let cleaned = text.trim().toLowerCase();
    cleaned = replaceChars.reduce(
      (replaced, char) => replaced.replaceAll(char, ""),
      cleaned,
    );
    cleaned = cleaned.replaceAll("\n", " ");
    cleaned = cleaned.replaceAll(" - ", " ");
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
            Select a category
            <select
              name="tag"
              value={activeTag}
              onChange={(e) => setActiveTag(e.target.value.toString())}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
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
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Write as much as you can remember:
            <textarea
              rows={8}
              name="input"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={`${textTitle}...`}
            ></textarea>
          </label>
          <button className="btn-primary">Submit</button>
        </form>
      )}
    </main>
  );
}
