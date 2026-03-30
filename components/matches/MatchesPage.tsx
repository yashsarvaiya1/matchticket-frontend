// components/matches/MatchesPage.tsx
'use client'

import { useState } from 'react'
import { useMatches } from '@/hooks/useMatches'
import { useAuthStore } from '@/stores/authStore'
import PageHeader from '@/components/shared/PageHeader'
import MatchCard from './MatchCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { MatchStatus } from '@/models/match'

const STATUS_TABS: { label: string; value: MatchStatus | 'all' }[] = [
  { label: 'All',         value: 'all'         },
  { label: 'Active',      value: 'active'      },
  { label: 'Draw Closed', value: 'draw_closed' },
  { label: 'Ended',       value: 'ended'       },
  { label: 'Concluded',   value: 'concluded'   },
]

export default function MatchesPage() {
  const isAdmin = useAuthStore((s) => s.isAdmin())
  const [tab, setTab]   = useState<MatchStatus | 'all'>('all')
  const { data, isLoading } = useMatches(tab !== 'all' ? { status: tab } : undefined)

  const matches = data?.results ?? []

  return (
    <div>
      <PageHeader title="Matches" />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        {[...STATUS_TABS, ...(isAdmin ? [{ label: 'Upcoming', value: 'upcoming' as MatchStatus }] : [])].map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              tab === t.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 space-y-3 pb-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : matches.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No matches found.</div>
        ) : (
          matches.map((match) => <MatchCard key={match.id} match={match} />)
        )}
      </div>
    </div>
  )
}
