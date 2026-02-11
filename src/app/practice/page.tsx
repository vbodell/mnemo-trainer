'use client'
import Link from 'next/link'

export default function Practice() {
  const games = [
    ['Deck of Cards', '/practice/deck-of-cards'],
    ['Pi Digits', '/practice/pi-digits'],
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Practice Games</h1>
      <div className="grid grid-rows-4 w-3/4 sm:w-1/2 lg:grid-rows-1 lg:grid-cols-4 gap-4 text-center">
        {games.map(([title, url]) => (
          <Link key={url} href={url} className="btn-primary">
            {title}
          </Link>
        ))}
      </div>
    </main>
  )
}
