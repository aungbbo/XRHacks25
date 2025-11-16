import React, { useState } from 'react'
import { Music, Play, Pause, X } from 'lucide-react'
import './../App.css'

interface MusicPanelProps {
  onClose?: () => void
}

export const MusicPanel: React.FC<MusicPanelProps> = ({ onClose }) => {
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
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-medium text-white flex items-center gap-2">
            <Music className="w-4 h-4" />
            Music
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Focus music for your study session.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            type="button"
            aria-label="Close music panel"
          >
            <X className="w-3 h-3 text-gray-700" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-white font-medium">{currentTrack}</p>
            <p className="text-xs text-white/60">Now Playing</p>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
            type="button"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto">
          {tracks.map(track => (
            <button
              key={track}
              onClick={() => {
                setCurrentTrack(track)
                setIsPlaying(true)
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                currentTrack === track
                  ? 'bg-blue-500/30 text-white'
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
  )
}

