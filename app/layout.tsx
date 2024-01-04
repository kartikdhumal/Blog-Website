import Navbar from '@/components/navbar/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import getCurrentUser from './actions/getCurrentUser'
import { TProvider } from '@/providers/toast-provider'
import getBlogs from './actions/getBlogs'
import { HomeProps } from '@/utils/mytypes'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DKTales',
  description: "Kartik Dhumal's blog app",
}

export default async function RootLayout({
  children,
}: HomeProps & { children: React.ReactNode }) {
  const currentUser = await getCurrentUser()

  return (
    <html lang="en">
      <body className={inter.className}>
        <TProvider />
        <Navbar currentUser={currentUser} />
        {children}
      </body>
    </html>
  )
}
