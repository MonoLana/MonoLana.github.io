import type { Metadata, Viewport } from 'next'
import { Caveat, Shantell_Sans } from 'next/font/google'
import './globals.css'

// Headline (nama + tagline): handwriting tebal
const handDisplay = Caveat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-hand-display',
  display: 'swap',
})

// Kalimat penjelas: handwriting yang rapi dan mudah dibaca
const hand = Shantell_Sans({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mono',
  description: 'A retro desktop portfolio of useful systems, data stories, and web experiences.',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${handDisplay.variable} ${hand.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}