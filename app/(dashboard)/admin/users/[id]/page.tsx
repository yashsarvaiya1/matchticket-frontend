// app/(dashboard)/admin/users/[id]/page.tsx
import UserDetailPage from '@/components/users/UserDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  return <UserDetailPage userId={Number(resolvedParams.id)} />
}
