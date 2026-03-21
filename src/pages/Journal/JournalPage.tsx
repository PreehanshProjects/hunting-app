import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Plus, X, Trash2, ChevronLeft, Cloud, Sun, CloudRain, Wind,
  Droplets, Feather, AlertCircle, CheckCircle2, Eye, Target, PawPrint,
  Camera, Video, Upload, ChevronRight, Play, ZoomIn, ImageOff,
} from 'lucide-react'

// ─── IndexedDB media storage ──────────────────────────────────────────────────
const DB_NAME = 'rusa_media_db'
const STORE = 'blobs'

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function saveMediaBlob(id: string, blob: Blob) {
  const db = await openMediaDB()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function loadMediaBlobUrl(id: string): Promise<string | null> {
  const db = await openMediaDB()
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => resolve(req.result ? URL.createObjectURL(req.result) : null)
    req.onerror = () => resolve(null)
  })
}

async function deleteMediaBlob(id: string) {
  const db = await openMediaDB()
  return new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => resolve()
  })
}

// Compress image to thumbnail (base64 JPEG, max 400px wide)
function compressImageToThumb(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 400
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.6))
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve('') }
    img.src = url
  })
}

// Capture first frame from a video as thumbnail
function captureVideoThumb(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)
    video.preload = 'metadata'
    video.muted = true
    video.onloadeddata = () => {
      video.currentTime = 0.5
    }
    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      const MAX = 400
      const ratio = Math.min(MAX / video.videoWidth, MAX / video.videoHeight, 1)
      canvas.width = video.videoWidth * ratio
      canvas.height = video.videoHeight * ratio
      canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.6))
    }
    video.onerror = () => { URL.revokeObjectURL(url); resolve('') }
    video.src = url
  })
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface MediaItem {
  id: string
  type: 'photo' | 'video'
  name: string
  thumbnail: string // small base64 JPEG for card/strip
}

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
  media: MediaItem[]
}

// ─── Journal hook ─────────────────────────────────────────────────────────────
function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('rusa_journal') || '[]') as JournalEntry[]
      return raw.map((e) => ({ ...e, media: e.media ?? [] }))
    } catch { return [] }
  })

  const save = (updated: JournalEntry[]) => {
    setEntries(updated)
    localStorage.setItem('rusa_journal', JSON.stringify(updated))
  }

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = { ...entry, id: Date.now().toString(), createdAt: new Date().toISOString() }
    save([newEntry, ...entries])
  }

  const deleteEntry = async (id: string) => {
    const entry = entries.find((e) => e.id === id)
    if (entry) {
      for (const m of entry.media) await deleteMediaBlob(m.id)
    }
    save(entries.filter((e) => e.id !== id))
  }

  return { entries, addEntry, deleteEntry }
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SPECIES = ['Rusa Deer', 'Wild Boar', 'Hare', 'Partridge', 'Quail', 'Guinea Fowl']
const WEATHER_OPTIONS = ['Clear', 'Cloudy', 'Light Rain', 'Windy', 'Humid']
const WIND_OPTIONS = ['Calm', 'Light', 'Moderate', 'Strong']
const MOON_PHASES = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent']
const OUTCOME_OPTIONS: { value: JournalEntry['outcome']; label: string }[] = [
  { value: 'success', label: 'Success' },
  { value: 'missed', label: 'Missed' },
  { value: 'no_game', label: 'No Game' },
  { value: 'observed_only', label: 'Observed Only' },
]

function todayString() { return new Date().toISOString().split('T')[0] }
function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function outcomeConfig(outcome: JournalEntry['outcome']) {
  switch (outcome) {
    case 'success':       return { label: 'Success',       bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', Icon: CheckCircle2 }
    case 'missed':        return { label: 'Missed',        bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30',   Icon: Target }
    case 'no_game':       return { label: 'No Game',       bg: 'bg-white/5',        text: 'text-white/40',    border: 'border-white/10',       Icon: AlertCircle }
    case 'observed_only': return { label: 'Observed Only', bg: 'bg-sky-500/15',     text: 'text-sky-400',     border: 'border-sky-500/30',     Icon: Eye }
  }
}
function weatherIcon(weather: string) {
  switch (weather) {
    case 'Clear':      return <Sun size={13} className="text-amber-400" />
    case 'Cloudy':     return <Cloud size={13} className="text-slate-400" />
    case 'Light Rain': return <CloudRain size={13} className="text-sky-400" />
    case 'Windy':      return <Wind size={13} className="text-teal-400" />
    case 'Humid':      return <Droplets size={13} className="text-blue-400" />
    default:           return <Sun size={13} className="text-white/30" />
  }
}
function speciesIcon(species: string) {
  switch (species) {
    case 'Rusa Deer': return <PawPrint size={14} className="text-forest-400" />
    case 'Wild Boar': return <PawPrint size={14} className="text-earth-400" />
    default:          return <Feather size={14} className="text-forest-500" />
  }
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  items,
  startIndex,
  blobUrls,
  onClose,
}: {
  items: MediaItem[]
  startIndex: number
  blobUrls: Record<string, string>
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)
  const item = items[idx]
  const url = blobUrls[item?.id ?? '']

  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length)
  const next = () => setIdx((i) => (i + 1) % items.length)

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm text-white/50 truncate max-w-xs">{item?.name}</span>
        <div className="flex items-center gap-3">
          {items.length > 1 && (
            <span className="text-xs text-white/40 font-mono">{idx + 1} / {items.length}</span>
          )}
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Media */}
      <div className="flex-1 flex items-center justify-center px-4 min-h-0" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl max-h-full flex items-center justify-center"
          >
            {!url ? (
              <div className="flex flex-col items-center gap-3 text-white/30">
                <ImageOff size={48} />
                <p className="text-sm">Media not available</p>
              </div>
            ) : item?.type === 'video' ? (
              <video
                src={url}
                controls
                autoPlay
                className="max-w-full max-h-[70vh] rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={url}
                alt={item?.name}
                className="max-w-full max-h-[70vh] rounded-xl object-contain"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-6 py-5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={prev} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white">
            <ChevronLeft size={20} />
          </button>
          {/* Dot indicators */}
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? 'w-6 h-2 bg-forest-400' : 'w-2 h-2 bg-white/25 hover:bg-white/40'}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div className="flex gap-2 px-5 pb-5 overflow-x-auto flex-shrink-0 justify-center" onClick={(e) => e.stopPropagation()}>
          {items.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setIdx(i)}
              className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${i === idx ? 'border-forest-400' : 'border-transparent opacity-50 hover:opacity-80'}`}
            >
              <img src={m.thumbnail} alt="" className="w-full h-full object-cover" />
              {m.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play size={12} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Media Gallery (in EntryDetail) ──────────────────────────────────────────
function MediaGallery({ media }: { media: MediaItem[] }) {
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({})
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const urls: Record<string, string> = {}
    ;(async () => {
      for (const m of media) {
        const url = await loadMediaBlobUrl(m.id)
        if (url) urls[m.id] = url
      }
      if (!cancelled) setBlobUrls(urls)
    })()
    return () => {
      cancelled = true
      Object.values(urls).forEach((u) => URL.revokeObjectURL(u))
    }
  }, [media])

  if (media.length === 0) return null

  return (
    <>
      <div className="mb-5">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-forest-500 flex items-center gap-1.5">
          <Camera size={11} /> Media · {media.length} file{media.length !== 1 ? 's' : ''}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {media.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLightboxIdx(i)}
              className="relative aspect-square rounded-xl overflow-hidden bg-forest-900 border border-forest-700/40 group"
            >
              <img src={m.thumbnail || ''} alt={m.name} className="w-full h-full object-cover" />
              {m.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Play size={14} className="text-white ml-0.5" />
                  </div>
                </div>
              )}
              {/* Hover zoom hint */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                <ZoomIn size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            items={media}
            startIndex={lightboxIdx}
            blobUrls={blobUrls}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Media Upload Zone (in NewEntryForm) ──────────────────────────────────────
interface PendingMedia {
  id: string
  file: File
  type: 'photo' | 'video'
  thumbnail: string
  ready: boolean
}

function MediaUploadZone({
  pending,
  onChange,
}: {
  pending: PendingMedia[]
  onChange: (items: PendingMedia[]) => void
}) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const MAX_ITEMS = 6

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files) return
    const remaining = MAX_ITEMS - pending.length
    const toAdd = Array.from(files).slice(0, remaining)

    const newItems: PendingMedia[] = toAdd.map((f) => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      file: f,
      type: f.type.startsWith('video/') ? 'video' : 'photo',
      thumbnail: '',
      ready: false,
    }))

    // Add placeholders immediately so UI updates
    onChange([...pending, ...newItems])

    // Generate thumbnails async
    const withThumbs = await Promise.all(
      newItems.map(async (item) => {
        const thumbnail = item.type === 'video'
          ? await captureVideoThumb(item.file)
          : await compressImageToThumb(item.file)
        return { ...item, thumbnail, ready: true }
      })
    )

    onChange([...pending, ...withThumbs])
  }, [pending, onChange])

  const remove = (id: string) => onChange(pending.filter((p) => p.id !== id))

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-2">
        Photos & Videos
        <span className="ml-1.5 text-white/25">({pending.length}/{MAX_ITEMS})</span>
      </label>

      {/* Drop zone */}
      {pending.length < MAX_ITEMS && (
        <motion.div
          animate={dragging ? { scale: 1.02, borderColor: '#3a7a30' } : { scale: 1, borderColor: 'rgba(58,122,48,0.3)' }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-forest-700/50 bg-forest-900/30 py-6 cursor-pointer hover:border-forest-500/50 hover:bg-forest-800/20 transition-colors"
        >
          <motion.div
            animate={dragging ? { y: -4 } : { y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-forest-800/60 flex items-center justify-center">
              <Camera size={17} className="text-forest-400" />
            </div>
            <div className="w-9 h-9 rounded-xl bg-forest-800/60 flex items-center justify-center">
              <Video size={17} className="text-forest-400" />
            </div>
          </motion.div>
          <p className="text-sm text-white/40 text-center">
            {dragging ? 'Drop to add' : 'Tap to add photos & videos'}
          </p>
          <p className="text-xs text-white/20">JPG, PNG, WEBP, MP4, MOV</p>
          {dragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-xl bg-forest-600/10 flex items-center justify-center"
            >
              <Upload size={32} className="text-forest-400" />
            </motion.div>
          )}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => processFiles(e.target.files)}
          />
        </motion.div>
      )}

      {/* Preview grid */}
      {pending.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {pending.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.04 }}
              className="relative aspect-square rounded-xl overflow-hidden bg-forest-900 border border-forest-700/40"
            >
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-forest-500 border-t-transparent rounded-full"
                  />
                </div>
              )}
              {item.type === 'video' && item.thumbnail && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Play size={12} className="text-white ml-0.5" />
                  </div>
                </div>
              )}
              {/* Type badge */}
              <div className="absolute top-1.5 left-1.5">
                <span className="flex items-center gap-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] text-white/70">
                  {item.type === 'video' ? <Video size={9} /> : <Camera size={9} />}
                </span>
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500/80 transition"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-col items-center justify-center py-20 text-center px-6"
    >
      <svg viewBox="0 0 120 120" className="mb-6 w-28 opacity-20" fill="none">
        <circle cx="60" cy="60" r="58" stroke="#3a7a30" strokeWidth="1.5" strokeDasharray="8,4" />
        <ellipse cx="60" cy="75" rx="22" ry="16" fill="#3a7a30" />
        <rect x="55" y="57" width="10" height="16" rx="5" fill="#3a7a30" />
        <ellipse cx="60" cy="52" rx="9" ry="8" fill="#3a7a30" />
        <path d="M 54 44 C 50 36, 44 30, 42 22" stroke="#3a7a30" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 48 34 C 44 30, 40 28, 38 24" stroke="#3a7a30" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 66 44 C 70 36, 76 30, 78 22" stroke="#3a7a30" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 72 34 C 76 30, 80 28, 82 24" stroke="#3a7a30" strokeWidth="2" strokeLinecap="round" fill="none" />
        <rect x="46" y="89" width="6" height="16" rx="3" fill="#3a7a30" />
        <rect x="54" y="89" width="6" height="16" rx="3" fill="#3a7a30" />
        <rect x="60" y="89" width="6" height="16" rx="3" fill="#3a7a30" />
        <rect x="68" y="89" width="6" height="16" rx="3" fill="#3a7a30" />
      </svg>
      <p className="text-lg font-semibold text-white/40 mb-1">No hunts logged yet</p>
      <p className="text-sm text-white/25 mb-6 max-w-xs">Your hunt journal is empty. Start recording your expeditions — every outing tells a story.</p>
      <button type="button" onClick={onNew} className="flex items-center gap-2 rounded-xl bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-500 transition">
        <Plus size={16} /> Log Your First Hunt
      </button>
    </motion.div>
  )
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────
function StatsStrip({ entries }: { entries: JournalEntry[] }) {
  const total = entries.length
  const successes = entries.filter((e) => e.outcome === 'success').length
  const rate = total > 0 ? Math.round((successes / total) * 100) : 0
  const speciesCounts = entries.reduce<Record<string, number>>((acc, e) => { acc[e.species] = (acc[e.species] || 0) + 1; return acc }, {})
  const topSpecies = Object.entries(speciesCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  const totalMedia = entries.reduce((sum, e) => sum + e.media.length, 0)

  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {[
        { label: 'Hunts', value: total.toString() },
        { label: 'Success', value: `${rate}%` },
        { label: 'Top Species', value: topSpecies.split(' ')[0] },
        { label: 'Media', value: totalMedia.toString() },
      ].map((s) => (
        <div key={s.label} className="rounded-xl border border-forest-700/40 bg-forest-900/50 px-2 py-2.5 text-center">
          <p className="text-base font-bold text-forest-400 font-mono leading-none">{s.value}</p>
          <p className="mt-0.5 text-[10px] text-white/30">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Entry Card ───────────────────────────────────────────────────────────────
function EntryCard({ entry, selected, onClick }: { entry: JournalEntry; selected: boolean; onClick: () => void }) {
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
      className={`w-full text-left rounded-xl border px-4 py-3 transition ${selected ? 'border-forest-500/60 bg-forest-800/60 shadow-md' : 'border-forest-700/30 bg-forest-900/40 hover:border-forest-600/40 hover:bg-forest-800/30'}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {speciesIcon(entry.species)}
          <span className="text-sm font-semibold text-white/80 truncate">{entry.species}</span>
        </div>
        <span className={`shrink-0 flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${oc.bg} ${oc.text} ${oc.border}`}>
          <OcIcon size={10} />{oc.label}
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
      {/* Media thumbnail strip */}
      {entry.media.length > 0 && (
        <div className="mt-2.5 flex gap-1.5 items-center">
          {entry.media.slice(0, 4).map((m) => (
            <div key={m.id} className="relative w-9 h-9 rounded-md overflow-hidden border border-forest-700/30 flex-shrink-0">
              <img src={m.thumbnail} alt="" className="w-full h-full object-cover" />
              {m.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play size={8} className="text-white" />
                </div>
              )}
            </div>
          ))}
          {entry.media.length > 4 && (
            <span className="text-xs text-white/30">+{entry.media.length - 4}</span>
          )}
        </div>
      )}
    </motion.button>
  )
}

// ─── Entry Detail ─────────────────────────────────────────────────────────────
function EntryDetail({ entry, onDelete, onClose }: { entry: JournalEntry; onDelete: (id: string) => void; onClose: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const oc = outcomeConfig(entry.outcome)
  const OcIcon = oc.Icon

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3500) }
    else { onDelete(entry.id); onClose() }
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
  ]

  return (
    <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {speciesIcon(entry.species)}
            <h2 className="text-xl font-bold text-white font-display">{entry.species}</h2>
          </div>
          <p className="text-sm text-white/40">{formatDate(entry.date)} · {entry.zone || 'Location not specified'}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg border border-forest-700/40 p-1.5 text-white/40 hover:text-white hover:border-forest-500 transition">
          <X size={15} />
        </button>
      </div>

      <div className={`mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 ${oc.bg} ${oc.border}`}>
        <OcIcon size={18} className={oc.text} />
        <span className={`font-semibold ${oc.text}`}>{oc.label}</span>
      </div>

      {/* Media gallery */}
      {entry.media.length > 0 && <MediaGallery media={entry.media} />}

      {/* Details grid */}
      <div className="mb-4 overflow-hidden rounded-xl border border-forest-700/35">
        {details.map((d, i) => (
          <div key={d.label} className={`flex items-center justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-forest-900/40' : 'bg-forest-900/20'} border-b border-forest-800/40 last:border-b-0`}>
            <span className="text-white/40">{d.label}</span>
            <span className="text-white/80 font-medium">{d.value}</span>
          </div>
        ))}
      </div>

      {entry.notes && (
        <div className="mb-5 rounded-xl border border-forest-700/35 bg-forest-900/30 p-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-forest-500">Notes</p>
          <p className="text-sm text-white/65 whitespace-pre-wrap leading-relaxed">{entry.notes}</p>
        </div>
      )}

      <div className="mt-auto flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-forest-700/40 py-2.5 text-sm text-white/50 hover:text-white hover:border-forest-500 transition">
          <ChevronLeft size={14} className="inline mr-1" />Back
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${confirmDelete ? 'border-red-500/60 bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'border-blood/40 bg-blood/10 text-blood/70 hover:bg-blood/20 hover:text-red-300'}`}
        >
          <Trash2 size={14} />
          {confirmDelete ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </motion.div>
  )
}

// ─── New Entry Form ───────────────────────────────────────────────────────────
const selectClass = 'w-full rounded-lg border border-forest-700/60 bg-forest-900/60 px-3 py-2 text-sm text-white outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500/40 transition appearance-none'
const inputClass = 'w-full rounded-lg border border-forest-700/60 bg-forest-900/60 px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500/40 transition'
const labelClass = 'block text-xs font-medium text-white/50 mb-1.5'

interface FormState {
  date: string; zone: string; species: string; weather: string; wind: string
  moonPhase: string; outcome: JournalEntry['outcome']; shotsTaken: number
  companions: string; notes: string
}

function defaultForm(): FormState {
  return { date: todayString(), zone: '', species: 'Rusa Deer', weather: 'Clear', wind: 'Calm', moonPhase: '', outcome: 'success', shotsTaken: 0, companions: '', notes: '' }
}

function NewEntryForm({ onSubmit, onCancel }: { onSubmit: (data: Omit<JournalEntry, 'id' | 'createdAt'>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof FormState>(key: K) => (value: FormState[K]) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Save blobs to IndexedDB, build MediaItem list
    const mediaItems: MediaItem[] = []
    for (const pm of pendingMedia) {
      if (!pm.ready) continue
      await saveMediaBlob(pm.id, pm.file)
      mediaItems.push({ id: pm.id, type: pm.type, name: pm.file.name, thumbnail: pm.thumbnail })
    }

    onSubmit({ ...form, media: mediaItems })
    setSaving(false)
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); onCancel() }, 900)
  }

  return (
    <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">Log New Hunt</h2>
        <button type="button" onClick={onCancel} className="rounded-lg border border-forest-700/40 p-1.5 text-white/40 hover:text-white hover:border-forest-500 transition">
          <X size={15} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Hunt Date</label>
            <input type="date" required value={form.date} max={todayString()} onChange={(e) => set('date')(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Species</label>
            <select value={form.species} onChange={(e) => set('species')(e.target.value)} className={selectClass}>
              {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Location / Zone</label>
          <input type="text" placeholder="e.g. Domaine de Chasseur…" value={form.zone} onChange={(e) => set('zone')(e.target.value)} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Weather</label>
            <select value={form.weather} onChange={(e) => set('weather')(e.target.value)} className={selectClass}>
              {WEATHER_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Wind</label>
            <select value={form.wind} onChange={(e) => set('wind')(e.target.value)} className={selectClass}>
              {WIND_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Outcome</label>
            <select value={form.outcome} onChange={(e) => set('outcome')(e.target.value as JournalEntry['outcome'])} className={selectClass}
              style={{ color: form.outcome === 'success' ? '#34d399' : form.outcome === 'missed' ? '#fbbf24' : form.outcome === 'observed_only' ? '#38bdf8' : undefined }}>
              {OUTCOME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Shots Taken</label>
            <input type="number" min={0} max={10} value={form.shotsTaken} onChange={(e) => set('shotsTaken')(parseInt(e.target.value) || 0)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Moon Phase</label>
            <select value={form.moonPhase} onChange={(e) => set('moonPhase')(e.target.value)} className={selectClass}>
              <option value="">— Select —</option>
              {MOON_PHASES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Companions</label>
            <input type="text" placeholder="Leave blank for solo" value={form.companions} onChange={(e) => set('companions')(e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes <span className="text-white/25">({form.notes.length}/500)</span></label>
          <textarea rows={3} maxLength={500} placeholder="Observations, terrain, animal behaviour…" value={form.notes} onChange={(e) => set('notes')(e.target.value)} className={`${inputClass} resize-none leading-relaxed`} />
          <div className="mt-1 h-0.5 w-full rounded-full bg-forest-800/60">
            <motion.div className="h-full rounded-full bg-forest-500" animate={{ width: `${(form.notes.length / 500) * 100}%` }} transition={{ duration: 0.2 }} />
          </div>
        </div>

        {/* Media upload */}
        <div className="rounded-xl border border-forest-700/30 bg-forest-900/20 p-4">
          <MediaUploadZone pending={pendingMedia} onChange={setPendingMedia} />
        </div>

        <motion.button
          type="submit"
          disabled={saving}
          animate={submitted ? { scale: [1, 1.04, 1] } : {}}
          className="w-full rounded-xl bg-forest-600 py-3 text-sm font-semibold text-white hover:bg-forest-500 transition disabled:opacity-60"
        >
          {submitted ? (
            <span className="flex items-center justify-center gap-2"><CheckCircle2 size={16} className="text-emerald-300" /> Entry Saved!</span>
          ) : saving ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
              Saving media…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2"><BookOpen size={15} /> Save Hunt Entry</span>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

// ─── Right Panel Idle ─────────────────────────────────────────────────────────
function RightPanelIdle({ onNew }: { onNew: () => void }) {
  return (
    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center text-center py-16 px-6">
      <BookOpen size={36} className="text-forest-600/60 mb-4" strokeWidth={1.5} />
      <p className="text-white/35 text-sm mb-5 max-w-xs">Select an entry to view its details, or log a new hunt to add to your journal.</p>
      <button type="button" onClick={onNew} className="flex items-center gap-2 rounded-xl bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-500 transition">
        <Plus size={16} /> Log New Hunt
      </button>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type PanelMode = 'idle' | 'form' | 'detail'

export default function JournalPage() {
  const { entries, addEntry, deleteEntry } = useJournal()
  const [panelMode, setPanelMode] = useState<PanelMode>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedEntry = useMemo(() => entries.find((e) => e.id === selectedId) ?? null, [entries, selectedId])

  const handleSelectEntry = (id: string) => { setSelectedId(id); setPanelMode('detail') }
  const handleNewEntry = () => { setSelectedId(null); setPanelMode('form') }
  const handleSubmit = (data: Omit<JournalEntry, 'id' | 'createdAt'>) => addEntry(data)
  const handleClose = () => { setSelectedId(null); setPanelMode('idle') }
  const handleDelete = (id: string) => { deleteEntry(id); setSelectedId(null); setPanelMode('idle') }

  return (
    <PageWrapper>
      <section className="px-4 pt-10 pb-6">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-widest text-forest-500">
              <BookOpen size={12} /> Personal Record
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Hunt Journal</h1>
                <p className="mt-1 text-sm text-white/45">Your personal hunting log — every expedition in Mauritius, recorded.</p>
              </div>
              <button type="button" onClick={handleNewEntry} className="flex items-center gap-2 rounded-xl border border-forest-600/60 bg-forest-700/30 px-4 py-2.5 text-sm font-semibold text-forest-300 hover:bg-forest-600/40 hover:text-white transition">
                <Plus size={16} /> Log New Hunt
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            {/* Left panel */}
            <ScrollReveal>
              <div className="rounded-2xl border border-forest-700/40 bg-forest-900/30 p-4">
                {entries.length > 0 && <StatsStrip entries={entries} />}
                <AnimatePresence mode="popLayout">
                  {entries.length === 0 ? (
                    <EmptyState key="empty-state" onNew={handleNewEntry} />
                  ) : (
                    <div className="space-y-2.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                      {entries.map((entry, i) => (
                        <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04, duration: 0.25 }}>
                          <EntryCard entry={entry} selected={selectedId === entry.id} onClick={() => handleSelectEntry(entry.id)} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>

            {/* Right panel */}
            <ScrollReveal delay={0.08}>
              <div className="rounded-2xl border border-forest-700/40 bg-forest-900/30 p-6 min-h-[28rem]">
                <AnimatePresence mode="wait">
                  {panelMode === 'form' && <NewEntryForm key="form" onSubmit={handleSubmit} onCancel={handleClose} />}
                  {panelMode === 'detail' && selectedEntry && <EntryDetail key={`detail-${selectedEntry.id}`} entry={selectedEntry} onDelete={handleDelete} onClose={handleClose} />}
                  {panelMode === 'idle' && <RightPanelIdle key="idle" onNew={handleNewEntry} />}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
