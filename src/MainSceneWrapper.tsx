import React, { useState, useRef, useEffect } from 'react'
import { FocusGoalBar } from './components/FocusGoalBar'
import { StickerNote } from './components/StickerNote'
import { MusicApp } from './components/MusicApp'
import { NoteDetailView } from './components/NoteDetailView'
import './App.css'

const SUBJECTS = [
  { name: 'My Planner', color: '#FF6B6B' },
  { name: 'Math', color: '#4ECDC4' },
  { name: 'Chemistry', color: '#45B7D1' },
  { name: 'Biology', color: '#96CEB4' },
  { name: 'History', color: '#FFEAA7' },
]

interface MainSceneWrapperProps {
  onToggleMusic: () => void
}

export default function MainSceneWrapper({ onToggleMusic }: MainSceneWrapperProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [focusItems, setFocusItems] = useState([
    { id: 1, text: 'Review user feedback', completed: true },
    { id: 2, text: 'Update wireframes', completed: false },
    { id: 3, text: 'Prototype new interaction', completed: false },
    { id: 4, text: 'Schedule team sync', completed: false },
    { id: 5, text: 'Research AR best practices', completed: false },
  ])
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFocusItem = (id: number) => {
    setFocusItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('input, button, label, textarea')) {
      return
    }
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart])

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('input, button, label, textarea')) {
      return
    }
    e.preventDefault()
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    })
  }

  useEffect(() => {
    if (!isDragging) return

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      })
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, dragStart])

  // If a subject is selected, show only the note detail view (full screen)
  if (selectedSubject) {
    return (
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translateZ(150px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          zIndex: 999,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        ref={containerRef}
      >
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
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) translateZ(100px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: 999,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="relative min-h-screen pt-24"
        style={{
          perspective: '2000px',
          '--xr-background-material': 'transparent',
          backgroundColor: 'transparent',
        } as React.CSSProperties}
        enable-xr
      >
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

