'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  items?: { label: string; value: number | string; color?: string }[]
  className?: string
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = 'bg-primary',
  items,
  className 
}: KPICardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">{value}</span>
            {subtitle && (
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            )}
          </div>
        </div>
        <div className={cn('rounded-lg p-2.5', iconColor)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      {items && items.length > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={cn('font-medium', item.color)}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Status badge component
interface StatusBadgeProps {
  status: 'pendiente' | 'aprobado' | 'rechazado' | 'en_progreso' | 'completado'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    aprobado: { label: 'Aprobado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    rechazado: { label: 'Rechazado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    en_progreso: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    completado: { label: 'Completado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
  }

  const config = statusConfig[status]

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      config.color,
      className
    )}>
      {config.label}
    </span>
  )
}

// Deadline indicator with traffic light colors
interface DeadlineIndicatorProps {
  daysRemaining: number
  className?: string
}

export function DeadlineIndicator({ daysRemaining, className }: DeadlineIndicatorProps) {
  let colorClass = 'text-green-600 dark:text-green-400'
  let bgClass = 'bg-green-100 dark:bg-green-900/30'
  
  if (daysRemaining < 3) {
    colorClass = 'text-red-600 dark:text-red-400'
    bgClass = 'bg-red-100 dark:bg-red-900/30'
  } else if (daysRemaining <= 7) {
    colorClass = 'text-yellow-600 dark:text-yellow-400'
    bgClass = 'bg-yellow-100 dark:bg-yellow-900/30'
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      bgClass,
      colorClass,
      className
    )}>
      {daysRemaining <= 0 ? 'Vencido' : `${daysRemaining} dias`}
    </span>
  )
}

// Progress bar component
interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, max = 100, className, showLabel = true }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  let colorClass = 'bg-green-500'
  if (percentage < 50) {
    colorClass = 'bg-red-500'
  } else if (percentage < 75) {
    colorClass = 'bg-yellow-500'
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium tabular-nums">{Math.round(percentage)}%</span>
      )}
    </div>
  )
}
