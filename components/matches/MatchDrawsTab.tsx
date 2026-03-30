// components/matches/MatchDrawsTab.tsx
'use client'

import { useState } from 'react'
import type { Match } from '@/models/match'
import { useMyDraws, useOpenDraw } from '@/hooks/useDraws'
import { useProfile } from '@/hooks/useUsers'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Ticket } from 'lucide-react'
import TicketChip from '@/components/shared/TicketChip'
import EmptyState from '@/components/shared/EmptyState'
import DrawRevealSheet from './DrawRevealSheet'
import { cn } from '@/lib/utils'

export default function MatchDrawsTab({ match }: { match: Match }) {
  const { data: me }      = useProfile()
  const { data: myDraws, isLoading } = useMyDraws(match.id)
  const openDrawMutation  = useOpenDraw(match.id)
  const [lastEntry, setLastEntry] = useState<any>(null)
  const [showReveal, setShowReveal] = useState(false)

  const canDraw      = match.status === 'active' && Number(me?.tickets ?? 0) >= match.entry_ticket
  const draws        = myDraws ?? []

  const handleOpenDraw = () => {
    openDrawMutation.mutate(undefined, {
      onSuccess: (res) => {
        setLastEntry(res.data)
        setShowReveal(true)
      },
    })
  }

  const STATUS_STYLE: Record<string, string> = {
    open:     'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    full:     'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    counted:  'bg-primary/10 text-primary',
    void:     'bg-muted text-muted-foreground line-through',
  }

  return (
    <div className="space-y-4 pb-32">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <TicketChip />
        {canDraw && (
          <Button size="sm" onClick={handleOpenDraw} disabled={openDrawMutation.isPending}>
            <Ticket size={14} className="mr-1.5" />
            {openDrawMutation.isPending ? 'Opening...' : `Open Draw · ${match.entry_ticket}🎫`}
          </Button>
        )}
        {match.status !== 'active' && (
          <span className="text-xs text-muted-foreground">Draws {match.status === 'upcoming' ? 'not open yet' : 'closed'}</span>
        )}
      </div>

      {/* Draw boxes */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : draws.length === 0 ? (
        <EmptyState
          icon={<Ticket size={32} />}
          title="No draws yet"
          message={canDraw ? "Tap 'Open Draw' to participate in this match." : 'You haven\'t opened any draws for this match.'}
        />
      ) : (
        <div className="space-y-3">
          {draws.map((box) => (
            <div key={box.id} className={cn('rounded-xl border border-border bg-card p-4 space-y-2', box.status === 'void' && 'opacity-60')}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Box #{box.box_number}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_STYLE[box.status])}>
                  {box.status === 'void' ? 'Void · Refunded' : box.status.charAt(0).toUpperCase() + box.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Your slot </span>
                  <span className="font-mono font-medium">{box.position_label ?? `Slot ${box.my_slot}`}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {box.entries_count}/10 entries
                </div>
              </div>

              {box.winner_slots.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-primary font-medium pt-1 border-t border-border">
                  <Trophy size={12} />
                  {box.winner_slots.includes(box.my_slot!) ? '🎉 You won!' : `Winner: Slot ${box.winner_slots.join(', ')}`}
                </div>
              )}

              {box.status === 'open' && (
                <div className="text-xs text-muted-foreground">
                  {box.slots_remaining} slot{box.slots_remaining !== 1 ? 's' : ''} remaining
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reveal sheet */}
      {lastEntry && (
        <DrawRevealSheet
          open={showReveal}
          onClose={() => setShowReveal(false)}
          entry={lastEntry}
          matchId={match.id}
          entryTicket={match.entry_ticket}
          onOpenAnother={handleOpenDraw}
          canOpenAnother={canDraw}
        />
      )}
    </div>
  )
}
