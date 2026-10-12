import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-40 text-center">
      <h1 className="text-5xl text-forest">Page not found</h1>
      <Link to="/" className="mt-6 inline-block text-sm text-clay underline">
        Back to home
      </Link>
    </div>
  )
}
