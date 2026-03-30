// components/shared/AppShell.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import BottomNav from './BottomNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const access = useAuthStore((s) => s.access)

  useEffect(() => {
    if (!access) router.replace('/login')
  }, [access, router])

  if (!access) return null

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
