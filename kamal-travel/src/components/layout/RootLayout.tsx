import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'
import { ScrollProgress } from '../ui/ScrollProgress'

export function RootLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <motion.div
        key={pathname}
        initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-forest"
      >
        <motion.span
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="font-display text-4xl tracking-[0.35em] text-cream"
        >
          KAMAL
        </motion.span>
      </motion.div>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
