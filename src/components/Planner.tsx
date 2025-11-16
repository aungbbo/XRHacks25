import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, X, Square, Trash2 } from 'lucide-react'
import './../App.css'

interface PlannerProps {
  onClose: () => void
}

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

interface WhiteboardProps {
  onClose: () => void
}

const Whiteboard: React.FC<WhiteboardProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [opacity, setOpacity] = useState(1)
  const [size, setSize] = useState(3)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.strokeStyle = color
    ctx.globalAlpha = opacity
    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl p-6 w-[90vw] h-[90vh] max-w-6xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Whiteboard</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          {/* Color Picker */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                  style={{ backgroundColor: c }}
                  type="button"
                />
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Opacity: {Math.round(opacity * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-32"
            />
          </div>

          {/* Size */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Size: {size}px</label>
            <input
              type="range"
              min="1"
              max="20"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-32"
            />
          </div>

          {/* Clear Button */}
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        <canvas
          ref={canvasRef}
          className="flex-1 border-2 border-gray-300 rounded cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  )
}

export const Planner: React.FC<PlannerProps> = ({ onClose }) => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Review user feedback', completed: true },
    { id: 2, text: 'Update wireframes', completed: false },
    { id: 3, text: 'Prototype new interaction', completed: false },
    { id: 4, text: 'Schedule team sync', completed: false },
    { id: 5, text: 'Research AR best practices', completed: false },
    { id: 6, text: 'Complete math homework', completed: false },
    { id: 7, text: 'Study for chemistry exam', completed: false },
  ])
  const [showWhiteboard, setShowWhiteboard] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    return startOfWeek
  })

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getWeekDates = (weekStart: Date) => {
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      week.push(date)
    }
    return week
  }

  const prevWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newWeekStart)
    setCurrentDate(newWeekStart)
  }

  const nextWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newWeekStart)
    setCurrentDate(newWeekStart)
  }

  const weekDates = getWeekDates(currentWeekStart)
  const weekMonth = currentWeekStart.getMonth()
  const weekYear = currentWeekStart.getFullYear()

  // Helper function to get schedule content for a specific day and time
  const getScheduleContent = (day: string, time: string): string => {
    if (day === 'Sun') {
      if (time === '09:00-10:00') return 'Get ready for Church'
      if (time === '10:00-11:00' || time === '11:00-12:00' || time === '12:00-1:00pm') return 'Church'
    }
    if (day === 'Mon') {
      if (time === '10:00-11:00') return 'Get ready for Plus Classes'
      if (time === '11:00-12:00' || time === '12:00-1:00pm') return 'Plus Classes'
    }
    if (day === 'Wed') {
      if (time === '06:00-07:00am') return 'Get ready for Core Classes'
      if (['07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00pm'].includes(time)) {
        return 'Core Classes'
      }
    }
    return ''
  }

  const timeSlots = ['06:00-07:00am', '07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00pm']
  const calendarDayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div
      className="min-h-screen bg-gray-50 overflow-y-auto"
      style={{
        '--xr-background-material': 'transparent',
        backgroundColor: '#f9fafb',
      } as React.CSSProperties}
      enable-xr
    >
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-5 py-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-lg text-gray-700 transition-colors shadow-md"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>

        {/* Main Planner Container */}
        <div className="bg-white shadow-lg overflow-hidden border-black" style={{ backgroundColor: '#ffffff', opacity: 1, borderRadius: '24px', borderWidth: '8px', borderStyle: 'solid' }}>
          {/* Banner with Snoopy Study GIF */}
          <div className="w-full h-64 relative overflow-hidden">
            <img
              src="/snoopy_study.gif"
              alt="Snoopy Study"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title Section */}
          <div className="px-8 py-8 text-center bg-white">
            <h1 className="text-7xl font-bold mb-4 text-gray-900 mx-auto" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.08em', fontWeight: 700 }}>
              - WEEKLY~PLANNER -
            </h1>
            <div className="bg-gray-100 rounded-lg p-4 mx-auto max-w-2xl">
              <p className="text-gray-700 italic text-lg text-center" style={{ fontFamily: 'serif' }}>
                ✨ "Believe that you can, and you're halfway there." - Theodore Roosevelt
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex px-8 pb-8 gap-8 bg-white">
            {/* Left Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div 
                className="rounded-lg p-4 mb-4"
                style={{ backgroundColor: '#f9fafb', opacity: 1 }}
              >
                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-gray-200" style={{ opacity: 1 }}>
                  <span className="text-4xl">☕</span>
                </div>
                <p className="text-center text-lg font-medium mb-4 text-gray-800" style={{ opacity: 1 }}>Welcome, Sofia &lt;3</p>
                <div className="space-y-2">
                  <div 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-left flex items-center gap-2 text-gray-600"
                    style={{ backgroundColor: '#ffffff', opacity: 1 }}
                  >
                    <span>❤️</span>
                    <span>link</span>
                  </div>
                  <div 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-left flex items-center gap-2 text-gray-600"
                    style={{ backgroundColor: '#ffffff', opacity: 1 }}
                  >
                    <span>❤️</span>
                    <span>link</span>
                  </div>
                </div>
              </div>

              {/* Weekly Calendar */}
              <div 
                className="p-4 border border-gray-200 bg-white"
                style={{ opacity: 1, borderRadius: '20px' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={prevWeek} 
                    className="text-gray-600 hover:text-gray-900 px-2 py-1 text-lg"
                    type="button"
                  >
                    ‹
                  </button>
                  <span className="font-medium text-sm text-gray-800">
                    {monthNames[weekMonth]} {weekYear}
                  </span>
                  <button 
                    onClick={nextWeek} 
                    className="text-gray-600 hover:text-gray-900 px-2 py-1 text-lg"
                    type="button"
                  >
                    ›
                  </button>
                </div>
                <div className="space-y-2">
                  {weekDates.map((date, idx) => {
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString()
                    const dayName = dayNames[date.getDay()]
                    const dayNumber = date.getDate()
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        type="button"
                        className={`
                          w-full px-3 py-2 text-left flex items-center justify-between
                          transition-colors
                          ${isToday 
                            ? 'bg-blue-500 text-white' 
                            : isSelected
                            ? 'bg-gray-200 text-gray-800'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                        style={{ borderRadius: '12px' }}
                      >
                        <span className="text-xs font-medium">{dayName}</span>
                        <span className="text-sm font-semibold">{dayNumber}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Weekly Schedule Table */}
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">TIME</th>
                        {dayNames.map(day => (
                          <th key={day} className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-800">
                            {day}.
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-semibold bg-gray-50 text-gray-800">OVERALL</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Math and Bio Due</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Literature Due</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Rest of Core Class due</td>
                        <td className="border border-gray-300 px-4 py-3"></td>
                        <td className="border border-gray-300 px-4 py-3"></td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">Labs @ either 10am or 12:30am</td>
                        <td className="border border-gray-300 px-4 py-3"></td>
                      </tr>
                      {timeSlots.map(time => (
                        <tr key={time}>
                          <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">{time}</td>
                          {dayNames.map((day) => {
                            const content = getScheduleContent(day, time)
                            return (
                              <td key={`${day}-${time}`} className="border border-gray-300 px-4 py-3 text-gray-700">
                                {content}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Whiteboard Modal */}
      {showWhiteboard && <Whiteboard onClose={() => setShowWhiteboard(false)} />}
    </div>
  )
}

