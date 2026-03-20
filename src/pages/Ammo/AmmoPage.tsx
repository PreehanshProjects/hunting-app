import { useState, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Wind,
  Target,
  CloudRain,
  TreePine,
  Crosshair,
  AlertTriangle,
} from 'lucide-react'

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function CartridgeSVG({ color = '#3a7a30' }: { color?: string }) {
  return (
    <svg viewBox="0 0 160 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Bullet tip — ogive shape */}
      <path
        d="M 80 10 C 60 10 44 40 44 80 L 116 80 C 116 40 100 10 80 10 Z"
        fill={color}
        opacity="0.95"
      />
      {/* Bullet jacket highlight */}
      <path
        d="M 80 10 C 68 10 56 30 52 55 C 60 45 72 38 80 38 C 88 38 100 45 108 55 C 104 30 92 10 80 10 Z"
        fill="white"
        opacity="0.18"
      />
      {/* Bullet body */}
      <rect x="44" y="76" width="72" height="30" rx="2" fill={color} opacity="0.9" />
      {/* Cannelure groove */}
      <rect x="44" y="100" width="72" height="5" rx="1" fill="black" opacity="0.25" />
      {/* Case neck */}
      <rect x="44" y="106" width="72" height="18" rx="2" fill={color} opacity="0.75" />
      {/* Case shoulder */}
      <path d="M 44 124 L 36 148 L 124 148 L 116 124 Z" fill={color} opacity="0.7" />
      {/* Case body */}
      <rect x="36" y="144" width="88" height="120" rx="3" fill={color} opacity="0.65" />
      {/* Case body highlight */}
      <rect x="36" y="144" width="14" height="120" rx="3" fill="white" opacity="0.06" />
      {/* Extractor groove */}
      <rect x="36" y="255" width="88" height="6" rx="1" fill="black" opacity="0.3" />
      {/* Case head / rim */}
      <rect x="30" y="261" width="100" height="22" rx="4" fill={color} opacity="0.8" />
      {/* Primer pocket */}
      <circle cx="80" cy="296" r="10" fill="black" opacity="0.35" />
      <circle cx="80" cy="296" r="6" fill={color} opacity="0.5" />
      {/* Primer cup */}
      <circle cx="80" cy="296" r="4" fill="white" opacity="0.15" />
    </svg>
  )
}

function ShotshellSVG({ color = '#b45309' }: { color?: string }) {
  return (
    <svg viewBox="0 0 160 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Crimp top */}
      <path
        d="M 80 18 L 95 32 L 116 38 L 116 58 L 44 58 L 44 38 L 65 32 Z"
        fill={color}
        opacity="0.85"
      />
      {/* Crimp fold lines */}
      <line x1="80" y1="18" x2="95" y2="32" stroke="white" strokeWidth="1.5" opacity="0.2" />
      <line x1="80" y1="18" x2="65" y2="32" stroke="white" strokeWidth="1.5" opacity="0.2" />
      <line x1="116" y1="38" x2="116" y2="58" stroke="white" strokeWidth="1.5" opacity="0.12" />
      <line x1="44" y1="38" x2="44" y2="58" stroke="white" strokeWidth="1.5" opacity="0.12" />
      {/* Hull body (plastic) */}
      <rect x="44" y="54" width="72" height="170" rx="2" fill={color} opacity="0.55" />
      {/* Hull body highlight */}
      <rect x="44" y="54" width="12" height="170" rx="2" fill="white" opacity="0.08" />
      {/* Shot pellet visual layer */}
      {[70, 90, 110, 130, 150, 170, 190].map((y, i) => (
        <g key={y} opacity="0.25">
          {[52, 63, 74, 85, 96, 107].map((x) => (
            <circle key={x} cx={x + (i % 2) * 5} cy={y} r="4" fill="white" />
          ))}
        </g>
      ))}
      {/* Brass base */}
      <rect x="36" y="220" width="88" height="62" rx="3" fill={color} opacity="0.9" />
      {/* Base highlight */}
      <rect x="36" y="220" width="14" height="62" rx="3" fill="white" opacity="0.07" />
      {/* Extractor groove */}
      <rect x="36" y="272" width="88" height="5" rx="1" fill="black" opacity="0.3" />
      {/* Head rim */}
      <rect x="30" y="277" width="100" height="20" rx="4" fill={color} opacity="0.85" />
      {/* Primer */}
      <circle cx="80" cy="296" r="9" fill="black" opacity="0.3" />
      <circle cx="80" cy="296" r="5" fill={color} opacity="0.55" />
    </svg>
  )
}

function ProhibitedCartridgeSVG({ color = '#dc2626' }: { color?: string }) {
  return (
    <svg viewBox="0 0 160 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Tiny .22 rimfire shape — visually smaller, centred */}
      <path
        d="M 80 55 C 66 55 55 75 55 105 L 105 105 C 105 75 94 55 80 55 Z"
        fill={color}
        opacity="0.8"
      />
      <rect x="55" y="101" width="50" height="20" rx="2" fill={color} opacity="0.75" />
      <rect x="55" y="118" width="50" height="90" rx="2" fill={color} opacity="0.6" />
      {/* Rimfire rim (wider than body) */}
      <rect x="46" y="205" width="68" height="14" rx="3" fill={color} opacity="0.85" />
      {/* Rim is flat on bottom */}
      <rect x="46" y="215" width="68" height="6" rx="2" fill={color} opacity="0.7" />
      {/* No primer pocket — rimfire ignition band */}
      <rect x="48" y="216" width="64" height="3" rx="1" fill="white" opacity="0.1" />

      {/* Big X prohibition mark */}
      <line x1="30" y1="30" x2="130" y2="290" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
      <line x1="130" y1="30" x2="30" y2="290" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
      {/* Prohibition circle */}
      <circle cx="80" cy="160" r="70" stroke="#dc2626" strokeWidth="4" fill="none" opacity="0.35" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type AmmoCategory = 'rifle' | 'shotgun' | 'prohibited'

type AmmoRound = {
  id: string
  name: string
  calibre: string
  category: AmmoCategory
  weight: string
  velocity: number      // fps
  energy: number        // ft-lbs
  effectiveRange: number // metres
  bestFor: string[]
  legalNote: string
  description: string
  accentColor: string
  // Normalised 0-100 stat scores
  velocityStat: number
  energyStat: number
  rangeStat: number
}

const AMMO_DATA: AmmoRound[] = [
  // ── Rifle ──
  {
    id: 'federal-trophy-308',
    name: 'Federal Trophy Bonded',
    calibre: '.308 Winchester',
    category: 'rifle',
    weight: '180gr',
    velocity: 2620,
    energy: 2743,
    effectiveRange: 400,
    bestFor: ['Deer (Rusa)'],
    legalNote: 'Ideal legal choice for deer — above .22 restriction. Bonded construction ensures reliable expansion and retained weight.',
    description: 'Bonded bullet construction bonds the lead core to the copper jacket, controlling expansion and ensuring deep penetration through bone and muscle. The trusted professional option for ethical Rusa deer hunting.',
    accentColor: '#3a7a30',
    velocityStat: 72,
    energyStat: 88,
    rangeStat: 82,
  },
  {
    id: 'hornady-sst-243',
    name: 'Hornady SST',
    calibre: '.243 Winchester',
    category: 'rifle',
    weight: '95gr',
    velocity: 3025,
    energy: 1929,
    effectiveRange: 380,
    bestFor: ['Deer'],
    legalNote: 'Legal for deer — calibre is above .22. Polymer tip initiates reliable expansion even at lower velocities. Excellent for beginners.',
    description: 'The Super Shock Tip polymer tip drives back into the lead core on impact, delivering rapid, controlled expansion. High velocity and flat trajectory make it forgiving for newer hunters estimating distance.',
    accentColor: '#15803d',
    velocityStat: 92,
    energyStat: 62,
    rangeStat: 78,
  },
  {
    id: 'nosler-partition-3006',
    name: 'Nosler Partition',
    calibre: '.30-06 Springfield',
    category: 'rifle',
    weight: '180gr',
    velocity: 2700,
    energy: 2913,
    effectiveRange: 430,
    bestFor: ['Deer', 'Wild Boar'],
    legalNote: 'Fully legal for all game — no restrictions beyond standard licence. A proven choice with no legal concerns.',
    description: 'The legendary dual-core partition design separates the front expansion zone from the rear retained-weight zone. The front deforms for energy transfer; the rear drives deep. Over 60 years of hunting reliability.',
    accentColor: '#3a7a30',
    velocityStat: 76,
    energyStat: 94,
    rangeStat: 88,
  },
  {
    id: 'barnes-ttsx-7mm',
    name: 'Barnes TTSX',
    calibre: '7mm Rem Mag',
    category: 'rifle',
    weight: '160gr',
    velocity: 2940,
    energy: 3071,
    effectiveRange: 500,
    bestFor: ['Deer', 'Boar (long range)'],
    legalNote: 'Legal for all game. Lead-free copper solid passes strict environmental regulations. Maximum penetration on heavy boar.',
    description: 'All-copper solid construction with a polymer tip. No lead means 100% weight retention on impact, producing four razor-sharp petals that drive through any angle. Preferred when shooting through heavy brush or quartering shots.',
    accentColor: '#166534',
    velocityStat: 88,
    energyStat: 99,
    rangeStat: 100,
  },
  // ── Shotgun ──
  {
    id: '12ga-no5-lead',
    name: '12ga No.5 Lead Shot',
    calibre: '12 Gauge',
    category: 'shotgun',
    weight: '36g shot',
    velocity: 1300,
    energy: 0,
    effectiveRange: 35,
    bestFor: ['Partridge', 'Quail'],
    legalNote: 'Legal for birds. DO NOT use on deer — illegal under s.19(1)(c)(ii) regardless of shot size or gauge.',
    description: 'Standard game load for upland birds. No.5 pellets (2.79mm diameter) strike a balance between pattern density and pellet energy at 35 metres. A full choke extends effective range slightly.',
    accentColor: '#b45309',
    velocityStat: 38,
    energyStat: 28,
    rangeStat: 35,
  },
  {
    id: '12ga-no4-lead',
    name: '12ga No.4 Lead Shot',
    calibre: '12 Gauge',
    category: 'shotgun',
    weight: '36g shot',
    velocity: 1300,
    energy: 0,
    effectiveRange: 40,
    bestFor: ['Guinea Fowl', 'Hare'],
    legalNote: 'Legal for birds and hare. Heavier pellets suit the denser feathering of guinea fowl. Not for deer.',
    description: 'Larger No.4 pellets (3.05mm) carry more energy per pellet to deal with the tougher body structure of guinea fowl and hare. Slightly fewer pellets in the pattern but each hits harder.',
    accentColor: '#92400e',
    velocityStat: 38,
    energyStat: 32,
    rangeStat: 40,
  },
  {
    id: '12ga-rifled-slug',
    name: '12ga Rifled Slug (Brenneke)',
    calibre: '12 Gauge',
    category: 'shotgun',
    weight: '28g slug',
    velocity: 1480,
    energy: 0,
    effectiveRange: 75,
    bestFor: ['Wild Boar'],
    legalNote: 'Legal for boar. NOT recommended for deer — use a centrefire rifle above .22 for Rusa deer.',
    description: 'The Brenneke design attaches a fibre wad to the base of a finned lead slug, stabilising it through a smooth bore. Single projectile delivers authoritative stopping power on heavy wild boar at close to medium bush ranges.',
    accentColor: '#b45309',
    velocityStat: 44,
    energyStat: 72,
    rangeStat: 75,
  },
  {
    id: '20ga-no6-lead',
    name: '20ga No.6 Lead Shot',
    calibre: '20 Gauge',
    category: 'shotgun',
    weight: '28g shot',
    velocity: 1200,
    energy: 0,
    effectiveRange: 30,
    bestFor: ['Partridge', 'Quail'],
    legalNote: 'Legal for birds. Lighter gauge means lighter gun — a good option for smaller-framed hunters on bird drives.',
    description: 'A lighter option for upland bird hunting. No.6 pellets (2.54mm) produce a dense pattern at closer flushes. The reduced recoil of the 20 gauge makes for a more comfortable day in the field across Mauritian estates.',
    accentColor: '#a16207',
    velocityStat: 33,
    energyStat: 20,
    rangeStat: 30,
  },
  // ── Prohibited ──
  {
    id: 'prohibited-22',
    name: '.22 LR / .22 Mag (for deer)',
    calibre: '.22 LR / .22 Mag',
    category: 'prohibited',
    weight: '40gr typical',
    velocity: 1200,
    energy: 128,
    effectiveRange: 0,
    bestFor: [],
    legalNote: 'ILLEGAL for deer — s.19(1)(c)(i). Any rimfire .22 calibre firearm is expressly banned for deer hunting. Insufficient energy causes unacceptable suffering rather than a clean, ethical kill.',
    description: 'Rimfire .22 cartridges — whether Long Rifle or Magnum — generate only a fraction of the energy needed for a humane kill on Rusa deer. Wounds without killing, causing prolonged suffering. Expressly prohibited under the Wildlife & National Parks Act 1993.',
    accentColor: '#dc2626',
    velocityStat: 30,
    energyStat: 4,
    rangeStat: 0,
  },
  {
    id: 'prohibited-lead-shot-deer',
    name: 'Lead Shot on Deer',
    calibre: 'Any Gauge',
    category: 'prohibited',
    weight: 'Any shot load',
    velocity: 0,
    energy: 0,
    effectiveRange: 0,
    bestFor: [],
    legalNote: 'ILLEGAL — s.19(1)(c)(ii). Using any shotgun loaded with lead shot to hunt deer is a criminal offence, regardless of shot size, gauge, or distance. Use a legal centrefire rifle.',
    description: 'No matter how large the pellets or how close the shot, lead birdshot or buckshot lacks the penetration and individual projectile energy to cleanly kill deer. The law prohibits it outright — not as a guideline but as a hard criminal offence under the Act.',
    accentColor: '#dc2626',
    velocityStat: 0,
    energyStat: 0,
    rangeStat: 0,
  },
]

const CATEGORIES: { id: AmmoCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Loads' },
  { id: 'rifle', label: 'Rifle Ammo' },
  { id: 'shotgun', label: 'Shotgun Loads' },
  { id: 'prohibited', label: 'Prohibited' },
]

const SELECTION_TIPS = [
  {
    icon: Target,
    title: 'Match Bullet to Game',
    body: 'Use a bonded or partition rifle bullet for deer — it expands reliably at a wide range of impact velocities. For boar, prioritise deep penetration over rapid expansion. Never use birdshot on large game.',
    color: '#3a7a30',
    bg: 'bg-forest-900/40 border-forest-700/30',
  },
  {
    icon: Crosshair,
    title: 'Ethical Shot Distance',
    body: 'Know your maximum effective range before the hunt, not during it. Rifle loads for deer retain sufficient energy well past 300 m, but your ability to place the shot precisely is the true limiting factor.',
    color: '#15803d',
    bg: 'bg-forest-900/40 border-forest-700/30',
  },
  {
    icon: TreePine,
    title: 'Ricochet Awareness in Forest',
    body: "Mauritius's plantation forests and rocky terrain mean deflected rounds travel unpredictably. Rifle bullets that fragment early (like Hornady V-MAX) reduce ricochet risk. Never shoot at a steep downward angle toward hard surfaces.",
    color: '#166534',
    bg: 'bg-forest-900/40 border-forest-700/30',
  },
  {
    icon: CloudRain,
    title: 'Keeping Ammo Dry (Tropical)',
    body: "Mauritius's humidity can corrode brass cases and degrade propellant in unsealed cartridges. Store ammunition in factory boxes inside airtight containers with silica gel. Inspect primers for corrosion before every hunt.",
    color: '#b45309',
    bg: 'bg-earth-900/40 border-earth-700/30',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBar({
  label,
  value,
  color,
  Icon,
}: {
  label: string
  value: number
  color: string
  Icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1.5 text-white/40">
          <Icon className="w-3 h-3" />
          {label}
        </span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function AmmoCard({
  round,
  isActive,
  onClick,
}: {
  round: AmmoRound
  isActive: boolean
  onClick: () => void
}) {
  const isProhibited = round.category === 'prohibited'
  const isShotgun = round.category === 'shotgun'

  const activeGlow = isProhibited
    ? 'bg-red-950/60 border-red-600/50 shadow-[0_0_40px_rgba(220,38,38,0.15)]'
    : isShotgun
    ? 'bg-earth-900/60 border-amber-fire/30 shadow-[0_0_40px_rgba(180,83,9,0.12)]'
    : 'bg-forest-900/60 border-forest-600/50 shadow-[0_0_40px_rgba(58,122,48,0.15)]'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className="cursor-pointer"
      style={{ perspective: 1200 }}
    >
      <motion.div
        whileHover={{ rotateY: isProhibited ? 0 : 4, rotateX: -3, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`rounded-3xl border p-6 space-y-5 transition-colors duration-300 ${
          isActive ? activeGlow : 'bg-forest-950/40 border-white/5 hover:border-white/10'
        }`}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className="text-[10px] font-black uppercase tracking-[0.3em] block"
              style={{ color: round.accentColor }}
            >
              {round.calibre}
            </span>
            <h3 className="text-xl font-display font-bold italic mt-0.5 leading-tight">
              {round.name}
            </h3>
          </div>
          <div
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              isProhibited
                ? 'bg-red-900/40 text-red-400 border border-red-700/40'
                : 'bg-forest-900/60 text-forest-500 border border-forest-700/40'
            }`}
          >
            {isProhibited ? (
              <ShieldAlert className="w-3 h-3" />
            ) : (
              <ShieldCheck className="w-3 h-3" />
            )}
            {isProhibited ? 'Prohibited' : 'Legal'}
          </div>
        </div>

        {/* Cartridge visual */}
        <div className="flex justify-center py-2 relative">
          <motion.div
            animate={isActive ? { y: [0, -6, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-36 w-16"
          >
            {isProhibited ? (
              <ProhibitedCartridgeSVG color={round.accentColor} />
            ) : isShotgun ? (
              <ShotshellSVG color={round.accentColor} />
            ) : (
              <CartridgeSVG color={round.accentColor} />
            )}
          </motion.div>
          {isActive && (
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 blur-xl rounded-full opacity-50"
              style={{ backgroundColor: round.accentColor }}
            />
          )}
        </div>

        {/* Spec row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-white/5 rounded-xl">
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-0.5">
              Weight
            </p>
            <p className="text-sm font-bold">{round.weight}</p>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl">
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-0.5">
              {round.category === 'shotgun' ? 'Eff. Range' : 'Velocity'}
            </p>
            <p className="text-sm font-bold">
              {round.category === 'shotgun'
                ? `${round.effectiveRange}m`
                : `${round.velocity.toLocaleString()} fps`}
            </p>
          </div>
        </div>

        {/* Stat bars */}
        {!isProhibited && (
          <div className="space-y-2.5">
            <StatBar
              label="Velocity"
              value={round.velocityStat}
              color={round.accentColor}
              Icon={Zap}
            />
            <StatBar
              label="Energy"
              value={round.energyStat}
              color={round.accentColor}
              Icon={Target}
            />
            <StatBar
              label="Range"
              value={round.rangeStat}
              color={round.accentColor}
              Icon={Wind}
            />
          </div>
        )}

        {/* Species tags */}
        {round.bestFor.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">
              Best For
            </p>
            <div className="flex flex-wrap gap-1.5">
              {round.bestFor.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-full bg-forest-800/60 border border-forest-700/40 text-[10px] font-bold text-forest-500"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function AmmoDetail({ round }: { round: AmmoRound }) {
  const isProhibited = round.category === 'prohibited'
  const isShotgun = round.category === 'shotgun'

  return (
    <motion.div
      key={round.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className={`sticky top-28 rounded-3xl border p-8 space-y-7 ${
        isProhibited
          ? 'bg-red-950/30 border-red-700/30'
          : isShotgun
          ? 'bg-earth-900/30 border-earth-700/30'
          : 'bg-forest-900/30 border-forest-700/30'
      }`}
    >
      {/* Title */}
      <div>
        <span
          className="text-[10px] font-black uppercase tracking-[0.3em]"
          style={{ color: round.accentColor }}
        >
          {isProhibited ? 'PROHIBITED AMMUNITION' : round.calibre}
        </span>
        <h2 className="text-3xl font-display font-bold italic mt-1 leading-tight">
          {round.name}
        </h2>
        <p className="text-white/40 text-sm mt-1">{round.weight}</p>
      </div>

      {/* Cartridge illustration — large */}
      <div className="flex justify-center py-4 relative">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-48 w-24"
        >
          {isProhibited ? (
            <ProhibitedCartridgeSVG color={round.accentColor} />
          ) : isShotgun ? (
            <ShotshellSVG color={round.accentColor} />
          ) : (
            <CartridgeSVG color={round.accentColor} />
          )}
        </motion.div>
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-5 blur-2xl rounded-full opacity-35"
          style={{ backgroundColor: round.accentColor }}
        />
      </div>

      {/* Ballistic specs */}
      {!isProhibited && (
        <div className="grid grid-cols-3 gap-3">
          {round.velocity > 0 && (
            <div className="p-3 bg-white/5 rounded-2xl text-center">
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">
                Velocity
              </p>
              <p className="text-lg font-display font-bold italic mt-1">
                {round.velocity.toLocaleString()}
              </p>
              <p className="text-[9px] text-white/25">fps</p>
            </div>
          )}
          {round.energy > 0 && (
            <div className="p-3 bg-white/5 rounded-2xl text-center">
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">
                Energy
              </p>
              <p className="text-lg font-display font-bold italic mt-1">
                {round.energy.toLocaleString()}
              </p>
              <p className="text-[9px] text-white/25">ft-lbs</p>
            </div>
          )}
          {round.effectiveRange > 0 && (
            <div className="p-3 bg-white/5 rounded-2xl text-center">
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">
                Eff. Range
              </p>
              <p className="text-lg font-display font-bold italic mt-1">
                {round.effectiveRange}
              </p>
              <p className="text-[9px] text-white/25">metres</p>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-white/60 leading-relaxed text-sm">{round.description}</p>

      {/* Best for */}
      {round.bestFor.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
            Best For
          </p>
          <div className="flex flex-wrap gap-2">
            {round.bestFor.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full bg-forest-800/60 border border-forest-700/40 text-[11px] font-bold text-forest-500"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legal note */}
      <div
        className={`p-5 rounded-2xl border ${
          isProhibited
            ? 'bg-red-900/20 border-red-700/30'
            : 'bg-forest-900/20 border-forest-700/20'
        }`}
      >
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ color: round.accentColor }}
        >
          {isProhibited
            ? 'Legal Warning — Wildlife & National Parks Act 1993'
            : 'Legal Note — Wildlife & National Parks Act 1993'}
        </p>
        <p className="text-sm text-white/70 leading-relaxed">{round.legalNote}</p>
      </div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AmmoPage() {
  const [activeCategory, setActiveCategory] = useState<AmmoCategory | 'all'>('all')
  const [activeRound, setActiveRound] = useState<AmmoRound>(AMMO_DATA[0])
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const filtered =
    activeCategory === 'all'
      ? AMMO_DATA
      : AMMO_DATA.filter((r) => r.category === activeCategory)

  return (
    <PageWrapper>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[55vh] overflow-hidden flex items-center justify-center"
      >
        {/* Background grid */}
        <div className="absolute inset-0 bg-forest-950">
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="ammo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ammo-grid)" />
          </svg>
        </div>

        {/* Floating cartridge silhouettes behind title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-20">
          {[-2, 0, 2].map((offset, i) => (
            <motion.div
              key={i}
              animate={{ y: [offset * 3, offset * 3 - 10, offset * 3] }}
              transition={{
                duration: 4 + i * 0.7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
              className="opacity-[0.04] h-64 w-16"
            >
              <CartridgeSVG color="white" />
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/60 via-transparent to-forest-950/60" />

        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-forest-500 font-black uppercase tracking-[0.4em] text-xs block mb-6"
          >
            Companion to the Arsenal — Wildlife & National Parks Act 1993
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-9xl font-display font-black italic uppercase"
          >
            Ammunition
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-white/40 mt-4 max-w-lg mx-auto text-sm"
          >
            Rifle rounds, shotgun loads, and what's expressly banned — choose the right
            cartridge, hunt ethically, stay legal.
          </motion.p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-forest-950 to-transparent" />
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Category tabs */}
          <ScrollReveal>
            <div className="flex justify-center mb-14">
              <div className="bg-forest-900/40 p-1.5 rounded-full border border-white/5 flex gap-1 flex-wrap justify-center">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat.id
                        ? cat.id === 'prohibited'
                          ? 'bg-red-700 text-white shadow-lg'
                          : cat.id === 'shotgun'
                          ? 'bg-amber-fire text-white shadow-lg'
                          : 'bg-forest-600 text-white shadow-lg'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Cards grid + detail panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
              <AnimatePresence mode="popLayout">
                {filtered.map((round) => (
                  <AmmoCard
                    key={round.id}
                    round={round}
                    isActive={activeRound.id === round.id}
                    onClick={() => setActiveRound(round)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <AmmoDetail key={activeRound.id} round={activeRound} />
              </AnimatePresence>
            </div>
          </div>

          {/* ── Selection tips ───────────────────────────────────────────── */}
          <ScrollReveal>
            <div className="mt-32 p-10 md:p-16 bg-forest-900/20 border border-white/5 rounded-[40px]">
              <div className="text-center mb-12">
                <span className="text-forest-500 font-black uppercase tracking-[0.35em] text-xs">
                  Field Guidance
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold italic mt-3">
                  Selecting the Right Load
                </h2>
                <p className="text-white/35 text-sm mt-3 max-w-xl mx-auto">
                  Four principles every Mauritian hunter should understand before loading the
                  magazine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SELECTION_TIPS.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-6 rounded-2xl border space-y-3 ${tip.bg}`}
                  >
                    <tip.icon className="w-6 h-6" style={{ color: tip.color }} />
                    <h4 className="font-bold text-base">{tip.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{tip.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Prohibited summary strip ─────────────────────────────────── */}
          <ScrollReveal delay={0.1}>
            <div className="mt-12 p-8 bg-red-950/20 border border-red-800/30 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="shrink-0">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">
                  Legal Reminder — s.19(1)(c) Wildlife & National Parks Act 1993
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Using any .22 rimfire firearm or any shotgun loaded with lead shot to hunt
                  Rusa deer is a <span className="text-white font-bold">criminal offence</span>{' '}
                  in Mauritius. Penalties include fines up to{' '}
                  <span className="text-white font-bold">Rs 50,000</span> and/or up to{' '}
                  <span className="text-white font-bold">3 years' imprisonment</span>. Choose your
                  ammunition carefully — both for legal compliance and for humane, ethical hunting.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Bottom spacer */}
          <div className="h-16" />
        </div>
      </section>
    </PageWrapper>
  )
}
