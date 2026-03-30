// components/matches/DrawRevealSheet.tsx
'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Ticket } from 'lucide-react'
import TicketChip from '@/components/shared/TicketChip'

interface Props {
  open:            boolean
  onClose:         () => void
  entry:           { drawbox: number; slot: number; position_label: string | null }
  matchId:         number
  entryTicket:     number
  onOpenAnother:   () => void
  canOpenAnother:  boolean
}

export default function DrawRevealSheet({ open, onClose, entry, entryTicket, onOpenAnother, canOpenAnother }: Props) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader className="text-center pb-4">
          <SheetTitle>🎰 Draw Opened!</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-5xl font-bold text-primary animate-bounce">
            {entry.slot}
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold">Box #{entry.drawbox}</p>
            <p className="text-muted-foreground">
              Your position: <span className="font-mono font-semibold text-foreground">{entry.position_label ?? `Slot ${entry.slot}`}</span>
            </p>
          </div>

          <TicketChip />
        </div>

        <div className="flex gap-3 pt-4">
          {canOpenAnother && (
            <Button variant="outline" className="flex-1" onClick={() => { onClose(); onOpenAnother() }}>
              <Ticket size={14} className="mr-1.5" />
              Open Another · {entryTicket}🎫
            </Button>
          )}
          <Button className="flex-1" onClick={onClose}>Done</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
