import React, { useEffect, useState } from 'react'
import './../App.css'

interface LandingScreenProps {
  onEnter: () => void
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        '--xr-background-material': 'transparent',
        backgroundColor: 'transparent',
      } as React.CSSProperties}
      enable-xr
    >

      {/* Main Content */}
      <div
        className="relative z-10"
        style={{ perspective: '2000px' }}
      >
        <div
          className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-16 spatial-translucent flex flex-col items-center"
          style={{
            transform: `translateZ(100px) rotateY(${mousePosition.x * 0.1}deg) rotateX(${-mousePosition.y * 0.1}deg)`,
            width: '700px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'transform 0.1s ease-out',
          }}
          enable-xr
        >
          {/* 3D Hovering MindOrbit Logo */}
          <div
            className="mb-12 logo-3d-container"
            style={{
              transform: `rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg) translateZ(50px)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.1s ease-out',
              perspective: '1000px',
            }}
          >
            <div className="logo-wrapper">
              <img
                src="/mindorbit.png"
                alt="MindOrbit Logo"
                className="w-80 h-80 object-contain logo-transparent"
                style={{
                  imageRendering: 'auto',
                  transform: 'translateZ(0)',
                }}
              />
            </div>
          </div>

          <button
            onClick={onEnter}
            className="w-full px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-2xl font-semibold rounded-xl transition-all shadow-2xl button-pulse"
            type="button"
            style={{
              transform: 'translateZ(20px)',
            }}
          >
            Enter Note Garden
          </button>
        </div>
      </div>
    </div>
  )
}

