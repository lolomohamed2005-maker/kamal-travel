import { Link } from 'react-router-dom'
import { kinds } from '../../lib/kinds'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { whatsappLink } from './WhatsAppButton'

export function Footer() {
  const { settings } = useSiteSettings()
  const whatsapp = settings.whatsapp_number
  const email = settings.contact_email

  return (
    <footer className="bg-forest-dark text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl tracking-[0.18em]">KAMAL</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">
            Student trips, study support and summer programs for Egyptians travelling to Turkey.
            Clear prices in US dollars and a team that answers you in Arabic.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-moss-light">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            {kinds.map((kind) => (
              <li key={kind.value}>
                <Link to={`/packages/${kind.value}`} className="hover:text-clay">
                  {kind.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/packages" className="hover:text-clay">
                All packages
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-moss-light">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            {whatsapp && (
              <li>
                <a
                  href={whatsappLink(whatsapp, 'Hello, I would like to ask about a trip to Turkey.')}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-clay"
                >
                  WhatsApp: {whatsapp}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="hover:text-clay">
                  {email}
                </a>
              </li>
            )}
            {!whatsapp && !email && <li>Contact details coming soon.</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Kamal. All rights reserved.
      </div>
    </footer>
  )
}
