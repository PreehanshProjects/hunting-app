import { useState, useEffect, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, useInView } from 'framer-motion'
import {
  CheckCircle,
  Circle,
  FileText,
  Shield,
  BookOpen,
  ClipboardList,
  RefreshCw,
  AlertTriangle,
  Phone,
  MapPin,
  ChevronRight,
  Info,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Step {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  items?: string[]
  subNote?: string
}

interface ChecklistItem {
  id: string
  label: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    number: 1,
    icon: <Shield className="w-5 h-5" />,
    title: 'Check Eligibility',
    description:
      'Before starting your application, confirm you meet all legal requirements to hold a game licence in Mauritius.',
    items: [
      'Must be 18 years or older',
      'Must be a Mauritian citizen or resident with valid national ID or residence permit',
      'Must not have a criminal conviction related to firearms or wildlife offences',
      'Must not have had a hunting licence revoked in the past',
    ],
    subNote:
      'Foreign nationals on tourist visas may NOT obtain a game licence.',
  },
  {
    number: 2,
    icon: <FileText className="w-5 h-5" />,
    title: 'Obtain a Firearms Certificate',
    description:
      'If you do not already hold a valid Firearms Certificate, you must apply to the Commissioner of Police, Firearms Licensing Division, Line Barracks, Port Louis. The certificate specifies the make, model, calibre, and serial number of your firearm.',
    items: [
      'Application form (obtainable at Line Barracks)',
      'National ID card — copy and original',
      'Two recent passport-size photographs',
      'Proof of address (utility bill or bank statement)',
      'Medical certificate confirming mental and physical fitness',
      'Police clearance certificate (obtainable from nearest police station)',
      'Safe storage declaration — you must have a locked gun cabinet',
    ],
    subNote:
      'Processing time: 4–8 weeks. Fee: approximately Rs 1,500–2,000 (subject to change).',
  },
  {
    number: 3,
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Complete Hunter Safety Training (Recommended)',
    description:
      'No formal mandatory course is currently required by law, but completing a recognised safety course is strongly recommended. A completion certificate strengthens your licence application.',
    items: [
      'The Mauritius Game & Wildlife Conservation Association (MGWCA) runs periodic safety courses',
      'Safe firearm handling techniques',
      'Wildlife identification and species recognition',
      'Ethical hunting practices and fair chase principles',
      'First aid in the field',
    ],
  },
  {
    number: 4,
    icon: <ClipboardList className="w-5 h-5" />,
    title: 'Apply for a Game Licence',
    description:
      'Submit your application to the Ministry of Agro-Industry & Food Security, Game & Wildlife Division, Réduit. Opening hours: Monday–Friday, 09:00–15:00. The licence specifies the holder, firearm(s) licensed for hunting, permitted species, and validity period (1 year, renewable annually).',
    items: [
      'Completed Game Licence application form',
      'National ID card — copy and original',
      'Valid Firearms Certificate — copy and original',
      'Two recent passport-size photographs',
      'Proof of hunting ground access (letter from private estate OR proof of membership of a licensed hunting club for public areas)',
      'Application fee — approximately Rs 500–1,000 per year (subject to annual revision)',
    ],
  },
  {
    number: 5,
    icon: <Info className="w-5 h-5" />,
    title: 'Understand Your Licence Conditions',
    description:
      'A game licence comes with strict legal conditions. Violating any condition is a criminal offence under the Wildlife & National Parks Act 1993.',
    items: [
      'The licence is personal and non-transferable',
      'Must be carried at all times while hunting',
      'Only the firearm(s) listed on the licence may be used',
      'Only the species listed may be hunted, and only during open season',
      'Private land: a written permission letter from the landowner is required for every hunting trip',
      'Public areas: must comply with Forestry Service zone designations',
    ],
  },
  {
    number: 6,
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Annual Renewal',
    description:
      'Game licences expire on 31 December each year. Hunting without a valid licence is a criminal offence under s.20 of the Wildlife & National Parks Act 1993.',
    items: [
      'Renewal applications must be submitted by 30 November each year',
      'Submit: copy of existing licence, updated firearms certificate if firearm details have changed',
      'Pay the annual renewal fee at the Game & Wildlife Division, Réduit',
    ],
  },
]

const FEES = [
  { doc: 'Firearms Certificate', fee: 'Rs 1,500–2,000', authority: 'Commissioner of Police' },
  { doc: 'Game Licence (Annual)', fee: 'Rs 500–1,000', authority: 'Ministry of Agro-Industry' },
  { doc: 'Police Clearance', fee: 'Rs 50–100', authority: 'Nearest Police Station' },
  { doc: 'Medical Certificate', fee: 'Rs 500–800', authority: 'Private Doctor' },
]

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'nid', label: 'National ID card (copy + original)' },
  { id: 'photo', label: 'Two recent passport-size photographs' },
  { id: 'address', label: 'Proof of address (utility bill or bank statement)' },
  { id: 'medical', label: 'Medical certificate (mental and physical fitness)' },
  { id: 'clearance', label: 'Police clearance certificate' },
  { id: 'storage', label: 'Safe storage declaration (locked gun cabinet)' },
  { id: 'firearms_cert', label: 'Valid Firearms Certificate' },
  { id: 'game_form', label: 'Completed Game Licence application form' },
  { id: 'land_access', label: 'Proof of hunting ground access (estate letter or club membership)' },
  { id: 'safety_cert', label: 'Hunter safety training completion certificate (recommended)' },
]

const CONTACTS = [
  {
    icon: <Shield className="w-5 h-5 text-forest-400" />,
    title: 'Commissioner of Police',
    subtitle: 'Firearms Licensing Division',
    address: 'Line Barracks, Port Louis',
    detail: 'For Firearms Certificate applications',
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-forest-400" />,
    title: 'Ministry of Agro-Industry & Food Security',
    subtitle: 'Game & Wildlife Division',
    address: 'Réduit, Mauritius',
    detail: 'Mon–Fri, 09:00–15:00',
  },
  {
    icon: <BookOpen className="w-5 h-5 text-forest-400" />,
    title: 'Mauritius Game & Wildlife Conservation Association',
    subtitle: 'MGWCA',
    address: 'Mauritius',
    detail: 'Hunter safety training and conservation resources',
  },
]

const STORAGE_KEY = 'rusa_licence_checklist'

// ─── Animated Step Circle ─────────────────────────────────────────────────────

function StepCircle({ number, icon }: { number: number; icon: React.ReactNode }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: inView
            ? 'linear-gradient(135deg, #2a5522, #3a7a30)'
            : 'transparent',
          border: '2px solid #2a5522',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.15 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-forest-500 text-white text-[10px] font-black flex items-center justify-center"
        >
          {number}
        </motion.span>
      </motion.div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LicenceGuidePage() {
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist))
  }, [checklist])

  const toggleItem = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const checkedCount = CHECKLIST_ITEMS.filter(i => checklist[i.id]).length
  const progress = Math.round((checkedCount / CHECKLIST_ITEMS.length) * 100)
  const allDone = checkedCount === CHECKLIST_ITEMS.length

  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/60 to-forest-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-forest-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block text-forest-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-6"
          >
            Official Process · Ministry of Agro-Industry & Food Security
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="font-display font-bold italic text-4xl sm:text-5xl md:text-6xl leading-tight mb-6"
          >
            How to Get Your{' '}
            <span className="text-forest-400">Hunting Licence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            A complete, step-by-step walkthrough of the licensing process in Mauritius — from
            eligibility checks to annual renewal, with all required documents, fees, and contacts.
          </motion.p>
        </div>
      </section>

      {/* ── Timeline Steps ── */}
      <section className="relative max-w-3xl mx-auto px-6 pb-24">
        {/* Vertical timeline line */}
        <div className="absolute left-[43px] top-0 bottom-0 w-px bg-gradient-to-b from-forest-600/60 via-forest-700/30 to-transparent hidden sm:block" />

        <div className="space-y-16">
          {STEPS.map((step, idx) => (
            <ScrollReveal key={step.number} delay={idx * 0.05}>
              <div className="flex gap-6 sm:gap-8">
                <StepCircle number={step.number} icon={step.icon} />

                <div className="flex-1 pt-2 pb-8 border-b border-white/5 last:border-0">
                  <h2 className="font-display font-bold italic text-2xl mb-3 text-white">
                    {step.title}
                  </h2>
                  <p className="text-white/60 leading-relaxed mb-4 text-sm">
                    {step.description}
                  </p>

                  {step.items && (
                    <ul className="space-y-2 mb-4">
                      {step.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                          <ChevronRight className="w-4 h-4 text-forest-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.subNote && (
                    <div className="mt-4 p-4 bg-earth-900/60 border border-earth-700/40 rounded-xl">
                      <p className="text-amber-glow/80 text-xs leading-relaxed flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {step.subNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Fees Summary Table ── */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <ScrollReveal>
          <h2 className="font-display font-bold italic text-3xl mb-8 text-center">
            Estimated Fees Summary
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-forest-900/80 border-b border-white/10">
                  <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-white/40">
                    Document
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-white/40">
                    Approx. Fee
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-white/40 hidden sm:table-cell">
                    Authority
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEES.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 last:border-0 hover:bg-forest-900/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-white/80">{row.doc}</td>
                    <td className="px-6 py-4 text-forest-400 font-mono font-medium">
                      {row.fee}
                    </td>
                    <td className="px-6 py-4 text-white/40 text-xs hidden sm:table-cell">
                      {row.authority}
                    </td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-forest-800/40">
                  <td className="px-6 py-4 font-bold text-white">Total Estimated</td>
                  <td className="px-6 py-4 font-bold text-forest-300 font-mono">
                    Rs 2,550–3,900
                  </td>
                  <td className="px-6 py-4 text-white/20 text-xs hidden sm:table-cell">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-white/30 text-xs mt-3 text-center">
            All fees are approximate and subject to change. Verify current amounts with the relevant authority.
          </p>
        </ScrollReveal>
      </section>

      {/* ── Interactive Checklist ── */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <ScrollReveal>
          <h2 className="font-display font-bold italic text-3xl mb-2 text-center">
            Your Application Checklist
          </h2>
          <p className="text-white/40 text-sm text-center mb-8">
            Track which documents you have ready. Your progress is saved automatically.
          </p>
        </ScrollReveal>

        {/* Progress bar */}
        <ScrollReveal delay={0.1}>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Progress
              </span>
              <span className="text-sm font-bold text-forest-400">
                {checkedCount} / {CHECKLIST_ITEMS.length} complete
              </span>
            </div>
            <div className="h-2 bg-forest-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-forest-600 to-forest-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-1 text-right text-[10px] text-white/20">{progress}%</div>
          </div>
        </ScrollReveal>

        {/* Checklist items */}
        <ScrollReveal delay={0.15}>
          <div className="space-y-2 mb-6">
            {CHECKLIST_ITEMS.map((item) => {
              const checked = !!checklist[item.id]
              return (
                <motion.button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    checked
                      ? 'bg-forest-800/60 border-forest-600/50 text-white'
                      : 'bg-forest-950/60 border-white/5 text-white/60 hover:border-white/10 hover:text-white/80'
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{ scale: checked ? [1.3, 1] : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {checked ? (
                      <CheckCircle className="w-5 h-5 text-forest-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/20 flex-shrink-0" />
                    )}
                  </motion.div>
                  <span className={`text-sm ${checked ? 'line-through text-white/40' : ''}`}>
                    {item.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </ScrollReveal>

        {/* Ready to Apply banner */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="p-6 bg-forest-700/40 border border-forest-500/50 rounded-2xl text-center"
          >
            <CheckCircle className="w-10 h-10 text-forest-400 mx-auto mb-3" />
            <h3 className="font-display font-bold italic text-xl mb-1 text-forest-300">
              Ready to Apply!
            </h3>
            <p className="text-white/50 text-sm">
              You have gathered all required documents. Head to the Game & Wildlife Division in
              Réduit during office hours (Mon–Fri, 09:00–15:00) to submit your application.
            </p>
          </motion.div>
        )}
      </section>

      {/* ── Contacts ── */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <ScrollReveal>
          <h2 className="font-display font-bold italic text-3xl mb-8 text-center">
            Key Contacts
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {CONTACTS.map((c, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="p-6 bg-forest-900/30 border border-white/8 rounded-2xl h-full">
                <div className="w-10 h-10 rounded-xl bg-forest-800/60 border border-forest-700/40 flex items-center justify-center mb-4">
                  {c.icon}
                </div>
                <h3 className="font-bold text-sm text-white mb-1">{c.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-forest-400 font-bold mb-3">
                  {c.subtitle}
                </p>
                <div className="flex items-start gap-2 text-white/40 text-xs mb-2">
                  <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>{c.address}</span>
                </div>
                <div className="flex items-start gap-2 text-white/30 text-xs">
                  <Phone className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>{c.detail}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <ScrollReveal>
          <div className="p-6 bg-earth-900/40 border border-earth-700/30 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-glow/60 flex-shrink-0 mt-0.5" />
            <p className="text-white/40 text-xs leading-relaxed">
              <span className="text-white/60 font-semibold block mb-1">Important Disclaimer</span>
              All fees and procedures described in this guide are approximate and subject to change
              without notice. Always verify current requirements, fees, and documentation directly
              with the relevant authority before submitting any application. This guide is provided
              for informational purposes only and does not constitute legal advice.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </PageWrapper>
  )
}
