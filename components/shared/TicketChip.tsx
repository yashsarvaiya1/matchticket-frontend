// components/shared/TicketChip.tsx
import { Ticket } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useProfile } from '@/hooks/useUsers'
import { cn } from '@/lib/utils'

export default function TicketChip({ className }: { className?: string }) {
  const { data: me } = useProfile()
  const name        = useAuthStore((s) => s.name)

  return (
    <div className={cn('flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium', className)}>
      <Ticket size={14} />
      <span>{me?.tickets ?? '—'}</span>
    </div>
  )
}
