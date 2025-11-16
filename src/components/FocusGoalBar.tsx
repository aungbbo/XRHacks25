import React, { useState, useEffect } from 'react'
import { Check, Circle, ChevronLeft, ChevronRight } from 'lucide-react'

interface FocusItem {
  id: number
  text: string
  completed: boolean
}

interface FocusGoalBarProps {
  items: FocusItem[]
  onToggle: (id: number) => void
}

export const FocusGoalBar: React.FC<FocusGoalBarProps> = ({
  items,
  onToggle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const incompleteItems = items.filter(item => !item.completed)

  useEffect(() => {
    // Find first incomplete item
    const firstIncomplete = items.findIndex(item => !item.completed)
    if (firstIncomplete !== -1) {
      setCurrentIndex(firstIncomplete)
    } else {
      setCurrentIndex(0)
    }
  }, [items])

  const currentItem = items[currentIndex] || items[0]

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : items.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev < items.length - 1 ? prev + 1 : 0))
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl px-8 py-4 spatial-translucent flex items-center gap-4 min-w-[500px]"
      style={{ width: 'auto' }}
      enable-xr
    >
        <button
          onClick={goToPrevious}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          type="button"
          aria-label="Previous goal"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div
          className="flex-1 flex items-center gap-4 cursor-pointer"
          onClick={() => onToggle(currentItem.id)}
        >
          {currentItem.completed ? (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
          ) : (
            <Circle className="w-6 h-6 text-white/60 flex-shrink-0" />
          )}
          <span
            className={`text-lg font-medium flex-1 ${
              currentItem.completed
                ? 'text-white/60 line-through'
                : 'text-white'
            }`}
          >
            {currentItem.text}
          </span>
        </div>

        <div className="text-sm text-white/60 flex-shrink-0">
          {currentIndex + 1} / {items.length}
        </div>

        <button
          onClick={goToNext}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          type="button"
          aria-label="Next goal"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
    </div>
  )
}

