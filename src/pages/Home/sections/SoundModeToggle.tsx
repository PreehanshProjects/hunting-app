import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useAppStore } from '../../../store/useAppStore'
import { useTranslation } from 'react-i18next'

export function SoundModeToggle() {
  const { soundEnabled, toggleSound } = useAppStore()
  const { t } = useTranslation()

  return (
    <section className="py-24 px-6 bg-earth-950/30">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            animate={soundEnabled ? { scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] } : { scale: 1, opacity: 0.1 }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-forest-500 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-forest-900 rounded-full border border-forest-800 flex items-center justify-center">
              {soundEnabled ? <Volume2 className="w-8 h-8 text-forest-400" /> : <VolumeX className="w-8 h-8 text-white/30" />}
            </div>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-display font-bold italic mb-6">
          {t('sound.title')}
        </h2>
        <p className="text-white/50 mb-10 max-w-lg mx-auto">
          {t('sound.subtitle')}
        </p>

        <button
          onClick={toggleSound}
          className={`px-10 py-4 rounded-full font-bold transition-all duration-500 ${
            soundEnabled
              ? 'bg-forest-600 text-white shadow-[0_0_30px_rgba(58,122,48,0.4)]'
              : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
          }`}
        >
          {soundEnabled ? t('sound.enabled') : t('sound.enable')}
        </button>
      </div>
    </section>
  )
}
