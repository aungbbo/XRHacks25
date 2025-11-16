import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Music } from 'lucide-react'
import './App.css'

interface MusicPlayerSceneWrapperProps {
  onClose?: () => void
}

interface MusicNote {
  id: number
  x: number
  y: number
  delay: number
}

export default function MusicPlayerSceneWrapper({ onClose }: MusicPlayerSceneWrapperProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [size, setSize] = useState({ width: 260, height: 420 })
  const [isHovering, setIsHovering] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('Study Focus')
  const [musicNotes, setMusicNotes] = useState<MusicNote[]>([])
  const [floatOffset, setFloatOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const noteIdRef = useRef(0)

  const tracks = [
    'Study Focus',
    'Ambient Chill',
    'Classical Study',
    'Lo-Fi Beats',
    'Nature Sounds',
  ]

  const currentTrackIndex = tracks.indexOf(currentTrack)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't drag if clicking on interactive elements or resize handle
    if (e.target instanceof HTMLElement) {
      const isButton = e.target.closest('button')
      const isInput = e.target.closest('input, select, textarea')
      const isResizeHandle = e.target.closest('[data-resize-handle]')
      if (isButton || isInput || isResizeHandle) {
        return
      }
    }
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    // Set cursor immediately on both container and body
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing'
    }
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
      // Keep cursor as grabbing during drag
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing'
      }
      // Also set cursor on document body
      document.body.style.cursor = 'grabbing'
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      // Reset cursor
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab'
      }
      document.body.style.cursor = 'default'
    }

    // Set cursor immediately when drag starts
    document.body.style.cursor = 'grabbing'
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing'
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'default'
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

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      setSize({
        width: Math.max(200, Math.min(400, resizeStart.width + deltaX)),
        height: Math.max(320, Math.min(600, resizeStart.height + deltaY)),
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeStart])

  // Animated music notes effect - coming from top of player
  useEffect(() => {
    if (!isPlaying) {
      setMusicNotes([])
      return
    }

    const interval = setInterval(() => {
      // Notes come from the top center of the player
      const newNote: MusicNote = {
        id: noteIdRef.current++,
        x: 50 + (Math.random() - 0.5) * 30, // Random position at top (40-60% width)
        y: 0, // Start at top (0%)
        delay: Math.random() * 0.2,
      }
      setMusicNotes(prev => [...prev, newNote])

      // Remove note after animation
      setTimeout(() => {
        setMusicNotes(prev => prev.filter(note => note.id !== newNote.id))
      }, 3000)
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Floating animation effect - only when not dragging
  useEffect(() => {
    if (isDragging || isResizing) {
      setFloatOffset(0)
      return
    }

    const startTime = Date.now()
    const animate = () => {
      if (isDragging || isResizing) {
        setFloatOffset(0)
        return
      }
      const elapsed = (Date.now() - startTime) / 1000
      const offset = Math.sin(elapsed * 2) * 8 // 8px floating range
      setFloatOffset(offset)
      requestAnimationFrame(animate)
    }
    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isDragging, isResizing])

  return (
    <div
      ref={containerRef}
      className="fixed"
      style={{
        top: '50%',
        right: '0px',
        transform: `translate(calc(0% + ${position.x}px), calc(-50% + ${position.y + (isDragging ? 0 : floatOffset)}px)) translateZ(200px)`,
        cursor: isDragging ? 'grabbing !important' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        zIndex: 10000,
        pointerEvents: 'auto',
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
      }}
      onMouseDown={(e) => {
        // Only handle drag if clicking directly on the outer container (not inner elements)
        // The inner container will handle its own drag events
        if (e.target === e.currentTarget) {
          handleMouseDown(e)
        }
      }}
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) {
          handleTouchStart(e)
        }
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated Music Notes - Keynotes coming from top */}
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
              '--random-x': randomX,
            } as React.CSSProperties & { '--random-x': number }}
          >
            <img
              src="/keynotes.png"
              alt="Music Note"
              style={{
                width: '32px',
                height: '32px',
                filter: 'drop-shadow(0 0 8px rgba(100, 200, 255, 0.9))',
                imageRendering: 'auto',
              }}
            />
          </div>
        )
      })}

      {/* MP3 Player Container - Deep Blue */}
      <div
        className="relative rounded-3xl shadow-2xl spatial-translucent transition-all duration-300"
        style={{
          backgroundColor: '#001F3F', // Deep blue
          width: `${size.width}px`,
          height: `${size.height}px`,
          border: '3px solid #003366',
          boxShadow: isHovering
            ? '0 25px 80px rgba(0, 100, 200, 0.6), inset 0 0 30px rgba(0, 150, 255, 0.2), 0 0 40px rgba(0, 100, 200, 0.4)'
            : '0 20px 60px rgba(0, 31, 63, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3)',
          transform: isHovering ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s ease',
          pointerEvents: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        enable-xr
        onMouseDown={(e) => {
          // Allow dragging from anywhere on the container except buttons and resize handle
          if (e.target instanceof HTMLElement) {
            const isButton = e.target.closest('button')
            const isInput = e.target.closest('input, select, textarea')
            const isResizeHandle = e.target.closest('[data-resize-handle]')
            // Don't stop propagation - let the outer container handle it
            if (!isButton && !isInput && !isResizeHandle) {
              // Call handleMouseDown which will set up dragging
              handleMouseDown(e)
            }
          }
        }}
        onTouchStart={(e) => {
          if (e.target instanceof HTMLElement) {
            const isButton = e.target.closest('button')
            const isInput = e.target.closest('input, select, textarea')
            const isResizeHandle = e.target.closest('[data-resize-handle]')
            if (!isButton && !isInput && !isResizeHandle) {
              handleTouchStart(e)
            }
          }
        }}
      >

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg z-20"
            type="button"
            aria-label="Close"
            style={{ border: '2px solid white' }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Top Section - Screen with GIF */}
        <div className="p-4 pt-6" style={{ paddingLeft: `${size.width * 0.04}px`, paddingRight: `${size.width * 0.04}px` }}>
          {/* Screen Frame */}
          <div
            className="rounded-2xl overflow-hidden mb-4"
            style={{
              backgroundColor: '#000',
              border: '4px solid #003366',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 4px 10px rgba(0, 0, 0, 0.3)',
              height: `${size.height * 0.45}px`,
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
          <div className="text-center mb-4">
            <h3 className="font-bold text-white mb-1 truncate px-2" style={{ fontSize: `${size.width * 0.05}px` }}>
              {currentTrack}
            </h3>
            <p className="text-white" style={{ fontSize: `${size.width * 0.035}px`, opacity: 0.9 }}>Now Playing</p>
          </div>
        </div>

        {/* Control Buttons Section */}
        <div className="px-4 pb-4" style={{ paddingLeft: `${size.width * 0.04}px`, paddingRight: `${size.width * 0.04}px` }}>
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <button
              onClick={handlePrevious}
              className="rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shadow-lg"
              type="button"
              style={{
                border: '2px solid #004080',
                width: `${size.width * 0.12}px`,
                height: `${size.width * 0.12}px`,
              }}
            >
              <SkipBack className="text-white" style={{ width: `${size.width * 0.04}px`, height: `${size.width * 0.04}px` }} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-lg"
              type="button"
              style={{
                border: '3px solid #004080',
                width: `${size.width * 0.16}px`,
                height: `${size.width * 0.16}px`,
              }}
            >
              {isPlaying ? (
                <Pause className="text-white" style={{ width: `${size.width * 0.06}px`, height: `${size.width * 0.06}px` }} />
              ) : (
                <Play className="text-white ml-1" style={{ width: `${size.width * 0.06}px`, height: `${size.width * 0.06}px` }} />
              )}
            </button>

            <button
              onClick={handleNext}
              className="rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shadow-lg"
              type="button"
              style={{
                border: '2px solid #004080',
                width: `${size.width * 0.12}px`,
                height: `${size.width * 0.12}px`,
              }}
            >
              <SkipForward className="text-white" style={{ width: `${size.width * 0.04}px`, height: `${size.width * 0.04}px` }} />
            </button>
          </div>

          {/* Track List */}
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {tracks.map((track, index) => (
              <button
                key={track}
                onClick={() => {
                  setCurrentTrack(track)
                  setIsPlaying(true)
                }}
                className={`w-full text-left rounded-lg transition-colors ${
                  currentTrack === track
                    ? 'bg-blue-500/50 text-white font-medium'
                    : 'bg-blue-900/30 hover:bg-blue-800/40 text-white'
                }`}
                type="button"
                style={{
                  border: currentTrack === track ? '1px solid #0066CC' : '1px solid transparent',
                  padding: `${size.width * 0.015}px ${size.width * 0.03}px`,
                  fontSize: `${size.width * 0.035}px`,
                }}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Volume Indicator */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <Volume2 className="text-white" style={{ width: `${size.width * 0.035}px`, height: `${size.width * 0.035}px`, opacity: 0.9 }} />
            <div className="flex-1 h-1 bg-blue-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          data-resize-handle
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-20"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(100, 150, 255, 0.5) 40%, rgba(100, 150, 255, 0.5) 60%, transparent 60%)',
            borderBottomRightRadius: '1rem',
          }}
          onMouseDown={handleResizeStart}
        />
      </div>
    </div>
  )
}

