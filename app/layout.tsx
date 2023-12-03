import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ToasterContext from './context/ToasterContext';
import AuthContext from './context/AuthContext';
import { EdgeStoreProvider } from '@/lib/edgestore';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resource Hub',
  description: 'All tech resources community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}><AuthContext><ToasterContext/><EdgeStoreProvider>{children}</EdgeStoreProvider></AuthContext></body>
    </html>
  )
}
