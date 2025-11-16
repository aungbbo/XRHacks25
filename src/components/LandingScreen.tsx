import React from 'react'
import './../App.css'

interface LandingScreenProps {
  onEnter: () => void
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
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
        <div
          className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl p-16 spatial-translucent"
          style={{
            transform: 'translateZ(100px) rotateY(-5deg)',
            width: '600px',
          }}
          enable-xr
        >
          <h1 className="text-8xl font-bold text-white mb-12 text-center">
            MyOrbit
          </h1>
          <button
            onClick={onEnter}
            className="w-full px-12 py-6 bg-blue-500 hover:bg-blue-600 text-white text-2xl font-semibold rounded-xl transition-colors shadow-lg"
            type="button"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  )
}

