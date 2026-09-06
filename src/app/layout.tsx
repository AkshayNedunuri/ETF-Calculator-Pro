
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'ETF Calculator India - SIP & Lumpsum Returns',
    description: 'Free ETF Investment Calculator for Indian investors. Calculate returns on SIP, Lumpsum with Step-up and Inflation adjustment. Plan your financial goals today.',
    keywords: ['ETF Calculator India', 'SIP ETF Returns Calculator', 'Long Term Investment Calculator India', 'Mutual Fund Calculator', 'Compound Interest Calculator'],
}

import { Providers } from '@/components/Providers'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html >
    )
}
