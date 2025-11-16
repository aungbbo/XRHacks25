// src/App.tsx
import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { FocusGoalBar } from './components/FocusGoalBar'
import { LandingScreen } from './components/LandingScreen'
import { StickerNote } from './components/StickerNote'
import { MusicApp } from './components/MusicApp'
import { NoteDetailView } from './components/NoteDetailView'
import MusicPlayerSceneWrapper from './MusicPlayerSceneWrapper'
import './App.css'
import SecondPage from './SecondPage'

// WebSpatial injects this; declare so TS doesn't complain
declare const __XR_ENV_BASE__: string

const SUBJECTS: Array<{ name: string; theme: 'pink' | 'blue' | 'purple' | 'yellow' | 'green' }> = [
  { name: 'Maths', theme: 'pink' },
  { name: 'Engineering', theme: 'blue' },
  { name: 'Physics', theme: 'purple' },
  { name: 'Biology', theme: 'yellow' },
  { name: 'History', theme: 'green' },
]

/** Main board scene ("/") */
function MainScene({ onToggleMusic, onBackToWelcome, animateTaskCards }: { onToggleMusic: () => void; onBackToWelcome: () => void; animateTaskCards: boolean }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [focusItems, setFocusItems] = useState([
    { id: 1, text: 'Review user feedback', completed: true },
    { id: 2, text: 'Update wireframes', completed: false },
    { id: 3, text: 'Prototype new interaction', completed: false },
    { id: 4, text: 'Schedule team sync', completed: false },
    { id: 5, text: 'Research AR best practices', completed: false },
  ])

  const toggleFocusItem = (id: number) => {
    setFocusItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  // If a subject is selected, show only the note detail view (full screen)
  if (selectedSubject) {
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
        className="relative min-h-screen pt-24"
        style={{ perspective: '2000px' }}
      >
        {/* TOP LEFT: Back to Welcome Button */}
        <div
          className="absolute top-8 left-8 z-20"
          style={{ transform: 'translateZ(50px)' }}
        >
            <button
            onClick={onBackToWelcome}
            className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-colors shadow-lg"
              type="button"
            >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Welcome</span>
            </button>
          </div>

        {/* TOP RIGHT: Music App - Always visible */}
        <div
          className="absolute top-8 right-8 z-20"
          style={{ transform: 'translateZ(50px)' }}
        >
          <MusicApp onClick={onToggleMusic} />
        </div>

        {/* CENTER: Focus Goal Bar and Sticker Notes */}
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
          {/* Focus Goal Bar */}
          <div style={{ transform: 'translateZ(50px)' }}>
            <FocusGoalBar items={focusItems} onToggle={toggleFocusItem} />
          </div>

          {/* Sticker Notes */}
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
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [animateTaskCards, setAnimateTaskCards] = useState(false)
  const cardAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleMusicPlayer = () => {
    setShowMusicPlayer(prev => !prev)
  }

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

  if (!hasEntered) {
    return <LandingScreen onEnter={handleEnter} />
  }

  return (
    <>
      {/* Music Player Scene - Independent and Draggable (rendered outside Router) */}
      {showMusicPlayer && (
        <MusicPlayerSceneWrapper
          onClose={() => setShowMusicPlayer(false)}
        />
      )}
      
      <Router basename={__XR_ENV_BASE__}>
        <Routes>
          <Route path="/second-page" element={<SecondPage />} />
          <Route path="/" element={<MainScene onToggleMusic={toggleMusicPlayer} onBackToWelcome={handleBackToWelcome} animateTaskCards={animateTaskCards} />} />
        </Routes>
      </Router>
    </>
  )
}
