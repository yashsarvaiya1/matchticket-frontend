// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/lib/providers'

export const metadata: Metadata = {
  title: 'MatchTicket',
  description: 'Cricket match draw app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MatchTicket',
  },
}

export const viewport: Viewport = {
  themeColor: '#01696f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
