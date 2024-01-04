import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/react';


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Strava for Sleep',
  description: 'Social Sleep Tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
          <Toaster />
          <Analytics />
        </main>
      </body>
    </html>
  )
}
