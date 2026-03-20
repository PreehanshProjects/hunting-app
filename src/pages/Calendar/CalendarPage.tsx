import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sun, Sunrise, Moon, Clock, Info } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { fadeInUp, staggerContainer } from '../../animations/variants'

// ─── Moon Phase Algorithm ────────────────────────────────────────────────────

function getMoonPhase(date: Date): number {
  const known = new Date(2000, 0, 6) // known new moon
  const diff = date.getTime() - known.getTime()
  const days = diff / (1000 * 60 * 60 * 24)
  const cycle = 29.53058867
  return (((days % cycle) + cycle) % cycle) / cycle
}

type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent'

function getMoonPhaseName(phase: number): MoonPhaseName {
  if (phase < 0.03 || phase > 0.97) return 'New Moon'
  if (phase < 0.22) return 'Waxing Crescent'
  if (phase < 0.28) return 'First Quarter'
  if (phase < 0.47) return 'Waxing Gibbous'
  if (phase < 0.53) return 'Full Moon'
  if (phase < 0.72) return 'Waning Gibbous'
  if (phase < 0.78) return 'Last Quarter'
  return 'Waning Crescent'
}

type HuntingRating = 'Excellent' | 'Good' | 'Fair'

function getHuntingRating(phase: number): HuntingRating {
  const name = getMoonPhaseName(phase)
  if (name === 'New Moon') return 'Excellent'
  if (name === 'Full Moon') return 'Fair'
  if (name === 'First Quarter' || name === 'Last Quarter') return 'Good'
  return 'Good'
}

// ─── Season Data ─────────────────────────────────────────────────────────────

interface SeasonInfo {
  species: string
  months: number[] // 0-indexed
  color: string
}

const SEASONS: SeasonInfo[] = [
  { species: 'Rusa Deer', months: [5, 6, 7, 8], color: 'text-forest-400' },
  { species: 'Wild Boar', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], color: 'text-amber-400' },
  { species: 'Hare', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], color: 'text-white/60' },
  { species: 'Partridge', months: [3, 4, 5, 6, 7], color: 'text-sky-400' },
  { species: 'Quail', months: [3, 4, 5, 6, 7], color: 'text-violet-400' },
  { species: 'Guinea Fowl', months: [3, 4, 5, 6, 7, 8], color: 'text-teal-400' },
]

function getSpeciesInSeason(month: number): string[] {
  return SEASONS.filter((s) => s.months.includes(month)).map((s) => s.species)
}

// ─── Best Species by Phase ────────────────────────────────────────────────────

function getBestSpeciesByPhase(phase: number, month: number): string[] {
  const name = getMoonPhaseName(phase)
  const inSeason = getSpeciesInSeason(month)

  // Full moon: birds and hare better than deer (deer nocturnal)
  if (name === 'Full Moon') {
    return inSeason.filter((s) => s !== 'Rusa Deer').slice(0, 3)
  }
  // New moon: all daytime species excellent
  if (name === 'New Moon') {
    return inSeason.slice(0, 4)
  }
  // Default: deer first if in season
  return inSeason.slice(0, 3)
}

// ─── Time Recommendation ─────────────────────────────────────────────────────

function getTimeRecommendation(phase: number): { label: string; icon: React.ReactNode; detail: string } {
  const name = getMoonPhaseName(phase)
  if (name === 'New Moon') {
    return {
      label: 'All Day',
      icon: <Sun size={14} />,
      detail: 'Dark nights push game to feed during daylight hours. Peak activity 08:00–11:00 and 14:00–17:00.',
    }
  }
  if (name === 'Full Moon') {
    return {
      label: 'Dawn & Dusk Only',
      icon: <Sunrise size={14} />,
      detail: 'Animals fed through the night. Brief twilight windows 05:30–07:30 and 17:30–19:00 offer best chances.',
    }
  }
  if (name === 'Waxing Gibbous' || name === 'Waning Gibbous') {
    return {
      label: 'Dawn & Dusk',
      icon: <Sunrise size={14} />,
      detail: 'Good dawn and dusk activity windows. Deer move in transition light. 06:00–08:30 and 16:30–18:30.',
    }
  }
  return {
    label: 'Morning Focus',
    icon: <Clock size={14} />,
    detail: 'Early morning hours 06:00–10:00 most productive. Animals return to cover by mid-morning.',
  }
}

// ─── Moon SVG Components ──────────────────────────────────────────────────────

function MoonSVG({ phase, size = 32 }: { phase: number; size?: number }) {
  const name = getMoonPhaseName(phase)
  const r = size / 2
  const cx = r
  const cy = r

  // Illumination fraction and direction
  const isWaxing =
    name === 'Waxing Crescent' || name === 'First Quarter' || name === 'Waxing Gibbous'

  if (name === 'New Moon') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r - 1} fill="#1a2e18" stroke="#2a5522" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r - 3} fill="#0f1f0c" opacity="0.8" />
      </svg>
    )
  }

  if (name === 'Full Moon') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id={`full-${size}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#fffde0" />
            <stop offset="60%" stopColor="#f5e87a" />
            <stop offset="100%" stopColor="#c8b84a" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r - 1} fill={`url(#full-${size})`} />
        <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#f5e87a" strokeWidth="1" opacity="0.3" />
        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#f5e87a" strokeWidth="0.5" opacity="0.15" />
      </svg>
    )
  }

  if (name === 'First Quarter') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r - 1} fill="#1a2e18" stroke="#2a5522" strokeWidth="0.5" />
        {/* Right half lit */}
        <path d={`M ${cx} ${1} A ${r - 1} ${r - 1} 0 0 1 ${cx} ${size - 1}`} fill="#d4c06a" />
      </svg>
    )
  }

  if (name === 'Last Quarter') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r - 1} fill="#1a2e18" stroke="#2a5522" strokeWidth="0.5" />
        {/* Left half lit */}
        <path d={`M ${cx} ${1} A ${r - 1} ${r - 1} 0 0 0 ${cx} ${size - 1}`} fill="#d4c06a" />
      </svg>
    )
  }

  // Crescent / Gibbous — use clip-path approach
  const isGibbous = name === 'Waxing Gibbous' || name === 'Waning Gibbous'
  const shadowCx = isWaxing
    ? isGibbous
      ? cx - (r - 2) * 0.5
      : cx + (r - 2) * 0.8
    : isGibbous
    ? cx + (r - 2) * 0.5
    : cx - (r - 2) * 0.8

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <clipPath id={`moon-clip-${phase.toFixed(2)}-${size}`}>
          <circle cx={cx} cy={cy} r={r - 1} />
        </clipPath>
      </defs>
      {/* Base lit circle */}
      <circle cx={cx} cy={cy} r={r - 1} fill="#d4c06a" stroke="#2a5522" strokeWidth="0.5" />
      {/* Shadow overlay */}
      <circle
        cx={shadowCx}
        cy={cy}
        r={r - 1}
        fill="#0f1f0c"
        clipPath={`url(#moon-clip-${phase.toFixed(2)}-${size})`}
        opacity="0.95"
      />
    </svg>
  )
}

// Large animated moon for hero display
function LargeMoonDisplay({ phase }: { phase: number }) {
  const name = getMoonPhaseName(phase)
  const size = 120

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      <MoonSVG phase={phase} size={size} />
      {name === 'Full Moon' && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            boxShadow: '0 0 40px 20px rgba(245,232,122,0.25), 0 0 80px 40px rgba(245,232,122,0.1)',
          }}
        />
      )}
    </motion.div>
  )
}

// ─── Rating Config ────────────────────────────────────────────────────────────

const RATING_CONFIG: Record<
  HuntingRating,
  { label: string; dot: string; text: string; bg: string; border: string; explanation: string }
> = {
  Excellent: {
    label: 'Excellent',
    dot: 'bg-forest-500',
    text: 'text-forest-400',
    bg: 'bg-forest-900/40',
    border: 'border-forest-600/40',
    explanation:
      'Dark nights with a new moon push game to feed during daylight. Deer, boar and hare are highly active from mid-morning. Ideal for all-day hunts.',
  },
  Good: {
    label: 'Good',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    bg: 'bg-amber-950/30',
    border: 'border-amber-600/30',
    explanation:
      'Partial moon provides moderate illumination. Animals active at dawn and dusk with some midday movement. Focus efforts on transitions.',
  },
  Fair: {
    label: 'Fair',
    dot: 'bg-white/40',
    text: 'text-white/50',
    bg: 'bg-white/5',
    border: 'border-white/10',
    explanation:
      'Bright full-moon nights allow game to feed nocturnally, reducing daytime movement. Concentrate on brief twilight windows at dawn and dusk.',
  },
}

// ─── Calendar Helpers ─────────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const d = new Date(year, month, 1)
  while (d.getMonth() === month) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

// Returns 0=Mon … 6=Sun for calendar grid offset
function getMonthStartOffset(year: number, month: number): number {
  const jsDay = new Date(year, month, 1).getDay() // 0=Sun
  return jsDay === 0 ? 6 : jsDay - 1
}

// ─── Day Cell ────────────────────────────────────────────────────────────────

interface DayData {
  date: Date
  phase: number
  phaseName: MoonPhaseName
  rating: HuntingRating
}

function DayCell({
  data,
  isToday,
  isSelected,
  onClick,
}: {
  data: DayData
  isToday: boolean
  isSelected: boolean
  onClick: () => void
}) {
  const rating = RATING_CONFIG[data.rating]

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all duration-200 ${
        isSelected
          ? `${rating.bg} ${rating.border} ring-1 ring-forest-400`
          : isToday
          ? 'bg-forest-900/60 border-forest-500'
          : 'bg-forest-950/50 border-white/5 hover:border-white/15 hover:bg-forest-900/30'
      }`}
    >
      {isToday && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-forest-400" />
      )}
      <span className={`text-xs font-semibold ${isToday ? 'text-forest-300' : 'text-white/60'}`}>
        {data.date.getDate()}
      </span>
      <MoonSVG phase={data.phase} size={20} />
      <span className={`w-1.5 h-1.5 rounded-full ${rating.dot}`} />
    </motion.button>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DayDetailPanel({ data, month }: { data: DayData; month: number }) {
  const rating = RATING_CONFIG[data.rating]
  const timeRec = getTimeRecommendation(data.phase)
  const bestSpecies = getBestSpeciesByPhase(data.phase, month)
  const allInSeason = getSpeciesInSeason(month)

  const dateStr = data.date.toLocaleDateString('en-MU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border ${rating.border} ${rating.bg} p-6 backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-white/40 mb-1">{dateStr}</p>
          <h3 className="font-display font-bold text-xl text-white italic">{data.phaseName}</h3>
        </div>
        <MoonSVG phase={data.phase} size={48} />
      </div>

      {/* Rating */}
      <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-forest-950/60 border border-white/5`}>
        <span className={`w-2 h-2 rounded-full ${rating.dot} flex-shrink-0`} />
        <span className={`text-sm font-bold ${rating.text}`}>{rating.label} Hunting</span>
      </div>

      <p className="text-xs text-white/55 leading-relaxed mb-5">{rating.explanation}</p>

      {/* Best time */}
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Best Time of Day</p>
        <div className="flex items-start gap-2 bg-forest-950/50 rounded-lg p-3 border border-white/5">
          <span className="text-forest-400 flex-shrink-0 mt-0.5">{timeRec.icon}</span>
          <div>
            <span className="text-sm font-semibold text-white">{timeRec.label}</span>
            <p className="text-xs text-white/45 mt-1 leading-relaxed">{timeRec.detail}</p>
          </div>
        </div>
      </div>

      {/* Best species */}
      {bestSpecies.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
            Best Species Today
          </p>
          <div className="flex flex-wrap gap-1.5">
            {bestSpecies.map((s) => {
              const season = SEASONS.find((ss) => ss.species === s)
              return (
                <span
                  key={s}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full bg-forest-900/60 border border-white/10 ${season?.color ?? 'text-white/60'}`}
                >
                  {s}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Species in season this month */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
          In Season This Month
        </p>
        {allInSeason.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {allInSeason.map((s) => {
              const season = SEASONS.find((ss) => ss.species === s)
              return (
                <span key={s} className={`text-[10px] ${season?.color ?? 'text-white/40'}`}>
                  {s}
                </span>
              )
            }).reduce<React.ReactNode[]>((acc, el, i) => {
              if (i > 0) acc.push(<span key={`sep-${i}`} className="text-white/20 text-[10px]"> · </span>)
              acc.push(el)
              return acc
            }, [])}
          </div>
        ) : (
          <p className="text-xs text-white/30 italic">No species in open season</p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today = useMemo(() => new Date(), [])

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date>(today)

  // Today's moon data
  const todayPhase = useMemo(() => getMoonPhase(today), [today])
  const todayPhaseName = getMoonPhaseName(todayPhase)
  const todayRating = getHuntingRating(todayPhase)
  const todayTimeRec = getTimeRecommendation(todayPhase)

  // Calendar grid
  const daysInMonth = useMemo(() => getDaysInMonth(viewYear, viewMonth), [viewYear, viewMonth])
  const offset = useMemo(() => getMonthStartOffset(viewYear, viewMonth), [viewYear, viewMonth])

  const dayDataMap = useMemo(() => {
    const map = new Map<string, DayData>()
    daysInMonth.forEach((date) => {
      const phase = getMoonPhase(date)
      map.set(date.toDateString(), {
        date,
        phase,
        phaseName: getMoonPhaseName(phase),
        rating: getHuntingRating(phase),
      })
    })
    return map
  }, [daysInMonth])

  const selectedData = useMemo(() => {
    return dayDataMap.get(selectedDate.toDateString()) ?? dayDataMap.get(daysInMonth[0]?.toDateString() ?? '')
  }, [selectedDate, dayDataMap, daysInMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const todayRatingConfig = RATING_CONFIG[todayRating]

  return (
    <PageWrapper>
      {/* ── Hero: Today's Moon ── */}
      <section className="relative py-20 px-6 overflow-hidden border-b border-white/5">
        {/* Celestial background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b18] via-forest-950 to-forest-950" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 70% 40%, rgba(58,122,48,0.15) 0%, transparent 60%), radial-gradient(circle at 30% 60%, rgba(15,118,110,0.08) 0%, transparent 50%)',
          }}
        />

        {/* Stars */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
            animate={{ opacity: [Math.random() * 0.4 + 0.1, Math.random() * 0.8 + 0.3, Math.random() * 0.4 + 0.1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">
            {/* Left: heading */}
            <div className="flex-1">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-forest-400 font-bold uppercase tracking-[0.4em] text-xs mb-5"
              >
                Moon Phase & Conditions
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black italic text-5xl md:text-7xl text-white leading-none mb-4"
              >
                Hunting
                <br />
                <span className="text-forest-400">Calendar</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-white/45 text-base leading-relaxed max-w-md"
              >
                Plan every outing around lunar cycles. Moon phase is one of the strongest predictors
                of game movement — especially for Rusa deer in Mauritius native forest.
              </motion.p>
            </div>

            {/* Right: today's moon card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`flex-shrink-0 rounded-3xl border ${todayRatingConfig.border} ${todayRatingConfig.bg} p-8 min-w-[280px] backdrop-blur-sm`}
            >
              <p className="text-xs text-white/35 uppercase tracking-widest mb-4">
                {today.toLocaleDateString('en-MU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <LargeMoonDisplay phase={todayPhase} />
                <div>
                  <div className={`text-sm font-bold ${todayRatingConfig.text} mb-1`}>
                    {todayRatingConfig.label} Hunting
                  </div>
                  <div className="font-display text-xl font-bold italic text-white">{todayPhaseName}</div>
                </div>
              </div>

              {/* Time rec */}
              <div className="flex items-center gap-2 text-xs text-white/60 bg-forest-950/60 rounded-xl px-3 py-2.5 border border-white/5 mb-4">
                <span className="text-forest-400">{todayTimeRec.icon}</span>
                <span className="font-semibold">{todayTimeRec.label}</span>
              </div>

              {/* In-season species */}
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">In Season</p>
              <div className="flex flex-wrap gap-1">
                {getSpeciesInSeason(today.getMonth()).map((s) => {
                  const season = SEASONS.find((ss) => ss.species === s)
                  return (
                    <span key={s} className={`text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/8 ${season?.color ?? 'text-white/50'}`}>
                      {s}
                    </span>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Calendar Grid ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Calendar column */}
            <div className="flex-1 min-w-0">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-8">
                <motion.button
                  onClick={prevMonth}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-forest-900/50 border border-white/10 text-white/60 hover:text-white hover:border-forest-500 transition-colors"
                >
                  <ChevronLeft size={18} />
                </motion.button>

                <div className="text-center">
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={`${viewYear}-${viewMonth}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="font-display font-bold text-2xl italic text-white"
                    >
                      {MONTHS[viewMonth]} {viewYear}
                    </motion.h2>
                  </AnimatePresence>

                  {/* In-season indicator for current month */}
                  <div className="flex items-center justify-center gap-2 mt-1">
                    {getSpeciesInSeason(viewMonth).slice(0, 3).map((s) => {
                      const season = SEASONS.find((ss) => ss.species === s)
                      return (
                        <span key={s} className={`text-[9px] font-semibold uppercase tracking-wide ${season?.color ?? 'text-white/40'}`}>
                          {s}
                        </span>
                      )
                    })}
                    {getSpeciesInSeason(viewMonth).length > 3 && (
                      <span className="text-[9px] text-white/30">
                        +{getSpeciesInSeason(viewMonth).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={nextMonth}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-forest-900/50 border border-white/10 text-white/60 hover:text-white hover:border-forest-500 transition-colors"
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-white/25 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${viewYear}-${viewMonth}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-7 gap-1"
                >
                  {/* Offset empty cells */}
                  {Array.from({ length: offset }, (_, i) => (
                    <div key={`empty-${i}`} className="h-16" />
                  ))}

                  {/* Day cells */}
                  {daysInMonth.map((date) => {
                    const data = dayDataMap.get(date.toDateString())!
                    const isToday = date.toDateString() === today.toDateString()
                    const isSelected = date.toDateString() === selectedDate.toDateString()
                    return (
                      <DayCell
                        key={date.toDateString()}
                        data={data}
                        isToday={isToday}
                        isSelected={isSelected}
                        onClick={() => setSelectedDate(date)}
                      />
                    )
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Legend */}
              <div className="flex items-center gap-5 mt-6 pt-4 border-t border-white/5">
                <span className="text-xs text-white/30 font-medium">Rating:</span>
                {(Object.entries(RATING_CONFIG) as [HuntingRating, typeof RATING_CONFIG[HuntingRating]][]).map(
                  ([key, cfg]) => (
                    <span key={key} className="flex items-center gap-1.5 text-xs text-white/50">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  )
                )}
                <span className="flex items-center gap-1.5 text-xs text-white/40 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-400" />
                  Today
                </span>
              </div>
            </div>

            {/* Detail panel */}
            <div className="xl:w-80 flex-shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-4">
                Selected Day
              </p>
              <AnimatePresence mode="wait">
                {selectedData && (
                  <DayDetailPanel
                    key={selectedDate.toDateString()}
                    data={selectedData}
                    month={viewMonth}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Moon Phase Matters ── */}
      <ScrollReveal>
        <section className="py-16 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <span className="text-forest-400 font-bold uppercase tracking-[0.4em] text-xs">
                Field Intelligence
              </span>
              <h2 className="font-display font-bold italic text-3xl text-white mt-3">
                Why Moon Phase Matters
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: <Moon size={24} className="text-amber-300" />,
                  title: 'Nocturnal Illumination & Feeding',
                  body: `On full-moon nights, Rusa deer and other game have enough light to feed freely after dark. By sunrise they are already back in dense cover with full stomachs, dramatically reducing daytime sightings. New-moon nights are pitch black — deer must feed during daylight hours, making morning and afternoon hunts far more productive.`,
                  border: 'border-amber-700/25',
                  bg: 'bg-amber-950/15',
                },
                {
                  icon: <Sunrise size={24} className="text-forest-400" />,
                  title: 'Best Times of Day per Phase',
                  body: `New Moon: All-day activity windows, peak at 08:00–11:00 and 14:00–17:00. Crescent phases: Morning focus, 06:00–10:00. Quarter Moon: Dawn and dusk only. Gibbous: Short active windows at transition light — 06:00–08:30 and 16:30–18:30. Full Moon: Twilight edges only, 05:30–07:30 and 17:30–19:00. Birds and hare are less affected than deer.`,
                  border: 'border-forest-600/25',
                  bg: 'bg-forest-900/20',
                },
                {
                  icon: <Info size={24} className="text-sky-400" />,
                  title: 'Barometric Pressure Note',
                  body: `Moon phase interacts with barometric pressure — falling pressure before a front pushes game to feed aggressively regardless of moon phase. A new moon combined with a dropping barometer creates the best possible conditions in Mauritius. Rising pressure after rain produces excellent midday movement as animals emerge to dry off and feed. Always check the forecast alongside the lunar calendar.`,
                  border: 'border-sky-700/25',
                  bg: 'bg-sky-950/15',
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  variants={fadeInUp}
                  className={`rounded-2xl border ${card.border} ${card.bg} p-6`}
                >
                  <div className="mb-4">{card.icon}</div>
                  <h3 className="font-display font-bold text-lg italic text-white mb-3">{card.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Phase Reference ── */}
      <ScrollReveal delay={0.1}>
        <section className="py-12 px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-display text-xl font-bold italic text-white mb-6">
              Moon Phase Quick Reference
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(
                [
                  { phase: 0.0, label: 'New Moon' },
                  { phase: 0.15, label: 'Waxing Crescent' },
                  { phase: 0.25, label: 'First Quarter' },
                  { phase: 0.38, label: 'Waxing Gibbous' },
                  { phase: 0.5, label: 'Full Moon' },
                  { phase: 0.63, label: 'Waning Gibbous' },
                  { phase: 0.75, label: 'Last Quarter' },
                  { phase: 0.88, label: 'Waning Crescent' },
                ] as { phase: number; label: MoonPhaseName }[]
              ).map((item) => {
                const rating = getHuntingRating(item.phase)
                const ratingCfg = RATING_CONFIG[rating]
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 bg-forest-900/30 border border-white/5 rounded-xl px-4 py-3"
                  >
                    <MoonSVG phase={item.phase} size={28} />
                    <div>
                      <div className="text-xs font-semibold text-white/80">{item.label}</div>
                      <div className={`text-[10px] font-bold ${ratingCfg.text}`}>{ratingCfg.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </PageWrapper>
  )
}
