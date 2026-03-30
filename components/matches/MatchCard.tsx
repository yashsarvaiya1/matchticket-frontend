// components/matches/MatchCard.tsx
'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { MatchList } from '@/models/match'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  upcoming:    'bg-muted text-muted-foreground',
  active:      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  draw_closed: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  ended:       'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  concluded:   'bg-primary/10 text-primary',
}

const STATUS_LABELS: Record<string, string> = {
  upcoming:    'Upcoming',
  active:      'Active',
  draw_closed: 'Draw Closed',
  ended:       'Ended',
  concluded:   'Concluded',
}

export default function MatchCard({ match }: { match: MatchList }) {
  const drawCutoff = match.common_match_start_time
    ? new Date(new Date(match.common_match_start_time).getTime() - 60 * 60 * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3 hover:shadow-md transition-shadow active:scale-[0.98]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm">{match.team1_name} vs {match.team2_name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(match.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full shrink-0', STATUS_STYLES[match.status])}>
            {STATUS_LABELS[match.status]}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>🎫 {match.entry_ticket} ticket{match.entry_ticket !== 1 ? 's' : ''} to enter</span>
          {drawCutoff && match.status === 'active' && (
            <span>Draws close at {drawCutoff}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
