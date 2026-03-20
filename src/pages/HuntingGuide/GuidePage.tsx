import { useState, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { guideSections } from '../../data/guides'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BookOpen, Compass, Shield, Target, Footprints, CheckCircle, Save } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { useTranslation } from 'react-i18next'

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState(guideSections[0].id)
  const { toggleSavedGuide, savedGuides, addXP } = useAppStore()
  const { t } = useTranslation()
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const handleSave = (id: string) => {
    toggleSavedGuide(id)
    if (!savedGuides.includes(id)) addXP(5)
  }

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <section ref={heroRef} className="relative h-[55vh] overflow-hidden flex items-center justify-center">
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-0 w-full h-[130%] -top-[15%]"
        >
          <img
            src="/common/various-travel-objects-grass.jpg"
            alt="Hunting gear in forest"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-forest-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/50 via-transparent to-forest-950/50" />

        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-10 text-center px-6"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-forest-400 font-bold uppercase tracking-[0.4em] text-xs block mb-6"
          >
            {t('wildlife.tag')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-8xl font-display font-bold italic"
          >
            {t('guide.title')}
          </motion.h1>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest-950 to-transparent" />
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">

          {/* Sidebar Nav */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-12">
              <div>
                <nav className="space-y-1">
                  {guideSections.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id)}
                      className={`w-full text-left px-6 py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                        activeSection === s.id
                          ? 'bg-forest-900/60 text-forest-400 border border-forest-800'
                          : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {t(`guides.${s.id}.title`)}
                      {activeSection === s.id && <motion.div layoutId="guide-dot" className="w-1.5 h-1.5 rounded-full bg-forest-500" />}
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveSection('shot-placement')}
                    className={`w-full text-left px-6 py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-between mt-8 ${
                      activeSection === 'shot-placement'
                        ? 'bg-amber-600/20 text-amber-500 border border-amber-800'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {t('guide.shot_placement')} <Target className="w-4 h-4" />
                  </button>
                </nav>
              </div>

              <div className="p-6 bg-forest-900/20 border border-white/5 rounded-2xl">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-4">Your Progress</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-forest-800 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-forest-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{savedGuides.length} {t('guide.sections_saved')}</p>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t('guide.saved_label')}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-24">
            {activeSection === 'shot-placement' ? (
              <ShotPlacementSection />
            ) : (
              <div className="space-y-24">
                {guideSections.filter(s => s.id === activeSection).map(section => {
                  const sectionTitle = t(`guides.${section.id}.title`)
                  const sectionContent = t(`guides.${section.id}.content`, { returnObjects: true }) as Array<{title: string, text: string}>
                  return (
                    <div key={section.id} className="space-y-16">
                      <div className="flex items-center justify-between">
                        <h2 className="text-5xl md:text-6xl font-display font-bold italic">{sectionTitle}</h2>
                        <button
                          onClick={() => handleSave(section.id)}
                          className={`flex items-center gap-2 px-6 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${
                            savedGuides.includes(section.id)
                            ? 'bg-forest-600 border-forest-500 text-white'
                            : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {savedGuides.includes(section.id) ? <CheckCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                          {savedGuides.includes(section.id) ? t('guide.saved') : t('guide.save')}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {sectionContent.map((item, i) => (
                          <ScrollReveal key={i} delay={i * 0.1}>
                            <div className="p-10 bg-forest-900/20 border border-white/5 rounded-3xl space-y-6">
                              <div className="w-12 h-12 bg-forest-800 rounded-xl flex items-center justify-center">
                                {section.id === 'beginner-basics' && <Footprints className="w-6 h-6 text-forest-400" />}
                                {section.id === 'advanced-tactics' && <Compass className="w-6 h-6 text-forest-400" />}
                                {section.id === 'safety-first' && <Shield className="w-6 h-6 text-forest-400" />}
                              </div>
                              <h3 className="text-2xl font-bold italic">{item.title}</h3>
                              <p className="text-white/60 leading-relaxed">{item.text}</p>
                            </div>
                          </ScrollReveal>
                        ))}
                      </div>
                    </div>
                  )
                })}

                <GearExplorer />
              </div>
            )}
          </main>
        </div>
      </section>
    </PageWrapper>
  )
}

function ShotPlacementSection() {
  const { t } = useTranslation()

  return (
    <div className="space-y-16">
      <h2 className="text-5xl md:text-6xl font-display font-bold italic">{t('guide.shot_title')}</h2>
      <p className="text-white/60 text-xl leading-relaxed max-w-2xl font-body">
        {t('guide.shot_subtitle')}
      </p>

      <div className="p-12 bg-forest-900/40 border border-white/5 rounded-[40px] flex flex-col items-center">
        <div className="relative w-full max-w-2xl aspect-[1.5/1] bg-white/5 rounded-2xl flex items-center justify-center group overflow-hidden">
          <svg viewBox="0 0 200 200" className="w-64 h-64 text-white/10 fill-current group-hover:scale-110 transition-transform duration-1000" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="110" rx="40" ry="30" />
            <ellipse cx="100" cy="75" rx="18" ry="18" />
            <rect x="93" y="88" width="14" height="20" rx="4" />
            <rect x="80" y="138" width="10" height="30" rx="4" />
            <rect x="110" y="138" width="10" height="30" rx="4" />
            <rect x="86" y="155" width="9" height="22" rx="4" />
            <rect x="105" y="155" width="9" height="22" rx="4" />
            <line x1="92" y1="62" x2="75" y2="35" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <line x1="108" y1="62" x2="125" y2="35" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <line x1="75" y1="35" x2="65" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <line x1="125" y1="35" x2="135" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-32 rounded-full border-2 border-forest-500/50 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-forest-500 rounded-full" />
             </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-[100px] h-[100px] bg-forest-500/20 blur-2xl rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
          <div className="p-6 border border-forest-500/20 rounded-2xl">
            <h5 className="text-forest-400 font-bold uppercase tracking-widest text-[10px] mb-2">{t('guide.primary_label')}</h5>
            <p className="font-display italic text-lg mb-2">{t('guide.primary_name')}</p>
            <p className="text-white/40 text-xs">{t('guide.primary_desc')}</p>
          </div>
          <div className="p-6 border border-amber-500/20 rounded-2xl">
            <h5 className="text-amber-500 font-bold uppercase tracking-widest text-[10px] mb-2">{t('guide.secondary_label')}</h5>
            <p className="font-display italic text-lg mb-2">{t('guide.secondary_name')}</p>
            <p className="text-white/40 text-xs">{t('guide.secondary_desc')}</p>
          </div>
          <div className="p-6 border border-blood/20 rounded-2xl">
            <h5 className="text-blood font-bold uppercase tracking-widest text-[10px] mb-2">{t('guide.avoid_label')}</h5>
            <p className="font-display italic text-lg mb-2">{t('guide.avoid_name')}</p>
            <p className="text-white/40 text-xs">{t('guide.avoid_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GearExplorer() {
  const { t } = useTranslation()

  const gear = [
    { name: t('guide.gear_bolt'), category: t('guide.gear_category_weaponry'), desc: t('guide.gear_bolt_desc') },
    { name: t('guide.gear_bino'), category: t('guide.gear_category_optics'), desc: t('guide.gear_bino_desc') },
    { name: t('guide.gear_kit'), category: t('guide.gear_category_processing'), desc: t('guide.gear_kit_desc') }
  ]

  return (
    <div className="space-y-12 pt-24 border-t border-white/5">
      <h2 className="text-4xl font-display font-bold italic">{t('guide.gear_title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gear.map((item, i) => (
          <div key={i} className="p-8 bg-forest-900/20 border border-white/5 rounded-2xl">
            <span className="text-[10px] uppercase tracking-widest font-bold text-forest-500 mb-2 block">{item.category}</span>
            <h4 className="text-xl font-bold mb-4">{item.name}</h4>
            <p className="text-white/40 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
