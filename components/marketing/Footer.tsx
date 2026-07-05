import Link from 'next/link'

export function Footer() {
  const cols = [
    { title: 'Product', links: [{ href: '/start', label: 'Start' }, { href: '/pricing', label: 'Pricing' }, { href: '/examples', label: 'Examples' }] },
    { title: 'Company', links: [{ href: '/contact', label: 'Contact' }, { href: '/faq', label: 'FAQ' }] },
    { title: 'Legal', links: [{ href: '/privacy', label: 'Privacy' }, { href: '/terms', label: 'Terms' }] },
  ]

  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm text-white">B</span>
              BuildReady
            </Link>
            <p className="mt-2 text-sm text-gray-500">AI website blueprints in minutes.</p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}><Link href={l.href} className="text-sm text-gray-500 hover:text-brand-600">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-400">
          © {new Date().getFullYear()} BuildReady Blueprint. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
