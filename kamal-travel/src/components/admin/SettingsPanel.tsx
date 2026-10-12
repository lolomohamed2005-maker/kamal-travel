import { useEffect, useState } from 'react'
import { useSiteSettings } from '../../hooks/useSiteSettings'

const fieldClass =
  'mt-1 w-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-forest'

export function SettingsPanel() {
  const { settings, loading, updateSetting } = useSiteSettings()
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setWhatsapp(settings.whatsapp_number ?? '')
    setEmail(settings.contact_email ?? '')
  }, [settings])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    await updateSetting('whatsapp_number', whatsapp.trim())
    await updateSetting('contact_email', email.trim())
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <p className="text-sm text-ink/50">Loading...</p>

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div>
        <label className="text-sm text-ink/70">WhatsApp number (with country code, e.g. 201012345678)</label>
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="201012345678" className={fieldClass} />
      </div>
      <div>
        <label className="text-sm text-ink/70">Contact email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
      </div>
      <button type="submit" className="bg-forest px-6 py-2.5 text-sm text-cream transition-colors hover:bg-forest-dark">
        {saved ? 'Saved' : 'Save settings'}
      </button>
    </form>
  )
}
