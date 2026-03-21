import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2, VolumeX, Menu, X, Shield, Map as MapIcon, BookOpen, User, Home,
  Crosshair, PawPrint, NotebookPen, Award, Footprints, Building2,
  CalendarDays, Zap, Scissors, HeartPulse, ScanEye, ChevronDown,
  MapPin, Droplets, ScrollText, Target, Wrench, ClipboardList,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useTranslation } from 'react-i18next'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

type NavItem = { name: string; path: string; icon: React.FC<{ className?: string }> }
type NavGroup = { label: string; items: NavItem[] }

// ── Desktop dropdown ──────────────────────────────────────────────────────────
function DropdownGroup({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const groupActive = group.items.some((i) => i.path === location.pathname)

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
          groupActive ? 'text-forest-400' : 'text-white/70'
        )}
      >
        {group.label}
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')} />
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

// ── Mobile menu — rendered via portal so it always covers the full viewport ──
function MobileMenu({
  open,
  onClose,
  navGroups,
  langLabel,
  cycleLang,
}: {
  open: boolean
  onClose: () => void
  navGroups: NavGroup[]
  langLabel: string
  cycleLang: () => void
}) {
  const location = useLocation()
  const { t } = useTranslation()
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  // Reset open group on route change
  useEffect(() => { setOpenGroup(null) }, [location.pathname])

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          // Portal renders directly in body — no containing block issues
          style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
          className="bg-forest-950 flex flex-col lg:hidden"
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-forest-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
                <DeerIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold italic">RUSA</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={cycleLang}
                className="px-3 py-1.5 rounded-full bg-forest-900 border border-forest-800 text-xs font-bold tracking-widest uppercase text-forest-400"
              >
                {langLabel}
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-forest-900/60 border border-forest-800 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── Scrollable nav content ── */}
          <div className="flex-1 overflow-y-auto py-3 px-4 space-y-1">

            {/* Home */}
            <Link
              to="/"
              className={cn(
                'flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-semibold transition-colors',
                location.pathname === '/'
                  ? 'text-forest-400 bg-forest-900/60 border border-forest-700'
                  : 'text-white/80 hover:bg-forest-900/40 border border-transparent'
              )}
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-forest-800/60">
                <Home className="w-5 h-5" />
              </span>
              {t('nav.home')}
            </Link>

            {/* Divider */}
            <div className="h-px bg-forest-800/60 my-2" />

            {/* Grouped accordion sections */}
            {navGroups.map((group) => {
              const isOpen = openGroup === group.label
              const groupActive = group.items.some((i) => i.path === location.pathname)
              return (
                <div key={group.label}>
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : group.label)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-semibold transition-colors border',
                      groupActive
                        ? 'text-forest-400 bg-forest-900/60 border-forest-700'
                        : isOpen
                        ? 'text-white bg-forest-900/40 border-forest-800'
                        : 'text-white/80 hover:bg-forest-900/40 border-transparent'
                    )}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={cn('w-5 h-5 text-white/40 transition-transform duration-200', isOpen && 'rotate-180')}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 mb-2 ml-2 rounded-xl border border-forest-800/60 bg-forest-900/20 overflow-hidden">
                          {group.items.map((item, i) => {
                            const Icon = item.icon
                            const active = location.pathname === item.path
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-3.5 text-base transition-colors',
                                  i < group.items.length - 1 && 'border-b border-forest-800/40',
                                  active
                                    ? 'text-forest-400 bg-forest-800/40'
                                    : 'text-white/70 hover:text-white hover:bg-forest-800/30'
                                )}
                              >
                                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-forest-800/60 flex-shrink-0">
                                  <Icon className="w-4 h-4" />
                                </span>
                                {item.name}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {/* Divider */}
            <div className="h-px bg-forest-800/60 my-2" />

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className={cn(
                'flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-semibold transition-colors border',
                location.pathname === '/dashboard'
                  ? 'text-forest-400 bg-forest-900/60 border-forest-700'
                  : 'text-white/80 hover:bg-forest-900/40 border-transparent'
              )}
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-forest-800/60">
                <User className="w-5 h-5" />
              </span>
              {t('nav.dashboard')}
            </Link>

            {/* Bottom padding so last item isn't against edge */}
            <div className="h-6" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { soundEnabled, toggleSound, xp, level } = useAppStore()
  const { t, i18n } = useTranslation()

  const navGroups: NavGroup[] = [
    {
      label: t('nav.group_wildlife'),
      items: [
        { name: t('nav.wildlife'), path: '/wildlife', icon: DeerIcon },
        { name: t('nav.tracks'), path: '/tracks', icon: Footprints },
        { name: t('nav.speciesquiz'), path: '/speciesquiz', icon: ScanEye },
        { name: t('nav.zones'), path: '/zones', icon: MapIcon },
        { name: t('nav.sightings'), path: '/sightings', icon: MapPin },
        { name: t('nav.bloodtrail'), path: '/bloodtrail', icon: Droplets },
      ],
    },
    {
      label: t('nav.group_learn'),
      items: [
        { name: t('nav.guide'), path: '/guide', icon: BookOpen },
        { name: t('nav.law'), path: '/law', icon: Shield },
        { name: t('nav.firstaid'), path: '/firstaid', icon: HeartPulse },
        { name: t('nav.licenceguide'), path: '/licenceguide', icon: ScrollText },
      ],
    },
    {
      label: t('nav.group_gear'),
      items: [
        { name: t('nav.arsenal'), path: '/arsenal', icon: Crosshair },
        { name: t('nav.ammo'), path: '/ammo', icon: Zap },
        { name: t('nav.dogs'), path: '/dogs', icon: PawPrint },
        { name: t('nav.processing'), path: '/processing', icon: Scissors },
        { name: t('nav.ballistics'), path: '/ballistics', icon: Target },
        { name: t('nav.maintenance'), path: '/maintenance', icon: Wrench },
      ],
    },
    {
      label: t('nav.group_myhunt'),
      items: [
        { name: t('nav.journal'), path: '/journal', icon: NotebookPen },
        { name: t('nav.trophy'), path: '/trophy', icon: Award },
        { name: t('nav.calendar'), path: '/calendar', icon: CalendarDays },
        { name: t('nav.estates'), path: '/estates', icon: Building2 },
        { name: t('nav.permits'), path: '/permits', icon: ClipboardList },
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
    <>
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

            {navGroups.map((group) => (
              <DropdownGroup key={group.label} group={group} />
            ))}

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
            <button
              onClick={cycleLang}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-900/50 border border-forest-800 hover:bg-forest-800 transition-colors text-xs font-bold tracking-widest uppercase text-forest-400"
            >
              {langLabel}
            </button>

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

            {/* Burger — only shown on mobile */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-forest-900/50 border border-forest-800 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu rendered via portal — escapes nav's containing block */}
      <MobileMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navGroups={navGroups}
        langLabel={langLabel}
        cycleLang={cycleLang}
      />
    </>
  )
}
