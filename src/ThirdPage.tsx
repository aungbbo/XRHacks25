// src/ThirdPage.tsx
import React from 'react'
import './App.css'

export default function ThirdPage() {
  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">CS106B – Lecture Hub</h2>
        <p className="text-xs text-white/70">
          Quick snapshots of recent lectures and course news.
        </p>
      </div>

      {/* Today’s lecture card */}
      <div className="rounded-2xl bg-white/10 px-4 py-3 space-y-2">
        <h3 className="text-sm font-semibold">Today’s Lecture: Recursion & Backtracking</h3>
        <p className="text-xs text-white/80">
          We walked through how recursive functions build up a call stack and how
          backtracking lets us explore search spaces (like mazes or subsets)
          while undoing partial choices.
        </p>
        <ul className="text-xs list-disc list-inside text-white/75 space-y-1">
          <li>Base cases vs. recursive cases</li>
          <li>Recursive tree diagrams for understanding flow</li>
          <li>Backtracking pattern: choose → explore → un-choose</li>
        </ul>
      </div>

      {/* Recent lecture blurbs */}
      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-2xl bg-white/10 px-4 py-3">
          <h4 className="text-xs font-semibold mb-1">
            Lecture: Big-O & Algorithm Efficiency
          </h4>
          <p className="text-xs text-white/75">
            Compared algorithms like selection sort and merge sort, and talked
            about why asymptotic analysis matters more than constant factors.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 px-4 py-3">
          <h4 className="text-xs font-semibold mb-1">
            Lecture: Abstract Data Types (ADTs)
          </h4>
          <p className="text-xs text-white/75">
            Introduced stacks, queues, and maps as abstractions. Emphasis on
            “what they do” instead of “how they’re implemented” so we can swap
            in different data structures later.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 px-4 py-3">
          <h4 className="text-xs font-semibold mb-1">
            Lecture: Trees & Recursive Traversals
          </h4>
          <p className="text-xs text-white/75">
            Looked at binary trees, pre/in/post-order traversals, and how
            recursive structure of trees matches the shape of recursive code.
          </p>
        </div>
      </div>

      {/* Newsletter / announcements */}
      <div className="rounded-2xl bg-white/10 px-4 py-3 space-y-2">
        <h3 className="text-sm font-semibold">Course Newsletter</h3>
        <ul className="text-xs text-white/80 space-y-1">
          <li>• Section this week will focus on recursion tracing practice.</li>
          <li>• Problem Set 3 (Backtracking) is out – start early 👀</li>
          <li>• Office Hours extended on Sunday 7–9pm before the PS3 deadline.</li>
          <li>• Extra credit: try re-implementing a favorite algorithm with recursion only.</li>
        </ul>
      </div>
    </div>
  )
}