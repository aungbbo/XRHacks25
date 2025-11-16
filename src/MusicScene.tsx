import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react'
import './App.css'

declare const __XR_ENV_BASE__: string

interface MusicNote {
  id: number
  x: number
  y: number
  delay: number
}

export default function MusicScene() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('Study Focus')
  const [musicNotes, setMusicNotes] = useState<MusicNote[]>([])
  const noteIdRef = useRef(0)

  const tracks = [
    'Study Focus',
    'Ambient Chill',
    'Classical Study',
    'Lo-Fi Beats',
    'Nature Sounds',
  ]

  const currentTrackIndex = tracks.indexOf(currentTrack)

  // Animated music notes when playing
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      const newNote: MusicNote = {
        id: noteIdRef.current++,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 0,
        delay: Math.random() * 0.2,
      }
      setMusicNotes(prev => [...prev, newNote])

      setTimeout(() => {
        setMusicNotes(prev => prev.filter(note => note.id !== newNote.id))
      }, 3000)
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying])

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1
    setCurrentTrack(tracks[prevIndex])
  }

  const handleNext = () => {
    const nextIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0
    setCurrentTrack(tracks[nextIndex])
  }

  const handleClose = () => {
    try {
      // Try to close the window
      if (window.opener) {
        // If opened from another window, try to close
        window.close()
      } else {
        // If window.close() doesn't work, try navigating back
        // In WebSpatial, we might need to use history or postMessage
        if (window.history.length > 1) {
          window.history.back()
        } else {
          // Fallback: try to close anyway
          window.close()
        }
      }
    } catch (error) {
      console.error('Error closing window:', error)
      // Last resort: try to navigate to parent
      try {
        window.location.href = typeof __XR_ENV_BASE__ !== 'undefined' ? `${__XR_ENV_BASE__}/` : '/'
      } catch (e) {
        console.error('Error navigating:', e)
      }
    }
  }

  return (
    <div
      className="relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-6 min-h-[500px]"
      style={{
        '--xr-background-material': 'transparent',
        backgroundColor: 'transparent',
      } as React.CSSProperties}
      enable-xr
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
        type="button"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Animated Music Notes */}
      {musicNotes.map(note => {
        const randomX = (Math.random() - 0.5) * 80
        return (
          <div
            key={note.id}
            className="absolute pointer-events-none"
            style={{
              left: `${note.x}%`,
              top: `${note.y}%`,
              animation: `floatNoteUp 3s ease-out forwards`,
              animationDelay: `${note.delay}s`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img
              src="/keynotes.png"
              alt="Music Note"
              style={{
                width: '32px',
                height: '32px',
                filter: 'drop-shadow(0 0 8px rgba(100, 200, 255, 0.9))',
              }}
            />
          </div>
        )
      })}

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full pt-8">
        {/* Album Art */}
        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-xl mb-6">
          <img
            src="/snoopy_gif.gif"
            alt="Album Art"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Track Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{currentTrack}</h2>
          <p className="text-white/70 text-sm">Now Playing</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handlePrevious}
            className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            type="button"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-white hover:bg-white/90 rounded-full flex items-center justify-center text-purple-600 transition-colors shadow-lg"
            type="button"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            type="button"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Track List */}
        <div className="w-full max-w-xs space-y-2">
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => setCurrentTrack(track)}
              className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                track === currentTrack
                  ? 'bg-white text-purple-600 font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              type="button"
            >
              {track}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

