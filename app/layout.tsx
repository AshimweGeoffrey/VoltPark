import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { StoreProvider } from './core/store'
import { AuthProvider } from './core/auth'
import { ToastProvider } from './core/toast'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'VoltPark Kigali - Automated Parking System',
  description:
    'Admin & Driver apps for parking zones, tickets, and payments in Kigali.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]`}
      >
        <AuthProvider>
          <ToastProvider>
            <StoreProvider>
              <main className="flex-1 w-full">{children}</main>
            </StoreProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
