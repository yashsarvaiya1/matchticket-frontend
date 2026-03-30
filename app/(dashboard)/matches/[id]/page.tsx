// app/(dashboard)/matches/[id]/page.tsx
import MatchDetailPage from '@/components/matches/MatchDetailPage'

export default function Page({ params }: { params: { id: string } }) {
  return <MatchDetailPage matchId={Number(params.id)} />
}
