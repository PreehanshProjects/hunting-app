import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2, VolumeX, Menu, X, Shield, Map as MapIcon, BookOpen, User, Home,
  Crosshair, PawPrint, NotebookPen, Award, Footprints, Building2,
  CalendarDays, Zap, Scissors, HeartPulse, ScanEye, ChevronDown,
} from 'lucide-react'

function DeerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M 50 38 C 48 34 45 30 42 26 C 40 23 38 20 36 17 C 37 19 37 22 38 25 C 35 22 32 18 30 14 C 31 18 32 22 34 26 C 31 24 28 21 26 18 C 28 22 30 26 33 30 C 30 29 27 27 25 25 C 27 29 30 33 34 36 C 36 37 38 38 40 38 Z" />
      <path d="M 50 38 C 52 34 55 30 58 26 C 60 23 62 20 64 17 C 63 19 63 22 62 25 C 65 22 68 18 70 14 C 69 18 68 22 66 26 C 69 24 72 21 74 18 C 72 22 70 26 67 30 C 70 29 73 27 75 25 C 73 29 70 33 66 36 C 64 37 62 38 60 38 Z" />
      <ellipse cx="40" cy="46" rx="5" ry="7" transform="rotate(-20 40 46)" />
      <ellipse cx="60" cy="46" rx="5" ry="7" transform="rotate(20 60 46)" />
      <ellipse cx="50" cy="54" rx="13" ry="14" />
      <ellipse cx="50" cy="64" rx="8" ry="6" />
      <ellipse cx="50" cy="67" rx="4" ry="2.5" fill="white" opacity="0.25" />
      <ellipse cx="44" cy="51" rx="2.2" ry="2.5" fill="white" opacity="0.9" />
      <ellipse cx="44.5" cy="51.5" rx="1.1" ry="1.3" fill="black" opacity="0.8" />
      <ellipse cx="56" cy="51" rx="2.2" ry="2.5" fill="white" opacity="0.9" />
      <ellipse cx="55.5" cy="51.5" rx="1.1" ry="1.3" fill="black" opacity="0.8" />
    </svg>
  )
}

import { useAppStore } from '../../store/useAppStore'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useTranslation } from 'react-i18next'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type NavItem = { name: string; path: string; icon: React.FC<{ className?: string }> }
type NavGroup = { label: string; items: NavItem[] }

// ── Dropdown group component ───────────────────────────────────────────────────
function DropdownGroup({
  group,
  isActive,
}: {
  group: NavGroup
  isActive: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const groupActive = group.items.some((i) => i.path === location.pathname)

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={cn(
          'flex items-center gap-1 text-sm font-medium tracking-wide transition-colors hover:text-forest-400',
          groupActive || isActive ? 'text-forest-400' : 'text-white/70'
        )}
      >
        {group.label}
        <ChevronDown
          className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-forest-950/95 backdrop-blur-xl border border-forest-800 rounded-xl shadow-2xl overflow-hidden"
          >
            {group.items.map((item) => {
              const Icon = item.icon
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-forest-800/60',
                    active ? 'text-forest-400 bg-forest-900/50' : 'text-white/70'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null)
  const location = useLocation()
  const { soundEnabled, toggleSound, xp, level } = useAppStore()
  const { t, i18n } = useTranslation()

  // ── Nav structure ────────────────────────────────────────────────────────────
  const navGroups: NavGroup[] = [
    {
      label: t('nav.group_wildlife'),
      items: [
        { name: t('nav.wildlife'), path: '/wildlife', icon: DeerIcon },
        { name: t('nav.tracks'), path: '/tracks', icon: Footprints },
        { name: t('nav.speciesquiz'), path: '/speciesquiz', icon: ScanEye },
        { name: t('nav.zones'), path: '/zones', icon: MapIcon },
      ],
    },
    {
      label: t('nav.group_learn'),
      items: [
        { name: t('nav.guide'), path: '/guide', icon: BookOpen },
        { name: t('nav.law'), path: '/law', icon: Shield },
        { name: t('nav.firstaid'), path: '/firstaid', icon: HeartPulse },
      ],
    },
    {
      label: t('nav.group_gear'),
      items: [
        { name: t('nav.arsenal'), path: '/arsenal', icon: Crosshair },
        { name: t('nav.ammo'), path: '/ammo', icon: Zap },
        { name: t('nav.dogs'), path: '/dogs', icon: PawPrint },
        { name: t('nav.processing'), path: '/processing', icon: Scissors },
      ],
    },
    {
      label: t('nav.group_myhunt'),
      items: [
        { name: t('nav.journal'), path: '/journal', icon: NotebookPen },
        { name: t('nav.trophy'), path: '/trophy', icon: Award },
        { name: t('nav.calendar'), path: '/calendar', icon: CalendarDays },
        { name: t('nav.estates'), path: '/estates', icon: Building2 },
      ],
    },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setMobileOpenGroup(null)
  }, [location.pathname])

  const xpProgress = (xp % 200) / 200 * 100
  const lang = i18n.language
  const LANGS = ['en', 'fr', 'mc']
  const cycleLang = () => {
    const next = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]
    i18n.changeLanguage(next)
  }
  const langLabel = lang === 'fr' ? 'FR' : lang === 'mc' ? 'MC' : 'EN'

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-[100] transition-all duration-300 border-b border-transparent',
        isScrolled ? 'h-16 bg-forest-950/80 backdrop-blur-xl border-forest-800' : 'h-24 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-10 h-10 bg-forest-600 rounded-lg flex items-center justify-center group-hover:bg-forest-500 transition-colors">
            <DeerIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter uppercase italic">Rusa</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Home — direct link */}
          <Link
            to="/"
            className={cn(
              'relative text-sm font-medium tracking-wide transition-colors hover:text-forest-400',
              location.pathname === '/' ? 'text-forest-400' : 'text-white/70'
            )}
          >
            <Home className="w-4 h-4" />
            {location.pathname === '/' && (
              <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-forest-500" />
            )}
          </Link>

          {/* Grouped dropdowns */}
          {navGroups.map((group) => (
            <DropdownGroup key={group.label} group={group} isActive={false} />
          ))}

          {/* Dashboard — direct link */}
          <Link
            to="/dashboard"
            className={cn(
              'relative text-sm font-medium tracking-wide transition-colors hover:text-forest-400',
              location.pathname === '/dashboard' ? 'text-forest-400' : 'text-white/70'
            )}
          >
            <User className="w-4 h-4" />
            {location.pathname === '/dashboard' && (
              <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-forest-500" />
            )}
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={cycleLang}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-900/50 border border-forest-800 hover:bg-forest-800 transition-colors text-xs font-bold tracking-widest uppercase text-forest-400"
          >
            {langLabel}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-full bg-forest-900/50 border border-forest-800 flex items-center justify-center hover:bg-forest-800 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-forest-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-white/50" />
            )}
          </button>

          {/* XP Bar */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
              <span>LVL {level}</span>
              <span className="text-forest-500">{xp} XP</span>
            </div>
            <div className="w-24 h-1.5 bg-forest-900 rounded-full overflow-hidden border border-forest-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-forest-500 shadow-[0_0_10px_rgba(58,122,48,0.5)]"
              />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[101] bg-forest-950 lg:hidden flex flex-col overflow-y-auto"
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-6 border-b border-forest-800 flex-shrink-0">
              <span className="text-2xl font-display font-bold italic">RUSA</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={cycleLang}
                  className="px-3 py-1.5 rounded-full bg-forest-900 border border-forest-800 text-xs font-bold tracking-widest uppercase text-forest-400"
                >
                  {langLabel}
                </button>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Mobile nav groups */}
            <div className="flex flex-col p-6 gap-2">
              {/* Home */}
              <Link
                to="/"
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl text-xl font-display italic transition-colors',
                  location.pathname === '/' ? 'text-forest-500 bg-forest-900/50' : 'text-white hover:bg-forest-900/30'
                )}
              >
                <Home className="w-6 h-6" />
                {t('nav.home')}
              </Link>

              {/* Grouped accordion sections */}
              {navGroups.map((group) => {
                const isOpen = mobileOpenGroup === group.label
                const groupActive = group.items.some((i) => i.path === location.pathname)
                return (
                  <div key={group.label} className="rounded-xl overflow-hidden border border-forest-800/50">
                    <button
                      onClick={() => setMobileOpenGroup(isOpen ? null : group.label)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 text-left text-xl font-display italic transition-colors',
                        groupActive ? 'text-forest-500 bg-forest-900/50' : 'text-white hover:bg-forest-900/30'
                      )}
                    >
                      {group.label}
                      <ChevronDown
                        className={cn('w-5 h-5 transition-transform duration-200 flex-shrink-0', isOpen && 'rotate-180')}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-forest-900/30"
                        >
                          {group.items.map((item, i) => {
                            const Icon = item.icon
                            const active = location.pathname === item.path
                            return (
                              <motion.div
                                key={item.path}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                              >
                                <Link
                                  to={item.path}
                                  className={cn(
                                    'flex items-center gap-3 px-6 py-3 text-base transition-colors',
                                    active ? 'text-forest-400' : 'text-white/70 hover:text-white'
                                  )}
                                >
                                  <Icon className="w-5 h-5 flex-shrink-0" />
                                  {item.name}
                                </Link>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl text-xl font-display italic transition-colors',
                  location.pathname === '/dashboard' ? 'text-forest-500 bg-forest-900/50' : 'text-white hover:bg-forest-900/30'
                )}
              >
                <User className="w-6 h-6" />
                {t('nav.dashboard')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
