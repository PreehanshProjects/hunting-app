import { useState, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { Heart, Wind, Zap, Brain, Shield } from 'lucide-react'

// ─── Dog SVG Silhouettes ──────────────────────────────────────────────────────

function BassetHoundSVG({ color = '#b45309' }: { color?: string }) {
  return (
    <svg viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Body - long and low */}
      <ellipse cx="165" cy="110" rx="110" ry="38" fill={color} opacity="0.85" />
      {/* Neck */}
      <path d="M 230 88 Q 252 72 258 65 L 272 70 Q 265 80 248 95 Z" fill={color} opacity="0.85" />
      {/* Head */}
      <ellipse cx="276" cy="60" rx="30" ry="26" fill={color} opacity="0.9" />
      {/* Muzzle - droopy long */}
      <path d="M 270 70 Q 310 72 316 84 Q 308 92 285 88 Q 268 84 270 70 Z" fill={color} opacity="0.8" />
      {/* Nose */}
      <ellipse cx="312" cy="83" rx="6" ry="5" fill="black" opacity="0.6" />
      {/* Eye */}
      <circle cx="285" cy="52" r="5" fill="black" opacity="0.7" />
      <circle cx="286" cy="51" r="2" fill="white" opacity="0.4" />
      {/* Long droopy ear */}
      <path d="M 262 46 Q 248 38 240 52 Q 238 78 252 85 Q 262 80 268 68 Z" fill={color} opacity="0.7" />
      {/* Dewlap / loose skin */}
      <path d="M 255 78 Q 250 92 260 96" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none" />
      {/* Front legs - short */}
      <rect x="222" y="138" width="16" height="32" rx="7" fill={color} opacity="0.8" />
      <rect x="200" y="138" width="16" height="32" rx="7" fill={color} opacity="0.8" />
      {/* Back legs - short */}
      <rect x="105" y="138" width="16" height="32" rx="7" fill={color} opacity="0.8" />
      <rect x="83" y="138" width="16" height="32" rx="7" fill={color} opacity="0.8" />
      {/* Paws */}
      <ellipse cx="230" cy="170" rx="10" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="208" cy="170" rx="10" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="113" cy="170" rx="10" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="91" cy="170" rx="10" ry="5" fill={color} opacity="0.6" />
      {/* Tail - upright */}
      <path d="M 55 105 Q 35 90 38 75 Q 42 68 48 72 Q 46 85 60 98 Z" fill={color} opacity="0.7" />
      {/* Wrinkle lines on forehead */}
      <path d="M 270 44 Q 280 40 290 44" stroke={color} strokeWidth="2" opacity="0.4" fill="none" />
      <path d="M 268 50 Q 280 46 292 50" stroke={color} strokeWidth="1.5" opacity="0.3" fill="none" />
    </svg>
  )
}

function BeagleSVG({ color = '#d97706' }: { color?: string }) {
  return (
    <svg viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Body - compact and athletic */}
      <ellipse cx="160" cy="100" rx="100" ry="40" fill={color} opacity="0.85" />
      {/* White belly patch */}
      <ellipse cx="160" cy="112" rx="60" ry="20" fill="white" opacity="0.12" />
      {/* Neck */}
      <path d="M 228 78 Q 248 62 258 56 L 272 62 Q 260 72 242 88 Z" fill={color} opacity="0.85" />
      {/* Head */}
      <ellipse cx="270" cy="52" rx="28" ry="26" fill={color} opacity="0.9" />
      {/* Muzzle */}
      <path d="M 268 62 Q 304 64 308 74 Q 300 82 278 78 Q 266 74 268 62 Z" fill={color} opacity="0.8" />
      {/* Nose */}
      <ellipse cx="304" cy="73" rx="6" ry="5" fill="black" opacity="0.7" />
      {/* Eye */}
      <circle cx="278" cy="46" r="5" fill="black" opacity="0.8" />
      <circle cx="279" cy="45" r="2" fill="white" opacity="0.4" />
      {/* Ear - floppy, medium */}
      <path d="M 255 40 Q 242 34 238 48 Q 240 68 254 72 Q 264 66 266 54 Z" fill={color} opacity="0.7" />
      {/* Front legs */}
      <rect x="220" y="130" width="18" height="36" rx="8" fill={color} opacity="0.8" />
      <rect x="196" y="132" width="18" height="34" rx="8" fill={color} opacity="0.75" />
      {/* Back legs */}
      <rect x="108" y="128" width="18" height="36" rx="8" fill={color} opacity="0.8" />
      <rect x="82" y="132" width="18" height="34" rx="8" fill={color} opacity="0.75" />
      {/* Paws */}
      <ellipse cx="229" cy="166" rx="11" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="205" cy="166" rx="11" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="117" cy="164" rx="11" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="91" cy="164" rx="11" ry="5" fill={color} opacity="0.6" />
      {/* Tail - upright and curved */}
      <path d="M 60 88 Q 40 70 44 52 Q 50 46 56 50 Q 52 66 66 82 Z" fill={color} opacity="0.7" />
      {/* Tricolor marking suggestion */}
      <path d="M 120 62 Q 160 55 200 62" stroke="white" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function RidgebackSVG({ color = '#c2410c' }: { color?: string }) {
  return (
    <svg viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Body - tall and muscular */}
      <ellipse cx="158" cy="95" rx="108" ry="45" fill={color} opacity="0.85" />
      {/* Ridge along back (darker stripe) */}
      <path d="M 90 52 Q 158 46 228 55" stroke={color} strokeWidth="5" opacity="0.5" strokeLinecap="round" fill="none" />
      {/* Neck - strong */}
      <path d="M 230 65 Q 255 48 268 42 L 282 50 Q 268 60 248 80 Z" fill={color} opacity="0.9" />
      {/* Head - refined */}
      <ellipse cx="282" cy="40" rx="28" ry="24" fill={color} opacity="0.9" />
      {/* Muzzle - long */}
      <path d="M 280 50 Q 318 50 322 60 Q 316 68 292 64 Q 278 60 280 50 Z" fill={color} opacity="0.85" />
      {/* Nose */}
      <ellipse cx="318" cy="59" rx="6" ry="5" fill="black" opacity="0.7" />
      {/* Eye */}
      <circle cx="290" cy="34" r="5" fill="black" opacity="0.8" />
      <circle cx="291" cy="33" r="2" fill="white" opacity="0.4" />
      {/* Ear - folded back */}
      <path d="M 268 28 Q 258 22 256 34 Q 258 48 268 52 Q 276 48 278 38 Z" fill={color} opacity="0.65" />
      {/* Muscular chest */}
      <ellipse cx="238" cy="108" rx="22" ry="30" fill={color} opacity="0.6" />
      {/* Front legs - long and muscular */}
      <rect x="222" y="128" width="20" height="42" rx="9" fill={color} opacity="0.85" />
      <rect x="196" y="130" width="20" height="40" rx="9" fill={color} opacity="0.8" />
      {/* Back legs - powerful */}
      <path d="M 95 130 Q 88 148 90 170 L 108 170 Q 106 148 100 130 Z" fill={color} opacity="0.8" rx="8" />
      <path d="M 118 130 Q 112 148 114 170 L 132 170 Q 130 148 124 130 Z" fill={color} opacity="0.75" rx="8" />
      {/* Paws */}
      <ellipse cx="232" cy="170" rx="12" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="206" cy="170" rx="12" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="99" cy="170" rx="12" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="123" cy="170" rx="12" ry="5" fill={color} opacity="0.6" />
      {/* Tail - straight and strong */}
      <path d="M 50 90 Q 28 80 26 65 Q 30 58 36 62 Q 36 75 52 84 Z" fill={color} opacity="0.7" />
    </svg>
  )
}

function SpanielSVG({ color = '#7c3aed' }: { color?: string }) {
  return (
    <svg viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Body - athletic, medium */}
      <ellipse cx="158" cy="100" rx="98" ry="42" fill={color} opacity="0.85" />
      {/* Feathering on belly */}
      <path d="M 120 138 Q 158 148 196 138" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.3" fill="none" />
      {/* Neck */}
      <path d="M 228 76 Q 250 58 262 52 L 274 60 Q 262 70 244 88 Z" fill={color} opacity="0.85" />
      {/* Head - rounded */}
      <ellipse cx="272" cy="50" rx="26" ry="28" fill={color} opacity="0.9" />
      {/* Muzzle */}
      <path d="M 270 62 Q 304 62 308 72 Q 300 80 278 76 Q 268 72 270 62 Z" fill={color} opacity="0.8" />
      {/* Nose */}
      <ellipse cx="304" cy="71" rx="5" ry="5" fill="black" opacity="0.7" />
      {/* Eye - expressive */}
      <circle cx="278" cy="44" r="6" fill="black" opacity="0.8" />
      <circle cx="280" cy="42" r="2.5" fill="white" opacity="0.5" />
      {/* Long floppy ear with feathering */}
      <path d="M 256 36 Q 240 28 234 46 Q 230 72 248 78 Q 260 74 264 60 Z" fill={color} opacity="0.7" />
      {/* Ear feathering lines */}
      <path d="M 238 46 Q 244 68 250 76" stroke="white" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" fill="none" />
      {/* Front legs */}
      <rect x="218" y="132" width="18" height="36" rx="8" fill={color} opacity="0.8" />
      <rect x="194" y="134" width="18" height="34" rx="8" fill={color} opacity="0.75" />
      {/* Back legs */}
      <rect x="108" y="130" width="18" height="36" rx="8" fill={color} opacity="0.8" />
      <rect x="82" y="132" width="18" height="34" rx="8" fill={color} opacity="0.75" />
      {/* Paws with feathering */}
      <ellipse cx="227" cy="168" rx="11" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="203" cy="168" rx="11" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="117" cy="166" rx="11" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="91" cy="166" rx="11" ry="5" fill={color} opacity="0.6" />
      {/* Docked tail - upright */}
      <rect x="54" y="78" width="10" height="28" rx="5" fill={color} opacity="0.7" transform="rotate(-15 54 78)" />
    </svg>
  )
}

function LabradorSVG({ color = '#1d4ed8' }: { color?: string }) {
  return (
    <svg viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Body - strong and solid */}
      <ellipse cx="158" cy="98" rx="105" ry="44" fill={color} opacity="0.85" />
      {/* Neck - thick */}
      <path d="M 232 70 Q 256 52 268 46 L 284 56 Q 270 66 250 86 Z" fill={color} opacity="0.9" />
      {/* Head - broad and blocky */}
      <ellipse cx="278" cy="46" rx="32" ry="28" fill={color} opacity="0.9" />
      {/* Wide muzzle */}
      <path d="M 275 58 Q 316 56 320 68 Q 312 78 285 74 Q 272 68 275 58 Z" fill={color} opacity="0.85" />
      {/* Broad nose */}
      <ellipse cx="316" cy="67" rx="7" ry="6" fill="black" opacity="0.7" />
      {/* Eye */}
      <circle cx="284" cy="40" r="6" fill="black" opacity="0.8" />
      <circle cx="286" cy="38" r="2.5" fill="white" opacity="0.45" />
      {/* Ear - short, folded close */}
      <path d="M 262 32 Q 250 26 248 40 Q 250 56 264 60 Q 274 56 274 44 Z" fill={color} opacity="0.65" />
      {/* Otter tail - thick at base */}
      <path d="M 53 92 Q 32 84 28 68 Q 32 60 40 64 Q 38 78 56 86 Z" fill={color} opacity="0.75" />
      {/* Tail thick base */}
      <ellipse cx="58" cy="90" rx="12" ry="8" fill={color} opacity="0.5" />
      {/* Front legs - strong */}
      <rect x="224" y="130" width="22" height="40" rx="10" fill={color} opacity="0.85" />
      <rect x="198" y="132" width="22" height="38" rx="10" fill={color} opacity="0.8" />
      {/* Back legs */}
      <rect x="104" y="128" width="22" height="40" rx="10" fill={color} opacity="0.85" />
      <rect x="78" y="130" width="22" height="38" rx="10" fill={color} opacity="0.8" />
      {/* Paws - wide */}
      <ellipse cx="235" cy="170" rx="13" ry="6" fill={color} opacity="0.6" />
      <ellipse cx="209" cy="170" rx="13" ry="6" fill={color} opacity="0.6" />
      <ellipse cx="115" cy="168" rx="13" ry="6" fill={color} opacity="0.6" />
      <ellipse cx="89" cy="168" rx="13" ry="6" fill={color} opacity="0.6" />
      {/* Chest highlight */}
      <ellipse cx="248" cy="110" rx="18" ry="28" fill="white" opacity="0.06" />
    </svg>
  )
}

function PointerSVG({ color = '#0f766e' }: { color?: string }) {
  return (
    <svg viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Body - lean and elegant */}
      <ellipse cx="155" cy="92" rx="105" ry="38" fill={color} opacity="0.85" />
      {/* Neck - elegant arch */}
      <path d="M 232 66 Q 260 44 274 38 L 286 48 Q 272 56 252 80 Z" fill={color} opacity="0.85" />
      {/* Head - refined long muzzle */}
      <ellipse cx="280" cy="38" rx="26" ry="22" fill={color} opacity="0.9" />
      {/* Long square muzzle */}
      <path d="M 278 48 Q 324 46 328 57 Q 320 66 292 62 Q 276 57 278 48 Z" fill={color} opacity="0.85" />
      {/* Nose */}
      <ellipse cx="324" cy="56" rx="6" ry="5" fill="black" opacity="0.7" />
      {/* Eye */}
      <circle cx="286" cy="32" r="5" fill="black" opacity="0.8" />
      <circle cx="287" cy="31" r="2" fill="white" opacity="0.45" />
      {/* Ear - medium, close to head */}
      <path d="M 266 26 Q 254 22 254 36 Q 256 52 268 55 Q 277 51 278 40 Z" fill={color} opacity="0.6" />
      {/* Pointing pose - one front leg raised */}
      <rect x="218" y="120" width="18" height="42" rx="8" fill={color} opacity="0.85" />
      {/* Raised leg - classic pointer pose */}
      <path d="M 196 118 Q 188 104 192 92 Q 198 88 204 94 Q 202 106 208 118 Z" fill={color} opacity="0.75" />
      {/* Back legs */}
      <rect x="104" y="118" width="18" height="42" rx="8" fill={color} opacity="0.85" />
      <rect x="78" y="120" width="18" height="40" rx="8" fill={color} opacity="0.8" />
      {/* Paws */}
      <ellipse cx="227" cy="162" rx="11" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="113" cy="160" rx="11" ry="5" fill={color} opacity="0.6" />
      <ellipse cx="87" cy="160" rx="11" ry="5" fill={color} opacity="0.6" />
      {/* Tail - straight out horizontal - pointer style */}
      <rect x="24" y="85" width="52" height="10" rx="5" fill={color} opacity="0.7" />
      {/* Lean belly tuck */}
      <path d="M 160 126 Q 190 132 220 124" stroke={color} strokeWidth="2" opacity="0.3" fill="none" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type Dog = {
  id: string
  name: string
  subtitle: string
  origin: string
  category: 'scent' | 'gundog' | 'bay'
  role: string[]
  game: string[]
  nose: number
  speed: number
  stamina: number
  trainability: number
  courage: number
  description: string
  huntingNote: string
  accentColor: string
  svg: React.FC<{ color?: string }>
}

const DOGS: Dog[] = [
  {
    id: 'basset',
    name: 'Basset Hound',
    subtitle: 'Scent Hound',
    origin: 'France / Belgium',
    category: 'scent',
    role: ['Tracking', 'Flushing'],
    game: ['Hare', 'Wild Boar'],
    nose: 98,
    speed: 35,
    stamina: 80,
    trainability: 62,
    courage: 70,
    description: 'With the second-best nose in the canine world (after the Bloodhound), the Basset Hound is a relentless tracker. Its low-slung body keeps its nose close to the ground and its long ears sweep scent upward. Slow but incredibly persistent.',
    huntingNote: 'Excellent for tracking hare across dense undergrowth. Used on Mauritian estates to push game toward waiting hunters. Works best in small packs. Loud baying voice gives constant position feedback.',
    accentColor: '#b45309',
    svg: BassetHoundSVG,
  },
  {
    id: 'beagle',
    name: 'Beagle',
    subtitle: 'Scent Hound',
    origin: 'England',
    category: 'scent',
    role: ['Tracking', 'Flushing', 'Pack Hunting'],
    game: ['Hare', 'Wild Boar', 'Small Game'],
    nose: 95,
    speed: 65,
    stamina: 88,
    trainability: 72,
    courage: 75,
    description: 'The Beagle is arguably the most versatile hunting dog for Mauritian conditions. Compact, robust, and adaptable to tropical heat, it tracks by scent with tremendous determination. Its musical bay keeps the hunter informed at all times.',
    huntingNote: 'Widely used in Mauritius for hare drives and flushing small game. Packs of 4–8 Beagles are common for organised deer drives, pushing Rusa deer through forest corridors toward riflemen.',
    accentColor: '#d97706',
    svg: BeagleSVG,
  },
  {
    id: 'ridgeback',
    name: 'Rhodesian Ridgeback',
    subtitle: 'Bay & Tracking Dog',
    origin: 'Southern Africa',
    category: 'bay',
    role: ['Baying', 'Tracking', 'Holding Game'],
    game: ['Wild Boar', 'Deer'],
    nose: 82,
    speed: 88,
    stamina: 92,
    trainability: 78,
    courage: 98,
    description: 'Bred to track and hold lions in Africa, the Ridgeback brings exceptional courage and athleticism to the hunting field. Its distinctive dorsal ridge and fearless temperament make it outstanding for finding and baying dangerous game.',
    huntingNote: 'Used in Mauritius primarily for wild boar hunting. The Ridgeback locates and bays the boar — holding it in place without engaging — while hunters move in. Its heat tolerance suits the Mauritian climate perfectly.',
    accentColor: '#c2410c',
    svg: RidgebackSVG,
  },
  {
    id: 'springer',
    name: 'English Springer Spaniel',
    subtitle: 'Flushing Gun Dog',
    origin: 'England',
    category: 'gundog',
    role: ['Flushing', 'Retrieving'],
    game: ['Partridge', 'Quail', 'Guinea Fowl', 'Hare'],
    nose: 88,
    speed: 72,
    stamina: 85,
    trainability: 92,
    courage: 68,
    description: 'The classic bird dog. The Springer hunts close to the gun, quartering methodically into the wind to locate and flush birds into the air. Quick, biddable, and with a tireless work ethic, it also retrieves shot birds with a soft mouth.',
    huntingNote: 'Ideal for driven partridge and quail shoots across Mauritian estates. Works dense undergrowth that other breeds avoid. Will retrieve from water — useful near rivers and wetland areas.',
    accentColor: '#7c3aed',
    svg: SpanielSVG,
  },
  {
    id: 'labrador',
    name: 'Labrador Retriever',
    subtitle: 'Retriever / Gun Dog',
    origin: 'Newfoundland, Canada',
    category: 'gundog',
    role: ['Retrieving', 'Flushing', 'Tracking Wounded Game'],
    game: ['Partridge', 'Guinea Fowl', 'Quail', 'Hare', 'Deer (blood tracking)'],
    nose: 90,
    speed: 70,
    stamina: 90,
    trainability: 96,
    courage: 72,
    description: 'The world\'s most popular hunting companion — and for good reason. Exceptional trainability, a "soft mouth" for retrieving undamaged birds, and an eagerness to please make the Labrador outstanding in any hunting context.',
    huntingNote: 'Versatile across all Mauritian game. Exceptional at blood-tracking wounded deer after the shot. Also ideal for retrieving guinea fowl and partridge on driven shoots. Thrives in both forest and open terrain.',
    accentColor: '#1d4ed8',
    svg: LabradorSVG,
  },
  {
    id: 'pointer',
    name: 'German Shorthaired Pointer',
    subtitle: 'Pointing Gun Dog',
    origin: 'Germany',
    category: 'gundog',
    role: ['Pointing', 'Flushing', 'Retrieving'],
    game: ['Partridge', 'Quail', 'Guinea Fowl'],
    nose: 92,
    speed: 90,
    stamina: 95,
    trainability: 88,
    courage: 80,
    description: 'The GSP is a high-performance all-rounder. It locates game by air scent, freezes in the classic "point" pose, then flushes on command and retrieves. Athletic, fast-ranging, and adaptable to Mauritius\'s varied terrain.',
    huntingNote: 'Best used for partridge and quail hunting across open areas and field edges. Its wide-ranging style covers ground quickly. The dramatic freeze-point gives the hunter time to prepare before the flush.',
    accentColor: '#0f766e',
    svg: PointerSVG,
  },
]

const CATEGORIES = ['all', 'scent', 'gundog', 'bay'] as const
type Category = typeof CATEGORIES[number]

const CAT_LABELS: Record<Category, string> = {
  all: 'All Dogs',
  scent: 'Scent Hounds',
  gundog: 'Gun Dogs',
  bay: 'Bay Dogs',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBar({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.FC<{ className?: string }> }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1.5 text-white/40">
          <Icon className="w-3 h-3" /> {label}
        </span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

const CAT_COLORS: Record<string, string> = {
  scent: '#d97706',
  gundog: '#1d4ed8',
  bay: '#c2410c',
}

function DogCard({ dog, isActive, onClick }: { dog: Dog; isActive: boolean; onClick: () => void }) {
  const SVGComp = dog.svg
  const catColor = CAT_COLORS[dog.category] ?? dog.accentColor

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35 }}
      onClick={onClick}
      className="cursor-pointer"
      style={{ perspective: 1200 }}
    >
      <motion.div
        whileHover={{ rotateY: 4, rotateX: -3, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          transformStyle: 'preserve-3d',
          background: isActive
            ? `radial-gradient(ellipse at top right, ${dog.accentColor}18, transparent 70%), rgba(10,22,10,0.7)`
            : undefined,
          borderColor: isActive ? `${dog.accentColor}50` : undefined,
        }}
        className={`rounded-3xl border p-7 space-y-5 transition-colors duration-300 ${
          isActive
            ? 'shadow-[0_0_40px_rgba(255,255,255,0.05)]'
            : 'bg-forest-950/40 border-white/5 hover:border-white/10'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: catColor }}>
              {CAT_LABELS[dog.category]}
            </span>
            <h3 className="text-xl font-display font-bold italic mt-0.5">{dog.name}</h3>
            <p className="text-white/30 text-xs mt-0.5">{dog.origin}</p>
          </div>
          <div
            className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
            style={{ color: catColor, borderColor: `${catColor}40`, backgroundColor: `${catColor}15` }}
          >
            {dog.subtitle}
          </div>
        </div>

        {/* Dog SVG */}
        <div className="relative py-2">
          <motion.div
            animate={isActive ? { y: [0, -7, 0] } : {}}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SVGComp color={dog.accentColor} />
          </motion.div>
          {isActive && (
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-5 blur-2xl rounded-full opacity-35"
              style={{ backgroundColor: dog.accentColor }}
            />
          )}
        </div>

        {/* Game tags */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">Hunts</p>
          <div className="flex flex-wrap gap-1.5">
            {dog.game.map(g => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold border"
                style={{ color: dog.accentColor, borderColor: `${dog.accentColor}35`, backgroundColor: `${dog.accentColor}10` }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <StatBar label="Nose" value={dog.nose} color={dog.accentColor} icon={Wind} />
          <StatBar label="Speed" value={dog.speed} color={dog.accentColor} icon={Zap} />
          <StatBar label="Stamina" value={dog.stamina} color={dog.accentColor} icon={Heart} />
          <StatBar label="Trainability" value={dog.trainability} color={dog.accentColor} icon={Brain} />
          <StatBar label="Courage" value={dog.courage} color={dog.accentColor} icon={Shield} />
        </div>
      </motion.div>
    </motion.div>
  )
}

function DogDetail({ dog }: { dog: Dog }) {
  const SVGComp = dog.svg
  return (
    <motion.div
      key={dog.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className="sticky top-28 rounded-3xl border p-8 space-y-8"
      style={{
        background: `radial-gradient(ellipse at top left, ${dog.accentColor}12, transparent 65%), rgba(10,22,10,0.6)`,
        borderColor: `${dog.accentColor}30`,
      }}
    >
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: dog.accentColor }}>
          {CAT_LABELS[dog.category]} · {dog.origin}
        </span>
        <h2 className="text-4xl font-display font-bold italic mt-1">{dog.name}</h2>
        <p className="text-white/35 text-sm mt-1">{dog.subtitle}</p>
      </div>

      {/* Big dog SVG */}
      <div className="relative">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="py-2"
        >
          <SVGComp color={dog.accentColor} />
        </motion.div>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-6 blur-3xl rounded-full opacity-25"
          style={{ backgroundColor: dog.accentColor }}
        />
      </div>

      {/* Roles */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Roles</p>
        <div className="flex flex-wrap gap-2">
          {dog.role.map(r => (
            <span key={r} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/70">
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-white/55 leading-relaxed text-sm">{dog.description}</p>

      {/* Hunting note */}
      <div
        className="p-5 rounded-2xl border space-y-2"
        style={{ backgroundColor: `${dog.accentColor}10`, borderColor: `${dog.accentColor}25` }}
      >
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: dog.accentColor }}>
          In the Mauritian Field
        </p>
        <p className="text-sm text-white/65 leading-relaxed">{dog.huntingNote}</p>
      </div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DogsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [activeDog, setActiveDog] = useState<Dog>(DOGS[0])
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const filtered = DOGS.filter(d => activeCategory === 'all' || d.category === activeCategory)

  return (
    <PageWrapper>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[55vh] overflow-hidden flex items-center justify-center">
        {/* Animated paw-print grid */}
        <div className="absolute inset-0 bg-forest-950 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/[0.03] text-6xl select-none"
              style={{
                left: `${(i % 4) * 28 + 5}%`,
                top: `${Math.floor(i / 4) * 38 + 8}%`,
              }}
              animate={{ opacity: [0.02, 0.06, 0.02] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
            >
              🐾
            </motion.div>
          ))}
        </div>

        {/* Floating dog silhouette */}
        <motion.div
          animate={{ y: [0, -14, 0], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-20 pt-10"
        >
          <BeagleSVG color="white" />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/60 via-transparent to-forest-950/60" />

        <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-forest-400 font-black uppercase tracking-[0.4em] text-xs block mb-6"
          >
            Hunting Companions of Mauritius
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-9xl font-display font-black italic uppercase"
          >
            The Dogs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-white/40 mt-4 max-w-lg mx-auto text-sm"
          >
            Scent hounds, gun dogs, and bay dogs — the essential partners of every Mauritian hunter.
          </motion.p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-forest-950 to-transparent" />
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Filter tabs */}
          <ScrollReveal>
            <div className="flex justify-center mb-14">
              <div className="bg-forest-900/40 p-1.5 rounded-full border border-white/5 flex gap-1 flex-wrap justify-center">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat
                        ? 'bg-forest-600 text-white shadow-lg'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {CAT_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Grid + detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
              <AnimatePresence mode="popLayout">
                {filtered.map(dog => (
                  <DogCard
                    key={dog.id}
                    dog={dog}
                    isActive={activeDog.id === dog.id}
                    onClick={() => setActiveDog(dog)}
                  />
                ))}
              </AnimatePresence>
            </div>
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <DogDetail key={activeDog.id} dog={activeDog} />
              </AnimatePresence>
            </div>
          </div>

          {/* Tips strip */}
          <ScrollReveal>
            <div className="mt-32 p-10 md:p-16 bg-forest-900/20 border border-white/5 rounded-[40px]">
              <h2 className="text-3xl md:text-4xl font-display font-bold italic mb-10 text-center">
                Working Your Dog in Mauritius
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    emoji: '🌡️',
                    title: 'Heat Management',
                    body: 'Mauritius\'s tropical climate demands careful management. Hunt in the early morning, carry water, and allow frequent rest. Breeds with short coats (Ridgeback, Pointer) tolerate heat better than heavy-coated dogs.',
                  },
                  {
                    emoji: '🎵',
                    title: 'Baying Voice',
                    body: 'A hound\'s bay communicates its exact position and behaviour — frantic chop means the game is close, steady bay means it\'s bayed up. Learning your dog\'s voice is as important as marksmanship.',
                  },
                  {
                    emoji: '🐗',
                    title: 'Boar Safety',
                    body: 'Wild boar can inflict serious injuries on dogs. Bay dogs locate and hold game vocally — they should never be trained to physically grip a boar. Keep dogs fitted with protective Kevlar vests where available.',
                  },
                  {
                    emoji: '🦌',
                    title: 'Deer Drives',
                    body: 'Packs of 4–8 scent hounds (Beagles, Bassets) are used to push Rusa deer through forest corridors. Hunters post at strategic passes. Dogs must be steady to gunfire and trained not to chase deer beyond the estate boundary.',
                  },
                  {
                    emoji: '🐦',
                    title: 'Bird Season',
                    body: 'For partridge and quail (April–August), gun dogs must be steady to flush — sitting or standing still when game rises. A dog that chases shot birds without command ruins the shoot for others.',
                  },
                  {
                    emoji: '📋',
                    title: 'Licence & Registration',
                    body: 'Ensure your hunting dog is licensed, vaccinated, and microchipped under Mauritian law. Dogs used commercially on estates should be registered with the estate\'s operating permit.',
                  },
                ].map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="p-6 rounded-2xl border border-white/5 bg-forest-900/20 space-y-3"
                  >
                    <span className="text-3xl">{tip.emoji}</span>
                    <h4 className="font-bold text-base">{tip.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{tip.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </PageWrapper>
  )
}
