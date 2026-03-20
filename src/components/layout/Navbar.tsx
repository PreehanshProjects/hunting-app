import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Menu, X, Shield, Map as MapIcon, BookOpen, User, Home } from 'lucide-react'

function DeerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Left antler */}
      <path d="
        M 50 38
        C 48 34 45 30 42 26
        C 40 23 38 20 36 17
        C 37 19 37 22 38 25
        C 35 22 32 18 30 14
        C 31 18 32 22 34 26
        C 31 24 28 21 26 18
        C 28 22 30 26 33 30
        C 30 29 27 27 25 25
        C 27 29 30 33 34 36
        C 36 37 38 38 40 38
        Z
      " />
      {/* Right antler */}
      <path d="
        M 50 38
        C 52 34 55 30 58 26
        C 60 23 62 20 64 17
        C 63 19 63 22 62 25
        C 65 22 68 18 70 14
        C 69 18 68 22 66 26
        C 69 24 72 21 74 18
        C 72 22 70 26 67 30
        C 70 29 73 27 75 25
        C 73 29 70 33 66 36
        C 64 37 62 38 60 38
        Z
      " />
      {/* Left ear */}
      <ellipse cx="40" cy="46" rx="5" ry="7" transform="rotate(-20 40 46)" />
      {/* Right ear */}
      <ellipse cx="60" cy="46" rx="5" ry="7" transform="rotate(20 60 46)" />
      {/* Head */}
      <ellipse cx="50" cy="54" rx="13" ry="14" />
      {/* Snout */}
      <ellipse cx="50" cy="64" rx="8" ry="6" />
      {/* Nose */}
      <ellipse cx="50" cy="67" rx="4" ry="2.5" fill="white" opacity="0.25" />
      {/* Left eye */}
      <ellipse cx="44" cy="51" rx="2.2" ry="2.5" fill="white" opacity="0.9" />
      <ellipse cx="44.5" cy="51.5" rx="1.1" ry="1.3" fill="black" opacity="0.8" />
      {/* Right eye */}
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

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { soundEnabled, toggleSound, xp, level } = useAppStore()
  const { t, i18n } = useTranslation()

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: Home },
    { name: t('nav.wildlife'), path: '/wildlife', icon: DeerIcon },
    { name: t('nav.guide'), path: '/guide', icon: BookOpen },
    { name: t('nav.law'), path: '/law', icon: Shield },
    { name: t('nav.zones'), path: '/zones', icon: MapIcon },
    { name: t('nav.dashboard'), path: '/dashboard', icon: User },
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
  const isFR = i18n.language === 'fr'

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-[100] transition-all duration-300 border-b border-transparent',
        isScrolled ? 'h-16 bg-forest-950/80 backdrop-blur-xl border-forest-800' : 'h-24 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-forest-600 rounded-lg flex items-center justify-center group-hover:bg-forest-500 transition-colors">
            <DeerIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter uppercase italic">Rusa</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'relative text-sm font-medium tracking-wide transition-colors hover:text-forest-400',
                location.pathname === link.path ? 'text-forest-400' : 'text-white/70'
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-forest-500"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={() => i18n.changeLanguage(isFR ? 'en' : 'fr')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-900/50 border border-forest-800 hover:bg-forest-800 transition-colors text-xs font-bold tracking-widest uppercase"
          >
            <span className={isFR ? 'text-white/40' : 'text-forest-400'}>EN</span>
            <span className="text-white/20">|</span>
            <span className={isFR ? 'text-forest-400' : 'text-white/40'}>FR</span>
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
            className="fixed inset-0 z-[101] bg-forest-950 lg:hidden flex flex-col p-10"
          >
            <div className="flex items-center justify-between mb-12">
              <span className="text-2xl font-display font-bold italic">RUSA</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => i18n.changeLanguage(isFR ? 'en' : 'fr')}
                  className="px-3 py-1.5 rounded-full bg-forest-900 border border-forest-800 text-xs font-bold tracking-widest uppercase"
                >
                  {isFR ? 'EN' : 'FR'}
                </button>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      'flex items-center gap-4 text-3xl font-display italic transition-colors',
                      location.pathname === link.path ? 'text-forest-500' : 'text-white'
                    )}
                  >
                    <link.icon className="w-8 h-8" />
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
