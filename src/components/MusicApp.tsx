import React from 'react'
import { Music } from 'lucide-react'

interface MusicAppProps {
  onClick: () => void
}

export const MusicApp: React.FC<MusicAppProps> = ({ onClick }) => {
  return (
    <div
      className="relative w-32 h-32 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform spatial-translucent"
      style={{
        backgroundColor: '#8B5CF6',
      }}
      onClick={onClick}
      enable-xr
    >
      <div className="absolute top-3 left-3 w-5 h-5 bg-black/10 rounded-full" />
      <div className="p-5 h-full flex flex-col justify-center items-center">
        <Music className="w-14 h-14 text-white/90 mb-2" />
        <h3 className="text-base font-bold text-white text-center">Music</h3>
      </div>
    </div>
  )
}

