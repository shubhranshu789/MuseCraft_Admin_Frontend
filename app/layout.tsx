import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import WhatsAppFloat from '@/components/WhatsAppFloat';
import './globals.css'

import Footer from "../app/Component/Footer/page"

import Chatbot from '@/components/Chatbot'
import { 
  trendingProducts, 
  miniBooks,
  gratitudeReminder,
  magzine,
  deskCalender,
  walletCard,
  whiteBook,
  photoFrame,
  Caricurate,
  Journal,
  Fragrance,
  Magnets,

} from '@/lib/data/products'

// import "../public/logoCompany-removebg-preview.png"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const allProducts = [
    ...trendingProducts,
    ...miniBooks,
    ...gratitudeReminder,
    ...magzine,
    ...deskCalender,
    ...walletCard,
    ...whiteBook,
    ...photoFrame,
    ...Caricurate,
    ...Journal,
    ...Fragrance,
    ...Magnets
  ]

export const metadata: Metadata = {
  title: 'MuseCraft',
  description: 'Creating memorable moments through personalized gifts.',
  generator: 'Shubh',
  
  // Add icons/logo
  icons: {
    icon: '/logoCompany-removebg-preview.png',              
    shortcut: '/logoCompany-removebg-preview.png',    
    apple: '/logoCompany-removebg-preview.png',          
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />

        {/* <WhatsAppFloat /> */}
        {/* <Chatbot allProducts={allProducts} /> */}
      
      </body>

      <Footer/>

      
    </html>
  )
}
