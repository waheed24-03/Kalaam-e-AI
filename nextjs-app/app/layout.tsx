import type { Metadata } from 'next'
import { Lora, Playfair_Display } from 'next/font/google'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Poetry Companion AI',
  description: 'Your creative partner for writing poems and lyrics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}