"use client";

export default function Home() {
  const nav = [
    ["Numbers", "/numbers"],
    ["Texts", "/texts"],
    ["Lists", "/lists"],
    ["Practice", "/practice"],
  ];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Pick a game</h1>
      <div className="grid grid-rows-4 w-3/4 sm:w-1/2 lg:grid-rows-1 lg:grid-cols-4 gap-4 text-center">
        {nav.map(([title, url]) => (
          <a key={url} href={url} className="btn-primary">
            {title}
          </a>
        ))}
      </div>
    </main>
  );
}
