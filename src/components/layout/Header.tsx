import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { kinds } from '../../lib/kinds'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { pathname } = useLocation()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(latest > 40)
    setHidden(latest > previous && latest > 200)
  })

  const overHero = pathname === '/' && !scrolled

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        overHero ? 'bg-transparent text-cream' : 'border-b border-line bg-cream/90 text-ink backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
            <circle cx="32" cy="32" r="30" className={overHero ? 'fill-cream' : 'fill-forest'} />
            <path d="M38 14a18 18 0 1 0 0 36 14 14 0 1 1 0-36z" className={overHero ? 'fill-forest' : 'fill-cream'} />
            <circle cx="43" cy="22" r="3" className="fill-clay" />
          </svg>
          <span className="font-display text-2xl tracking-[0.18em]">KAMAL</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {kinds.map((kind) => (
            <NavLink
              key={kind.value}
              to={`/packages/${kind.value}`}
              className="group relative text-sm tracking-wide opacity-90 hover:opacity-100"
            >
              {kind.short}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-clay transition-transform duration-500 group-hover:scale-x-100" />
            </NavLink>
          ))}
          <NavLink to="/packages" className="text-sm tracking-wide opacity-90 hover:opacity-100">
            All packages
          </NavLink>
          <Link
            to="/packages"
            className="rounded-full bg-clay px-5 py-2 text-sm text-cream transition-transform duration-300 hover:scale-105"
          >
            Book a trip
          </Link>
        </nav>

        <button className="p-2 md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/60 text-cream md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="ml-auto flex h-full w-72 flex-col gap-7 bg-forest p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <button className="self-end p-2" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={24} strokeWidth={1.5} />
              </button>
              {kinds.map((kind, index) => (
                <motion.div
                  key={kind.value}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.07 }}
                >
                  <NavLink
                    to={`/packages/${kind.value}`}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-3xl"
                  >
                    {kind.label}
                  </NavLink>
                </motion.div>
              ))}
              <NavLink
                to="/packages"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-clay px-6 py-3 text-center text-sm"
              >
                See all packages
              </NavLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
