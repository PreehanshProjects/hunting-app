import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Trees,
  Users,
  Star,
  ChevronRight,
  AlertTriangle,
  Home,
  Thermometer,
  Car,
  Coffee,
  Info,
} from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { staggerContainer, fadeInUp } from '../../animations/variants'

// ─── Types ────────────────────────────────────────────────────────────────────

type Region = 'All' | 'South' | 'East' | 'West' | 'Central'
type Difficulty = 'Novice' | 'Intermediate' | 'Expert'

interface Estate {
  id: number
  name: string
  region: Exclude<Region, 'All'>
  location: string
  coords: [number, number]
  game: string[]
  size: string
  type: string
  difficulty: Difficulty
  season: string
  description: string
  facilities: string[]
  contact?: string
  accentColor: string
  image: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ESTATES: Estate[] = [
  {
    id: 1,
    name: 'Domaine de Chasseur',
    region: 'South',
    location: 'Mahébourg',
    coords: [-20.43, 57.69],
    game: ['Rusa Deer', 'Wild Boar', 'Hare'],
    size: '260 hectares of native forest',
    type: 'Private — paid hunting',
    difficulty: 'Expert',
    season: 'Deer (Jun–Sep), Boar (year-round)',
    description:
      'The most prestigious hunting estate in Mauritius. Dense native forest with high deer density. Professional guides provided. Trophy fees apply.',
    facilities: ['Lodge', 'Skinning shed', 'Cold room', 'Guide service'],
    contact: 'By appointment only',
    accentColor: '#3a7a30',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
  },
  {
    id: 2,
    name: 'Plaine Champagne Reserve',
    region: 'Central',
    location: 'Black River Gorges area',
    coords: [-20.37, 57.41],
    game: ['Rusa Deer', 'Wild Boar'],
    size: '180 hectares',
    type: 'Private — estate members only',
    difficulty: 'Intermediate',
    season: 'Deer (Jun–Sep), Boar (year-round)',
    description:
      'High-altitude plateau hunting with spectacular views. Cool mornings make for excellent deer activity at dawn. Mixed forest and savanna terrain.',
    facilities: ['Basic shelter', 'Vehicle access tracks'],
    accentColor: '#15803d',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
  },
  {
    id: 3,
    name: 'Grand Port Hunting Club',
    region: 'East',
    location: 'Grand Port',
    coords: [-20.38, 57.73],
    game: ['Rusa Deer', 'Hare', 'Partridge'],
    size: '95 hectares',
    type: 'Club membership',
    difficulty: 'Novice',
    season: 'Deer (Jun–Sep), Partridge (Apr–Aug)',
    description:
      'Ideal for newer hunters. Flatter terrain, well-maintained tracks, and active club community. Regular organised drives.',
    facilities: ['Clubhouse', 'BBQ area', 'Parking'],
    accentColor: '#d97706',
    image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800',
  },
  {
    id: 4,
    name: 'Rivière Noire Forest Block',
    region: 'West',
    location: 'Black River',
    coords: [-20.36, 57.37],
    game: ['Wild Boar', 'Hare'],
    size: '140 hectares',
    type: 'Private — landowner permission required',
    difficulty: 'Intermediate',
    season: 'Boar (year-round), Hare (year-round)',
    description:
      'Dense secondary forest bordering the Black River Gorges National Park. High boar population. Dogs essential for this terrain.',
    facilities: ['None — bring all equipment'],
    accentColor: '#92400e',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800',
  },
  {
    id: 5,
    name: 'Montagne Blanche Estate',
    region: 'East',
    location: 'Montagne Blanche',
    coords: [-20.22, 57.68],
    game: ['Rusa Deer', 'Wild Boar', 'Guinea Fowl'],
    size: '210 hectares',
    type: 'Private — paid day permits',
    difficulty: 'Intermediate',
    season: 'Deer (Jun–Sep), Guinea Fowl (Apr–Sep)',
    description:
      'Varied terrain from open savanna to forest gully. Excellent for driven deer shoots. Guinea fowl season (April–September) particularly productive.',
    facilities: ['Day shelter', 'Cold storage available'],
    accentColor: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
  },
  {
    id: 6,
    name: 'Bel Ombre Reserve',
    region: 'South',
    location: 'Bel Ombre',
    coords: [-20.51, 57.39],
    game: ['Hare', 'Partridge', 'Quail'],
    size: '60 hectares',
    type: 'Open to licensed hunters (NPCS permit)',
    difficulty: 'Novice',
    season: 'Partridge/Quail (Apr–Aug), Hare (year-round)',
    description:
      'Open grassland and scrub. Best for bird hunters and beginners. Excellent hare population year-round. Easy walking terrain.',
    facilities: ['Public access tracks'],
    accentColor: '#0f766e',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  },
  {
    id: 7,
    name: 'Chamarel Forest Walk',
    region: 'West',
    location: 'Chamarel',
    coords: [-20.43, 57.38],
    game: ['Wild Boar', 'Hare'],
    size: '75 hectares',
    type: 'Private — guided hunts only',
    difficulty: 'Expert',
    season: 'Boar (year-round), Hare (year-round)',
    description:
      'Steep volcanic terrain near the Chamarel coloured earths. Challenging but rewarding boar hunting. Night access strictly prohibited.',
    facilities: ['Guide mandatory', 'Transport provided'],
    accentColor: '#c2410c',
    image: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800',
  },
]

const REGIONS: Region[] = ['All', 'South', 'East', 'West', 'Central']

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string }> = {
  Novice: { label: 'Novice', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  Intermediate: { label: 'Intermediate', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  Expert: { label: 'Expert', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
}

const GAME_COLORS: Record<string, string> = {
  'Rusa Deer': 'bg-forest-600/20 text-forest-400 border-forest-600/40',
  'Wild Boar': 'bg-earth-700/30 text-amber-400 border-earth-600/40',
  Hare: 'bg-white/5 text-white/60 border-white/15',
  Partridge: 'bg-sky-900/30 text-sky-400 border-sky-700/40',
  Quail: 'bg-violet-900/30 text-violet-400 border-violet-700/40',
  'Guinea Fowl': 'bg-teal-900/30 text-teal-400 border-teal-700/40',
}

const FACILITY_ICONS: Record<string, React.ReactNode> = {
  Lodge: <Home size={13} />,
  'Skinning shed': <Thermometer size={13} />,
  'Cold room': <Thermometer size={13} />,
  'Guide service': <Users size={13} />,
  'Basic shelter': <Home size={13} />,
  'Vehicle access tracks': <Car size={13} />,
  Clubhouse: <Coffee size={13} />,
  'BBQ area': <Coffee size={13} />,
  Parking: <Car size={13} />,
  'None — bring all equipment': <Info size={13} />,
  'Day shelter': <Home size={13} />,
  'Cold storage available': <Thermometer size={13} />,
  'Public access tracks': <Car size={13} />,
  'Guide mandatory': <Users size={13} />,
  'Transport provided': <Car size={13} />,
}

// ─── Estate Card ──────────────────────────────────────────────────────────────

function EstateCard({ estate, index }: { estate: Estate; index: number }) {
  const [hovered, setHovered] = useState(false)
  const diff = DIFFICULTY_CONFIG[estate.difficulty]

  return (
    <motion.article
      variants={fadeInUp}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group border border-white/5 h-[480px] flex flex-col"
      style={{ boxShadow: hovered ? `0 20px 60px ${estate.accentColor}33` : '0 4px 24px rgba(0,0,0,0.5)' }}
      transition={{ boxShadow: { duration: 0.4 } }}
    >
      {/* Background image with parallax scale */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={estate.image}
          alt={estate.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/20" />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: `linear-gradient(to top, ${estate.accentColor}44, transparent 60%)` }}
      />

      {/* Accent bar top */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(to right, ${estate.accentColor}, transparent)` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Top badges */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-forest-900/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-white/70">
            <MapPin size={11} className="text-forest-400" />
            {estate.location}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold rounded-full px-3 py-1 border ${diff.bg} ${diff.color}`}
          >
            <Star size={10} />
            {diff.label}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Estate name */}
        <h3 className="font-display font-bold text-2xl text-white leading-tight mb-2 italic">
          {estate.name}
        </h3>

        {/* Region tag */}
        <span
          className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3"
          style={{ color: estate.accentColor }}
        >
          {estate.region} Mauritius
        </span>

        {/* Game tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {estate.game.map((g) => (
            <span
              key={g}
              className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${GAME_COLORS[g] ?? 'bg-white/5 text-white/50 border-white/10'}`}
            >
              {g}
            </span>
          ))}
        </div>

        {/* Size + type row */}
        <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
          <span className="flex items-center gap-1">
            <Trees size={12} className="text-forest-500" />
            {estate.size}
          </span>
        </div>

        {/* Description — revealed on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="text-xs text-white/65 leading-relaxed mb-3">{estate.description}</p>

              {/* Facilities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {estate.facilities.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 text-[10px] text-white/50 bg-white/5 rounded px-2 py-0.5"
                  >
                    <span className="text-forest-400">{FACILITY_ICONS[f] ?? <Info size={13} />}</span>
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom row: type + CTA */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded border border-white/8 truncate max-w-[60%]">
            {estate.type}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors"
            style={{
              borderColor: `${estate.accentColor}66`,
              color: estate.accentColor,
              background: `${estate.accentColor}11`,
            }}
          >
            Learn More
            <ChevronRight size={12} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EstatesPage() {
  const [activeRegion, setActiveRegion] = useState<Region>('All')

  const filtered = ESTATES.filter(
    (e) => activeRegion === 'All' || e.region === activeRegion
  )

  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {/* Parallax hero background */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600"
            alt="Mauritius hunting estate"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-forest-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/50 to-transparent" />
        </motion.div>

        {/* Decorative grid lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(58,122,48,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(58,122,48,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Hero text */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-20 pt-40">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-forest-400 font-bold uppercase tracking-[0.4em] text-xs mb-5"
          >
            Mauritius Hunting Directory
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black italic text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-6"
          >
            Hunting
            <br />
            <span className="text-forest-400">Estates</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-white/55 text-lg leading-relaxed"
          >
            Seven curated private estates, reserves, and club grounds across
            Mauritius — from expert-only native forest to beginner-friendly
            open grassland.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-8 mt-10"
          >
            {[
              { label: 'Estates listed', value: '7' },
              { label: 'Total hectares', value: '1,020+' },
              { label: 'Game species', value: '6' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-display font-bold text-forest-400">{stat.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <section className="sticky top-20 z-30 bg-forest-950/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {REGIONS.map((region) => (
            <motion.button
              key={region}
              onClick={() => setActiveRegion(region)}
              whileTap={{ scale: 0.96 }}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 border ${
                activeRegion === region
                  ? 'bg-forest-600 border-forest-500 text-white'
                  : 'bg-transparent border-white/10 text-white/50 hover:text-white/80 hover:border-white/25'
              }`}
            >
              {region}
              {activeRegion === region && (
                <motion.span
                  layoutId="regionIndicator"
                  className="absolute inset-0 rounded-full bg-forest-600 -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </motion.button>
          ))}

          <span className="ml-auto text-xs text-white/30 whitespace-nowrap">
            {filtered.length} estate{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRegion}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((estate, i) => (
                <EstateCard key={estate.id} estate={estate} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-white/30"
            >
              <Trees size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">No estates found in this region.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Before You Visit Disclaimer ── */}
      <ScrollReveal>
        <section className="py-16 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl bg-amber-950/20 border border-amber-600/20 p-8 md:p-10">
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-white italic mb-1">
                    Before You Visit
                  </h2>
                  <p className="text-white/40 text-sm">
                    Essential checks before accessing any hunting estate in Mauritius
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Verify Permissions',
                    body: 'Always confirm access with the estate owner or manager before entering. Trespassing on private hunting land is a criminal offence.',
                    color: 'text-amber-400',
                  },
                  {
                    title: 'Carry Your Licence',
                    body: 'Your valid game licence must be carried at all times when hunting. Inspectors may check on any estate at any time.',
                    color: 'text-forest-400',
                  },
                  {
                    title: 'Landowner Consent (s.18)',
                    body: 'Ensure written or verbal landowner consent as required under Section 18 of the Wildlife & National Parks Act.',
                    color: 'text-sky-400',
                  },
                  {
                    title: 'Check Open Seasons',
                    body: 'Confirm current open season dates from the NPCS before hunting. Seasons and bag limits may change year to year.',
                    color: 'text-violet-400',
                  },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className={`font-semibold text-sm mb-2 ${item.color}`}>{item.title}</h3>
                    <p className="text-xs text-white/45 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Season Quick Reference ── */}
      <ScrollReveal delay={0.1}>
        <section className="py-12 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl font-bold italic text-white mb-6">
              Season Quick Reference
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-widest">
                      Species
                    </th>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                      (m) => (
                        <th
                          key={m}
                          className="py-3 px-2 text-white/40 font-medium text-xs uppercase tracking-widest text-center"
                        >
                          {m}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      species: 'Rusa Deer',
                      open: [5, 6, 7, 8],
                      color: 'bg-forest-600',
                    },
                    {
                      species: 'Wild Boar',
                      open: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                      color: 'bg-amber-600',
                    },
                    {
                      species: 'Hare',
                      open: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                      color: 'bg-white/25',
                    },
                    {
                      species: 'Partridge',
                      open: [3, 4, 5, 6, 7],
                      color: 'bg-sky-600',
                    },
                    {
                      species: 'Quail',
                      open: [3, 4, 5, 6, 7],
                      color: 'bg-violet-600',
                    },
                    {
                      species: 'Guinea Fowl',
                      open: [3, 4, 5, 6, 7, 8],
                      color: 'bg-teal-600',
                    },
                  ].map((row) => (
                    <tr key={row.species} className="border-b border-white/5 hover:bg-white/2">
                      <td className="py-3 px-4 font-medium text-white/70 whitespace-nowrap">
                        {row.species}
                      </td>
                      {Array.from({ length: 12 }, (_, i) => (
                        <td key={i} className="py-3 px-2 text-center">
                          <div
                            className={`w-full h-5 rounded-sm mx-auto ${
                              row.open.includes(i) ? `${row.color} opacity-80` : 'bg-white/5'
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-white/25 mt-3 px-4">
                * Indicative only. Always confirm current open season dates with NPCS before hunting.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </PageWrapper>
  )
}
