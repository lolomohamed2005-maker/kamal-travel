import { motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { useSiteSettings } from '../../hooks/useSiteSettings'

export function whatsappLink(number: string, text: string) {
  const digits = number.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function WhatsAppButton() {
  const { settings } = useSiteSettings()
  const number = settings.whatsapp_number

  if (!number) return null

  return (
    <motion.a
      href={whatsappLink(number, 'Hello, I would like to ask about a trip to Turkey.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 2.4 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl"
    >
      <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25d366]" />
      <MessageCircle size={26} strokeWidth={1.8} className="relative" />
    </motion.a>
  )
}
