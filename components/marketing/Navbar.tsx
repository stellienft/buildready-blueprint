'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/#how-it-works', label: 'How it works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/examples', label: 'Examples' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm text-white">B</span>
          BuildReady
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-brand-600">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link href="/start"><Button size="sm">Start Blueprint</Button></Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gray-100 px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 text-sm font-medium text-gray-600" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/start" className="mt-2 block"><Button className="w-full" size="sm">Start Blueprint</Button></Link>
        </div>
      )}
    </header>
  )
}
