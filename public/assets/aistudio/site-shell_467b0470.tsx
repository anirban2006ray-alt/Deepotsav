'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DiyaIcon, MenuIcon } from './icons'
import { AmbientSoundButton, FestivalEffects } from './immersive-effects'

const links = [
  ['Diya', '/diya'],
  ['Rangoli', '/rangoli'],
  ['The Story', '/ramayana'],
  ['Ravana Dahan', '/ravana-dahan'],
  ['Gallery', '/gallery'],
  ['Greeting', '/greeting'],
  ['About', '/about'],
] as const

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <DiyaIcon />
        </span>
        <span>
          Diwali <b>3D</b>
        </span>
      </Link>
      <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <Link className={`nav-link ${pathname === href ? 'active' : ''}`} href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <AmbientSoundButton />
        <Link className="header-cta hidden sm:inline-flex" href="/diya">
          Start experience
        </Link>
        <details className="mobile-menu lg:hidden">
          <summary aria-label="Open menu">
            <MenuIcon />
          </summary>
          <nav>
            {links.map(([label, href]) => (
              <Link className={pathname === href ? 'active' : ''} href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <>
      <FestivalEffects />
      <footer className="border-t border-white/8 px-5 py-10 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 text-sm text-[#7F7465] md:flex-row md:items-end md:justify-between">
          <div>
            <Link className="brand mb-4" href="/">
              <span className="brand-mark">
                <DiyaIcon />
              </span>
              <span>
                Diwali <b>3D</b>
              </span>
            </Link>
            <p>Art, culture and technology—illuminated.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map(([label, href]) => (
              <Link className="hover:text-[#FFC65A]" href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
