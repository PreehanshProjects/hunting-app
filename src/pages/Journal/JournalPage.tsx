import { useState, useMemo } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Plus,
  X,
  Trash2,
  ChevronLeft,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Feather,
  AlertCircle,
  CheckCircle2,
  Eye,
  Target,
  PawPrint,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface JournalEntry {
  id: string
  createdAt: string
  date: string
  zone: string
  species: string
  weather: string
  wind: string
  moonPhase: string
  outcome: 'success' | 'missed' | 'no_game' | 'observed_only'
  shotsTaken: number
  notes: string
  companions: string
}

// ─── Custom Hook — localStorage journal ───────────────────────────────────────

function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('rusa_journal') || '[]')
    } catch {
      return []
    }
  })

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem('rusa_journal', JSON.stringify(updated))
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    localStorage.setItem('rusa_journal', JSON.stringify(updated))
  }

  return { entries, addEntry, deleteEntry }
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const SPECIES = [
  'Rusa Deer',
  'Wild Boar',
  'Hare',
  'Partridge',
  'Quail',
  'Guinea Fowl',
]

const WEATHER_OPTIONS = ['Clear', 'Cloudy', 'Light Rain', 'Windy', 'Humid']
const WIND_OPTIONS = ['Calm', 'Light', 'Moderate', 'Strong']
const OUTCOME_OPTIONS: { value: JournalEntry['outcome']; label: string }[] = [
  { value: 'success', label: 'Success' },
  { value: 'missed', label: 'Missed' },
  { value: 'no_game', label: 'No Game' },
  { value: 'observed_only', label: 'Observed Only' },
]

const MOON_PHASES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent']

// ─── Helpers ───────────────────────────────────────────────────────────────────

function todayString(): string {
  return new Date().toISOString().split('T')[0]
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function outcomeConfig(outcome: JournalEntry['outcome']) {
  switch (outcome) {
    case 'success':
      return { label: 'Success', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', Icon: CheckCircle2 }
    case 'missed':
      return { label: 'Missed', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', Icon: Target }
    case 'no_game':
      return { label: 'No Game', bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10', Icon: AlertCircle }
    case 'observed_only':
      return { label: 'Observed Only', bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', Icon: Eye }
  }
}

function weatherIcon(weather: string) {
  switch (weather) {
    case 'Clear': return <Sun size={13} className="text-amber-400" />
    case 'Cloudy': return <Cloud size={13} className="text-slate-400" />
    case 'Light Rain': return <CloudRain size={13} className="text-sky-400" />
    case 'Windy': return <Wind size={13} className="text-teal-400" />
    case 'Humid': return <Droplets size={13} className="text-blue-400" />
    default: return <Sun size={13} className="text-white/30" />
  }
}

function speciesIcon(species: string) {
  switch (species) {
    case 'Rusa Deer': return <PawPrint size={14} className="text-forest-400" />
    case 'Wild Boar': return <PawPrint size={14} className="text-earth-400" />
    default: return <Feather size={14} className="text-forest-500" />
  }
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-col items-center justify-center py-20 text-center px-6"
    >
      {/* Illustrated deer silhouette */}
      <svg viewBox="0 0 120 120" className="mb-6 w-28 opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="58" stroke="#3a7a30" strokeWidth="1.5" strokeDasharray="8,4" />
        {/* Body */}
        <ellipse cx="60" cy="75" rx="22" ry="16" fill="#3a7a30" />
        {/* Neck */}
        <rect x="55" y="57" width="10" height="16" rx="5" fill="#3a7a30" />
        {/* Head */}
        <ellipse cx="60" cy="52" rx="9" ry="8" fill="#3a7a30" />
        {/* Left antler */}
        <path d="M 54 44 C 50 36, 44 30, 42 22" stroke="#3a7a30" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 48 34 C 44 30, 40 28, 38 24" stroke="#3a7a30" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Right antler */}
        <path d="M 66 44 C 70 36, 76 30, 78 22" stroke="#3a7a30" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 72 34 C 76 30, 80 28, 82 24" stroke="#3a7a30" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Legs */}
        <rect x="46" y="89" width="6" height="16" rx="3" fill="#3a7a30" />
        <rect x="54" y="89" width="6" height="16" rx="3" fill="#3a7a30" />
        <rect x="60" y="89" width="6" height="16" rx="3" fill="#3a7a30" />
        <rect x="68" y="89" width="6" height="16" rx="3" fill="#3a7a30" />
      </svg>
      <p className="text-lg font-semibold text-white/40 mb-1">No hunts logged yet</p>
      <p className="text-sm text-white/25 mb-6 max-w-xs">
        Your hunt journal is empty. Start recording your expeditions across
        Mauritius — every outing tells a story.
      </p>
      <button
        type="button"
        onClick={onNew}
        className="flex items-center gap-2 rounded-xl bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-500 transition"
      >
        <Plus size={16} />
        Log Your First Hunt
      </button>
    </motion.div>
  )
}

// ─── Stats Strip ───────────────────────────────────────────────────────────────

function StatsStrip({ entries }: { entries: JournalEntry[] }) {
  const total = entries.length
  const successes = entries.filter((e) => e.outcome === 'success').length
  const rate = total > 0 ? Math.round((successes / total) * 100) : 0

  const speciesCounts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.species] = (acc[e.species] || 0) + 1
    return acc
  }, {})
  const topSpecies = Object.entries(speciesCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {[
        { label: 'Total Hunts', value: total.toString() },
        { label: 'Success Rate', value: `${rate}%` },
        { label: 'Top Species', value: topSpecies.split(' ')[0] },
      ].map((s) => (
        <div key={s.label} className="rounded-xl border border-forest-700/40 bg-forest-900/50 px-3 py-2.5 text-center">
          <p className="text-lg font-bold text-forest-400 font-mono leading-none">{s.value}</p>
          <p className="mt-0.5 text-xs text-white/30">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Entry Card ────────────────────────────────────────────────────────────────

function EntryCard({
  entry,
  selected,
  onClick,
}: {
  entry: JournalEntry
  selected: boolean
  onClick: () => void
}) {
  const oc = outcomeConfig(entry.outcome)
  const OcIcon = oc.Icon

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      onClick={onClick}
      className={`w-full text-left rounded-xl border px-4 py-3 transition ${
        selected
          ? 'border-forest-500/60 bg-forest-800/60 shadow-md'
          : 'border-forest-700/30 bg-forest-900/40 hover:border-forest-600/40 hover:bg-forest-800/30'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {speciesIcon(entry.species)}
          <span className="text-sm font-semibold text-white/80 truncate">{entry.species}</span>
        </div>
        <span className={`shrink-0 flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${oc.bg} ${oc.text} ${oc.border}`}>
          <OcIcon size={10} />
          {oc.label}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-white/35 mb-1">
        <span>{formatDate(entry.date)}</span>
        {entry.zone && <span className="truncate">{entry.zone}</span>}
      </div>
      <div className="flex items-center gap-2 text-xs text-white/30">
        {weatherIcon(entry.weather)}
        <span>{entry.weather}</span>
        <span className="mx-1 text-white/15">·</span>
        <Wind size={11} className="text-teal-500/50" />
        <span>{entry.wind}</span>
      </div>
      {entry.notes && (
        <p className="mt-2 text-xs text-white/30 line-clamp-1">{entry.notes}</p>
      )}
    </motion.button>
  )
}

// ─── Entry Detail ──────────────────────────────────────────────────────────────

function EntryDetail({
  entry,
  onDelete,
  onClose,
}: {
  entry: JournalEntry
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const oc = outcomeConfig(entry.outcome)
  const OcIcon = oc.Icon

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3500)
    } else {
      onDelete(entry.id)
      onClose()
    }
  }

  const details: { label: string; value: string | number }[] = [
    { label: 'Hunt Date', value: formatDate(entry.date) },
    { label: 'Location / Zone', value: entry.zone || '—' },
    { label: 'Species', value: entry.species },
    { label: 'Weather', value: entry.weather },
    { label: 'Wind', value: entry.wind },
    { label: 'Moon Phase', value: entry.moonPhase || '—' },
    { label: 'Shots Taken', value: entry.shotsTaken },
    { label: 'Companions', value: entry.companions || 'Solo' },
    { label: 'Logged', value: new Date(entry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
  ]

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col"
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {speciesIcon(entry.species)}
            <h2 className="text-xl font-bold text-white font-display">{entry.species}</h2>
          </div>
          <p className="text-sm text-white/40">{formatDate(entry.date)} · {entry.zone || 'Location not specified'}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-forest-700/40 p-1.5 text-white/40 hover:text-white hover:border-forest-500 transition"
        >
          <X size={15} />
        </button>
      </div>

      {/* Outcome badge */}
      <div className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 ${oc.bg} ${oc.border}`}>
        <OcIcon size={18} className={oc.text} />
        <span className={`font-semibold ${oc.text}`}>{oc.label}</span>
      </div>

      {/* Detail grid */}
      <div className="mb-5 overflow-hidden rounded-xl border border-forest-700/35">
        {details.map((d, i) => (
          <div
            key={d.label}
            className={`flex items-center justify-between px-4 py-2.5 text-sm ${
              i % 2 === 0 ? 'bg-forest-900/40' : 'bg-forest-900/20'
            } border-b border-forest-800/40 last:border-b-0`}
          >
            <span className="text-white/40">{d.label}</span>
            <span className="text-white/80 font-medium">{d.value}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      {entry.notes && (
        <div className="mb-5 rounded-xl border border-forest-700/35 bg-forest-900/30 p-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-forest-500">Notes</p>
          <p className="text-sm text-white/65 whitespace-pre-wrap leading-relaxed">{entry.notes}</p>
        </div>
      )}

      <div className="mt-auto flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-forest-700/40 py-2.5 text-sm text-white/50 hover:text-white hover:border-forest-500 transition"
        >
          <ChevronLeft size={14} className="inline mr-1" />
          Back
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            confirmDelete
              ? 'border-red-500/60 bg-red-500/15 text-red-400 hover:bg-red-500/25'
              : 'border-blood/40 bg-blood/10 text-blood/70 hover:bg-blood/20 hover:text-red-300'
          }`}
        >
          <Trash2 size={14} />
          {confirmDelete ? 'Confirm Delete?' : 'Delete'}
        </button>
      </div>
    </motion.div>
  )
}

// ─── New Entry Form ────────────────────────────────────────────────────────────

const selectClass =
  'w-full rounded-lg border border-forest-700/60 bg-forest-900/60 px-3 py-2 text-sm text-white outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500/40 transition appearance-none'
const inputClass =
  'w-full rounded-lg border border-forest-700/60 bg-forest-900/60 px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500/40 transition'
const labelClass = 'block text-xs font-medium text-white/50 mb-1.5'

interface FormState {
  date: string
  zone: string
  species: string
  weather: string
  wind: string
  moonPhase: string
  outcome: JournalEntry['outcome']
  shotsTaken: number
  companions: string
  notes: string
}

function defaultForm(): FormState {
  return {
    date: todayString(),
    zone: '',
    species: 'Rusa Deer',
    weather: 'Clear',
    wind: 'Calm',
    moonPhase: '',
    outcome: 'success',
    shotsTaken: 0,
    companions: '',
    notes: '',
  }
}

function NewEntryForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Omit<JournalEntry, 'id' | 'createdAt'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [submitted, setSubmitted] = useState(false)

  const set = <K extends keyof FormState>(key: K) => (
    value: FormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...form })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onCancel()
    }, 900)
  }

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">Log New Hunt</h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-forest-700/40 p-1.5 text-white/40 hover:text-white hover:border-forest-500 transition"
        >
          <X size={15} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row: Date + Species */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Hunt Date</label>
            <input
              type="date"
              required
              value={form.date}
              max={todayString()}
              onChange={(e) => set('date')(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Species</label>
            <select
              value={form.species}
              onChange={(e) => set('species')(e.target.value)}
              className={selectClass}
            >
              {SPECIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Zone */}
        <div>
          <label className={labelClass}>Location / Zone</label>
          <input
            type="text"
            placeholder="e.g. Domaine de Chasseur, Grand Port…"
            value={form.zone}
            onChange={(e) => set('zone')(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Row: Weather + Wind */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Weather</label>
            <select
              value={form.weather}
              onChange={(e) => set('weather')(e.target.value)}
              className={selectClass}
            >
              {WEATHER_OPTIONS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Wind</label>
            <select
              value={form.wind}
              onChange={(e) => set('wind')(e.target.value)}
              className={selectClass}
            >
              {WIND_OPTIONS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row: Outcome + Shots */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Outcome</label>
            <select
              value={form.outcome}
              onChange={(e) => set('outcome')(e.target.value as JournalEntry['outcome'])}
              className={selectClass}
              style={{
                color:
                  form.outcome === 'success'
                    ? '#34d399'
                    : form.outcome === 'missed'
                    ? '#fbbf24'
                    : form.outcome === 'observed_only'
                    ? '#38bdf8'
                    : undefined,
              }}
            >
              {OUTCOME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Shots Taken</label>
            <input
              type="number"
              min={0}
              max={10}
              value={form.shotsTaken}
              onChange={(e) => set('shotsTaken')(parseInt(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Moon Phase */}
        <div>
          <label className={labelClass}>Moon Phase</label>
          <select
            value={form.moonPhase}
            onChange={(e) => set('moonPhase')(e.target.value)}
            className={selectClass}
          >
            <option value="">— Select phase —</option>
            {MOON_PHASES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Companions */}
        <div>
          <label className={labelClass}>Companions</label>
          <input
            type="text"
            placeholder="Names of hunting partners (leave blank for solo)"
            value={form.companions}
            onChange={(e) => set('companions')(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>
            Notes
            <span className="ml-1.5 text-white/25">
              ({form.notes.length}/500)
            </span>
          </label>
          <textarea
            rows={4}
            maxLength={500}
            placeholder="Observations, animal behaviour, terrain notes…"
            value={form.notes}
            onChange={(e) => set('notes')(e.target.value)}
            className={`${inputClass} resize-none leading-relaxed`}
          />
          <div className="mt-1 flex justify-end">
            <div className="h-0.5 w-full rounded-full bg-forest-800/60">
              <motion.div
                className="h-full rounded-full bg-forest-500"
                animate={{ width: `${(form.notes.length / 500) * 100}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          animate={
            submitted
              ? { scale: [1, 1.04, 1], backgroundColor: ['#2a5522', '#34d399', '#2a5522'] }
              : {}
          }
          transition={{ duration: 0.5 }}
          className="w-full rounded-xl bg-forest-600 py-3 text-sm font-semibold text-white hover:bg-forest-500 transition disabled:opacity-50"
        >
          {submitted ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-300" />
              Entry Saved!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <BookOpen size={15} />
              Save Hunt Entry
            </span>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

// ─── Right Panel placeholder ───────────────────────────────────────────────────

function RightPanelIdle({ onNew }: { onNew: () => void }) {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center text-center py-16 px-6"
    >
      <BookOpen size={36} className="text-forest-600/60 mb-4" strokeWidth={1.5} />
      <p className="text-white/35 text-sm mb-5 max-w-xs">
        Select an entry from the list to view its details, or log a new hunt to add to your journal.
      </p>
      <button
        type="button"
        onClick={onNew}
        className="flex items-center gap-2 rounded-xl bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-500 transition"
      >
        <Plus size={16} />
        Log New Hunt
      </button>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type PanelMode = 'idle' | 'form' | 'detail'

export default function JournalPage() {
  const { entries, addEntry, deleteEntry } = useJournal()
  const [panelMode, setPanelMode] = useState<PanelMode>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedEntry = useMemo(
    () => entries.find((e) => e.id === selectedId) ?? null,
    [entries, selectedId]
  )

  const handleSelectEntry = (id: string) => {
    setSelectedId(id)
    setPanelMode('detail')
  }

  const handleNewEntry = () => {
    setSelectedId(null)
    setPanelMode('form')
  }

  const handleSubmit = (data: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    addEntry(data)
  }

  const handleClose = () => {
    setSelectedId(null)
    setPanelMode('idle')
  }

  const handleDelete = (id: string) => {
    deleteEntry(id)
    setSelectedId(null)
    setPanelMode('idle')
  }

  return (
    <PageWrapper>
      {/* ── Page Header ── */}
      <section className="px-4 pt-10 pb-6">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-widest text-forest-500">
              <BookOpen size={12} />
              Personal Record
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Hunt Journal</h1>
                <p className="mt-1 text-sm text-white/45">
                  Your personal hunting log — every expedition in Mauritius, recorded.
                </p>
              </div>
              <button
                type="button"
                onClick={handleNewEntry}
                className="flex items-center gap-2 rounded-xl border border-forest-600/60 bg-forest-700/30 px-4 py-2.5 text-sm font-semibold text-forest-300 hover:bg-forest-600/40 hover:text-white transition"
              >
                <Plus size={16} />
                Log New Hunt
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Two-panel layout ── */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">

            {/* ══ LEFT PANEL — Entry List ══ */}
            <ScrollReveal>
              <div className="rounded-2xl border border-forest-700/40 bg-forest-900/30 p-4">

                {/* Stats strip */}
                {entries.length > 0 && <StatsStrip entries={entries} />}

                {/* Entry list */}
                <AnimatePresence mode="popLayout">
                  {entries.length === 0 ? (
                    <EmptyState key="empty-state" onNew={handleNewEntry} />
                  ) : (
                    <div className="space-y-2.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                      {entries.map((entry, i) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                        >
                          <EntryCard
                            entry={entry}
                            selected={selectedId === entry.id}
                            onClick={() => handleSelectEntry(entry.id)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>

            {/* ══ RIGHT PANEL — Form / Detail / Idle ══ */}
            <ScrollReveal delay={0.08}>
              <div className="rounded-2xl border border-forest-700/40 bg-forest-900/30 p-6 min-h-[28rem]">
                <AnimatePresence mode="wait">
                  {panelMode === 'form' && (
                    <NewEntryForm
                      key="form"
                      onSubmit={handleSubmit}
                      onCancel={handleClose}
                    />
                  )}
                  {panelMode === 'detail' && selectedEntry && (
                    <EntryDetail
                      key={`detail-${selectedEntry.id}`}
                      entry={selectedEntry}
                      onDelete={handleDelete}
                      onClose={handleClose}
                    />
                  )}
                  {panelMode === 'idle' && (
                    <RightPanelIdle key="idle" onNew={handleNewEntry} />
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
