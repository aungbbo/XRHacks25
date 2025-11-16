import React, { useState } from 'react'
import { Music, Play, Pause, ArrowLeft, X } from 'lucide-react'
import './../App.css'

interface MusicScreenProps {
  onClose: () => void
}

export const MusicScreen: React.FC<MusicScreenProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('Study Focus')

  const tracks = [
    'Study Focus',
    'Ambient Chill',
    'Classical Study',
    'Lo-Fi Beats',
    'Nature Sounds',
  ]

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        '--xr-background-material': 'transparent',
        backgroundColor: 'transparent',
      } as React.CSSProperties}
      enable-xr
    >
      <div
        className="relative"
        style={{ perspective: '2000px' }}
      >
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute left-8 top-8 z-10 flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-colors shadow-lg"
          type="button"
          style={{ transform: 'translateZ(100px)' }}
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold text-lg">Back to Home</span>
        </button>

        {/* Music Panel */}
        <div
          className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 spatial-translucent relative"
          style={{
            transform: 'translateZ(150px)',
            width: '600px',
          }}
          enable-xr
        >
          {/* Exit Button inside panel */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
            type="button"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                <Music className="w-8 h-8" />
                Music
              </h2>
              <p className="text-base text-white/70">
                Focus music for your study session.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-lg text-white font-medium">{currentTrack}</p>
                <p className="text-sm text-white/60">Now Playing</p>
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full border border-blue-300/40 bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-md flex items-center justify-center transition-colors shadow-lg"
                type="button"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-white" />
                ) : (
                  <Play className="w-7 h-7 text-white ml-1" />
                )}
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tracks.map(track => (
                <button
                  key={track}
                  onClick={() => {
                    setCurrentTrack(track)
                    setIsPlaying(true)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base transition-colors ${
                    currentTrack === track
                      ? 'bg-blue-500/30 text-white font-medium'
                      : 'bg-white/10 hover:bg-white/15 text-white/80'
                  }`}
                  type="button"
                >
                  {track}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

