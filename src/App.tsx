// src/App.tsx
import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LandingScreen } from './components/LandingScreen'
import { StickerNote } from './components/StickerNote'
import { MusicApp } from './components/MusicApp'
import { NoteDetailView } from './components/NoteDetailView'
import { Planner } from './components/Planner'
import './App.css'
import SecondPage from './SecondPage'
import MusicScene from './MusicScene'

// WebSpatial injects this; declare so TS doesn't complain
declare const __XR_ENV_BASE__: string

const SUBJECTS: Array<{ name: string; theme: 'pink' | 'blue' | 'green' | 'yellow' | 'purple' }> = [
  { name: 'My Planner', theme: 'pink' },
  { name: 'Math', theme: 'blue' },
  { name: 'Chemistry', theme: 'green' },
  { name: 'Biology', theme: 'yellow' },
  { name: 'History', theme: 'purple' },
];

/** Main board scene ("/") */
function MainScene({ onBackToWelcome, animateTaskCards }: { onBackToWelcome: () => void; animateTaskCards: boolean }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [focusItems, setFocusItems] = useState([
    { id: 1, text: 'Review class notes', completed: true },
    { id: 2, text: 'Outline project ideas', completed: false },
    { id: 3, text: 'Email study partner', completed: false },
  ])

  const [newFocusText, setNewFocusText] = useState('')

  const toggleFocusItem = (id: number) => {
    setFocusItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const addFocusItem = () => {
    const text = newFocusText.trim()
    if (!text) return
    setFocusItems(items => [
      ...items,
      { id: Date.now(), text, completed: false },
    ])
    setNewFocusText('')
  }

  const deleteFocusItem = (id: number) => {
    setFocusItems(items => items.filter(item => item.id !== id))
  }

  // If a subject is selected, show only the note detail view (full screen)
  if (selectedSubject) {
    // Special handling for "My Planner" - show the Planner component
    if (selectedSubject === 'My Planner') {
      return (
        <div
          className="min-h-screen"
          style={
            {
              '--xr-background-material': 'transparent',
              backgroundColor: 'transparent',
            } as React.CSSProperties
          }
          enable-xr
        >
          <Planner onClose={() => setSelectedSubject(null)} />
        </div>
      )
    }
    
    // For other subjects, show the regular NoteDetailView
    return (
      <div
        className="min-h-screen"
        style={
          {
            '--xr-background-material': 'transparent',
            backgroundColor: 'transparent',
          } as React.CSSProperties
        }
        enable-xr
      >
        <NoteDetailView
          subject={selectedSubject}
          onClose={() => setSelectedSubject(null)}
        />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={
        {
        '--xr-background-material': 'transparent',
        backgroundColor: 'transparent',
        } as React.CSSProperties
      }
      enable-xr
    >
      <div
        className="relative min-h-screen pt-32 pb-24"
        style={{ perspective: '2000px' }}
      >
        <div
          className="absolute top-8 left-0 right-0 z-20 flex items-center justify-between px-20"
          style={{ transform: 'translateZ(50px)' }}
        >
          <button
            onClick={onBackToWelcome}
            className="flex items-center gap-2 px-4 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-colors shadow-lg"
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl w-[320px] mx-8" enable-xr>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Focus To-Do</h3>
              <span className="text-xs text-white/60">
                {focusItems.filter(item => item.completed).length} of {focusItems.length} done
              </span>
            </div>

            <div className="space-y-3">
              {focusItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleFocusItem(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-colors ${
                    item.completed
                      ? 'border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/15'
                      : 'border-white/15 bg-white/5 hover:bg-white/10'
                  }`}
                  type="button"
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                      item.completed ? 'border-emerald-300 bg-emerald-500 text-white' : 'border-white/40 text-white/60'
                    }`}
                  >
                    {item.completed ? '✓' : ''}
                  </span>
                  <span className={`flex-1 text-sm ${item.completed ? 'line-through text-white/60' : 'text-white'}`}>
                    {item.text}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteFocusItem(item.id)
                    }}
                    className="text-xs text-white/50 hover:text-white cursor-pointer"
                  >
                    Remove
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={newFocusText}
                onChange={(e) => setNewFocusText(e.target.value)}
                placeholder="Add focus task..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40"
                onKeyDown={(e) => e.key === 'Enter' && addFocusItem()}
              />
              <button
                onClick={addFocusItem}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm"
                type="button"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex-shrink-0">
            <MusicApp />
          </div>
        </div>

        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <div style={{ transform: 'translateZ(60px)' }}>
            <div className="bubble-grid">
              {SUBJECTS.map((subject, index) => (
                <StickerNote
                  key={subject.name}
                  subject={subject.name}
                  theme={subject.theme}
                  delay={index * 0.3}
                  floating={animateTaskCards}
                  onClick={() => setSelectedSubject(subject.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Router wrapper with landing screen */
export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [animateTaskCards, setAnimateTaskCards] = useState(false)
  const cardAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startCardAnimation = () => {
    setAnimateTaskCards(true)
    if (cardAnimationTimeoutRef.current) {
      clearTimeout(cardAnimationTimeoutRef.current)
    }
    cardAnimationTimeoutRef.current = setTimeout(() => {
      setAnimateTaskCards(false)
      cardAnimationTimeoutRef.current = null
    }, 6000)
  }

  const handleEnter = () => {
    setHasEntered(true)
    startCardAnimation()
  }

  const handleBackToWelcome = () => {
    setHasEntered(false)
    setAnimateTaskCards(false)
    if (cardAnimationTimeoutRef.current) {
      clearTimeout(cardAnimationTimeoutRef.current)
      cardAnimationTimeoutRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (cardAnimationTimeoutRef.current) {
        clearTimeout(cardAnimationTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Router basename={__XR_ENV_BASE__}>
      <Routes>
        <Route path="/music" element={<MusicScene />} />
        <Route path="/second-page" element={<SecondPage />} />
        <Route
          path="/"
          element={
            hasEntered ? (
              <MainScene
                onBackToWelcome={handleBackToWelcome}
                animateTaskCards={animateTaskCards}
              />
            ) : (
              <LandingScreen onEnter={handleEnter} />
            )
          }
        />
      </Routes>
    </Router>
  )
}
