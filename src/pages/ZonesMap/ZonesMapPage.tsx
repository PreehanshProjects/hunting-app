import { useState } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { zones } from '../../data/zones'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Info, ArrowRight } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'

// Fix Leaflet marker icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

export default function ZonesMapPage() {
  const [selectedZone, setSelectedZone] = useState<any>(null)
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null)
  const { t } = useTranslation()

  const filteredZones = filterDifficulty
    ? zones.filter(z => z.difficulty === filterDifficulty)
    : zones

  return (
    <PageWrapper>
      <section className="h-[calc(100vh-80px)] relative overflow-hidden flex flex-col md:flex-row">

        {/* Sidebar Filter */}
        <div className="w-full md:w-80 bg-forest-950 border-r border-forest-900 p-8 z-20 flex flex-col">
          <h1 className="text-3xl font-display font-bold italic mb-8">{t('zones.title')}</h1>

          <div className="space-y-8 flex-1">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-4">{t('zones.filter_difficulty')}</h4>
              <div className="flex flex-col gap-2">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setFilterDifficulty(filterDifficulty === d ? null : d)}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold capitalize transition-all text-left flex items-center justify-between ${
                      filterDifficulty === d
                        ? 'bg-forest-600 border-forest-500 text-white'
                        : 'bg-forest-900/40 border-white/5 text-white/40 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {t(`zones.${d}`)}
                    {filterDifficulty === d && <X className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-forest-900/20 border border-white/5 rounded-2xl">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-forest-500" /> {t('zones.legend')}
              </h4>
              <ul className="space-y-2 text-[10px] text-white/40 uppercase tracking-widest">
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> {t('zones.legend_public')}</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> {t('zones.legend_private')}</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> {t('zones.legend_high')}</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">
            {t('zones.legal_note')}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative z-10">
          <MapContainer
            center={[-20.3484, 57.5522]}
            zoom={11}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {filteredZones.map(zone => (
              <Marker
                key={zone.id}
                position={zone.coords}
                eventHandlers={{
                  click: () => setSelectedZone(zone)
                }}
              />
            ))}
            <MapUpdater selectedZone={selectedZone} />
          </MapContainer>

          {/* Zone Detail Drawer */}
          <AnimatePresence>
            {selectedZone && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute top-4 bottom-4 right-4 w-full max-w-sm bg-forest-950/90 backdrop-blur-xl border border-white/10 rounded-3xl z-[1000] p-8 overflow-y-auto"
              >
                <button
                  onClick={() => setSelectedZone(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mt-8">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    selectedZone.isPrivate ? 'bg-amber-600/20 text-amber-500' : 'bg-forest-600/20 text-forest-400'
                  }`}>
                    {selectedZone.isPrivate ? t('zones.private_badge') : t('zones.public_badge')}
                  </span>
                  <h2 className="text-3xl font-display font-bold italic mt-4 mb-2">{selectedZone.name}</h2>
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-8">
                    <MapPin className="w-3 h-3" /> {selectedZone.coords[0].toFixed(4)}, {selectedZone.coords[1].toFixed(4)}
                  </div>

                  <p className="text-white/60 leading-relaxed mb-8">{selectedZone.description}</p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3">{t('zones.density')}</h4>
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-6 w-1.5 rounded-full ${i < selectedZone.animalDensity ? 'bg-forest-500' : 'bg-white/5'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3">{t('zones.species')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedZone.animals.map((a: string) => (
                          <span key={a} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium capitalize">
                            {a.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5">
                    <button className="w-full py-4 bg-forest-600 text-white font-bold rounded-2xl hover:bg-forest-500 transition-all flex items-center justify-center gap-2">
                      {t('zones.access')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageWrapper>
  )
}

function MapUpdater({ selectedZone }: { selectedZone: any }) {
  const map = useMap()
  if (selectedZone) {
    map.flyTo(selectedZone.coords, 13, { duration: 2 })
  }
  return null
}
