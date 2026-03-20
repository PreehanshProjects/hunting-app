import { PageWrapper } from '../../components/layout/PageWrapper'
import { useAppStore } from '../../store/useAppStore'
import { badges as allBadges } from '../../data/badges'
import { motion } from 'framer-motion'
import { Award, CheckSquare, Edit3, Lock, CheckCircle2 } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { fadeInUp, staggerContainer } from '../../animations/variants'
import { useTranslation } from 'react-i18next'

export default function DashboardPage() {
  const { userName, setUserName, xp, level, badges, checklist, toggleChecklistItem } = useAppStore()
  const { t } = useTranslation()

  const xpProgress = (xp % 200) / 200 * 100

  const chartData = [
    { subject: 'Legal', A: 80, fullMark: 100 },
    { subject: 'Safety', A: 90, fullMark: 100 },
    { subject: 'Ethics', A: 70, fullMark: 100 },
    { subject: 'Tracking', A: 60, fullMark: 100 },
    { subject: 'Gear', A: 85, fullMark: 100 },
  ]

  return (
    <PageWrapper>
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Top: Profile & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-10 bg-forest-900/40 border border-white/5 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-forest-500 to-forest-800 rounded-full flex items-center justify-center text-5xl font-display font-bold italic shadow-[0_0_30px_rgba(58,122,48,0.3)]">
                  {userName[0]}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-glow text-forest-950 text-xs font-bold px-3 py-1 rounded-full border-4 border-forest-950">
                  LVL {level}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-transparent text-4xl font-display font-bold italic focus:outline-none border-b border-transparent focus:border-white/20 w-full max-w-[300px]"
                  />
                  <Edit3 className="w-5 h-5 text-white/20" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <span>{t('dashboard.xp_label')}</span>
                    <span>{xp} / {(level) * 200} {t('dashboard.xp_unit')}</span>
                  </div>
                  <div className="h-3 bg-forest-950 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-forest-500 shadow-[0_0_20px_rgba(58,122,48,0.4)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-forest-900/20 border border-white/5 rounded-[40px] flex flex-col justify-center items-center text-center">
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-6">{t('dashboard.profile_radar')}</h4>
               <div className="w-full h-48">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                     <PolarGrid stroke="rgba(255,255,255,0.1)" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                     <Radar name="Hunter" dataKey="A" stroke="#3a7a30" fill="#3a7a30" fillOpacity={0.6} />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Bottom: Badges & Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Badge Grid */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold italic flex items-center gap-4">
                  <Award className="w-8 h-8 text-amber-glow" /> {t('dashboard.trophy_room')}
                </h2>
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                  {badges.length} / {allBadges.length} {t('dashboard.earned')}
                </span>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {allBadges.map((badge) => {
                  const isEarned = badges.includes(badge.id)
                  return (
                    <motion.div
                      key={badge.id}
                      variants={fadeInUp}
                      className={`relative aspect-square rounded-3xl border flex flex-col items-center justify-center p-6 text-center group transition-all duration-500 ${
                        isEarned
                        ? 'bg-forest-900/40 border-forest-500/50 shadow-[0_0_30px_rgba(58,122,48,0.1)]'
                        : 'bg-white/5 border-white/5 grayscale'
                      }`}
                    >
                      {!isEarned && <Lock className="absolute top-4 right-4 w-4 h-4 text-white/10" />}
                      <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center ${isEarned ? 'bg-forest-800' : 'bg-white/5'}`}>
                         <Award className={`w-8 h-8 ${isEarned ? 'text-forest-400' : 'text-white/10'}`} />
                      </div>
                      <h4 className={`text-xs font-bold mb-1 ${isEarned ? 'text-white' : 'text-white/20'}`}>{badge.name}</h4>
                      <p className="text-[10px] text-white/20 leading-tight group-hover:text-white/40 transition-colors">
                        {isEarned ? badge.description : `${t('dashboard.unlock_at')} ${badge.xpRequired} ${t('dashboard.xp_unit')}`}
                      </p>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>

            {/* Checklist */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold italic flex items-center gap-4">
                  <CheckSquare className="w-8 h-8 text-forest-500" /> {t('dashboard.prehunt')}
                </h2>
              </div>

              <div className="p-8 bg-forest-900/20 border border-white/5 rounded-[40px] space-y-8">
                <ChecklistGroup
                  title={t('dashboard.legal_safety')}
                  items={[
                    { id: 'permit', label: t('dashboard.permit') },
                    { id: 'permission', label: t('dashboard.permission') },
                    { id: 'safety', label: t('dashboard.safety') }
                  ]}
                  checklist={checklist}
                  onToggle={toggleChecklistItem}
                />
                <ChecklistGroup
                  title={t('dashboard.gear_prep')}
                  items={[
                    { id: 'caliber', label: t('dashboard.caliber') },
                    { id: 'optics', label: t('dashboard.optics') },
                    { id: 'weather', label: t('dashboard.weather') }
                  ]}
                  checklist={checklist}
                  onToggle={toggleChecklistItem}
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

function ChecklistGroup({ title, items, checklist, onToggle }: any) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40">{title}</h4>
      <div className="space-y-2">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
              checklist[item.id]
                ? 'bg-forest-600/20 border-forest-500/50 text-white'
                : 'bg-white/5 border-transparent text-white/30 hover:bg-white/10'
            }`}
          >
            <span className="text-sm font-medium">{item.label}</span>
            {checklist[item.id] ? <CheckCircle2 className="w-5 h-5 text-forest-500" /> : <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
          </button>
        ))}
      </div>
    </div>
  )
}
