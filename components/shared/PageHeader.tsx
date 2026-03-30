// components/shared/PageHeader.tsx
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title:    string
  back?:    string
  actions?: React.ReactNode
  className?: string
}

export default function PageHeader({ title, back, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('sticky top-0 z-40 bg-background border-b border-border px-4 h-14 flex items-center gap-3', className)}>
      {back && (
        <Link href={back} className="p-1 -ml-1 text-muted-foreground hover:text-foreground">
          <ChevronLeft size={22} />
        </Link>
      )}
      <h1 className="flex-1 text-base font-semibold truncate">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
