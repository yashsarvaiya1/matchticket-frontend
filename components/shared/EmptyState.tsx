// components/shared/EmptyState.tsx
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?:    React.ReactNode
  title:    string
  message?: string
  action?:  React.ReactNode
  className?: string
}

export default function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-8 gap-3', className)}>
      {icon && <div className="text-muted-foreground/50 text-4xl">{icon}</div>}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {message && <p className="text-xs text-muted-foreground max-w-xs">{message}</p>}
      {action}
    </div>
  )
}
