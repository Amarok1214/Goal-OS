import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
}

export function StatsCard({ title, value, subtitle, icon: Icon, iconColor = '#38bdf8' }: StatsCardProps) {
  return (
    <div className="stats-card glass-sm">
      <div className="stats-card-header">
        <div className="stats-card-icon" style={{ background: `${iconColor}20`, color: iconColor }}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="stats-card-title">{title}</span>
      </div>
      <div className="stats-card-value">{value}</div>
      {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
    </div>
  )
}
