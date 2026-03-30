// components/matches/MatchInfoTab.tsx
'use client'

import Link from 'next/link'
import type { Match } from '@/models/match'
import { useAuthStore } from '@/stores/authStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  upcoming:    'bg-muted text-muted-foreground',
  active:      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  draw_closed: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  ended:       'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  concluded:   'bg-primary/10 text-primary',
}

export default function MatchInfoTab({ match }: { match: Match }) {
  const isAdmin = useAuthStore((s) => s.isAdmin())

  const team1Positions = match.positions.filter((p) => p.slot <= 5)
  const team2Positions = match.positions.filter((p) => p.slot > 5)

  return (
    <div className="space-y-5 pb-32">
      {/* Status + meta */}
      <div className="flex items-center justify-between">
        <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', STATUS_STYLES[match.status])}>
          {match.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
        {isAdmin && ['upcoming', 'active'].includes(match.status) && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/matches/${match.id}/scoring`}>
              <Pencil size={14} className="mr-1" /> Edit Scores
            </Link>
          </Button>
        )}
      </div>

      {/* Match info */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Entry Ticket</span>
          <span className="font-medium">🎫 {match.entry_ticket}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{new Date(match.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Draw Closes</span>
          <span className="font-medium">
            {new Date(new Date(match.common_match_start_time).getTime() - 3600000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {match.note && (
          <div className="pt-1 border-t border-border text-muted-foreground text-xs">{match.note}</div>
        )}
      </div>

      {/* Positions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">{match.team1_name}</h3>
        {team1Positions.map((pos) => (
          <div key={pos.id} className="flex items-center justify-between py-2 border-b border-border text-sm">
            <span className="font-mono text-xs text-muted-foreground w-16">{pos.position_label}</span>
            <span className="flex-1">{pos.player_name ?? <span className="text-muted-foreground italic">No Player</span>}</span>
            <span className="text-right w-16 font-medium">{pos.score ?? '—'}</span>
          </div>
        ))}

        <h3 className="text-sm font-semibold pt-2">{match.team2_name}</h3>
        {team2Positions.map((pos) => (
          <div key={pos.id} className="flex items-center justify-between py-2 border-b border-border text-sm">
            <span className="font-mono text-xs text-muted-foreground w-16">{pos.position_label}</span>
            <span className="flex-1">{pos.player_name ?? <span className="text-muted-foreground italic">No Player</span>}</span>
            <span className="text-right w-16 font-medium">{pos.score ?? '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
