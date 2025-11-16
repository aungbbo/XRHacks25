import React, { useRef } from 'react'
import { Music } from 'lucide-react'
import { initScene } from '@webspatial/react-sdk'

declare const __XR_ENV_BASE__: string

export const MusicApp: React.FC = () => {
  const musicWindowRef = useRef<Window | null>(null)

  const handleClick = () => {
    try {
      // Check if music window is already open and still valid
      if (musicWindowRef.current && !musicWindowRef.current.closed) {
        // Focus the existing window, but still allow opening a new one if needed
        musicWindowRef.current.focus()
        // You can still open a new one by clicking again or closing the existing one first
      }

      // Initialize scene with size and position to the right
      if (typeof initScene === 'function') {
        initScene({
          size: { width: 400, height: 600 },
        })
      }
      
      // Open the music scene (will open a new one even if one exists)
      const baseUrl = typeof __XR_ENV_BASE__ !== 'undefined' ? __XR_ENV_BASE__ : ''
      const newWindow = window.open(`${baseUrl}/music`, '_blank')
      
      if (newWindow) {
        musicWindowRef.current = newWindow
        
        // Clear reference when window is closed
        const checkClosed = setInterval(() => {
          if (newWindow.closed) {
            if (musicWindowRef.current === newWindow) {
              musicWindowRef.current = null
            }
            clearInterval(checkClosed)
          }
        }, 500)
      }
    } catch (error) {
      console.error('Error opening music scene:', error)
      // Fallback: try opening without initScene
      const baseUrl = typeof __XR_ENV_BASE__ !== 'undefined' ? __XR_ENV_BASE__ : ''
      const newWindow = window.open(`${baseUrl}/music`, '_blank')
      if (newWindow) {
        musicWindowRef.current = newWindow
      }
    }
  }

  return (
    <button
      type="button"
      className="relative w-32 h-32 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform spatial-translucent border-none outline-none focus:outline-none"
      style={{
        backgroundColor: '#8B5CF6',
      }}
      onClick={handleClick}
      enable-xr
    >
      <div className="absolute top-3 left-3 w-5 h-5 bg-black/10 rounded-full" />
      <div className="p-5 h-full flex flex-col justify-center items-center">
        <Music className="w-14 h-14 text-white/90 mb-2" />
        <h3 className="text-base font-bold text-white text-center">Music</h3>
      </div>
    </button>
  )
}

