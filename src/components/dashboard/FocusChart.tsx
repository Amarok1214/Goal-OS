import { useMemo } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface FocusChartProps {
  weeklyHours: number[]
}

export function FocusChart({ weeklyHours }: FocusChartProps) {
  const maxHours = useMemo(() => {
    const max = Math.max(...weeklyHours, 1)
    return Math.ceil(max * 1.2) // Add 20% headroom
  }, [weeklyHours])

  const today = new Date().getDay()

  return (
    <div className="focus-chart glass-sm">
      <h3 className="focus-chart-title">Weekly Focus Time</h3>
      <div className="focus-chart-container">
        <div className="focus-chart-y-axis">
          <span>{maxHours.toFixed(1)}h</span>
          <span>{(maxHours / 2).toFixed(1)}h</span>
          <span>0h</span>
        </div>
        <div className="focus-chart-bars">
          {weeklyHours.map((hours, index) => {
            const heightPercent = (hours / maxHours) * 100
            const isToday = index === today
            return (
              <div key={index} className="focus-chart-bar-wrapper">
                <div className="focus-chart-bar-container">
                  <div
                    className={`focus-chart-bar ${isToday ? 'today' : ''}`}
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  >
                    {hours > 0 && (
                      <span className="focus-chart-bar-label">
                        {hours.toFixed(1)}h
                      </span>
                    )}
                  </div>
                </div>
                <span className={`focus-chart-day ${isToday ? 'today' : ''}`}>
                  {DAYS[index]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
