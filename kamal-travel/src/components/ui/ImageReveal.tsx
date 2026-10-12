import { motion } from 'motion/react'

interface ImageRevealProps {
  src: string
  alt: string
  className?: string
  delay?: number
}

export function ImageReveal({ src, alt, className = '', delay = 0 }: ImageRevealProps) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        initial={{ scale: 1.35 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.8, delay, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
      />
    </motion.div>
  )
}
