// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import ReactQueryProvider from '@/components/shared/ReactQueryProvider'

export const metadata: Metadata = {
  title:       'MatchTicket',
  description: 'Cricket match draw app',
  manifest:    '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'MatchTicket' },
}

export const viewport: Viewport = {
  themeColor:    '#01696f',
  width:         'device-width',
  initialScale:  1,
  maximumScale:  1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
