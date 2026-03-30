// app/(dashboard)/matches/[id]/page.tsx
import MatchDetailPage from '@/components/matches/MatchDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  return <MatchDetailPage matchId={Number(resolvedParams.id)} />
}
