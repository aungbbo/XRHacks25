import React, { useEffect, useState } from 'react'
import './../App.css'

interface LandingScreenProps {
  onEnter: () => void
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [logoFloat, setLogoFloat] = useState(0)

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

  useEffect(() => {
    let animationFrame: number
    let startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      setLogoFloat(Math.sin(elapsed * 0.8) * 15)
      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
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
      {/* Welcome Banner - Big and Bold */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 z-20"
        style={{ transform: 'translateX(-50%) translateZ(150px)' }}
      >
        <h2 className="text-9xl font-black text-white welcome-bold" style={{
          textShadow: '0 0 40px rgba(100, 150, 255, 0.8), 0 0 80px rgba(150, 100, 255, 0.6)',
          letterSpacing: '0.1em',
        }}>
          WELCOME
        </h2>
      </div>

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
              transform: `translateY(${logoFloat}px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg) translateZ(50px)`,
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

          <h1 className="text-8xl font-bold text-white mb-12 text-center title-glow">
            MyOrbit
          </h1>

          <button
            onClick={onEnter}
            className="w-full px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-2xl font-semibold rounded-xl transition-all shadow-2xl button-pulse"
            type="button"
            style={{
              transform: 'translateZ(20px)',
            }}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  )
}

