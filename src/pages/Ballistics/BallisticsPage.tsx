import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import {
  Wind,
  Thermometer,
  Target,
  Crosshair,
  AlertTriangle,
  ChevronDown,
  Mountain,
  Zap,
  Clock,
  TrendingDown,
  Info,
  CheckCircle,
} from 'lucide-react'

// ─── Ballistics Engine ────────────────────────────────────────────────────────

const g = 9.81
const rhoSL = 1.225

function airDensity(altM: number, tempC: number): number {
  const T = tempC + 273.15
  const T0 = 288.15
  const L = 0.0065
  const p_ratio = Math.pow(1 - (L * altM) / T0, 5.2561)
  const rho = rhoSL * p_ratio * (T0 / T)
  return rho
}

function cdG1(mach: number): number {
  if (mach < 0.8) return 0.23
  if (mach < 0.9) return 0.23 + (mach - 0.8) * 0.8
  if (mach < 1.0) return 0.31 + (mach - 0.9) * 2.0
  if (mach < 1.2) return 0.51 - (mach - 1.0) * 0.6
  if (mach < 1.5) return 0.39 - (mach - 1.2) * 0.35
  if (mach < 3.0) return 0.285 - (mach - 1.5) * 0.04
  return 0.225
}

interface TrajectoryPoint {
  rangeM: number
  dropMm: number
  dropCm: number
  driftMm: number
  velocityMs: number
  energyJ: number
  timeMs: number
}

function solveTrajectory(
  mvFps: number,
  bcG1: number,
  bulletWeightGr: number,
  zeroRangeM: number,
  windSpeedKmh: number,
  windAngleDeg: number,
  altM: number,
  tempC: number
): TrajectoryPoint[] {
  const mv = mvFps * 0.3048
  const massKg = bulletWeightGr * 0.0000648
  const aRef = Math.PI * Math.pow(0.0254 / 2, 2)

  const rho = airDensity(altM, tempC)
  const speedOfSound = 331.3 * Math.sqrt(1 + tempC / 273.15)

  const windAngleRad = windAngleDeg * (Math.PI / 180)
  const windMs = windSpeedKmh / 3.6
  const crossWindMs = windMs * Math.sin(windAngleRad)

  function simulatePath(elevAngleRad: number): number {
    let x = 0,
      y = 0
    let vx = mv * Math.cos(elevAngleRad),
      vy = mv * Math.sin(elevAngleRad)
    const dt = 0.001
    let closestY = 0
    let closestDist = Infinity

    for (let t = 0; t < 3; t += dt) {
      const v = Math.sqrt(vx * vx + vy * vy)
      const mach = v / speedOfSound
      const cd = cdG1(mach) / bcG1
      const drag = 0.5 * rho * aRef * cd * v * v
      const ax = -drag * (vx / v) / massKg
      const ay = -g - drag * (vy / v) / massKg

      vx += ax * dt
      vy += ay * dt
      x += vx * dt
      y += vy * dt

      const dist = Math.abs(x - zeroRangeM)
      if (dist < closestDist) {
        closestDist = dist
        closestY = y
      }
      if (x > zeroRangeM + 5) break
    }
    return closestY
  }

  let lo = -0.05,
    hi = 0.05
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2
    if (simulatePath(mid) < 0) hi = mid
    else lo = mid
  }
  const zeroAngle = (lo + hi) / 2

  const outputRanges = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500]
  const results: TrajectoryPoint[] = []

  let x = 0,
    y = 0,
    wx2 = 0
  let vx = mv * Math.cos(zeroAngle),
    vy = mv * Math.sin(zeroAngle),
    vw = 0
  const dt = 0.001
  let t = 0
  let lastOutput = 0

  while (x <= 510 && t < 4) {
    const v = Math.sqrt(vx * vx + vy * vy)
    const mach = v / speedOfSound
    const cd = cdG1(mach) / bcG1
    const drag = 0.5 * rho * aRef * cd * v

    const ax = (-drag * vx) / massKg
    const ay = -g - (drag * vy) / massKg
    const aw = ((crossWindMs - vw) * drag) / massKg

    vx += ax * dt
    vy += ay * dt
    vw += aw * dt
    x += vx * dt
    y += vy * dt
    wx2 += vw * dt
    t += dt

    const nextRange = outputRanges[lastOutput]
    if (nextRange !== undefined && x >= nextRange) {
      const totalV = Math.sqrt(vx * vx + vy * vy)
      const energyJ = 0.5 * massKg * totalV * totalV
      results.push({
        rangeM: nextRange,
        dropMm: y * 1000,
        dropCm: y * 100,
        driftMm: wx2 * 1000,
        velocityMs: totalV,
        energyJ,
        timeMs: t * 1000,
      })
      lastOutput++
      if (lastOutput >= outputRanges.length) break
    }
  }

  return results
}

// ─── Rifle Presets ─────────────────────────────────────────────────────────────

interface Preset {
  name: string
  mv: number
  bc: number
  weight: number
}

const PRESETS: Preset[] = [
  { name: '.243 Win 95gr', mv: 3025, bc: 0.355, weight: 95 },
  { name: '.270 Win 130gr', mv: 3060, bc: 0.46, weight: 130 },
  { name: '.308 Win 180gr', mv: 2620, bc: 0.507, weight: 180 },
  { name: '.30-06 180gr', mv: 2700, bc: 0.507, weight: 180 },
  { name: '6.5 Creedmoor 143gr', mv: 2700, bc: 0.625, weight: 143 },
  { name: '7×64 Brenneke 170gr', mv: 2756, bc: 0.534, weight: 170 },
  { name: '7mm Rem Mag 160gr', mv: 2940, bc: 0.531, weight: 160 },
  { name: '8×57 JS 196gr', mv: 2526, bc: 0.446, weight: 196 },
  { name: '.300 Win Mag 180gr', mv: 2960, bc: 0.507, weight: 180 },
  { name: '.30-30 Win 150gr', mv: 2390, bc: 0.294, weight: 150 },
  { name: 'Custom', mv: 2800, bc: 0.45, weight: 150 },
]

const WIND_ANGLES: { label: string; value: number }[] = [
  { label: 'Headwind (0°)', value: 0 },
  { label: '45° Quartering', value: 45 },
  { label: '90° Crosswind', value: 90 },
  { label: 'Tailwind (180°)', value: 180 },
]

// ─── Animated Number ───────────────────────────────────────────────────────────

function AnimatedNumber({ value, decimals = 1 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value)
  const rafRef = useRef<number>(0)
  const startRef = useRef({ from: value, to: value, startTime: 0 })

  useEffect(() => {
    const from = display
    const to = value
    const duration = 400
    startRef.current = { from, to, startTime: performance.now() }

    const animate = (now: number) => {
      const elapsed = now - startRef.current.startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(startRef.current.from + (startRef.current.to - startRef.current.from) * eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span>{display.toFixed(decimals)}</span>
}

// ─── Trajectory SVG ────────────────────────────────────────────────────────────

function TrajectorySVG({
  points,
  zeroRange,
}: {
  points: TrajectoryPoint[]
  zeroRange: number
}) {
  const W = 560
  const H = 200
  const PAD = { l: 48, r: 24, t: 20, b: 40 }
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b

  if (points.length === 0) return null

  const drops = points.map((p) => p.dropCm)
  const maxDrop = Math.min(Math.abs(Math.min(...drops)), 200)
  const maxRise = Math.max(...drops, 2)

  const yMin = -(maxDrop + 5)
  const yMax = maxRise + 2
  const yRange = yMax - yMin

  const toSvgX = (rangeM: number) => PAD.l + (rangeM / 500) * plotW
  const toSvgY = (dropCm: number) => PAD.t + plotH - ((dropCm - yMin) / yRange) * plotH

  // Build smooth path via all data points + origin
  const allPoints = [{ rangeM: 0, dropCm: 0 }, ...points]
  const pathD = allPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(p.rangeM).toFixed(1)} ${toSvgY(p.dropCm).toFixed(1)}`)
    .join(' ')

  const zeroY = toSvgY(0)
  const zeroPt = points.find((p) => p.rangeM === zeroRange)
  const zeroCrossX = toSvgX(zeroRange)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* Background grid */}
      {[0, 100, 200, 300, 400, 500].map((r) => (
        <line
          key={r}
          x1={toSvgX(r)}
          y1={PAD.t}
          x2={toSvgX(r)}
          y2={H - PAD.b}
          stroke="#1e3d19"
          strokeWidth="1"
        />
      ))}
      {/* Zero line */}
      <line
        x1={PAD.l}
        y1={zeroY}
        x2={W - PAD.r}
        y2={zeroY}
        stroke="#3a7a30"
        strokeWidth="1"
        strokeDasharray="6 4"
        opacity="0.7"
      />
      {/* ±5cm band (point-blank zone) */}
      <rect
        x={PAD.l}
        y={toSvgY(5)}
        width={plotW}
        height={toSvgY(-5) - toSvgY(5)}
        fill="#3a7a30"
        opacity="0.08"
      />

      {/* Animated trajectory path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="#3a7a30"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Gradient area under curve */}
      <defs>
        <linearGradient id="trajGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a7a30" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3a7a30" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${pathD} L ${toSvgX(500).toFixed(1)} ${zeroY} L ${PAD.l} ${zeroY} Z`}
        fill="url(#trajGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
      />

      {/* Zero range marker */}
      {zeroPt && (
        <>
          <line
            x1={zeroCrossX}
            y1={PAD.t}
            x2={zeroCrossX}
            y2={H - PAD.b}
            stroke="#f5a623"
            strokeWidth="1"
            strokeDasharray="4 3"
            opacity="0.6"
          />
          <circle cx={zeroCrossX} cy={toSvgY(zeroPt.dropCm)} r="4" fill="#f5a623" opacity="0.9" />
          <text
            x={zeroCrossX + 4}
            y={PAD.t + 12}
            fill="#f5a623"
            fontSize="9"
            fontFamily="monospace"
            opacity="0.8"
          >
            zero
          </text>
        </>
      )}

      {/* Data points */}
      {points.map((p) => (
        <circle
          key={p.rangeM}
          cx={toSvgX(p.rangeM)}
          cy={toSvgY(p.dropCm)}
          r="3"
          fill={
            Math.abs(p.dropCm) <= 2
              ? '#22c55e'
              : Math.abs(p.dropCm) <= 10
              ? '#f59e0b'
              : '#ef4444'
          }
          opacity="0.9"
        />
      ))}

      {/* X-axis labels */}
      {[0, 100, 200, 300, 400, 500].map((r) => (
        <text
          key={r}
          x={toSvgX(r)}
          y={H - PAD.b + 14}
          textAnchor="middle"
          fill="#3a7a30"
          fontSize="9"
          fontFamily="monospace"
          opacity="0.7"
        >
          {r}m
        </text>
      ))}

      {/* Y-axis label */}
      <text
        x={PAD.l - 6}
        y={zeroY}
        textAnchor="end"
        dominantBaseline="middle"
        fill="#3a7a30"
        fontSize="8"
        fontFamily="monospace"
        opacity="0.6"
      >
        0
      </text>
    </svg>
  )
}

// ─── Slider Component ─────────────────────────────────────────────────────────

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  icon: Icon,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Icon size={14} className="text-forest-500" />
          <span>{label}</span>
        </div>
        <span className="font-mono text-sm text-forest-500 tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <div className="relative h-2">
        <div className="absolute inset-0 rounded-full bg-forest-800" />
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-forest-500 transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-forest-500 border-2 border-forest-900 shadow pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BallisticsPage() {
  const [presetIdx, setPresetIdx] = useState(2) // .308 Win default
  const [customMv, setCustomMv] = useState(2800)
  const [customBc, setCustomBc] = useState(0.45)
  const [customWeight, setCustomWeight] = useState(150)
  const [zeroRange, setZeroRange] = useState(100)
  const [windSpeed, setWindSpeed] = useState(10)
  const [windAngle, setWindAngle] = useState(90)
  const [altitude, setAltitude] = useState(0)
  const [temperature, setTemperature] = useState(28)
  const [presetOpen, setPresetOpen] = useState(false)

  const isCustom = presetIdx === PRESETS.length - 1
  const preset = PRESETS[presetIdx]

  const mv = isCustom ? customMv : preset.mv
  const bc = isCustom ? customBc : preset.bc
  const weight = isCustom ? customWeight : preset.weight

  const points = useMemo(
    () => solveTrajectory(mv, bc, weight, zeroRange, windSpeed, windAngle, altitude, temperature),
    [mv, bc, weight, zeroRange, windSpeed, windAngle, altitude, temperature]
  )

  // Point-blank range: max range where |drop| ≤ 5cm
  const pbr = useMemo(() => {
    let max = 0
    for (const p of points) {
      if (Math.abs(p.dropCm) <= 5) max = p.rangeM
      else break
    }
    return max
  }, [points])

  // Min ethical energy range
  const ethicalRange = useMemo(() => {
    const last = [...points].reverse().find((p) => p.energyJ >= 1500)
    return last?.rangeM ?? 0
  }, [points])

  function rowColor(dropCm: number) {
    const abs = Math.abs(dropCm)
    if (abs <= 2) return 'text-green-400'
    if (abs <= 10) return 'text-amber-400'
    return 'text-red-400'
  }

  function rowBg(dropCm: number) {
    const abs = Math.abs(dropCm)
    if (abs <= 2) return 'bg-green-500/5'
    if (abs <= 10) return 'bg-amber-500/5'
    return 'bg-red-500/5'
  }

  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-forest-950 border-b border-forest-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#1e3d19_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-forest-800 border border-forest-700 flex items-center justify-center">
                <Target size={20} className="text-forest-500" />
              </div>
              <span className="text-forest-500 text-sm font-mono uppercase tracking-widest">
                Trajectory Engine
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Ballistics
              <br />
              <span className="text-forest-500">Calculator</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl">
              G1 drag model trajectory solver for Mauritius hunting conditions. Accounts for
              tropical temperature, low altitude, and local crosswinds.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* ─── INPUTS PANEL ─── */}
          <ScrollReveal>
            <div className="bg-forest-900/60 border border-forest-800 rounded-2xl p-6 space-y-7 sticky top-24">
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Crosshair size={18} className="text-forest-500" />
                Rifle Configuration
              </h2>

              {/* Preset selector */}
              <div className="space-y-2">
                <label className="text-sm text-white/70 flex items-center gap-2">
                  <Target size={14} className="text-forest-500" />
                  Rifle / Cartridge Preset
                </label>
                <div className="relative">
                  <button
                    onClick={() => setPresetOpen((o) => !o)}
                    className="w-full flex items-center justify-between bg-forest-800/80 border border-forest-700 rounded-xl px-4 py-3 text-sm text-white hover:border-forest-500 transition-colors"
                  >
                    <span>{PRESETS[presetIdx].name}</span>
                    <ChevronDown
                      size={16}
                      className={`text-forest-500 transition-transform duration-200 ${presetOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {presetOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-30 top-full mt-1 w-full bg-forest-900 border border-forest-700 rounded-xl overflow-hidden shadow-2xl origin-top"
                      >
                        {PRESETS.map((p, i) => (
                          <button
                            key={p.name}
                            onClick={() => {
                              setPresetIdx(i)
                              setPresetOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-forest-800 ${
                              i === presetIdx ? 'text-forest-500 bg-forest-800/60' : 'text-white/80'
                            }`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Custom inputs */}
              <AnimatePresence>
                {isCustom && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden space-y-4 pl-3 border-l-2 border-forest-700"
                  >
                    <div className="space-y-1">
                      <label className="text-xs text-white/50 font-mono">
                        Muzzle Velocity (fps)
                      </label>
                      <input
                        type="number"
                        value={customMv}
                        onChange={(e) => setCustomMv(Number(e.target.value))}
                        className="w-full bg-forest-800 border border-forest-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-forest-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/50 font-mono">
                        Ballistic Coefficient (G1)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={customBc}
                        onChange={(e) => setCustomBc(Number(e.target.value))}
                        className="w-full bg-forest-800 border border-forest-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-forest-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/50 font-mono">
                        Bullet Weight (grains)
                      </label>
                      <input
                        type="number"
                        value={customWeight}
                        onChange={(e) => setCustomWeight(Number(e.target.value))}
                        className="w-full bg-forest-800 border border-forest-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-forest-500 outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                <Slider
                  label="Zero Range"
                  value={zeroRange}
                  min={50}
                  max={300}
                  step={25}
                  unit="m"
                  icon={Target}
                  onChange={setZeroRange}
                />
                <Slider
                  label="Wind Speed"
                  value={windSpeed}
                  min={0}
                  max={30}
                  step={1}
                  unit=" km/h"
                  icon={Wind}
                  onChange={setWindSpeed}
                />

                {/* Wind angle selector */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70 flex items-center gap-2">
                    <Wind size={14} className="text-forest-500" />
                    Wind Angle
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {WIND_ANGLES.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => setWindAngle(a.value)}
                        className={`px-3 py-2 rounded-lg text-xs transition-all duration-150 border ${
                          windAngle === a.value
                            ? 'bg-forest-700 border-forest-500 text-white'
                            : 'bg-forest-800/50 border-forest-800 text-white/50 hover:border-forest-700'
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Slider
                  label="Altitude"
                  value={altitude}
                  min={0}
                  max={800}
                  step={50}
                  unit="m"
                  icon={Mountain}
                  onChange={setAltitude}
                />
                <Slider
                  label="Temperature"
                  value={temperature}
                  min={15}
                  max={35}
                  step={1}
                  unit="°C"
                  icon={Thermometer}
                  onChange={setTemperature}
                />
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-forest-800">
                {[
                  { label: 'MV', value: mv, unit: 'fps', decimals: 0 },
                  { label: 'BC', value: bc, unit: 'G1', decimals: 3 },
                  { label: 'Wt', value: weight, unit: 'gr', decimals: 0 },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-forest-800/50 rounded-lg p-2 text-center"
                  >
                    <div className="text-xs text-white/40 font-mono mb-0.5">{s.label}</div>
                    <div className="font-mono text-sm text-forest-500 tabular-nums">
                      <AnimatedNumber value={s.value} decimals={s.decimals} />
                    </div>
                    <div className="text-xs text-white/30 font-mono">{s.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ─── RESULTS PANEL ─── */}
          <div className="space-y-6">
            {/* Summary cards */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Point Blank Range */}
                <div className="bg-forest-900/60 border border-forest-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-xs text-white/50 uppercase tracking-wider font-mono">
                      Point-Blank Range
                    </span>
                  </div>
                  <div className="font-mono text-3xl font-bold text-white tabular-nums">
                    <AnimatedNumber value={pbr} decimals={0} />
                    <span className="text-lg text-white/40 ml-1">m</span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">±5 cm vital zone</p>
                </div>

                {/* Ethical range */}
                <div className="bg-forest-900/60 border border-forest-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-amber-400" />
                    <span className="text-xs text-white/50 uppercase tracking-wider font-mono">
                      Ethical Range
                    </span>
                  </div>
                  <div className="font-mono text-3xl font-bold text-white tabular-nums">
                    <AnimatedNumber value={ethicalRange} decimals={0} />
                    <span className="text-lg text-white/40 ml-1">m</span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">&gt;1500 J terminal energy</p>
                </div>

                {/* Zero info */}
                <div className="bg-forest-900/60 border border-forest-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Crosshair size={16} className="text-forest-500" />
                    <span className="text-xs text-white/50 uppercase tracking-wider font-mono">
                      Zero
                    </span>
                  </div>
                  <div className="font-mono text-3xl font-bold text-white tabular-nums">
                    <AnimatedNumber value={zeroRange} decimals={0} />
                    <span className="text-lg text-white/40 ml-1">m</span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Point of impact at zero</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Trajectory SVG */}
            <ScrollReveal delay={0.15}>
              <div className="bg-forest-900/60 border border-forest-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown size={16} className="text-forest-500" />
                  <h3 className="font-mono text-sm text-white/70 uppercase tracking-wider">
                    Trajectory Arc — 0 to 500m
                  </h3>
                </div>
                <div className="text-xs text-white/30 font-mono flex gap-6 mb-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded-full bg-green-500 inline-block" /> ±2 cm
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded-full bg-amber-500 inline-block" /> ±10 cm
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded-full bg-red-500 inline-block" /> &gt;10 cm
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-1 inline-block opacity-40"
                      style={{ background: '#3a7a30' }}
                    />{' '}
                    ±5 cm zone
                  </span>
                </div>
                <TrajectorySVG points={points} zeroRange={zeroRange} />
              </div>
            </ScrollReveal>

            {/* Drop table */}
            <ScrollReveal delay={0.2}>
              <div className="bg-forest-900/60 border border-forest-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-forest-800 flex items-center gap-2">
                  <Info size={16} className="text-forest-500" />
                  <h3 className="font-mono text-sm text-white/70 uppercase tracking-wider">
                    Data Table — All Ranges
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-mono min-w-[560px]">
                    <thead>
                      <tr className="border-b border-forest-800">
                        {[
                          'Range',
                          'Drop',
                          'Wind Drift',
                          'Velocity',
                          'Energy',
                          'Time',
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs text-white/30 uppercase tracking-wider font-normal"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="wait">
                        {points.map((p) => (
                          <motion.tr
                            key={`${p.rangeM}-${mv}-${bc}`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: (p.rangeM / 500) * 0.3 }}
                            className={`border-b border-forest-800/50 ${rowBg(p.dropCm)}`}
                          >
                            <td className="px-4 py-3 text-white/70 tabular-nums">
                              {p.rangeM}m
                            </td>
                            <td className={`px-4 py-3 tabular-nums font-semibold ${rowColor(p.dropCm)}`}>
                              {p.dropCm >= 0 ? '+' : ''}
                              {p.dropCm.toFixed(1)} cm
                            </td>
                            <td className="px-4 py-3 text-white/60 tabular-nums">
                              {(p.driftMm / 10).toFixed(1)} cm
                            </td>
                            <td className="px-4 py-3 text-white/70 tabular-nums">
                              {p.velocityMs.toFixed(0)} m/s
                            </td>
                            <td
                              className={`px-4 py-3 tabular-nums ${
                                p.energyJ < 1500 ? 'text-red-400' : 'text-white/70'
                              }`}
                            >
                              {p.energyJ < 1500 && (
                                <AlertTriangle
                                  size={12}
                                  className="inline mr-1 text-red-400"
                                />
                              )}
                              {p.energyJ.toFixed(0)} J
                            </td>
                            <td className="px-4 py-3 text-white/50 tabular-nums flex items-center gap-1">
                              <Clock size={11} className="opacity-40" />
                              {p.timeMs.toFixed(0)} ms
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>

            {/* Energy warning banner */}
            <AnimatePresence>
              {points.some((p) => p.energyJ < 1500) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-950/40 border border-red-800/50 rounded-2xl p-4 flex gap-3"
                >
                  <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-300 font-semibold mb-0.5">
                      Energy Warning — Sub-ethical Ranges Detected
                    </p>
                    <p className="text-xs text-red-300/60">
                      One or more ranges fall below 1500 J terminal energy (minimum recommended for
                      ethical deer hunting). Limit shots to ranges with sufficient energy.
                      Ethical maximum range: <span className="text-red-300 font-mono">{ethicalRange}m</span>.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Methodology note */}
            <ScrollReveal delay={0.25}>
              <div className="bg-forest-900/40 border border-forest-800/60 rounded-2xl p-5 flex gap-3">
                <Info size={16} className="text-forest-500 shrink-0 mt-0.5" />
                <p className="text-xs text-white/40 leading-relaxed">
                  Calculations use a simplified G1 ballistic coefficient drag model with Euler
                  integration at 1ms steps. Results are estimates for field planning only — always
                  verify zero and impacts at your actual range. Atmospheric corrections use the
                  International Standard Atmosphere barometric formula adjusted for local temperature.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
