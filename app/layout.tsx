import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'محرك البحث الذكي - AI Search Engine',
  description: 'محرك بحث متطور يعمل بالذكاء الاصطناعي',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
