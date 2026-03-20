import { useState, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Leaf, Droplets, Eye, MapPin, Clock, Filter } from 'lucide-react'

// ─── SVG Track Illustrations ──────────────────────────────────────────────────

function DeerTrackSVG() {
  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Main hoofprint — two cleaves */}
      <g transform="translate(80,100)">
        {/* Left cleave — pointed teardrop */}
        <path
          d="M -22 30 C -30 30 -34 18 -32 4 C -30 -8 -22 -28 -16 -36 C -12 -42 -8 -44 -6 -42 C -4 -40 -4 -34 -6 -24 C -8 -10 -10 8 -10 20 C -10 26 -14 30 -22 30 Z"
          fill="#3a7a30"
          opacity="0.85"
        />
        {/* Right cleave — pointed teardrop */}
        <path
          d="M 22 30 C 30 30 34 18 32 4 C 30 -8 22 -28 16 -36 C 12 -42 8 -44 6 -42 C 4 -40 4 -34 6 -24 C 8 -10 10 8 10 20 C 10 26 14 30 22 30 Z"
          fill="#3a7a30"
          opacity="0.85"
        />
        {/* Gap line between cleaves */}
        <line x1="0" y1="-38" x2="0" y2="28" stroke="#0f1f0c" strokeWidth="2" opacity="0.4" />
        {/* Ground shadow */}
        <ellipse cx="0" cy="38" rx="28" ry="5" fill="#3a7a30" opacity="0.15" />
      </g>
      {/* Walking pattern — offset paired tracks above */}
      <g transform="translate(52, 30) scale(0.52)" opacity="0.45">
        <path d="M -22 30 C -30 30 -34 18 -32 4 C -30 -8 -22 -28 -16 -36 C -12 -42 -8 -44 -6 -42 C -4 -40 -4 -34 -6 -24 C -8 -10 -10 8 -10 20 C -10 26 -14 30 -22 30 Z" fill="#3a7a30" />
        <path d="M 22 30 C 30 30 34 18 32 4 C 30 -8 22 -28 16 -36 C 12 -42 8 -44 6 -42 C 4 -40 4 -34 6 -24 C 8 -10 10 8 10 20 C 10 26 14 30 22 30 Z" fill="#3a7a30" />
        <line x1="0" y1="-38" x2="0" y2="28" stroke="#0f1f0c" strokeWidth="2" opacity="0.5" />
      </g>
      <g transform="translate(108, 18) scale(0.52)" opacity="0.45">
        <path d="M -22 30 C -30 30 -34 18 -32 4 C -30 -8 -22 -28 -16 -36 C -12 -42 -8 -44 -6 -42 C -4 -40 -4 -34 -6 -24 C -8 -10 -10 8 -10 20 C -10 26 -14 30 -22 30 Z" fill="#3a7a30" />
        <path d="M 22 30 C 30 30 34 18 32 4 C 30 -8 22 -28 16 -36 C 12 -42 8 -44 6 -42 C 4 -40 4 -34 6 -24 C 8 -10 10 8 10 20 C 10 26 14 30 22 30 Z" fill="#3a7a30" />
        <line x1="0" y1="-38" x2="0" y2="28" stroke="#0f1f0c" strokeWidth="2" opacity="0.5" />
      </g>
      {/* Scale indicator */}
      <line x1="20" y1="186" x2="68" y2="186" stroke="#3a7a30" strokeWidth="1.5" opacity="0.5" />
      <line x1="20" y1="182" x2="20" y2="190" stroke="#3a7a30" strokeWidth="1.5" opacity="0.5" />
      <line x1="68" y1="182" x2="68" y2="190" stroke="#3a7a30" strokeWidth="1.5" opacity="0.5" />
      <text x="44" y="198" textAnchor="middle" fill="#3a7a30" fontSize="9" opacity="0.6" fontFamily="monospace">7 cm</text>
    </svg>
  )
}

function BoarTrackSVG() {
  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Main hoofprint — two large blunt lobes + dewclaws */}
      <g transform="translate(80,105)">
        {/* Left main lobe — blunt rounded rectangle */}
        <rect x="-30" y="-32" width="26" height="42" rx="10" ry="13" fill="#92400e" opacity="0.88" />
        {/* Right main lobe */}
        <rect x="4" y="-32" width="26" height="42" rx="10" ry="13" fill="#92400e" opacity="0.88" />
        {/* Left dewclaw — small dot behind */}
        <ellipse cx="-20" cy="24" rx="7" ry="5" fill="#92400e" opacity="0.65" />
        {/* Right dewclaw */}
        <ellipse cx="20" cy="24" rx="7" ry="5" fill="#92400e" opacity="0.65" />
        {/* Deep impression detail — inner shadow */}
        <rect x="-28" y="-28" width="22" height="36" rx="8" ry="11" fill="#0f1f0c" opacity="0.15" />
        <rect x="6" y="-28" width="22" height="36" rx="8" ry="11" fill="#0f1f0c" opacity="0.15" />
        {/* Ground shadow */}
        <ellipse cx="0" cy="38" rx="32" ry="6" fill="#92400e" opacity="0.12" />
      </g>
      {/* Smaller offset track above — showing heavy walk */}
      <g transform="translate(44, 28) scale(0.56)" opacity="0.4">
        <rect x="-30" y="-32" width="26" height="42" rx="10" ry="13" fill="#92400e" />
        <rect x="4" y="-32" width="26" height="42" rx="10" ry="13" fill="#92400e" />
        <ellipse cx="-20" cy="24" rx="7" ry="5" fill="#92400e" opacity="0.7" />
        <ellipse cx="20" cy="24" rx="7" ry="5" fill="#92400e" opacity="0.7" />
      </g>
      <g transform="translate(116, 14) scale(0.56)" opacity="0.4">
        <rect x="-30" y="-32" width="26" height="42" rx="10" ry="13" fill="#92400e" />
        <rect x="4" y="-32" width="26" height="42" rx="10" ry="13" fill="#92400e" />
        <ellipse cx="-20" cy="24" rx="7" ry="5" fill="#92400e" opacity="0.7" />
        <ellipse cx="20" cy="24" rx="7" ry="5" fill="#92400e" opacity="0.7" />
      </g>
      {/* Scale indicator */}
      <line x1="20" y1="186" x2="64" y2="186" stroke="#92400e" strokeWidth="1.5" opacity="0.5" />
      <line x1="20" y1="182" x2="20" y2="190" stroke="#92400e" strokeWidth="1.5" opacity="0.5" />
      <line x1="64" y1="182" x2="64" y2="190" stroke="#92400e" strokeWidth="1.5" opacity="0.5" />
      <text x="42" y="198" textAnchor="middle" fill="#92400e" fontSize="9" opacity="0.6" fontFamily="monospace">6 cm</text>
    </svg>
  )
}

function HareTrackSVG() {
  return (
    <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Bounding pattern: two long rear feet ahead, two small front feet behind */}
      {/* Rear left — long narrow oval */}
      <ellipse cx="52" cy="68" rx="10" ry="30" fill="#d97706" opacity="0.85" transform="rotate(-8 52 68)" />
      {/* Rear right — long narrow oval */}
      <ellipse cx="108" cy="62" rx="10" ry="30" fill="#d97706" opacity="0.85" transform="rotate(8 108 62)" />
      {/* Front left — small oval */}
      <ellipse cx="62" cy="130" rx="8" ry="12" fill="#d97706" opacity="0.7" transform="rotate(-5 62 130)" />
      {/* Front right — small oval */}
      <ellipse cx="98" cy="138" rx="8" ry="12" fill="#d97706" opacity="0.7" transform="rotate(5 98 138)" />
      {/* Toe detail on rear feet */}
      <ellipse cx="44" cy="42" rx="4" ry="6" fill="#d97706" opacity="0.5" transform="rotate(-12 44 42)" />
      <ellipse cx="52" cy="38" rx="4" ry="6" fill="#d97706" opacity="0.5" transform="rotate(-5 52 38)" />
      <ellipse cx="60" cy="40" rx="4" ry="6" fill="#d97706" opacity="0.5" transform="rotate(4 60 40)" />
      <ellipse cx="100" cy="36" rx="4" ry="6" fill="#d97706" opacity="0.5" transform="rotate(-4 100 36)" />
      <ellipse cx="108" cy="32" rx="4" ry="6" fill="#d97706" opacity="0.5" transform="rotate(3 108 32)" />
      <ellipse cx="116" cy="37" rx="4" ry="6" fill="#d97706" opacity="0.5" transform="rotate(10 116 37)" />
      {/* Direction arrow */}
      <path d="M 80 10 L 74 22 L 78 22 L 78 30 L 82 30 L 82 22 L 86 22 Z" fill="#d97706" opacity="0.3" />
      {/* Scale indicators */}
      <g opacity="0.5">
        {/* Rear foot scale */}
        <line x1="128" y1="38" x2="128" y2="98" stroke="#d97706" strokeWidth="1" />
        <line x1="124" y1="38" x2="132" y2="38" stroke="#d97706" strokeWidth="1" />
        <line x1="124" y1="98" x2="132" y2="98" stroke="#d97706" strokeWidth="1" />
        <text x="138" y="72" fill="#d97706" fontSize="8" fontFamily="monospace">8cm</text>
        {/* Front foot scale */}
        <line x1="30" y1="122" x2="30" y2="146" stroke="#d97706" strokeWidth="1" />
        <line x1="26" y1="122" x2="34" y2="122" stroke="#d97706" strokeWidth="1" />
        <line x1="26" y1="146" x2="34" y2="146" stroke="#d97706" strokeWidth="1" />
        <text x="8" y="138" fill="#d97706" fontSize="8" fontFamily="monospace">3cm</text>
      </g>
      <text x="80" y="210" textAnchor="middle" fill="#d97706" fontSize="8" opacity="0.5" fontFamily="monospace">bounding gait</text>
    </svg>
  )
}

function BirdTrackSVG() {
  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Main track — three forward toes + one rear toe */}
      <g transform="translate(80, 110)">
        {/* Centre forward toe */}
        <ellipse cx="0" cy="-38" rx="5" ry="20" fill="#7c3aed" opacity="0.85" />
        {/* Left forward toe */}
        <ellipse cx="-22" cy="-26" rx="5" ry="18" fill="#7c3aed" opacity="0.85" transform="rotate(-30 -22 -26)" />
        {/* Right forward toe */}
        <ellipse cx="22" cy="-26" rx="5" ry="18" fill="#7c3aed" opacity="0.85" transform="rotate(30 22 -26)" />
        {/* Rear toe (hallux) */}
        <ellipse cx="0" cy="20" rx="4" ry="14" fill="#7c3aed" opacity="0.65" />
        {/* Central pad */}
        <ellipse cx="0" cy="0" rx="10" ry="10" fill="#7c3aed" opacity="0.5" />
        {/* Claw tips */}
        <ellipse cx="0" cy="-56" rx="3" ry="4" fill="#7c3aed" opacity="0.45" />
        <ellipse cx="-34" cy="-38" rx="3" ry="4" fill="#7c3aed" opacity="0.45" transform="rotate(-30 -34 -38)" />
        <ellipse cx="34" cy="-38" rx="3" ry="4" fill="#7c3aed" opacity="0.45" transform="rotate(30 34 -38)" />
        {/* Ground shadow */}
        <ellipse cx="0" cy="36" rx="22" ry="4" fill="#7c3aed" opacity="0.1" />
      </g>
      {/* Second track offset — scratching pattern */}
      <g transform="translate(112, 68) scale(0.58) rotate(15)" opacity="0.38">
        <ellipse cx="0" cy="-38" rx="5" ry="20" fill="#7c3aed" />
        <ellipse cx="-22" cy="-26" rx="5" ry="18" fill="#7c3aed" transform="rotate(-30 -22 -26)" />
        <ellipse cx="22" cy="-26" rx="5" ry="18" fill="#7c3aed" transform="rotate(30 22 -26)" />
        <ellipse cx="0" cy="20" rx="4" ry="14" fill="#7c3aed" />
        <ellipse cx="0" cy="0" rx="10" ry="10" fill="#7c3aed" opacity="0.6" />
      </g>
      <g transform="translate(48, 56) scale(0.52) rotate(-10)" opacity="0.32">
        <ellipse cx="0" cy="-38" rx="5" ry="20" fill="#7c3aed" />
        <ellipse cx="-22" cy="-26" rx="5" ry="18" fill="#7c3aed" transform="rotate(-30 -22 -26)" />
        <ellipse cx="22" cy="-26" rx="5" ry="18" fill="#7c3aed" transform="rotate(30 22 -26)" />
        <ellipse cx="0" cy="20" rx="4" ry="14" fill="#7c3aed" />
        <ellipse cx="0" cy="0" rx="10" ry="10" fill="#7c3aed" opacity="0.6" />
      </g>
      {/* Scale indicator */}
      <line x1="20" y1="186" x2="60" y2="186" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5" />
      <line x1="20" y1="182" x2="20" y2="190" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5" />
      <line x1="60" y1="182" x2="60" y2="190" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5" />
      <text x="40" y="198" textAnchor="middle" fill="#7c3aed" fontSize="9" opacity="0.6" fontFamily="monospace">4 cm</text>
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'deer' | 'boar' | 'hare' | 'birds'

interface FieldSign {
  icon: 'leaf' | 'droplets' | 'eye' | 'mappin'
  text: string
}

interface TrackAnimal {
  id: string
  filter: FilterKey
  name: string
  latin: string
  accentColor: string
  accentHex: string
  trackLength: string
  trackWidth: string
  gaitNote: string
  bestTime: string
  fieldSigns: FieldSign[]
  svgComponent: React.FC
}

const animals: TrackAnimal[] = [
  {
    id: 'deer',
    filter: 'deer',
    name: 'Rusa Deer',
    latin: 'Rusa timorensis',
    accentColor: 'text-[#3a7a30]',
    accentHex: '#3a7a30',
    trackLength: '7 cm',
    trackWidth: '5 cm',
    gaitNote: 'Paired cleave prints in a neat linear walk; slightly offset between left and right feet.',
    bestTime: 'Dawn & Dusk',
    fieldSigns: [
      { icon: 'leaf', text: 'Bark rubs on saplings 60–120 cm high — antler velvet removal or territory marking.' },
      { icon: 'mappin', text: 'Ground scrapes with hoof gouges, often scent-marked; clustered oval pellet droppings (~15 mm).' },
      { icon: 'droplets', text: 'Wallows — shallow muddy depressions near waterholes; frequently revisited at dusk.' },
      { icon: 'eye', text: 'Browse lines on low vegetation; twigs snapped upward at ~1 m — no upper incisors so deer pull and tear.' },
    ],
    svgComponent: DeerTrackSVG,
  },
  {
    id: 'boar',
    filter: 'boar',
    name: 'Wild Boar',
    latin: 'Sus scrofa',
    accentColor: 'text-[#92400e]',
    accentHex: '#92400e',
    trackLength: '6 cm',
    trackWidth: '5 cm',
    gaitNote: 'Heavy, deep impressions — dewclaws often register due to weight. Toes splay under load on soft ground.',
    bestTime: 'Night & Early Morning',
    fieldSigns: [
      { icon: 'leaf', text: 'Rooting patches — large areas of soil turned over, often along forest edges and stream banks.' },
      { icon: 'droplets', text: 'Wallow holes — larger and deeper than deer wallows, mud coating on nearby tree trunks at shoulder height.' },
      { icon: 'eye', text: 'Tusk marks on roots and low bark; strong musky odour persists for hours near active trails.' },
      { icon: 'mappin', text: 'Rutting nests — piled leaf litter; sow trails between shelter and feeding areas show consistent use.' },
    ],
    svgComponent: BoarTrackSVG,
  },
  {
    id: 'hare',
    filter: 'hare',
    name: 'Indian Hare',
    latin: 'Lepus nigricollis',
    accentColor: 'text-[#d97706]',
    accentHex: '#d97706',
    trackLength: 'Rear: 8 cm / Front: 3 cm',
    trackWidth: 'Rear: 3 cm narrow',
    gaitNote: 'Classic bounding lope — two long rear feet land ahead of two small front feet. Trail width ~20 cm.',
    bestTime: 'Dusk & Night',
    fieldSigns: [
      { icon: 'leaf', text: 'Form — a flattened, body-sized depression in long grass where the hare rests; often in the open with a good view.' },
      { icon: 'mappin', text: 'Hard round pellet droppings (~10 mm) in latrine clusters on regularly used trails and feeding areas.' },
      { icon: 'eye', text: 'Grazing patches in short grass with clean diagonal cuts on grass stems — very neat, almost like scissors.' },
      { icon: 'droplets', text: 'Runs along fence lines, hedge bases, and field margins; vegetation worn to bare earth on repeated paths.' },
    ],
    svgComponent: HareTrackSVG,
  },
  {
    id: 'birds',
    filter: 'birds',
    name: 'Partridge & Guinea Fowl',
    latin: 'Alectoris spp. / Numida meleagris',
    accentColor: 'text-[#7c3aed]',
    accentHex: '#7c3aed',
    trackLength: '4 cm',
    trackWidth: '4 cm',
    gaitNote: 'Walking stride ~15 cm; scratching clusters in leaf litter show three forward toes fanned wide, one small rear toe.',
    bestTime: 'Morning & Late Afternoon',
    fieldSigns: [
      { icon: 'leaf', text: 'Dust baths — shallow, saucer-shaped depressions in dry soil with feathers and droppings around the rim.' },
      { icon: 'mappin', text: 'Roosting sites — white-washed droppings accumulated under favoured tree branches at ~2–4 m height.' },
      { icon: 'eye', text: 'Scratched leaf litter in irregular patches; feathers after preening or predator attack — check for blood or fur.' },
      { icon: 'droplets', text: 'Drinking trails to water — tight, parallel tracks converging on a waterbody edge in the early morning.' },
    ],
    svgComponent: BirdTrackSVG,
  },
]

// ─── Field Sign Icon Component ────────────────────────────────────────────────

function FieldSignIcon({ type, color }: { type: FieldSign['icon']; color: string }) {
  const cls = `w-4 h-4 flex-shrink-0 mt-0.5`
  switch (type) {
    case 'leaf': return <Leaf className={cls} style={{ color }} />
    case 'droplets': return <Droplets className={cls} style={{ color }} />
    case 'eye': return <Eye className={cls} style={{ color }} />
    case 'mappin': return <MapPin className={cls} style={{ color }} />
  }
}

// ─── Track Card ───────────────────────────────────────────────────────────────

function TrackCard({ animal, index }: { animal: TrackAnimal; index: number }) {
  const SVGComponent = animal.svgComponent

  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.article
        initial="rest"
        whileHover="hover"
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.015, transition: { duration: 0.3, ease: 'easeOut' } },
        }}
        className="relative rounded-2xl overflow-hidden border border-white/5 bg-forest-900/60 backdrop-blur-sm group"
        style={{ boxShadow: `0 0 0px ${animal.accentHex}00` }}
      >
        {/* Hover glow border */}
        <motion.div
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1, transition: { duration: 0.35 } },
          }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${animal.accentHex}55, 0 0 40px ${animal.accentHex}22` }}
        />

        {/* SVG Illustration panel */}
        <div
          className="relative flex items-center justify-center p-6 h-52"
          style={{ background: `radial-gradient(ellipse at center, ${animal.accentHex}18 0%, transparent 70%)` }}
        >
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(${animal.accentHex} 1px, transparent 1px), linear-gradient(90deg, ${animal.accentHex} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative w-28 h-40">
            <SVGComponent />
          </div>
          {/* Best time badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border"
            style={{ backgroundColor: `${animal.accentHex}22`, borderColor: `${animal.accentHex}44`, color: animal.accentHex }}
          >
            <Clock className="w-3 h-3" />
            {animal.bestTime}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 border-t border-white/5">
          {/* Name block */}
          <div className="mb-3">
            <h3 className="text-lg font-display font-bold">{animal.name}</h3>
            <p className="text-xs italic text-white/40 mt-0.5">{animal.latin}</p>
          </div>

          {/* Dimensions */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div
              className="rounded-lg px-3 py-1.5 text-xs font-mono border"
              style={{ backgroundColor: `${animal.accentHex}12`, borderColor: `${animal.accentHex}30`, color: animal.accentHex }}
            >
              L: {animal.trackLength}
            </div>
            <div
              className="rounded-lg px-3 py-1.5 text-xs font-mono border"
              style={{ backgroundColor: `${animal.accentHex}12`, borderColor: `${animal.accentHex}30`, color: animal.accentHex }}
            >
              W: {animal.trackWidth}
            </div>
          </div>

          {/* Gait note */}
          <p className="text-xs text-white/50 leading-relaxed mb-4 italic border-l-2 pl-3" style={{ borderColor: `${animal.accentHex}50` }}>
            {animal.gaitNote}
          </p>

          {/* Field signs */}
          <div className="space-y-2.5">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: animal.accentHex }}>Field Signs</p>
            {animal.fieldSigns.map((sign, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <FieldSignIcon type={sign.icon} color={animal.accentHex} />
                <span className="text-xs text-white/55 leading-relaxed">{sign.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.article>
    </ScrollReveal>
  )
}

// ─── Animated Background ──────────────────────────────────────────────────────

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 30%, #162b1222 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 70%, #0f1f0c44 0%, transparent 60%)' }} />
      {/* Floating orbs */}
      {[
        { cx: '15%', cy: '25%', r: 280, color: '#3a7a30', delay: 0, dur: 12 },
        { cx: '80%', cy: '60%', r: 220, color: '#1e3d19', delay: 4, dur: 16 },
        { cx: '50%', cy: '80%', r: 180, color: '#3a7a30', delay: 8, dur: 10 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.cx, top: orb.cy,
            width: orb.r * 2, height: orb.r * 2,
            marginLeft: -orb.r, marginTop: -orb.r,
            background: `radial-gradient(circle, ${orb.color}18 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: orb.dur, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── Reading the Forest Section ───────────────────────────────────────────────

function ReadingTheForest() {
  const tips = [
    {
      title: 'Following a Track Line',
      body: 'Mark each print with a small stone or twig before moving forward — you can always look back to confirm your line. Walk parallel to the track rather than on it to preserve evidence. In Mauritius forest, leaf litter obscures prints; look for disturbed soil edges, broken stems, and scuff marks on roots as connective evidence between clear prints.',
    },
    {
      title: 'Walking vs. Trotting vs. Running',
      body: 'Walking: tracks are close together, evenly spaced, often in an almost straight line (deer especially). Trotting: tracks are paired diagonals, stride length increases to 2–3× the animal\'s body length. Running/bounding: all four feet cluster together then extend in a long leap; stride gaps of a metre or more for boar, several metres for hare. Track depth increases dramatically at speed due to impact force.',
    },
    {
      title: 'Weather & Track Clarity',
      body: 'Fresh tracks in wet mud are crisp and three-dimensional — dewclaws and toe pads visible. After 2–4 hours in Mauritius heat, edges begin to crumble and dry. Rain fills and softens prints; a track under recent rain looks older than it is. Tracks in dry dust are shallow and can be erased by wind within an hour. Morning dew can restore definition briefly. Always compare track condition to known weather events to estimate age.',
    },
  ]

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-forest-500 font-bold uppercase tracking-[0.4em] text-xs">Fieldcraft</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold italic mt-3">Reading the Forest</h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Understanding what you see on the ground transforms a walk through the forest into a living map of animal activity.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, i) => (
            <ScrollReveal key={i} delay={i * 0.12}>
              <div className="relative rounded-2xl p-6 border border-white/5 bg-forest-900/40 h-full">
                {/* Large number */}
                <div
                  className="absolute top-4 right-5 text-6xl font-display font-bold italic leading-none select-none"
                  style={{ color: '#3a7a3015' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="w-1 h-8 rounded-full bg-forest-500 mb-4" />
                <h3 className="text-base font-display font-bold mb-3">{tip.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{tip.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Filter Tab Button ────────────────────────────────────────────────────────

function FilterTab({
  label, active, onClick, color,
}: { label: string; active: boolean; onClick: () => void; color?: string }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors"
      style={active ? { color: '#fff' } : { color: 'rgba(255,255,255,0.45)' }}
      whileTap={{ scale: 0.97 }}
    >
      {active && (
        <motion.div
          layoutId="filterPill"
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color ?? '#3a7a30' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative">{label}</span>
    </motion.button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const FILTERS: { key: FilterKey; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: '#3a7a30' },
  { key: 'deer', label: 'Deer', color: '#3a7a30' },
  { key: 'boar', label: 'Boar', color: '#92400e' },
  { key: 'hare', label: 'Hare', color: '#d97706' },
  { key: 'birds', label: 'Birds', color: '#7c3aed' },
]

export default function TracksPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const filteredAnimals = activeFilter === 'all'
    ? animals
    : animals.filter(a => a.filter === activeFilter)

  const activeColor = FILTERS.find(f => f.key === activeFilter)?.color ?? '#3a7a30'

  return (
    <PageWrapper>
      <AnimatedBackground />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-6">
        {/* Parallax content */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-forest-500 font-bold uppercase tracking-[0.4em] text-xs"
          >
            Field Reference · Mauritius
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-display font-bold italic mt-4 leading-none"
          >
            Animal Tracks
            <br />
            <span className="text-forest-500">&amp; Signs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 text-white/50 max-w-xl mx-auto leading-relaxed text-sm md:text-base"
          >
            Learn to read the forest floor. Identify prints, gait patterns, and field signs left by Mauritius's
            four principal game species — before you ever see the animal itself.
          </motion.p>

          {/* Decorative SVG footprint fade behind title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 -z-10">
            <div className="w-64 h-80">
              <DeerTrackSVG />
            </div>
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0a1208)' }} />
      </section>

      {/* ── Filter Tabs ── */}
      <section className="relative z-10 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-2 bg-forest-900/50 backdrop-blur border border-white/5 rounded-2xl p-2 w-fit mx-auto"
          >
            <Filter className="w-4 h-4 text-white/30 ml-2" />
            {FILTERS.map(f => (
              <FilterTab
                key={f.key}
                label={f.label}
                active={activeFilter === f.key}
                color={activeColor}
                onClick={() => setActiveFilter(f.key)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Track Card Grid ── */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredAnimals.map((animal, i) => (
                <TrackCard key={animal.id} animal={animal} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Reading the Forest ── */}
      <ReadingTheForest />
    </PageWrapper>
  )
}
