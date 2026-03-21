import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Shield, MapPin, File, Plus, Edit2, Trash2, X,
  CheckCircle, AlertTriangle, XCircle, ChevronRight, AlertCircle,
  Crosshair, Calendar, Hash, User, StickyNote, ChevronDown
} from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'

// ─── Types ───────────────────────────────────────────────────────────────────

type DocType = 'game_licence' | 'firearm_cert' | 'land_permit' | 'other'

interface HuntingDoc {
  id: string
  type: DocType
  label: string
  number: string
  holderName: string
  issueDate: string
  expiryDate: string
  notes: string
  createdAt: string
}

interface RegisteredFirearm {
  id: string
  make: string
  model: string
  calibre: string
  serialNumber: string
  registeredDate: string
  licenceRef: string
  notes: string
}

type DocStatus = 'valid' | 'expiring' | 'expired'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatus(expiryDate: string): DocStatus {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffMs = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'expiring'
  return 'valid'
}

function getDaysRemaining(expiryDate: string): number {
  const now = new Date()
  const expiry = new Date(expiryDate)
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function getProgress(issueDate: string, expiryDate: string): number {
  const now = new Date().getTime()
  const issue = new Date(issueDate).getTime()
  const expiry = new Date(expiryDate).getTime()
  if (expiry <= issue) return 0
  const elapsed = now - issue
  const total = expiry - issue
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-MU', { day: '2-digit', month: 'short', year: 'numeric' })
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DOC_TYPE_META: Record<DocType, { label: string; icon: React.ReactNode; colour: string }> = {
  game_licence: {
    label: 'Game Licence',
    icon: <FileText size={14} />,
    colour: 'bg-forest-600/30 text-forest-400 border-forest-600/40',
  },
  firearm_cert: {
    label: 'Firearm Cert',
    icon: <Shield size={14} />,
    colour: 'bg-earth-700/30 text-amber-glow border-earth-600/40',
  },
  land_permit: {
    label: 'Land Permit',
    icon: <MapPin size={14} />,
    colour: 'bg-blue-900/30 text-blue-400 border-blue-800/40',
  },
  other: {
    label: 'Other',
    icon: <File size={14} />,
    colour: 'bg-white/5 text-white/60 border-white/10',
  },
}

const STATUS_META: Record<DocStatus, { label: string; colour: string; textColour: string }> = {
  valid: {
    label: 'Valid',
    colour: 'bg-forest-600/20 border-forest-500/40',
    textColour: 'text-forest-400',
  },
  expiring: {
    label: 'Expiring Soon',
    colour: 'bg-amber-900/20 border-amber-fire/40',
    textColour: 'text-amber-fire',
  },
  expired: {
    label: 'Expired',
    colour: 'bg-blood/20 border-blood/40',
    textColour: 'text-red-400',
  },
}

const EMPTY_DOC: Omit<HuntingDoc, 'id' | 'createdAt'> = {
  type: 'game_licence',
  label: '',
  number: '',
  holderName: '',
  issueDate: '',
  expiryDate: '',
  notes: '',
}

const EMPTY_FIREARM: Omit<RegisteredFirearm, 'id'> = {
  make: '',
  model: '',
  calibre: '',
  serialNumber: '',
  registeredDate: '',
  licenceRef: '',
  notes: '',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DaysCounter({ days }: { days: number }) {
  const [displayed, setDisplayed] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true
    const target = Math.abs(days)
    let start = 0
    const step = Math.ceil(target / 40)
    const interval = setInterval(() => {
      start += step
      if (start >= target) {
        setDisplayed(target)
        clearInterval(interval)
      } else {
        setDisplayed(start)
      }
    }, 16)
    return () => clearInterval(interval)
  }, [days])

  if (days < 0) return <span className="text-red-400 font-mono text-sm">{displayed} days overdue</span>
  return <span className="font-mono text-sm">{displayed} days remaining</span>
}

function StatusBadge({ status }: { status: DocStatus }) {
  const meta = STATUS_META[status]
  const Icon = status === 'valid' ? CheckCircle : status === 'expiring' ? AlertTriangle : XCircle
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.colour} ${meta.textColour}`}>
      <Icon size={11} />
      {meta.label}
    </span>
  )
}

interface DocCardProps {
  doc: HuntingDoc
  onEdit: (doc: HuntingDoc) => void
  onDelete: (id: string) => void
}

function DocCard({ doc, onEdit, onDelete }: DocCardProps) {
  const status = getStatus(doc.expiryDate)
  const days = getDaysRemaining(doc.expiryDate)
  const progress = getProgress(doc.issueDate, doc.expiryDate)
  const typeMeta = DOC_TYPE_META[doc.type]
  const statusMeta = STATUS_META[status]

  const borderClass =
    status === 'expiring'
      ? 'border-amber-fire/50'
      : status === 'expired'
      ? 'border-blood/50'
      : 'border-white/5'

  const bgClass = status === 'expired' ? 'bg-blood/5' : 'bg-forest-900/40'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`relative rounded-2xl border p-5 ${bgClass} ${borderClass} overflow-hidden`}
    >
      {status === 'expiring' && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-amber-fire/30 pointer-events-none"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${typeMeta.colour}`}>
            {typeMeta.icon}
            {typeMeta.label}
          </span>
          <StatusBadge status={status} />
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(doc)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-forest-700/40 text-white/50 hover:text-white transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(doc.id)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-blood/30 text-white/50 hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h3 className="font-display text-lg font-bold text-white mb-0.5">{doc.label}</h3>
      <p className="text-white/50 text-sm mb-3">{doc.holderName}</p>

      <div className="font-mono text-xs text-forest-400 bg-forest-950/60 px-3 py-1.5 rounded-lg inline-block mb-3">
        {doc.number || '—'}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40 mb-4">
        <span>Issued {formatDate(doc.issueDate)}</span>
        <ChevronRight size={10} className="text-white/20" />
        <span>Expires {formatDate(doc.expiryDate)}</span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              status === 'expired'
                ? 'bg-red-500'
                : status === 'expiring'
                ? 'bg-amber-fire'
                : 'bg-forest-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className={statusMeta.textColour}>
        <DaysCounter days={days} />
      </div>

      {doc.notes && (
        <p className="mt-3 text-xs text-white/30 border-t border-white/5 pt-3">{doc.notes}</p>
      )}
    </motion.div>
  )
}

interface FirearmCardProps {
  firearm: RegisteredFirearm
  docs: HuntingDoc[]
  onEdit: (f: RegisteredFirearm) => void
  onDelete: (id: string) => void
}

function FirearmCard({ firearm, docs, onEdit, onDelete }: FirearmCardProps) {
  const linkedDoc = docs.find(d => d.id === firearm.licenceRef)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-2xl border border-white/5 bg-forest-900/40 p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-earth-800/60 flex items-center justify-center">
            <Crosshair size={16} className="text-amber-glow" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white leading-tight">
              {firearm.make} {firearm.model}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-earth-700/30 text-amber-fire border border-earth-600/30">
              {firearm.calibre}
            </span>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(firearm)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-forest-700/40 text-white/50 hover:text-white transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(firearm.id)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-blood/30 text-white/50 hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-white/30 text-xs mb-0.5">Serial Number</p>
          <p className="font-mono text-xs text-forest-400 bg-forest-950/60 px-2 py-1 rounded">
            {firearm.serialNumber || '—'}
          </p>
        </div>
        <div>
          <p className="text-white/30 text-xs mb-0.5">Registered</p>
          <p className="text-white/70 text-xs">{formatDate(firearm.registeredDate)}</p>
        </div>
      </div>

      {linkedDoc && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-white/40">
          <FileText size={11} />
          <span>Linked to: <span className="text-forest-400">{linkedDoc.label}</span></span>
        </div>
      )}

      {firearm.notes && (
        <p className="mt-3 text-xs text-white/30 border-t border-white/5 pt-3">{firearm.notes}</p>
      )}
    </motion.div>
  )
}

// ─── Slide Panel ─────────────────────────────────────────────────────────────

interface PanelProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function SlidePanel({ open, onClose, title, children }: PanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-forest-900 border-l border-white/5 shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="font-display text-lg font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Doc Form ─────────────────────────────────────────────────────────────────

interface DocFormProps {
  initial: Omit<HuntingDoc, 'id' | 'createdAt'>
  onSave: (data: Omit<HuntingDoc, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

function DocForm({ initial, onSave, onCancel }: DocFormProps) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  const labelClass = 'block text-xs font-medium text-white/50 mb-1'
  const inputClass =
    'w-full bg-forest-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-forest-500/60 transition-colors'

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSave(form)
      }}
      className="space-y-4"
    >
      <div>
        <label className={labelClass}>Document Type</label>
        <div className="relative">
          <select
            value={form.type}
            onChange={e => set('type', e.target.value)}
            className={`${inputClass} appearance-none pr-8`}
          >
            {(Object.keys(DOC_TYPE_META) as DocType[]).map(t => (
              <option key={t} value={t} className="bg-forest-900">
                {DOC_TYPE_META[t].label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className={labelClass}><span className="flex items-center gap-1"><FileText size={11} /> Label</span></label>
        <input
          required
          value={form.label}
          onChange={e => set('label', e.target.value)}
          placeholder="e.g. 2026 Game Licence"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}><span className="flex items-center gap-1"><Hash size={11} /> Licence / Cert Number</span></label>
        <input
          value={form.number}
          onChange={e => set('number', e.target.value)}
          placeholder="MU-GL-2026-0001"
          className={`${inputClass} font-mono`}
        />
      </div>

      <div>
        <label className={labelClass}><span className="flex items-center gap-1"><User size={11} /> Holder Name</span></label>
        <input
          required
          value={form.holderName}
          onChange={e => set('holderName', e.target.value)}
          placeholder="Full name on document"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}><span className="flex items-center gap-1"><Calendar size={11} /> Issue Date</span></label>
          <input
            type="date"
            required
            value={form.issueDate}
            onChange={e => set('issueDate', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}><span className="flex items-center gap-1"><Calendar size={11} /> Expiry Date</span></label>
          <input
            type="date"
            required
            value={form.expiryDate}
            onChange={e => set('expiryDate', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}><span className="flex items-center gap-1"><StickyNote size={11} /> Notes</span></label>
        <textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          rows={3}
          placeholder="Optional notes"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-sm font-semibold transition-colors"
        >
          Save Document
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Firearm Form ──────────────────────────────────────────────────────────────

interface FirearmFormProps {
  initial: Omit<RegisteredFirearm, 'id'>
  docs: HuntingDoc[]
  onSave: (data: Omit<RegisteredFirearm, 'id'>) => void
  onCancel: () => void
}

function FirearmForm({ initial, docs, onSave, onCancel }: FirearmFormProps) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  const labelClass = 'block text-xs font-medium text-white/50 mb-1'
  const inputClass =
    'w-full bg-forest-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-forest-500/60 transition-colors'

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSave(form)
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Make</label>
          <input required value={form.make} onChange={e => set('make', e.target.value)} placeholder="Tikka" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Model</label>
          <input required value={form.model} onChange={e => set('model', e.target.value)} placeholder="T3x" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Calibre</label>
        <input required value={form.calibre} onChange={e => set('calibre', e.target.value)} placeholder=".308 Winchester" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}><span className="flex items-center gap-1"><Hash size={11} /> Serial Number</span></label>
        <input value={form.serialNumber} onChange={e => set('serialNumber', e.target.value)} placeholder="SN-XXXXXXXX" className={`${inputClass} font-mono`} />
      </div>

      <div>
        <label className={labelClass}><span className="flex items-center gap-1"><Calendar size={11} /> Registered Date</span></label>
        <input type="date" required value={form.registeredDate} onChange={e => set('registeredDate', e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Linked Firearm Certificate</label>
        <div className="relative">
          <select value={form.licenceRef} onChange={e => set('licenceRef', e.target.value)} className={`${inputClass} appearance-none pr-8`}>
            <option value="" className="bg-forest-900">— None —</option>
            {docs.filter(d => d.type === 'firearm_cert').map(d => (
              <option key={d.id} value={d.id} className="bg-forest-900">{d.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className={labelClass}><span className="flex items-center gap-1"><StickyNote size={11} /> Notes</span></label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Optional notes" className={`${inputClass} resize-none`} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-sm font-semibold transition-colors">
          Save Firearm
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PermitsPage() {
  const [docs, setDocs] = useState<HuntingDoc[]>([])
  const [firearms, setFirearms] = useState<RegisteredFirearm[]>([])
  const [activeTab, setActiveTab] = useState<'docs' | 'firearms'>('docs')
  const [bannerDismissed, setBannerDismissed] = useState(false)

  // Panel state
  const [docPanelOpen, setDocPanelOpen] = useState(false)
  const [firearmPanelOpen, setFirearmPanelOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<HuntingDoc | null>(null)
  const [editingFirearm, setEditingFirearm] = useState<RegisteredFirearm | null>(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const d = localStorage.getItem('rusa_permits')
      if (d) setDocs(JSON.parse(d))
    } catch { /* ignore */ }
    try {
      const f = localStorage.getItem('rusa_firearms')
      if (f) setFirearms(JSON.parse(f))
    } catch { /* ignore */ }
  }, [])

  const saveDocs = (next: HuntingDoc[]) => {
    setDocs(next)
    localStorage.setItem('rusa_permits', JSON.stringify(next))
  }

  const saveFirearms = (next: RegisteredFirearm[]) => {
    setFirearms(next)
    localStorage.setItem('rusa_firearms', JSON.stringify(next))
  }

  // Doc CRUD
  const handleSaveDoc = (data: Omit<HuntingDoc, 'id' | 'createdAt'>) => {
    if (editingDoc) {
      saveDocs(docs.map(d => d.id === editingDoc.id ? { ...d, ...data } : d))
    } else {
      saveDocs([...docs, { ...data, id: uid(), createdAt: new Date().toISOString() }])
    }
    setDocPanelOpen(false)
    setEditingDoc(null)
  }

  const handleDeleteDoc = (id: string) => {
    saveDocs(docs.filter(d => d.id !== id))
  }

  const handleEditDoc = (doc: HuntingDoc) => {
    setEditingDoc(doc)
    setDocPanelOpen(true)
  }

  // Firearm CRUD
  const handleSaveFirearm = (data: Omit<RegisteredFirearm, 'id'>) => {
    if (editingFirearm) {
      saveFirearms(firearms.map(f => f.id === editingFirearm.id ? { ...f, ...data } : f))
    } else {
      saveFirearms([...firearms, { ...data, id: uid() }])
    }
    setFirearmPanelOpen(false)
    setEditingFirearm(null)
  }

  const handleDeleteFirearm = (id: string) => {
    saveFirearms(firearms.filter(f => f.id !== id))
  }

  const handleEditFirearm = (firearm: RegisteredFirearm) => {
    setEditingFirearm(firearm)
    setFirearmPanelOpen(true)
  }

  // Summary counts
  const validCount = docs.filter(d => getStatus(d.expiryDate) === 'valid').length
  const expiringCount = docs.filter(d => getStatus(d.expiryDate) === 'expiring').length
  const expiredCount = docs.filter(d => getStatus(d.expiryDate) === 'expired').length

  return (
    <PageWrapper>
      <section className="py-20 px-4 sm:px-6 min-h-screen">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <ScrollReveal>
            <div className="mb-8">
              <p className="text-forest-500 text-sm font-medium tracking-widest uppercase mb-2">Personal Records</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
                Permits &amp; Licences
              </h1>
              <p className="text-white/40 text-base">
                Track your game licences, firearm certificates, and registered firearms.
              </p>
            </div>
          </ScrollReveal>

          {/* Legal Banner */}
          <AnimatePresence>
            {!bannerDismissed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex gap-3 items-start bg-earth-800/40 border border-amber-fire/30 rounded-2xl p-4">
                  <AlertCircle size={18} className="text-amber-fire shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm text-amber-fire/90 leading-relaxed">
                    <span className="font-semibold">Legal Reminder:</span> Under Mauritian law, your game licence and firearm certificate
                    must be carried on your person while hunting at all times. Failure to produce documents on
                    request is an offence under s.20.
                  </div>
                  <button
                    onClick={() => setBannerDismissed(true)}
                    className="shrink-0 p-1 rounded text-amber-fire/50 hover:text-amber-fire transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="flex gap-1 bg-forest-900/60 border border-white/5 rounded-2xl p-1 mb-6 w-fit">
            {(['docs', 'firearms'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabBg"
                    className="absolute inset-0 bg-forest-700/50 rounded-xl"
                  />
                )}
                <span className="relative z-10">{tab === 'docs' ? 'Documents' : 'Firearms'}</span>
              </button>
            ))}
          </div>

          {/* Documents Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'docs' && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* Summary strip */}
                {docs.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Total', value: docs.length, colour: 'text-white/80' },
                      { label: 'Valid', value: validCount, colour: 'text-forest-400' },
                      { label: 'Expiring', value: expiringCount, colour: 'text-amber-fire' },
                      { label: 'Expired', value: expiredCount, colour: 'text-red-400' },
                    ].map(s => (
                      <div key={s.label} className="bg-forest-900/40 border border-white/5 rounded-2xl p-4 text-center">
                        <p className={`text-2xl font-display font-bold ${s.colour}`}>{s.value}</p>
                        <p className="text-xs text-white/30 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => { setEditingDoc(null); setDocPanelOpen(true) }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-forest-900/50"
                  >
                    <Plus size={15} />
                    Add Document
                  </button>
                </div>

                {/* Doc list */}
                {docs.length === 0 ? (
                  <div className="text-center py-20 text-white/25">
                    <FileText size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="font-display text-xl font-bold mb-2">No documents yet</p>
                    <p className="text-sm">Add your game licence, firearm cert, or land permits to track expiry dates.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <AnimatePresence>
                      {docs.map(doc => (
                        <DocCard key={doc.id} doc={doc} onEdit={handleEditDoc} onDelete={handleDeleteDoc} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* Firearms Tab */}
            {activeTab === 'firearms' && (
              <motion.div
                key="firearms"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => { setEditingFirearm(null); setFirearmPanelOpen(true) }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-forest-900/50"
                  >
                    <Plus size={15} />
                    Add Firearm
                  </button>
                </div>

                {firearms.length === 0 ? (
                  <div className="text-center py-20 text-white/25">
                    <Crosshair size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="font-display text-xl font-bold mb-2">No firearms registered</p>
                    <p className="text-sm">Add your registered firearms to keep them on record alongside your certificates.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {firearms.map(f => (
                        <FirearmCard key={f.id} firearm={f} docs={docs} onEdit={handleEditFirearm} onDelete={handleDeleteFirearm} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Document Panel */}
      <SlidePanel
        open={docPanelOpen}
        onClose={() => { setDocPanelOpen(false); setEditingDoc(null) }}
        title={editingDoc ? 'Edit Document' : 'Add Document'}
      >
        <DocForm
          initial={editingDoc ? { type: editingDoc.type, label: editingDoc.label, number: editingDoc.number, holderName: editingDoc.holderName, issueDate: editingDoc.issueDate, expiryDate: editingDoc.expiryDate, notes: editingDoc.notes } : EMPTY_DOC}
          onSave={handleSaveDoc}
          onCancel={() => { setDocPanelOpen(false); setEditingDoc(null) }}
        />
      </SlidePanel>

      {/* Firearm Panel */}
      <SlidePanel
        open={firearmPanelOpen}
        onClose={() => { setFirearmPanelOpen(false); setEditingFirearm(null) }}
        title={editingFirearm ? 'Edit Firearm' : 'Add Firearm'}
      >
        <FirearmForm
          initial={editingFirearm ? { make: editingFirearm.make, model: editingFirearm.model, calibre: editingFirearm.calibre, serialNumber: editingFirearm.serialNumber, registeredDate: editingFirearm.registeredDate, licenceRef: editingFirearm.licenceRef, notes: editingFirearm.notes } : EMPTY_FIREARM}
          docs={docs}
          onSave={handleSaveFirearm}
          onCancel={() => { setFirearmPanelOpen(false); setEditingFirearm(null) }}
        />
      </SlidePanel>
    </PageWrapper>
  )
}
