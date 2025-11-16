import React from 'react'
import { BookOpen } from 'lucide-react'

interface StickerNoteProps {
  subject: string
  color: string
  onClick: () => void
}

export const StickerNote: React.FC<StickerNoteProps> = ({
  subject,
  color,
  onClick,
}) => {
  return (
    <div
      className="relative w-64 h-64 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform spatial-translucent"
      style={{
        backgroundColor: color,
      }}
      onClick={onClick}
      enable-xr
    >
      <div className="absolute top-3 left-3 w-5 h-5 bg-black/10 rounded-full" />
      <div className="p-6 h-full flex flex-col justify-center items-center">
        <BookOpen className="w-16 h-16 text-white/90 mb-4" />
        <h3 className="text-2xl font-bold text-white text-center">
          {subject}
        </h3>
      </div>
    </div>
  )
}

