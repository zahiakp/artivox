import React from 'react'
import { Inter } from 'next/font/google'
import '../globals.css'
import { FaRegUserCircle } from 'react-icons/fa'
import { TbSmartHome } from 'react-icons/tb'
import FooterNav from './FooterNav'
import { brandName } from '../data/branding'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Student Fest Panel',
  description: 'Festival participant management system',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center h-16">
                {/* Logo and Title */}
                <div className="flex items-center justify-center flex-col">
                    <h1 className="text-xl font-bold text-gray-900">{brandName}</h1>
                    <p className="text-sm text-gray-500">Student Panel</p>
                  
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            {children}
          </main>

          {/* Footer - Simple Navbar Style */}
          <FooterNav/>
        </div>
      </body>
    </html>
  )
}