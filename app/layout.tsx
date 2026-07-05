import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BuildReady Blueprint — Turn your idea into a build-ready spec',
    template: '%s · BuildReady Blueprint',
  },
  description:
    'BuildReady Blueprint transforms your project idea into a build-ready, AI-generated blueprint with clear scope, tech stack, and step-by-step plan — in minutes.',
  keywords: [
    'blueprint',
    'project spec',
    'AI blueprint',
    'build plan',
    'tech stack',
    'product spec',
    'BuildReady',
  ],
  authors: [{ name: 'BuildReady' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'BuildReady Blueprint — Turn your idea into a build-ready spec',
    description:
      'Transform your project idea into a build-ready, AI-generated blueprint with clear scope, tech stack, and step-by-step plan — in minutes.',
    siteName: 'BuildReady Blueprint',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'BuildReady Blueprint',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildReady Blueprint',
    description:
      'Turn your idea into a build-ready, AI-generated blueprint with clear scope, tech stack, and plan.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
