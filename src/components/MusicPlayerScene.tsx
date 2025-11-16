import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react'
import './../App.css'

interface MusicPlayerSceneProps {
  onClose?: () => void
  isVisible: boolean
}

export const MusicPlayerScene: React.FC<MusicPlayerSceneProps> = ({ onClose, isVisible }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('Study Focus')
  const containerRef = useRef<HTMLDivElement>(null)

  const tracks = [
    'Study Focus',
    'Ambient Chill',
    'Classical Study',
    'Lo-Fi Beats',
    'Nature Sounds',
  ]

  const currentTrackIndex = tracks.indexOf(currentTrack)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't drag if clicking on interactive elements
    if (e.target instanceof HTMLElement && e.target.closest('button, input, select')) {
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
    if (e.target instanceof HTMLElement && e.target.closest('button, input, select')) {
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

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1
    setCurrentTrack(tracks[prevIndex])
  }

  const handleNext = () => {
    const nextIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0
    setCurrentTrack(tracks[nextIndex])
  }

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className="fixed z-50"
      style={{
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) translateZ(200px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* MP3 Player Container - Deep Blue */}
      <div
        className="relative rounded-3xl shadow-2xl spatial-translucent"
        style={{
          backgroundColor: '#001F3F', // Deep blue
          width: '380px',
          height: '580px',
          border: '3px solid #003366',
          boxShadow: '0 20px 60px rgba(0, 31, 63, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3)',
        }}
        enable-xr
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
            type="button"
            aria-label="Close"
            style={{ border: '2px solid white' }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Top Section - Screen with GIF */}
        <div className="p-6 pt-8">
          {/* Screen Frame */}
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{
              backgroundColor: '#000',
              border: '4px solid #003366',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 4px 10px rgba(0, 0, 0, 0.3)',
              height: '280px',
            }}
          >
            {/* GIF Display */}
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #001a33 0%, #003366 100%)',
              }}
            >
              <img
                src="/snoopy_gif.gif"
                alt="Snoopy Animation"
                className="w-full h-full object-contain"
                style={{
                  imageRendering: 'auto',
                }}
              />
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-1 truncate px-2">
              {currentTrack}
            </h3>
            <p className="text-sm text-blue-300">Now Playing</p>
          </div>
        </div>

        {/* Control Buttons Section */}
        <div className="px-6 pb-6">
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shadow-lg"
              type="button"
              style={{ border: '2px solid #004080' }}
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-lg"
              type="button"
              style={{ border: '3px solid #004080' }}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-white" />
              ) : (
                <Play className="w-7 h-7 text-white ml-1" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shadow-lg"
              type="button"
              style={{ border: '2px solid #004080' }}
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Track List */}
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {tracks.map((track, index) => (
              <button
                key={track}
                onClick={() => {
                  setCurrentTrack(track)
                  setIsPlaying(true)
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentTrack === track
                    ? 'bg-blue-500/50 text-white font-medium'
                    : 'bg-blue-900/30 hover:bg-blue-800/40 text-blue-200'
                }`}
                type="button"
                style={{
                  border: currentTrack === track ? '1px solid #0066CC' : '1px solid transparent',
                }}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Volume Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4 text-blue-300" />
            <div className="flex-1 h-1 bg-blue-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

