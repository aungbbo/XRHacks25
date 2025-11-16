import React from 'react'
import { Trash2, Edit2 } from 'lucide-react'

interface TaskCardProps {
  title: string
  description: string
  color: 'blue' | 'purple' | 'green'
  icon?: React.ReactNode
  className?: string
  floating?: boolean
  delay?: number
  onDelete?: () => void
  onEdit?: () => void
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  color,
  icon,
  className = '',
  floating = false,
  delay = 0,
  onDelete,
  onEdit,
}) => {
  const colorStyles = {
    blue: {
      theme: 'bubble-theme-blue',
      labelColor: '#1f2a44',
      iconColor: '#1f2937',
    },
    purple: {
      theme: 'bubble-theme-purple',
      labelColor: '#2d1f44',
      iconColor: '#312e81',
    },
    green: {
      theme: 'bubble-theme-green',
      labelColor: '#1f3d2f',
      iconColor: '#065f46',
    },
  } as const

  const style = colorStyles[color]
  const styleProps = {
    '--bubble-delay': `${delay}s`,
    '--bubble-label-color': style.labelColor,
    '--bubble-icon-color': style.iconColor,
  } as React.CSSProperties

  return (
    <div
      className={[
        'bubble',
        style.theme,
        floating ? 'taskcard-bubble bubble-floating' : 'bubble-floating',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={styleProps}
      enable-xr
    >
      <div className="bubble-content">
        {icon && <div className={`bubble-icon`}>{icon}</div>}
        <h3 className="bubble-label">{title}</h3>
        <p className="text-sm text-slate-700/80 leading-relaxed">{description}</p>
        {(onEdit || onDelete) && (
          <div className="bubble-actions">
            {onEdit && (
              <button
                onClick={onEdit}
                aria-label="Edit task"
                title="Edit task"
                type="button"
              >
                <Edit2 className={`w-4 h-4 ${style.icon}`} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                aria-label="Delete task"
                title="Delete task"
                type="button"
              >
                <Trash2 className={`w-4 h-4 ${style.icon}`} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}