import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight, MessageCircle, ShieldCheck, Wallet, GraduationCap } from 'lucide-react'
import { usePackages } from '../hooks/usePackages'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { PackageCard } from '../components/package/PackageCard'
import { Reveal } from '../components/ui/Reveal'
import { Magnetic } from '../components/ui/Magnetic'
import { ImageReveal } from '../components/ui/ImageReveal'
import { FlightRoute } from '../components/ui/FlightRoute'
import { whatsappLink } from '../components/layout/WhatsAppButton'
import { kinds } from '../lib/kinds'
import { resolveSiteImage } from '../lib/siteImages'
import type { Kind } from '../types/database'

const ease = [0.22, 1, 0.36, 1] as const

const destinations = ['Istanbul', 'Cappadocia', 'Antalya']

const steps = [
  { title: 'Pick a package', text: 'Browse trips, study support and summer programs with clear prices in USD.' },
  { title: 'Send a request', text: 'Fill in a short form. No payment and no commitment at this stage.' },
  { title: 'We contact you', text: 'Our team calls or messages you in Arabic to confirm dates and details.' },
  { title: 'Fly to Turkey', text: 'Get your plan, meet your guide and enjoy the trip.' },
]

const reasons = [
  { icon: Wallet, title: 'Clear prices in USD', text: 'The price you see is per person, with what is included listed on every package.' },
  { icon: GraduationCap, title: 'Built for students', text: 'Student-friendly hotels, small groups and plans that fit a student budget.' },
  { icon: ShieldCheck, title: 'Support in Arabic', text: 'Talk to a real person on WhatsApp before, during and after your trip.' },
]

function Balloon({ className, color, delay }: { className: string; color: string; delay: number }) {
  return (
    <motion.svg
      viewBox="0 0 60 90"
      aria-hidden="true"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, delay, ease }}
      className={`animate-float pointer-events-none absolute ${className}`}
    >
      <path d="M30 2C14 2 4 14 4 28c0 14 12 26 22 36h8c10-10 22-22 22-36C56 14 46 2 30 2z" fill={color} />
      <path d="M30 2c-8 8-10 22-4 62M30 2c8 8 10 22 4 62" stroke="rgba(247,240,228,0.45)" strokeWidth="1.2" fill="none" />
      <path d="M26 64l-3 10M34 64l3 10" stroke="#10212b" strokeWidth="1" />
      <rect x="22" y="74" width="16" height="10" rx="2" fill="#10212b" />
    </motion.svg>
  )
}

function Hero({ image }: { image: string }) {
  const ref = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const [kind, setKind] = useState<Kind | ''>('')
  const [destination, setDestination] = useState('')

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 110])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const lines = [['Your', 'Turkey'], ['chapter', 'starts', 'here.']]

  function find(event: React.FormEvent) {
    event.preventDefault()
    const base = kind ? `/packages/${kind}` : '/packages'
    navigate(destination ? `${base}?destination=${encodeURIComponent(destination)}` : base)
  }

  return (
    <section ref={ref} className="relative isolate min-h-screen overflow-hidden bg-forest-dark text-cream">
      <motion.div style={{ y: imageY }} className="absolute inset-0 -z-10">
        {image && (
          <motion.img
            src={image}
            alt="Cappadocia at sunrise"
            initial={{ scale: 1.25 }}
            animate={{ scale: 1.04 }}
            transition={{ duration: 2.8, ease }}
            className="h-[118%] w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/90 via-forest-dark/55 to-forest-dark/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-forest-dark/50" />
      </motion.div>

      <Balloon className="right-[8%] top-[22%] hidden w-14 md:block" color="#d65a31" delay={1.6} />
      <Balloon className="right-[26%] top-[14%] hidden w-9 opacity-80 md:block" color="#2aa7b8" delay={1.9} />
      <Balloon className="right-[3%] top-[48%] hidden w-10 opacity-70 lg:block" color="#f7f0e4" delay={2.2} />

      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 pb-16 pt-28 lg:grid-cols-12">
        <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.7, ease }}
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-moss-light"
          >
            <span className="h-px w-12 bg-moss-light" />
            Student travel, Egypt to Turkey
          </motion.p>

          <h1 className="mt-7 text-[3.6rem] leading-[0.95] sm:text-8xl lg:text-[6.2rem]">
            {lines.map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line.map((word, wordIndex) => (
                  <span key={word} className="mr-[0.2em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span
                      initial={{ y: '115%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1.1, delay: 0.8 + lineIndex * 0.25 + wordIndex * 0.12, ease }}
                      className={`inline-block ${word === 'Turkey' ? 'italic text-clay' : ''}`}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7, ease }}
            className="mt-7 max-w-lg text-lg leading-relaxed text-cream/80"
          >
            Student trips, university visits and summer programs. Transparent prices in US dollars and
            support in Arabic from the first message.
          </motion.p>

          <motion.form
            onSubmit={find}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.9, ease }}
            className="mt-9 max-w-xl rounded-2xl bg-cream/10 p-4 ring-1 ring-cream/20 backdrop-blur-xl"
          >
            <div className="flex flex-wrap gap-2">
              {[{ value: '' as const, short: 'Any' }, ...kinds].map((item) => (
                <button
                  key={item.value || 'any'}
                  type="button"
                  onClick={() => setKind(item.value)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    kind === item.value ? 'bg-cream text-forest' : 'bg-cream/10 text-cream hover:bg-cream/20'
                  }`}
                >
                  {item.short}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <select
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="w-full flex-1 rounded-full bg-cream px-5 py-3 text-sm text-ink outline-none"
              >
                <option value="">Any destination</option>
                {destinations.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center gap-2 rounded-full bg-clay px-7 py-3 text-sm text-cream"
              >
                Find packages
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.4, delay: 1.4, ease }}
          className="hidden lg:col-span-5 lg:block"
        >
          <div className="rounded-3xl bg-cream/10 p-6 text-cream ring-1 ring-cream/20 backdrop-blur-xl">
            <FlightRoute className="w-full" />
            <div className="mt-3 flex items-center justify-between border-t border-cream/15 pt-4 text-sm">
              <span className="text-cream/70">Cairo to Istanbul</span>
              <span className="font-display text-xl">about 3 hours</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-cream/60 md:flex"
      >
        Scroll
        <motion.span
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="block h-9 w-px origin-top bg-clay"
        />
      </motion.div>
    </section>
  )
}

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 26 })

  return (
    <section className="bg-forest py-28 text-cream">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-moss-light">How it works</p>
          <h2 className="mt-4 max-w-2xl text-5xl md:text-7xl">
            Four easy steps from Cairo to <span className="italic text-clay">Turkey.</span>
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-20">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-cream/15 md:block">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-clay" />
          </div>
          <div className="grid gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.15}>
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream font-display text-xl text-forest">
                    {index + 1}
                  </div>
                  <h3 className="mt-6 text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/60">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Home() {
  const { packages } = usePackages({ featured: true, limit: 6 })
  const { settings, loading: settingsLoading } = useSiteSettings()
  const image = (key: string) => (settingsLoading ? '' : resolveSiteImage(settings, key))
  const whatsapp = settings.whatsapp_number
  const marqueeWords = ['Istanbul', 'Cappadocia', 'Antalya', 'Bosphorus', 'Galata', 'Anatolia']

  return (
    <div>
      <Hero image={image('hero_image')} />

      <section className="overflow-hidden border-b border-line py-6">
        <div className="animate-marquee flex w-max gap-14 whitespace-nowrap font-display text-5xl md:text-7xl">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((word, index) => (
            <span key={`${word}-${index}`} className="flex items-center gap-14">
              <span className={index % 2 === 0 ? 'italic text-forest' : 'text-outline'}>{word}</span>
              <span className="text-clay">✦</span>
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-clay">Choose your journey</p>
          <h2 className="mt-4 max-w-3xl text-5xl text-forest md:text-7xl">
            Three ways to experience Turkey.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {kinds.map((kind, index) => (
            <Reveal key={kind.value} delay={index * 0.12} className={index === 1 ? 'md:mt-16' : ''}>
              <Link to={`/packages/${kind.value}`} className="group relative block overflow-hidden rounded-3xl">
                {image(`kind_${kind.value}_image`) && (
                  <ImageReveal
                    src={image(`kind_${kind.value}_image`)}
                    alt={kind.label}
                    delay={index * 0.1}
                    className="aspect-[3/4] bg-sand"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-cream">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-moss-light">0{index + 1}</p>
                  <p className="mt-2 font-display text-4xl">{kind.label}</p>
                  <p className="mt-2 text-sm text-cream/75">{kind.note}</p>
                  <span className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-clay">
                    Explore
                    <span className="block h-px w-8 bg-clay transition-all duration-500 group-hover:w-24" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-clay">Popular right now</p>
              <h2 className="mt-4 text-5xl text-forest md:text-7xl">Featured packages</h2>
            </div>
            <Link to="/packages" className="hidden items-center gap-2 text-xs uppercase tracking-[0.25em] text-forest md:flex">
              View all <ArrowRight size={16} />
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((item, index) => (
              <PackageCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-12 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 0.12}>
              <motion.div
                whileHover={{ rotate: -8, scale: 1.1 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-cream"
              >
                <reason.icon size={26} strokeWidth={1.5} />
              </motion.div>
              <h3 className="mt-6 text-3xl text-forest">{reason.title}</h3>
              <p className="mt-3 text-ink/65">{reason.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <Reveal>
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-forest-dark text-cream">
            {image('cta_image') && (
              <img src={image('cta_image')} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-45" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-forest-dark via-forest-dark/70 to-transparent" />
            <div className="relative px-8 py-24 md:px-16">
              <h2 className="max-w-2xl text-5xl md:text-7xl">
                Ready for your <span className="italic text-clay">first trip?</span>
              </h2>
              <p className="mt-5 max-w-md text-cream/75">
                Tell us where you want to go. We reply on WhatsApp with dates, prices and everything you need.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <Link
                    to="/packages"
                    className="block rounded-full bg-clay px-9 py-4 text-xs uppercase tracking-[0.25em] text-cream"
                  >
                    Browse packages
                  </Link>
                </Magnetic>
                {whatsapp && (
                  <Magnetic>
                    <a
                      href={whatsappLink(whatsapp, 'Hello, I would like to ask about a trip to Turkey.')}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full border border-cream/50 px-9 py-4 text-xs uppercase tracking-[0.25em] text-cream hover:bg-cream hover:text-forest"
                    >
                      <MessageCircle size={16} />
                      Chat with us
                    </a>
                  </Magnetic>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
