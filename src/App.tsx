// src/App.tsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FocusGoalBar } from './components/FocusGoalBar'
import { LandingScreen } from './components/LandingScreen'
import { StickerNote } from './components/StickerNote'
import { MusicScreen } from './components/MusicScreen'
import { MusicApp } from './components/MusicApp'
import { NoteDetailView } from './components/NoteDetailView'
import './App.css'
import SecondPage from './SecondPage'

// WebSpatial injects this; declare so TS doesn't complain
declare const __XR_ENV_BASE__: string

const SUBJECTS = [
  { name: 'Physics', color: '#FF6B6B' },
  { name: 'Math', color: '#4ECDC4' },
  { name: 'Chemistry', color: '#45B7D1' },
  { name: 'Biology', color: '#96CEB4' },
  { name: 'History', color: '#FFEAA7' },
]

/** Main board scene ("/") */
function MainScene() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [showMusicPanel, setShowMusicPanel] = useState(false)
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

  // If music panel is open, show full screen music
  if (showMusicPanel) {
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
        <MusicScreen onClose={() => setShowMusicPanel(false)} />
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
        {/* TOP RIGHT: Music App */}
        <div
          className="absolute top-8 right-8 z-20"
          style={{ transform: 'translateZ(50px)' }}
        >
          <MusicApp onClick={() => setShowMusicPanel(true)} />
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              width: '600px',
              justifyItems: 'center',
            }}
          >
          {SUBJECTS.map((subject, index) => (
            <div
              key={subject.name}
              style={{
                transform: `translateZ(${index * 15 + 40}px)`,
              }}
            >
              <StickerNote
                subject={subject.name}
                color={subject.color}
                onClick={() => setSelectedSubject(subject.name)}
              />
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Router wrapper with landing screen */
export default function App() {
  const [hasEntered, setHasEntered] = useState(false)

  if (!hasEntered) {
    return <LandingScreen onEnter={() => setHasEntered(true)} />
  }

  return (
    <Router basename={__XR_ENV_BASE__}>
      <Routes>
        <Route path="/second-page" element={<SecondPage />} />
        <Route path="/" element={<MainScene />} />
      </Routes>
    </Router>
  )
}
