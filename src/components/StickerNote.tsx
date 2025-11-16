import React from 'react'

interface StickerNoteProps {
  subject: string
  onClick: () => void
  theme: 'pink' | 'blue' | 'green' | 'yellow' | 'purple'
  floating?: boolean
  delay?: number
}

export const StickerNote: React.FC<StickerNoteProps> = ({
  subject,
  onClick,
  theme,
  floating = false,
  delay = 0,
}) => {
  const themeClass = `bubble-theme-${theme}`

  return (
    <button
      type="button"
      className={['bubble', themeClass, floating ? 'taskcard-bubble bubble-floating' : ''].filter(Boolean).join(' ')}
      onClick={onClick}
      style={{ '--bubble-delay': `${delay}s` } as React.CSSProperties}
      enable-xr
    >
      <div className="bubble-content">
        <span className="bubble-label">{subject}</span>
      </div>
    </button>
  )
}

