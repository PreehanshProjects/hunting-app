import { useState, useEffect, useRef, useCallback } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, AnimatePresence, animate } from 'framer-motion'
import {
  Trophy,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Info,
  Star,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TrophyMeasurements {
  leftBeam: number
  rightBeam: number
  leftBrow: number
  rightBrow: number
  leftBez: number
  rightBez: number
  leftTrez: number
  rightTrez: number
  c1: number
  c2: number
  c3: number
  c4: number
  insideSpread: number
  weight: number
}

type MedalType = 'none' | 'bronze' | 'silver' | 'gold'

// ─── CIC Score Calculator ──────────────────────────────────────────────────────

function calculateCICScore(m: TrophyMeasurements): number {
  const beamScore = (m.leftBeam + m.rightBeam) * 0.5
  const tineScore =
    m.leftBrow + m.rightBrow + m.leftBez + m.rightBez + m.leftTrez + m.rightTrez
  const circumScore = ((m.c1 + m.c2 + m.c3 + m.c4) / 4) * 1.0
  const spreadScore = m.insideSpread * 0.5
  const weightBonus = m.weight > 0 ? m.weight * 0.1 : 0
  return beamScore + tineScore + circumScore + spreadScore + weightBonus
}

function getMedal(score: number): MedalType {
  if (score >= 190) return 'gold'
  if (score >= 170) return 'silver'
  if (score >= 150) return 'bronze'
  return 'none'
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultMeasurements: TrophyMeasurements = {
  leftBeam: 0,
  rightBeam: 0,
  leftBrow: 0,
  rightBrow: 0,
  leftBez: 0,
  rightBez: 0,
  leftTrez: 0,
  rightTrez: 0,
  c1: 0,
  c2: 0,
  c3: 0,
  c4: 0,
  insideSpread: 0,
  weight: 0,
}

// ─── Animated Score Number ─────────────────────────────────────────────────────

function AnimatedScore({ value }: { value: number }) {
  const displayRef = useRef<HTMLSpanElement>(null)
  const prevValue = useRef(0)

  useEffect(() => {
    const node = displayRef.current
    if (!node) return
    const from = prevValue.current
    const to = value
    prevValue.current = value

    const controls = animate(from, to, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate(v) {
        if (node) node.textContent = v.toFixed(1)
      },
    })
    return () => controls.stop()
  }, [value])

  return (
    <span ref={displayRef} className="tabular-nums">
      {value.toFixed(1)}
    </span>
  )
}

// ─── Gold Particles ────────────────────────────────────────────────────────────

function GoldParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: -(40 + Math.random() * 80),
    rotate: Math.random() * 360,
    scale: 0.4 + Math.random() * 0.8,
    delay: Math.random() * 0.6,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
          style={{
            background: `hsl(${42 + Math.random() * 20}, 90%, 55%)`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: p.scale, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0,
            rotate: p.rotate,
          }}
          transition={{
            duration: 1.4,
            delay: p.delay,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  )
}

// ─── Medal Badge ───────────────────────────────────────────────────────────────

const medalConfig = {
  gold: {
    label: 'Gold Medal',
    bg: 'bg-amber-500/20',
    border: 'border-amber-400/60',
    text: 'text-amber-300',
    icon: 'text-amber-400',
    glow: 'shadow-[0_0_32px_rgba(245,166,35,0.35)]',
    desc: 'Exceptional trophy — a true masterpiece.',
  },
  silver: {
    label: 'Silver Medal',
    bg: 'bg-slate-400/10',
    border: 'border-slate-300/50',
    text: 'text-slate-200',
    icon: 'text-slate-300',
    glow: 'shadow-[0_0_20px_rgba(200,200,200,0.15)]',
    desc: 'Outstanding trophy — a fine achievement.',
  },
  bronze: {
    label: 'Bronze Medal',
    bg: 'bg-amber-900/20',
    border: 'border-amber-700/50',
    text: 'text-amber-600',
    icon: 'text-amber-700',
    glow: 'shadow-[0_0_18px_rgba(139,95,43,0.2)]',
    desc: 'Commendable trophy — well earned.',
  },
  none: {
    label: 'No Medal',
    bg: 'bg-white/5',
    border: 'border-white/10',
    text: 'text-white/40',
    icon: 'text-white/20',
    glow: '',
    desc: 'Keep measuring — enter your data to qualify.',
  },
}

function MedalBadge({ medal }: { medal: MedalType }) {
  const cfg = medalConfig[medal]
  return (
    <motion.div
      key={medal}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border p-6 ${cfg.bg} ${cfg.border} ${cfg.glow}`}
    >
      {medal === 'gold' && <GoldParticles />}
      <div className={`relative z-10 ${cfg.icon}`}>
        <Trophy size={52} strokeWidth={1.5} />
      </div>
      <span className={`relative z-10 text-lg font-semibold tracking-wide ${cfg.text}`}>
        {cfg.label}
      </span>
      <p className={`relative z-10 text-center text-sm ${cfg.text} opacity-80`}>
        {cfg.desc}
      </p>
    </motion.div>
  )
}

// ─── Antler Diagram SVG ────────────────────────────────────────────────────────

function AntlerDiagram() {
  return (
    <svg
      viewBox="0 0 380 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto"
      aria-label="Rusa Deer antler measurement diagram"
    >
      {/* ── Skull base ── */}
      <rect x="155" y="255" width="70" height="22" rx="10" fill="#1e3d19" stroke="#3a7a30" strokeWidth="1.5" />
      <text x="190" y="271" textAnchor="middle" fill="#a3c49a" fontSize="9" fontFamily="Inter, sans-serif">Skull Base</text>

      {/* ── Pedicles ── */}
      <rect x="168" y="228" width="18" height="30" rx="4" fill="#162b12" stroke="#3a7a30" strokeWidth="1.2" />
      <rect x="194" y="228" width="18" height="30" rx="4" fill="#162b12" stroke="#3a7a30" strokeWidth="1.2" />

      {/* ══ LEFT BEAM (main antler) ══ */}
      {/* Main beam curves up and arcs outward */}
      <path
        d="M 177 228 C 172 200, 145 175, 120 145 C 100 120, 88 95, 82 65"
        stroke="#4a9e3f"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Beam label */}
      <text x="105" y="140" fill="#86efac" fontSize="8.5" fontFamily="Inter, sans-serif" transform="rotate(-30,105,140)">← Left Beam (LB)</text>

      {/* ══ RIGHT BEAM ══ */}
      <path
        d="M 203 228 C 208 200, 235 175, 260 145 C 280 120, 292 95, 298 65"
        stroke="#4a9e3f"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <text x="268" y="138" fill="#86efac" fontSize="8.5" fontFamily="Inter, sans-serif" transform="rotate(30,268,138)">Right Beam (RB) →</text>

      {/* ══ LEFT BROW TINE (T1) ══ */}
      <path
        d="M 164 200 C 148 192, 132 178, 122 162"
        stroke="#f59e0b"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <text x="118" y="172" fill="#fcd34d" fontSize="8" fontFamily="Inter, sans-serif" textAnchor="end">Brow (T1)</text>
      {/* dot at base */}
      <circle cx="164" cy="200" r="4" fill="#f59e0b" opacity="0.8" />

      {/* ══ RIGHT BROW TINE ══ */}
      <path
        d="M 216 200 C 232 192, 248 178, 258 162"
        stroke="#f59e0b"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <text x="262" y="172" fill="#fcd34d" fontSize="8" fontFamily="Inter, sans-serif">Brow (T1)</text>
      <circle cx="216" cy="200" r="4" fill="#f59e0b" opacity="0.8" />

      {/* ══ LEFT BEZ TINE (T2) ══ */}
      <path
        d="M 152 165 C 138 155, 128 140, 122 126"
        stroke="#60a5fa"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <text x="108" y="128" fill="#93c5fd" fontSize="8" fontFamily="Inter, sans-serif" textAnchor="end">Bez (T2)</text>
      <circle cx="152" cy="165" r="3.5" fill="#60a5fa" opacity="0.8" />

      {/* ══ RIGHT BEZ TINE ══ */}
      <path
        d="M 228 165 C 242 155, 252 140, 258 126"
        stroke="#60a5fa"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <text x="262" y="128" fill="#93c5fd" fontSize="8" fontFamily="Inter, sans-serif">Bez (T2)</text>
      <circle cx="228" cy="165" r="3.5" fill="#60a5fa" opacity="0.8" />

      {/* ══ LEFT TREZ TINE (T3) ══ */}
      <path
        d="M 135 130 C 122 118, 115 104, 112 90"
        stroke="#c084fc"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="5,3"
      />
      <text x="100" y="90" fill="#d8b4fe" fontSize="8" fontFamily="Inter, sans-serif" textAnchor="end">Trez (T3)</text>
      <circle cx="135" cy="130" r="3" fill="#c084fc" opacity="0.7" />

      {/* ══ RIGHT TREZ TINE ══ */}
      <path
        d="M 245 130 C 258 118, 265 104, 268 90"
        stroke="#c084fc"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="5,3"
      />
      <text x="272" y="90" fill="#d8b4fe" fontSize="8" fontFamily="Inter, sans-serif">Trez (T3)</text>
      <circle cx="245" cy="130" r="3" fill="#c084fc" opacity="0.7" />

      {/* ══ CIRCUMFERENCE MARKERS (C1–C4) on left beam ══ */}
      {/* C1 — base of beam */}
      <ellipse cx="176" cy="218" rx="10" ry="4" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.8" />
      <text x="148" y="221" fill="#fb923c" fontSize="7.5" fontFamily="Inter, sans-serif" textAnchor="end">C1</text>
      {/* C2 */}
      <ellipse cx="158" cy="190" rx="9" ry="3.5" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.7" transform="rotate(-25,158,190)" />
      <text x="138" y="193" fill="#fb923c" fontSize="7.5" fontFamily="Inter, sans-serif" textAnchor="end">C2</text>
      {/* C3 */}
      <ellipse cx="138" cy="162" rx="8" ry="3" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.6" transform="rotate(-35,138,162)" />
      <text x="120" y="163" fill="#fb923c" fontSize="7.5" fontFamily="Inter, sans-serif" textAnchor="end">C3</text>
      {/* C4 */}
      <ellipse cx="118" cy="137" rx="7" ry="3" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.5" transform="rotate(-45,118,137)" />
      <text x="100" y="136" fill="#fb923c" fontSize="7.5" fontFamily="Inter, sans-serif" textAnchor="end">C4</text>

      {/* ══ INSIDE SPREAD ══ */}
      <line x1="177" y1="244" x2="203" y2="244" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4,2" />
      <line x1="177" y1="240" x2="177" y2="248" stroke="#34d399" strokeWidth="1.5" />
      <line x1="203" y1="240" x2="203" y2="248" stroke="#34d399" strokeWidth="1.5" />
      <text x="190" y="256" fill="#6ee7b7" fontSize="7.5" fontFamily="Inter, sans-serif" textAnchor="middle">Spread</text>

      {/* ══ Legend ══ */}
      <rect x="2" y="2" width="170" height="88" rx="6" fill="#0f1f0c" opacity="0.85" />
      <text x="10" y="16" fill="#a3c49a" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">MEASUREMENT LEGEND</text>
      <rect x="10" y="24" width="8" height="3" rx="1" fill="#4a9e3f" />
      <text x="22" y="29" fill="#86efac" fontSize="7.5" fontFamily="Inter, sans-serif">Main Beam (LB / RB)</text>
      <rect x="10" y="34" width="8" height="3" rx="1" fill="#f59e0b" />
      <text x="22" y="39" fill="#fcd34d" fontSize="7.5" fontFamily="Inter, sans-serif">Brow Tine (T1)</text>
      <rect x="10" y="44" width="8" height="3" rx="1" fill="#60a5fa" />
      <text x="22" y="49" fill="#93c5fd" fontSize="7.5" fontFamily="Inter, sans-serif">Bez Tine (T2)</text>
      <rect x="10" y="54" width="8" height="3" rx="1" fill="#c084fc" />
      <text x="22" y="59" fill="#d8b4fe" fontSize="7.5" fontFamily="Inter, sans-serif">Trez Tine (T3, optional)</text>
      <rect x="10" y="64" width="8" height="3" rx="1" fill="#f97316" />
      <text x="22" y="69" fill="#fb923c" fontSize="7.5" fontFamily="Inter, sans-serif">Circumferences C1–C4</text>
      <rect x="10" y="74" width="8" height="3" rx="1" fill="#34d399" />
      <text x="22" y="79" fill="#6ee7b7" fontSize="7.5" fontFamily="Inter, sans-serif">Inside Spread</text>
    </svg>
  )
}

// ─── Input Field ───────────────────────────────────────────────────────────────

interface FieldProps {
  label: string
  tooltip: string
  value: number
  unit?: string
  onChange: (v: number) => void
  color?: string
}

function MeasurementField({ label, tooltip, value, unit = 'cm', onChange, color }: FieldProps) {
  const [showTip, setShowTip] = useState(false)
  return (
    <div className="relative flex items-center gap-2">
      <label className="w-36 shrink-0 text-right text-xs text-white/60">{label}</label>
      <div className="relative flex-1">
        <input
          type="number"
          min={0}
          step={0.1}
          value={value === 0 ? '' : value}
          placeholder="0.0"
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-forest-700/60 bg-forest-900/60 px-3 py-1.5 pr-10 text-right text-sm text-white placeholder-white/20 outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500/40 transition"
          style={color ? { borderColor: `${color}55` } : undefined}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">
          {unit}
        </span>
      </div>
      <button
        type="button"
        className="shrink-0 text-white/30 hover:text-forest-400 transition"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onClick={() => setShowTip((s) => !s)}
        aria-label={`Help for ${label}`}
      >
        <HelpCircle size={14} />
      </button>
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute right-0 top-8 z-50 w-52 rounded-lg border border-forest-600/50 bg-forest-800 p-2.5 text-xs text-white/75 shadow-xl"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Score Breakdown Table ─────────────────────────────────────────────────────

function ScoreBreakdown({ m, score }: { m: TrophyMeasurements; score: number }) {
  const rows = [
    { label: 'Beam Score', value: (m.leftBeam + m.rightBeam) * 0.5, note: '(L+R)/2' },
    { label: 'Brow Tines', value: m.leftBrow + m.rightBrow, note: 'L+R' },
    { label: 'Bez Tines', value: m.leftBez + m.rightBez, note: 'L+R' },
    { label: 'Trez Tines', value: m.leftTrez + m.rightTrez, note: 'L+R' },
    { label: 'Circumference', value: ((m.c1 + m.c2 + m.c3 + m.c4) / 4) * 1.0, note: 'avg C1-C4' },
    { label: 'Spread', value: m.insideSpread * 0.5, note: '×0.5' },
    { label: 'Weight Bonus', value: m.weight > 0 ? m.weight * 0.1 : 0, note: '×0.1' },
  ]

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-forest-700/40">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-forest-700/40 bg-forest-800/60">
            <th className="px-3 py-2 text-left text-white/40 font-medium">Component</th>
            <th className="px-3 py-2 text-right text-white/40 font-medium">Formula</th>
            <th className="px-3 py-2 text-right text-white/40 font-medium">Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={`border-b border-forest-800/60 ${i % 2 === 0 ? 'bg-forest-900/30' : 'bg-forest-900/10'}`}
            >
              <td className="px-3 py-1.5 text-white/70">{row.label}</td>
              <td className="px-3 py-1.5 text-right text-white/30">{row.note}</td>
              <td className="px-3 py-1.5 text-right font-mono text-forest-400">
                {row.value.toFixed(1)}
              </td>
            </tr>
          ))}
          <tr className="bg-forest-700/20">
            <td className="px-3 py-2 font-semibold text-white" colSpan={2}>
              Total CIC Score
            </td>
            <td className="px-3 py-2 text-right font-mono font-bold text-forest-300">
              {score.toFixed(1)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ─── How to Measure collapsible ────────────────────────────────────────────────

function HowToMeasure() {
  const [open, setOpen] = useState(false)
  const steps = [
    { n: 1, title: 'Position the antler', body: 'Lay both antlers flat on a table in their natural position. Ensure the skull plate is stable and level.' },
    { n: 2, title: 'Measure main beams', body: 'Using a flexible tape, follow the outside curvature of each beam from the coronet (base) to the tip. Record left and right separately in cm.' },
    { n: 3, title: 'Measure brow tines (T1)', body: 'Measure from the base of the tine where it meets the main beam to the tip, following the outside curve. Both sides.' },
    { n: 4, title: 'Measure bez tines (T2)', body: 'Same method as brow tines for the second point. Enter 0 if absent.' },
    { n: 5, title: 'Measure trez tines (T3, optional)', body: 'Third tine if present. Enter 0 if the deer has no third point — this is common in Rusa.' },
    { n: 6, title: 'Measure circumferences (C1–C4)', body: 'Wrap a tape around the beam at 4 evenly spaced points: C1 at the base, C2 and C3 midway, C4 between the last tine and tip. Average all readings.' },
    { n: 7, title: 'Inside spread', body: 'Measure the widest inside distance between the two main beams at their greatest point. Keep the tape horizontal.' },
    { n: 8, title: 'Weight (optional bonus)', body: 'Estimated live weight of the animal in kg, if known from weighing or reliable estimate. This adds a small bonus to the score.' },
  ]

  return (
    <div className="rounded-xl border border-forest-700/40 bg-forest-900/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-forest-800/40 transition"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-forest-400">
          <Info size={15} />
          How to Measure — Step by Step Guide
        </span>
        {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-600/60 text-xs font-bold text-forest-300">
                    {s.n}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{s.title}</p>
                    <p className="text-xs text-white/45 mt-0.5">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Records Board ─────────────────────────────────────────────────────────────

const records = [
  {
    medal: 'gold' as MedalType,
    hunter: 'P. Ramjeet',
    estate: 'Domaine de Chasseur',
    year: 2019,
    score: 203.4,
    color: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
  },
  {
    medal: 'silver' as MedalType,
    hunter: 'A. Mooroogen',
    estate: 'Grand Port',
    year: 2021,
    score: 178.1,
    color: 'text-slate-200',
    border: 'border-slate-400/30',
    bg: 'bg-slate-400/5',
  },
  {
    medal: 'bronze' as MedalType,
    hunter: 'J. Li Wah Fong',
    estate: 'Montagne Blanche',
    year: 2022,
    score: 156.8,
    color: 'text-amber-600',
    border: 'border-amber-700/30',
    bg: 'bg-amber-900/10',
  },
]

function RecordsBoard() {
  return (
    <div className="space-y-3">
      {records.map((r, i) => (
        <ScrollReveal key={r.hunter} delay={i * 0.1}>
          <div className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${r.border} ${r.bg}`}>
            <Trophy size={22} className={r.color} strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${r.color}`}>{r.hunter}</p>
              <p className="text-xs text-white/40 truncate">
                {r.estate} · {r.year}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-mono text-lg font-bold ${r.color}`}>{r.score}</p>
              <p className="text-xs text-white/30">CIC pts</p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function TrophyPage() {
  const [measurements, setMeasurements] = useState<TrophyMeasurements>(defaultMeasurements)
  const score = calculateCICScore(measurements)
  const medal = getMedal(score)

  const set = useCallback(
    (key: keyof TrophyMeasurements) => (v: number) =>
      setMeasurements((prev) => ({ ...prev, [key]: v })),
    []
  )

  const handleReset = () => setMeasurements(defaultMeasurements)


  return (
    <PageWrapper>
      {/* ── Hero Header ── */}
      <section className="px-4 pt-10 pb-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-widest text-forest-500">
              <Trophy size={12} />
              CIC Trophy Scoring
            </div>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
              Trophy Calculator
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/50">
              Official CIC scoring formula for Rusa Deer (<em>Cervus timorensis</em>) —
              the iconic game animal of Mauritius. Enter your measurements below for
              an instant score and medal classification.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Main two-panel layout ── */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">

            {/* ══ LEFT PANEL — Input Form ══ */}
            <div className="space-y-5">

              {/* Antler Diagram */}
              <ScrollReveal>
                <div className="rounded-2xl border border-forest-700/40 bg-forest-900/40 p-5">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-forest-500">
                    Measurement Reference Diagram
                  </h2>
                  <AntlerDiagram />
                </div>
              </ScrollReveal>

              {/* ── Beam Lengths ── */}
              <ScrollReveal delay={0.05}>
                <div className="rounded-2xl border border-forest-700/40 bg-forest-900/40 p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-forest-500">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-forest-500" />
                    Main Beam Lengths
                  </h2>
                  <div className="space-y-3">
                    <MeasurementField
                      label="Left Beam"
                      tooltip="Measure from the coronet (base) to the tip of the left main beam, following the outer curvature."
                      value={measurements.leftBeam}
                      onChange={set('leftBeam')}
                    />
                    <MeasurementField
                      label="Right Beam"
                      tooltip="Same as left: from coronet to beam tip along the outer curve, right antler."
                      value={measurements.rightBeam}
                      onChange={set('rightBeam')}
                    />
                  </div>
                </div>
              </ScrollReveal>

              {/* ── Tine Lengths ── */}
              <ScrollReveal delay={0.08}>
                <div className="rounded-2xl border border-amber-700/25 bg-forest-900/40 p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-600/80">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                    Tine Lengths
                  </h2>
                  <div className="space-y-3">
                    <MeasurementField
                      label="Left Brow (T1)"
                      tooltip="First tine from the base of the beam. Measure from its junction with the main beam to the tip."
                      value={measurements.leftBrow}
                      onChange={set('leftBrow')}
                      color="#f59e0b"
                    />
                    <MeasurementField
                      label="Right Brow (T1)"
                      tooltip="First tine, right antler."
                      value={measurements.rightBrow}
                      onChange={set('rightBrow')}
                      color="#f59e0b"
                    />
                    <MeasurementField
                      label="Left Bez (T2)"
                      tooltip="Second tine. Measure from junction with main beam to tip. Enter 0 if absent."
                      value={measurements.leftBez}
                      onChange={set('leftBez')}
                      color="#60a5fa"
                    />
                    <MeasurementField
                      label="Right Bez (T2)"
                      tooltip="Second tine, right antler."
                      value={measurements.rightBez}
                      onChange={set('rightBez')}
                      color="#60a5fa"
                    />
                    <MeasurementField
                      label="Left Trez (T3)"
                      tooltip="Third tine — often absent in Rusa deer. Enter 0 if not present."
                      value={measurements.leftTrez}
                      onChange={set('leftTrez')}
                      color="#c084fc"
                    />
                    <MeasurementField
                      label="Right Trez (T3)"
                      tooltip="Third tine, right antler. Enter 0 if absent."
                      value={measurements.rightTrez}
                      onChange={set('rightTrez')}
                      color="#c084fc"
                    />
                  </div>
                </div>
              </ScrollReveal>

              {/* ── Circumferences ── */}
              <ScrollReveal delay={0.11}>
                <div className="rounded-2xl border border-orange-700/25 bg-forest-900/40 p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-orange-500/80">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
                    Circumferences (average of both sides)
                  </h2>
                  <p className="mb-3 text-xs text-white/35">
                    Measure the main beam circumference at 4 evenly spaced points — C1 at base, C4 near tip. Average all readings from both antlers.
                  </p>
                  <div className="space-y-3">
                    {(['c1', 'c2', 'c3', 'c4'] as const).map((key, i) => (
                      <MeasurementField
                        key={key}
                        label={`C${i + 1} Circumference`}
                        tooltip={`Circumference at point ${i + 1} — wrap the tape around the main beam. C1 is nearest the base, C4 near the crown.`}
                        value={measurements[key]}
                        onChange={set(key)}
                        color="#f97316"
                      />
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* ── Spread & Weight ── */}
              <ScrollReveal delay={0.14}>
                <div className="rounded-2xl border border-emerald-700/25 bg-forest-900/40 p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600/80">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Spread &amp; Weight
                  </h2>
                  <div className="space-y-3">
                    <MeasurementField
                      label="Inside Spread"
                      tooltip="Greatest inside width between the two main beams. Hold the tape horizontal at the widest point."
                      value={measurements.insideSpread}
                      onChange={set('insideSpread')}
                      color="#34d399"
                    />
                    <MeasurementField
                      label="Live Weight"
                      tooltip="Estimated live body weight of the animal in kg. Provides a small bonus score. Enter 0 to skip."
                      value={measurements.weight}
                      onChange={set('weight')}
                      unit="kg"
                      color="#34d399"
                    />
                  </div>
                </div>
              </ScrollReveal>

              {/* Reset */}
              <ScrollReveal delay={0.16}>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-blood/40 bg-blood/10 py-2.5 text-sm text-blood/80 hover:bg-blood/20 hover:text-red-300 transition"
                >
                  <RotateCcw size={14} />
                  Reset All Measurements
                </button>
              </ScrollReveal>

              {/* How to Measure */}
              <ScrollReveal delay={0.18}>
                <HowToMeasure />
              </ScrollReveal>
            </div>

            {/* ══ RIGHT PANEL — Live Score ══ */}
            <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

              {/* Score Display */}
              <ScrollReveal>
                <div className="rounded-2xl border border-forest-600/50 bg-forest-900/60 p-6 shadow-xl">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-forest-500">
                    CIC Score
                  </div>

                  {/* Big animated number */}
                  <div className="flex items-end gap-2 mb-6">
                    <span className="font-display text-7xl font-bold leading-none text-white">
                      <AnimatedScore value={score} />
                    </span>
                    <span className="mb-2 text-sm text-white/30 font-mono">pts</span>
                  </div>

                  {/* Progress bar toward next medal */}
                  <div className="mb-5">
                    <div className="mb-1.5 flex justify-between text-xs text-white/30">
                      <span>0</span>
                      <span>Bronze 150</span>
                      <span>Silver 170</span>
                      <span>Gold 190+</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-forest-800/80 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            medal === 'gold'
                              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                              : medal === 'silver'
                              ? 'linear-gradient(90deg, #94a3b8, #cbd5e1)'
                              : medal === 'bronze'
                              ? 'linear-gradient(90deg, #b45309, #d97706)'
                              : 'linear-gradient(90deg, #2a5522, #3a7a30)',
                        }}
                        animate={{ width: `${Math.min((score / 210) * 100, 100)}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Medal badge */}
                  <AnimatePresence mode="wait">
                    <MedalBadge key={medal} medal={medal} />
                  </AnimatePresence>
                </div>
              </ScrollReveal>

              {/* Score breakdown */}
              <ScrollReveal delay={0.06}>
                <div className="rounded-2xl border border-forest-700/40 bg-forest-900/40 p-5">
                  <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-forest-500">
                    Score Breakdown
                  </h2>
                  <ScoreBreakdown m={measurements} score={score} />
                </div>
              </ScrollReveal>

              {/* Medal thresholds reference */}
              <ScrollReveal delay={0.09}>
                <div className="rounded-2xl border border-forest-700/30 bg-forest-900/30 p-4">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-forest-500">
                    Medal Thresholds — Rusa Deer
                  </h2>
                  <div className="space-y-2">
                    {[
                      { label: 'Gold', range: '190+ pts', color: 'text-amber-300', dot: 'bg-amber-400' },
                      { label: 'Silver', range: '170–190 pts', color: 'text-slate-200', dot: 'bg-slate-300' },
                      { label: 'Bronze', range: '150–170 pts', color: 'text-amber-600', dot: 'bg-amber-700' },
                      { label: 'No Medal', range: 'Below 150', color: 'text-white/30', dot: 'bg-white/20' },
                    ].map((t) => (
                      <div key={t.label} className="flex items-center gap-3">
                        <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                        <span className={`text-sm font-medium ${t.color} w-16`}>{t.label}</span>
                        <span className="text-xs text-white/35">{t.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mauritius Records Board ── */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-6 border-t border-forest-700/30 pt-8">
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-widest text-forest-500">
                <Star size={12} />
                Hall of Fame
              </div>
              <h2 className="font-display text-2xl font-bold text-white">Mauritius Records</h2>
              <p className="mt-1 text-sm text-white/40">
                Verified CIC-scored Rusa Deer trophies from Mauritius — illustrative records.
              </p>
            </div>
          </ScrollReveal>
          <RecordsBoard />
        </div>
      </section>
    </PageWrapper>
  )
}
