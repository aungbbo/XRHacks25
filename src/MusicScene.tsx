import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react'
import './App.css'

declare const __XR_ENV_BASE__: string

interface MusicNote {
  id: number
  x: number
  y: number
  delay: number
}

interface Track {
  name: string
  file: string
}

export default function MusicScene() {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('Good Night Lo-Fi')
  const [musicNotes, setMusicNotes] = useState<MusicNote[]>([])
  const noteIdRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const tracks: Track[] = [
    { name: 'Good Night Lo-Fi', file: '/good-night-lofi-cozy-chill-music-160166 (1).mp3' },
    { name: 'Study Focus', file: '' },
    { name: 'Ambient Chill', file: '' },
    { name: 'Classical Study', file: '' },
    { name: 'Lo-Fi Beats', file: '' },
    { name: 'Nature Sounds', file: '' },
  ]

  const currentTrackIndex = tracks.findIndex(t => t.name === currentTrack)
  const currentTrackData = tracks.find(t => t.name === currentTrack) || tracks[0]

  // Handle track changes - load new audio
  useEffect(() => {
    if (!audioRef.current) return
    
    if (!currentTrackData.file) {
      setIsPlaying(false)
      return
    }

    try {
      // Pause and load new track
      audioRef.current.pause()
      audioRef.current.load()
    } catch (error) {
      console.error('Error loading track:', error)
      setIsPlaying(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack])

  // Handle audio playback - only sync state, don't control directly
  // The handlePlayPause function directly controls the audio
  useEffect(() => {
    if (!audioRef.current || !currentTrackData.file) return

    // Only sync if there's a mismatch (e.g., audio ended externally)
    const audio = audioRef.current
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    
    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [currentTrackData.file])

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
    let prevIndex = currentTrackIndex - 1
    if (prevIndex < 0) prevIndex = tracks.length - 1
    
    // Find the next track with a file
    let attempts = 0
    while (!tracks[prevIndex].file && attempts < tracks.length) {
      prevIndex = prevIndex - 1
      if (prevIndex < 0) prevIndex = tracks.length - 1
      attempts++
    }
    
    if (tracks[prevIndex].file) {
      setCurrentTrack(tracks[prevIndex].name)
    }
  }

  const handleNext = async () => {
    let nextIndex = currentTrackIndex + 1
    if (nextIndex >= tracks.length) nextIndex = 0
    
    // Find the next track with a file
    let attempts = 0
    while (!tracks[nextIndex].file && attempts < tracks.length) {
      nextIndex = nextIndex + 1
      if (nextIndex >= tracks.length) nextIndex = 0
      attempts++
    }
    
    if (tracks[nextIndex].file) {
      setCurrentTrack(tracks[nextIndex].name)
      // Auto-play when moving to next track
      // Wait for track to load, then play
      setTimeout(async () => {
        if (audioRef.current) {
          try {
            await audioRef.current.play()
            setIsPlaying(true)
          } catch (error) {
            console.error('Error auto-playing next track:', error)
            setIsPlaying(false)
          }
        }
      }, 200)
    }
  }

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Play/Pause clicked, isPlaying:', isPlaying, 'audioRef:', audioRef.current)
    
    if (!currentTrackData.file) {
      console.warn('No audio file available')
      alert('No audio file available for this track')
      return
    }
    
    if (!audioRef.current) {
      console.error('Audio ref is null')
      return
    }
    
    const audio = audioRef.current
    
    try {
      if (isPlaying) {
        console.log('Pausing audio')
        audio.pause()
        setIsPlaying(false)
      } else {
        console.log('Playing audio, readyState:', audio.readyState)
        // Wait for audio to be ready if needed
        if (audio.readyState < 2) {
          console.log('Audio not ready, waiting...')
          audio.load()
          await new Promise((resolve) => {
            audio.addEventListener('canplay', resolve, { once: true })
            setTimeout(resolve, 1000) // Timeout after 1 second
          })
        }
        await audio.play()
        console.log('Audio playing')
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error toggling playback:', error)
      setIsPlaying(false)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleTrackSelect = async (track: Track) => {
    if (!track.file) {
      alert('No audio file available for this track')
      return
    }
    setCurrentTrack(track.name)
    // Auto-play when selecting a track
    // Wait for track to load, then play
    setTimeout(async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.error('Error auto-playing selected track:', error)
          setIsPlaying(false)
        }
      }
    }, 200)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Close button clicked')
    
    // Stop audio first
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    
    // Try to close the window (works if opened via window.open())
    try {
      console.log('Attempting to close window')
      window.close()
    } catch (error) {
      console.error('window.close() failed:', error)
    }
    
    // Fallback: Try navigating back or to home
    setTimeout(() => {
      try {
        console.log('Attempting navigation fallback')
        // Try history.back first
        if (window.history.length > 1) {
          window.history.back()
        } else {
          // Navigate to home
          const baseUrl = typeof __XR_ENV_BASE__ !== 'undefined' ? __XR_ENV_BASE__ : ''
          if (baseUrl) {
            navigate(`${baseUrl}/`)
          } else {
            navigate('/')
          }
        }
      } catch (error) {
        console.error('Navigation failed:', error)
        // Last resort: direct location change
        const baseUrl = typeof __XR_ENV_BASE__ !== 'undefined' ? __XR_ENV_BASE__ : ''
        window.location.href = `${baseUrl}/`
      }
    }, 50)
  }

  return (
    <div
      className="relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-6 min-h-[500px]"
      style={{
        '--xr-background-material': 'transparent',
        backgroundColor: 'transparent',
        pointerEvents: 'auto',
      } as React.CSSProperties}
      enable-xr
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-50 cursor-pointer"
        type="button"
        style={{ pointerEvents: 'auto', zIndex: 9999 }}
      >
        <X className="w-5 h-5 pointer-events-none" />
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
            onClick={handlePlayPause}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="w-16 h-16 bg-white hover:bg-white/90 rounded-full flex items-center justify-center text-purple-600 transition-colors shadow-lg cursor-pointer"
            type="button"
            style={{ pointerEvents: 'auto', zIndex: 1000 }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 pointer-events-none" />
            ) : (
              <Play className="w-8 h-8 ml-1 pointer-events-none" />
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
              key={track.name}
              onClick={() => handleTrackSelect(track)}
              className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                track.name === currentTrack
                  ? 'bg-white text-purple-600 font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              type="button"
            >
              {track.name}
            </button>
          ))}
        </div>

        {/* Audio Element - Always render to ensure ref is available */}
        <audio
          ref={audioRef}
          preload="auto"
          src={
            currentTrackData.file
              ? encodeURI(
                  typeof __XR_ENV_BASE__ !== 'undefined'
                    ? `${__XR_ENV_BASE__}${currentTrackData.file}`
                    : currentTrackData.file
                )
              : ''
          }
          onEnded={() => {
            setIsPlaying(false)
            handleNext()
          }}
          onError={(e) => {
            console.error('Audio error:', e)
            setIsPlaying(false)
            if (currentTrackData.file) {
              console.error('Failed to load:', currentTrackData.file)
            }
          }}
          onLoadedData={() => {
            console.log('Audio loaded successfully')
          }}
        />
      </div>
    </div>
  )
}

