import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import {
  MapPin,
  Plus,
  X,
  Calendar,
  StickyNote,
  Eye,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'

// ─── Fix Leaflet default icon ────────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl

// ─── Types ───────────────────────────────────────────────────────────────────
type AnimalType = 'Rusa Deer' | 'Wild Boar' | 'Hare' | 'Macaque' | 'Other'

interface Sighting {
  id: string
  animal: AnimalType
  date: string
  lat: number
  lng: number
  notes: string
  createdAt: number
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'hunting_app_sightings_v2'

const MAURITIUS_CENTER: [number, number] = [-20.2, 57.55]

const ANIMAL_OPTIONS: AnimalType[] = [
  'Rusa Deer',
  'Wild Boar',
  'Hare',
  'Macaque',
  'Other',
]

const ANIMAL_COLORS: Record<AnimalType, string> = {
  'Rusa Deer': '#22c55e',
  'Wild Boar': '#f97316',
  Hare: '#eab308',
  Macaque: '#a78bfa',
  Other: '#94a3b8',
}

const ANIMAL_BADGE: Record<AnimalType, string> = {
  'Rusa Deer': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Wild Boar': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Hare: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Macaque: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  Other: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_SIGHTINGS: Sighting[] = [
  {
    id: 'seed-1',
    animal: 'Rusa Deer',
    date: '2026-03-18',
    lat: -20.1654,
    lng: 57.4891,
    notes: 'Herd of 6 near the river edge, early morning.',
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 'seed-2',
    animal: 'Wild Boar',
    date: '2026-03-17',
    lat: -20.3212,
    lng: 57.6134,
    notes: 'Two boars crossing the trail at dusk.',
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: 'seed-3',
    animal: 'Hare',
    date: '2026-03-15',
    lat: -20.2478,
    lng: 57.5043,
    notes: 'Spotted in open grassland near sugar cane field.',
    createdAt: Date.now() - 6 * 86400000,
  },
  {
    id: 'seed-4',
    animal: 'Macaque',
    date: '2026-03-14',
    lat: -20.1903,
    lng: 57.578,
    notes: 'Group of 12 in the forest canopy, very active.',
    createdAt: Date.now() - 7 * 86400000,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function createDivIcon(animal: AnimalType): L.DivIcon {
  const color = ANIMAL_COLORS[animal]
  return L.divIcon({
    className: '',
    html: `<div style="
      width:26px;height:26px;
      background:${color};
      border:3px solid rgba(255,255,255,0.85);
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,0.55);
    "></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -30],
  })
}

function loadSightings(): Sighting[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED_SIGHTINGS
    const parsed: Sighting[] = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_SIGHTINGS
  } catch {
    return SEED_SIGHTINGS
  }
}

function saveSightings(sightings: Sighting[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sightings))
  } catch {
    // quota exceeded — ignore
  }
}

function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

// ─── Map Click Handler ────────────────────────────────────────────────────────
interface MapClickHandlerProps {
  active: boolean
  onMapClick: (lat: number, lng: number) => void
}

function MapClickHandler({ active, onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      if (active) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

// ─── Map Recenter ─────────────────────────────────────────────────────────────
function MapRecenter({ center }: { center: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.4 })
    }
  }, [center, map])
  return null
}

// ─── Form State ───────────────────────────────────────────────────────────────
interface FormState {
  animal: AnimalType
  date: string
  lat: string
  lng: string
  notes: string
}

const defaultForm = (): FormState => ({
  animal: 'Rusa Deer',
  date: todayISO(),
  lat: '',
  lng: '',
  notes: '',
})

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SightingsPage() {
  const [sightings, setSightings] = useState<Sighting[]>(loadSightings)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [pickingOnMap, setPickingOnMap] = useState(false)
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null)
  const [showList, setShowList] = useState(true)
  const [filterAnimal, setFilterAnimal] = useState<AnimalType | 'All'>('All')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    saveSightings(sightings)
  }, [sightings])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setForm(f => ({ ...f, lat: lat.toFixed(6), lng: lng.toFixed(6) }))
    setPickingOnMap(false)
  }, [])

  const handleOpenModal = () => {
    setForm(defaultForm())
    setFormError(null)
    setPickingOnMap(false)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setPickingOnMap(false)
  }

  const handleSubmit = () => {
    const lat = parseFloat(form.lat)
    const lng = parseFloat(form.lng)

    if (!form.date) { setFormError('Please enter a date.'); return }
    if (isNaN(lat) || isNaN(lng)) {
      setFormError('Please set a location — click the map or enter coordinates.')
      return
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setFormError('Coordinates are out of valid range.')
      return
    }

    const newSighting: Sighting = {
      id: `sighting-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      animal: form.animal,
      date: form.date,
      lat,
      lng,
      notes: form.notes.trim(),
      createdAt: Date.now(),
    }

    setSightings(prev => [newSighting, ...prev])
    setShowModal(false)
    setPickingOnMap(false)
    setFlyTo([lat, lng])
    setTimeout(() => setFlyTo(null), 3500)
  }

  const handleDeleteSighting = (id: string) => {
    setSightings(prev => prev.filter(s => s.id !== id))
  }

  const handleFocusSighting = (s: Sighting) => {
    setFlyTo([s.lat, s.lng])
    setTimeout(() => setFlyTo(null), 3500)
  }

  const filteredSightings =
    filterAnimal === 'All'
      ? sightings
      : sightings.filter(s => s.animal === filterAnimal)

  return (
    <PageWrapper>
      {/* ── Header ── */}
      <section className="px-4 sm:px-8 lg:px-16 pt-8 pb-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">
                Community Reports
              </p>
              <h1 className="text-4xl sm:text-5xl font-display font-bold italic leading-tight">
                Wildlife Sightings
              </h1>
              <p className="text-white/50 text-sm mt-2 max-w-md">
                Log and explore recent animal sightings across Mauritius. Click "Add Sighting",
                then pin a location on the map or enter coordinates manually.
              </p>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-6 py-3 bg-forest-600 hover:bg-forest-500 text-white font-bold rounded-2xl transition-all shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-5 h-5" />
              Add Sighting
            </button>
          </div>
        </ScrollReveal>

        {/* ── Animal filter pills ── */}
        <ScrollReveal delay={0.06}>
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <Filter className="w-3.5 h-3.5 text-white/30" />
            {(['All', ...ANIMAL_OPTIONS] as const).map(a => (
              <button
                key={a}
                onClick={() => setFilterAnimal(a)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  filterAnimal === a
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
                style={
                  filterAnimal === a && a !== 'All'
                    ? {
                        borderColor: ANIMAL_COLORS[a as AnimalType],
                        color: ANIMAL_COLORS[a as AnimalType],
                      }
                    : {}
                }
              >
                {a === 'All' ? `All (${sightings.length})` : a}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Map + Sidebar ── */}
      <section className="px-4 sm:px-8 lg:px-16 pb-12 flex flex-col xl:flex-row gap-6">

        {/* Map */}
        <ScrollReveal className="flex-1 min-w-0">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 h-[60vh] min-h-[380px]">
            {pickingOnMap && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-forest-700/95 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xl border border-forest-500/50 flex items-center gap-2 pointer-events-none select-none">
                <MapPin className="w-4 h-4" />
                Click the map to pin a location
              </div>
            )}

            <MapContainer
              center={MAURITIUS_CENTER}
              zoom={10}
              className="w-full h-full"
              zoomControl
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />

              <MapClickHandler
                active={pickingOnMap && showModal}
                onMapClick={handleMapClick}
              />
              <MapRecenter center={flyTo} />

              {filteredSightings.map(s => (
                <Marker
                  key={s.id}
                  position={[s.lat, s.lng]}
                  icon={createDivIcon(s.animal)}
                >
                  <Popup>
                    <div
                      style={{
                        background: '#0d1a0e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        minWidth: '170px',
                        color: 'white',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: ANIMAL_COLORS[s.animal],
                          marginBottom: '5px',
                        }}
                      >
                        {s.animal}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>
                        {s.date}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: s.notes ? '8px' : '0' }}>
                        {formatCoords(s.lat, s.lng)}
                      </div>
                      {s.notes && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.55)',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                            paddingTop: '8px',
                            marginTop: '4px',
                          }}
                        >
                          {s.notes}
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteSighting(s.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          marginTop: '10px',
                          width: '100%',
                          padding: '5px 0',
                          fontSize: '11px',
                          color: '#f87171',
                          background: 'rgba(239,68,68,0.12)',
                          border: '1px solid rgba(239,68,68,0.25)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Hint bar */}
            {!pickingOnMap && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
                <div className="flex items-center gap-2 px-4 py-2 bg-forest-950/80 backdrop-blur-sm border border-white/10 rounded-full text-xs text-white/40">
                  <MapPin className="w-3 h-3 text-forest-400" />
                  {filteredSightings.length} sighting{filteredSightings.length !== 1 ? 's' : ''} shown
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Right panel */}
        <ScrollReveal delay={0.1} className="xl:w-80 shrink-0 flex flex-col gap-4">

          {/* Sightings List */}
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <button
              onClick={() => setShowList(v => !v)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-forest-400" />
                <span className="text-sm font-bold">Recent Sightings</span>
                <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                  {filteredSightings.length}
                </span>
              </div>
              {showList
                ? <ChevronUp className="w-4 h-4 text-white/40" />
                : <ChevronDown className="w-4 h-4 text-white/40" />
              }
            </button>

            <AnimatePresence initial={false}>
              {showList && (
                <motion.div
                  key="list"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="divide-y divide-white/5 max-h-[460px] overflow-y-auto">
                    {filteredSightings.length === 0 && (
                      <div className="px-6 py-10 text-center text-white/30 text-sm">
                        No sightings yet.
                        <br />
                        <span className="text-white/20 text-xs">Add the first one!</span>
                      </div>
                    )}
                    <AnimatePresence>
                      {filteredSightings.map(s => (
                        <motion.div
                          key={s.id}
                          layout
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          transition={{ duration: 0.18 }}
                          className="px-5 py-4 hover:bg-white/5 transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span
                                className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-1.5 ${ANIMAL_BADGE[s.animal]}`}
                              >
                                {s.animal}
                              </span>
                              <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                                <Calendar className="w-3 h-3" />
                                {s.date}
                              </div>
                              <div className="flex items-center gap-1 text-white/30 text-xs">
                                <MapPin className="w-3 h-3" />
                                {formatCoords(s.lat, s.lng)}
                              </div>
                              {s.notes && (
                                <p className="text-white/45 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                                  {s.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleFocusSighting(s)}
                                title="Focus on map"
                                className="w-7 h-7 rounded-lg bg-forest-600/20 hover:bg-forest-600/40 flex items-center justify-center transition-colors"
                              >
                                <MapPin className="w-3.5 h-3.5 text-forest-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteSighting(s.id)}
                                title="Delete"
                                className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                              >
                                <X className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Legend */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-3">Legend</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
              {ANIMAL_OPTIONS.map(a => (
                <div key={a} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: ANIMAL_COLORS[a] }}
                  />
                  <span className="text-xs text-white/60">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Add Sighting Modal ── */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[2000]"
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 44, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 44, scale: 0.97 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-md bg-[#0d1a0e] border border-white/10 rounded-3xl z-[2100] shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-display font-bold italic">New Sighting</h2>
                  <p className="text-white/40 text-xs mt-0.5">Log a wildlife sighting in Mauritius</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-7 py-6 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* Animal */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">
                    Animal
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ANIMAL_OPTIONS.map(a => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, animal: a }))}
                        className="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                        style={
                          form.animal === a
                            ? {
                                borderColor: ANIMAL_COLORS[a],
                                color: ANIMAL_COLORS[a],
                                background: ANIMAL_COLORS[a] + '22',
                              }
                            : {
                                borderColor: 'rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.4)',
                                background: 'rgba(255,255,255,0.04)',
                              }
                        }
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">
                    <Calendar className="w-3 h-3" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    max={todayISO()}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-forest-500 transition-colors [color-scheme:dark]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">
                    <MapPin className="w-3 h-3" />
                    Location
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Latitude"
                      value={form.lat}
                      step="any"
                      onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-forest-500 transition-colors"
                    />
                    <input
                      type="number"
                      placeholder="Longitude"
                      value={form.lng}
                      step="any"
                      onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-forest-500 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPickingOnMap(v => !v)}
                    className="w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2"
                    style={
                      pickingOnMap
                        ? { background: 'rgba(34,197,94,0.1)', borderColor: '#22c55e', color: '#86efac' }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }
                    }
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {pickingOnMap ? 'Click the map to pin…' : 'Pick on Map'}
                  </button>
                  {form.lat && form.lng && !isNaN(parseFloat(form.lat)) && !isNaN(parseFloat(form.lng)) && (
                    <p className="text-[10px] text-forest-400 mt-1.5 text-center">
                      Pinned: {parseFloat(form.lat).toFixed(5)}, {parseFloat(form.lng).toFixed(5)}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">
                    <StickyNote className="w-3 h-3" />
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Behaviour, terrain, group size…"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-forest-500 transition-colors resize-none"
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {formError && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
                    >
                      {formError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal footer */}
              <div className="px-7 pb-7 pt-2 flex gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-sm font-bold text-white/50 hover:text-white hover:border-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-2xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Save Sighting
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Leaflet popup dark skin ── */}
      <style>{`
        .leaflet-popup-content-wrapper,
        .leaflet-popup-tip {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-close-button {
          color: rgba(255,255,255,0.4) !important;
          top: 12px !important;
          right: 12px !important;
        }
        .leaflet-popup-close-button:hover {
          color: white !important;
        }
      `}</style>
    </PageWrapper>
  )
}
