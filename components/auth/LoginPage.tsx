// components/auth/LoginPage.tsx
'use client'

import { useState } from 'react'
import { useCheckNumber } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'

export default function LoginPage() {
  const [mobile, setMobile]   = useState('')
  const { mutate, isPending } = useCheckNumber()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mobile.trim()) mutate(mobile.trim())
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">MatchTicket 🎟️</h1>
          <p className="text-sm text-muted-foreground">Enter your mobile number to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={isPending}
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={!mobile.trim() || isPending}>
            {isPending ? 'Checking...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  )
}
