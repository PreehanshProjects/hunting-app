import { useState } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  AlertTriangle,
  ChevronDown,
  Heart,
  Droplets,
  Bug,
  Flame,
  Wind,
  Eye,
  Activity,
  Footprints,
  Package,
  CheckCircle,
} from 'lucide-react'

// ─── Animated heartbeat SVG ───────────────────────────────────────────────────

function HeartbeatLine() {
  return (
    <svg
      viewBox="0 0 800 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0 50 L 100 50 L 130 50 L 145 15 L 165 80 L 185 5 L 205 95 L 225 50 L 260 50 L 280 50 L 310 50 L 340 50 L 355 15 L 375 80 L 395 5 L 415 95 L 435 50 L 470 50 L 490 50 L 520 50 L 550 50 L 565 15 L 585 80 L 605 5 L 625 95 L 645 50 L 680 50 L 800 50"
        stroke="#8b1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
      />
      {/* Faint echo line */}
      <motion.path
        d="M 0 50 L 100 50 L 130 50 L 145 15 L 165 80 L 185 5 L 205 95 L 225 50 L 260 50 L 280 50 L 310 50 L 340 50 L 355 15 L 375 80 L 395 5 L 415 95 L 435 50 L 470 50 L 490 50 L 520 50 L 550 50 L 565 15 L 585 80 L 605 5 L 625 95 L 645 50 L 680 50 L 800 50"
        stroke="#8b1a1a"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.25}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.18 }}
        transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 0.3 }}
      />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type Severity = 'critical' | 'urgent' | 'general'

type Scenario = {
  id: string
  severity: Severity
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  steps: string[]
  warning?: string
  note?: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'firearm-accident',
    severity: 'critical',
    icon: AlertTriangle,
    title: 'Firearm Accident',
    subtitle: 'Penetrating wound / gunshot',
    steps: [
      'Call 999 immediately — do not delay.',
      'Apply firm, direct pressure to the wound using the cleanest material available (bandage, clothing). Maintain constant pressure — do NOT release to check.',
      'Do NOT remove any embedded objects — this can cause catastrophic haemorrhage. Pack around the object to stabilise it.',
      'Keep the victim absolutely still. Suspected spinal injury from a fall must not be moved unless there is an immediate life threat (fire, water).',
      'Treat for shock: if no spinal injury suspected, lay flat and elevate legs 20–30 cm to maintain blood pressure to vital organs.',
      'Keep the victim warm with an emergency blanket — hypothermia accelerates blood loss.',
      'Reassure and monitor breathing continuously until emergency services arrive.',
      'If a tourniquet is available and the wound is a limb with life-threatening arterial bleeding: apply 5–8 cm above the wound, tighten until bleeding stops, note the time on the tourniquet or skin.',
    ],
    warning: 'Do NOT remove embedded objects. Do NOT allow the victim to walk or stand. Do NOT give food or water.',
  },
  {
    id: 'anaphylaxis',
    severity: 'critical',
    icon: Bug,
    title: 'Anaphylactic Shock',
    subtitle: 'Severe allergic reaction — bee / wasp sting',
    steps: [
      'Call 999 immediately.',
      'Administer EpiPen (adrenaline auto-injector) if available — inject into outer mid-thigh, hold for 10 seconds.',
      'Lay the victim flat with legs raised (unless they are having difficulty breathing — in that case, allow them to sit upright).',
      'Loosen all tight clothing around the neck, chest and waist.',
      'If breathing stops or the victim loses consciousness, begin CPR (30 chest compressions : 2 rescue breaths).',
      'A second EpiPen may be given after 5–15 minutes if symptoms do not improve.',
      'Keep the victim still and warm. Do NOT allow them to stand up — anaphylaxis can cause sudden cardiovascular collapse.',
      'Inform paramedics of the time of EpiPen administration and the number of doses given.',
    ],
    warning: 'Signs: sudden rash or hives, swelling of throat/face/lips, wheezing or difficulty breathing, rapid weak pulse, dizziness or collapse. Act within minutes — anaphylaxis is rapidly fatal without adrenaline.',
  },
  {
    id: 'dog-boar-wound',
    severity: 'urgent',
    icon: Activity,
    title: 'Dog Bite / Boar Tusk Wound',
    subtitle: 'Puncture, laceration — tetanus & rabies risk',
    steps: [
      'Control bleeding with direct pressure using a clean dressing.',
      'Once bleeding is controlled, irrigate the wound thoroughly with large volumes of clean (ideally running) water for at least 5 minutes. Remove visible debris gently.',
      'Apply an antiseptic wipe or solution if available.',
      'Cover with a sterile dressing. Do NOT close the wound with tape or sutures — puncture wounds need to drain.',
      'Seek medical attention within 4 hours. Tetanus prophylaxis is required if vaccination is not up to date.',
      'If a dog is involved: note the animal\'s details for veterinary follow-up. Rabies is absent from Mauritius, but the protocol remains to report all dog bites to the veterinary authority.',
      'Boar tusks carry heavy bacterial contamination — IV antibiotics are frequently required. Do not delay hospital assessment.',
    ],
    note: 'Mauritius is officially rabies-free as of current records, but all animal bite wounds carry serious infection risk and must be evaluated by a doctor promptly.',
  },
  {
    id: 'heat-exhaustion',
    severity: 'urgent',
    icon: Flame,
    title: 'Heat Exhaustion / Heatstroke',
    subtitle: 'Hyperthermia — tropical hunting environment',
    steps: [
      'Move the victim out of direct sun into shade or a cool area immediately.',
      'Remove excess clothing, hat, and body armour/vest.',
      'Apply cool wet cloths to the neck, armpits, and groin — the major pulse points where surface arteries cool blood rapidly.',
      'Fan the victim vigorously to accelerate evaporative cooling.',
      'If conscious and able to swallow: encourage slow, small sips of cool water or an oral rehydration solution. Do NOT force fluids.',
      'Lay the victim down with legs slightly elevated if they feel faint.',
      'Call 999 if: the victim loses consciousness, has a seizure, stops sweating despite continuing to feel very hot (classic heatstroke), is confused or combative.',
      'Monitor temperature and consciousness every 2–3 minutes until help arrives.',
    ],
    warning: 'Heatstroke (hot, dry skin, confusion, no sweating) is a life-threatening emergency. Call 999 immediately and cool aggressively. Do NOT give aspirin or paracetamol — they are ineffective against hyperthermia.',
    note: "Mauritius's tropical humidity significantly reduces the body's ability to cool by sweating. Start hydrating before and during the hunt — do not wait until thirsty.",
  },
  {
    id: 'snake-bite',
    severity: 'urgent',
    icon: Wind,
    title: 'Snake Bite',
    subtitle: 'Envenomation — seek hospital immediately',
    steps: [
      'Keep the victim calm and as still as possible — movement accelerates venom spread through the lymphatic system.',
      'Do NOT cut, suck, squeeze, or apply a tourniquet to the bite site. These measures are harmful.',
      'Immobilise the bitten limb: apply a firm (not tight) bandage from the bite site upward, then immobilise with a splint below heart level.',
      'Remove any jewellery, watches or tight clothing near or distal to the bite site — swelling may be severe.',
      'Using a pen, mark the outline of any swelling or redness on the skin and note the time.',
      'Note the time of the bite and take a photograph of the snake if safe to do so — do NOT attempt to catch or handle it.',
      'Transport to the nearest hospital without delay. The Sir Seewoosagur Ramgoolam National Hospital (Pamplemousses) is the primary antivenom-capable centre.',
      'Remain with the victim and monitor breathing and consciousness continuously.',
    ],
    note: "Mauritius's native snakes (e.g. Boaedon fuliginosus, Ramphotyphlops braminus) are non-venomous. However, the exotic Boa constrictor is present in some areas and can cause severe mechanical injury. Treat all snake bites seriously and get medical assessment — do not assume the species was harmless.",
  },
  {
    id: 'twisted-ankle',
    severity: 'general',
    icon: Footprints,
    title: 'Twisted Ankle',
    subtitle: 'Sprain or fracture — rocky terrain',
    steps: [
      'R — Rest: stop all activity immediately and sit or lie down.',
      'I — Ice / Cold: apply a cold pack, cold-water-soaked cloth, or cold stream water to the ankle for 20 minutes. This reduces swelling and pain.',
      'C — Compression: apply a firm (not tight) elastic bandage from the toes up to mid-calf to reduce swelling. Check regularly that circulation is not impaired — toes should remain pink and warm.',
      'E — Elevation: raise the leg above heart level to reduce blood pooling and swelling.',
      'If the ankle cannot bear any weight, there is point tenderness over bone, or there is significant deformity: suspect a fracture. Splint in the position found using sticks or a SAM splint from your kit.',
      'Do NOT attempt to walk on a suspected fracture. Arrange evacuation.',
    ],
    note: 'Mauritius hunting terrain includes rocky volcanic ridges and plantation forestry slopes — ankle injuries are the most common field injury. Wear proper ankle-supporting boots.',
  },
  {
    id: 'eye-injury',
    severity: 'general',
    icon: Eye,
    title: 'Eye Injury',
    subtitle: 'Twig, debris, or foreign body',
    steps: [
      'Do NOT rub the eye — rubbing can embed the object deeper or scratch the cornea.',
      'If you can see the object on the white of the eye or inner eyelid: flush with large volumes of clean water or saline for at least 15 minutes, directing the stream from the inner corner outward.',
      'Do not attempt to remove an object embedded in the cornea (coloured part of the eye) — cover loosely with a clean eye pad and seek urgent medical attention.',
      'After flushing: cover the eye loosely with a clean pad. Do NOT apply pressure.',
      'Seek medical attention even if the eye feels clear after flushing — corneal scratches are not visible without specialist equipment.',
    ],
    warning: 'If a penetrating injury is suspected (sharp object, pellet), do NOT flush. Cover both eyes loosely (to prevent sympathetic movement) and go to hospital immediately.',
  },
  {
    id: 'dehydration',
    severity: 'general',
    icon: Droplets,
    title: 'Dehydration',
    subtitle: 'Fluid deficit — tropical climate',
    steps: [
      'Move to shade and rest immediately.',
      'Drink water or oral rehydration solution (ORS) slowly in small sips — do not chug large volumes as this can cause vomiting.',
      'Eat salty snacks if available (crackers, nuts) — sodium helps retain water and replace electrolytes lost through sweat.',
      'Loosen clothing and fan to aid cooling.',
      'Mild dehydration (thirst, dark yellow urine, dry mouth): rest and rehydrate over 30–60 minutes.',
      'Escalate to URGENT and call 999 if: victim becomes confused, stops urinating, urine is very dark brown or absent, loses consciousness, or has a rapid weak pulse.',
    ],
    warning: 'In Mauritius\'s tropical climate, a hunter can lose 1–2 litres of sweat per hour on active drives. Carry at least 2 litres of water per person per half-day hunt. Water purification tablets allow use of stream water if supplies run out.',
    note: 'Prevent dehydration: drink 500 ml before the hunt begins. Urine should be pale yellow — not clear (over-hydration) and not dark (dehydration).',
  },
]

const EMERGENCY_NUMBERS = [
  {
    number: '999',
    label: 'Police / Ambulance / Fire',
    description: 'Primary emergency dispatch — use for all life-threatening emergencies',
    priority: true,
  },
  {
    number: '114',
    label: 'SAMU',
    description: 'Service d\'Aide Médicale Urgente — dedicated medical emergency response',
    priority: true,
  },
  {
    number: '115',
    label: 'Fire Brigade',
    description: 'National Fire Service — also assists with forest fire and rescue',
    priority: false,
  },
  {
    number: 'A&E',
    label: 'SSR National Hospital',
    description: 'Sir Seewoosagur Ramgoolam National Hospital, Pamplemousses — nearest major A&E and trauma centre',
    priority: false,
  },
]

const KIT_ITEMS = [
  'Sterile wound dressings (various sizes)',
  'Combat application tourniquet (CAT)',
  'EpiPen (adrenaline auto-injector)',
  'SAM splint (foldable)',
  'Emergency mylar blanket',
  'Whistle (3 blasts = distress signal)',
  'Signalling mirror',
  'Water purification tablets',
  'Antihistamine tablets',
  'Antiseptic wipes',
  'Blister plasters',
  'Laminated emergency contact card',
]

// ─── Severity config ─────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; dot: string; border: string; bg: string; headerBg: string; textColor: string }
> = {
  critical: {
    label: 'CRITICAL',
    dot: 'bg-blood',
    border: 'border-blood/40',
    bg: 'bg-red-950/30',
    headerBg: 'bg-red-950/50',
    textColor: 'text-red-400',
  },
  urgent: {
    label: 'URGENT',
    dot: 'bg-amber-fire',
    border: 'border-amber-fire/30',
    bg: 'bg-earth-900/30',
    headerBg: 'bg-earth-800/50',
    textColor: 'text-amber-glow',
  },
  general: {
    label: 'GENERAL',
    dot: 'bg-forest-600',
    border: 'border-forest-700/30',
    bg: 'bg-forest-950/40',
    headerBg: 'bg-forest-900/50',
    textColor: 'text-forest-500',
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: Severity }) {
  const cfg = SEVERITY_CONFIG[severity]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${cfg.border} ${cfg.textColor} ${cfg.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  )
}

function AccordionCard({ scenario }: { scenario: Scenario }) {
  const [open, setOpen] = useState(scenario.severity === 'critical')
  const cfg = SEVERITY_CONFIG[scenario.severity]
  const IconComp = scenario.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border overflow-hidden ${cfg.border}`}
    >
      {/* Header — always visible, tap to expand */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left px-6 py-5 flex items-center gap-4 transition-colors ${cfg.headerBg} hover:brightness-110`}
        aria-expanded={open}
      >
        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border}`}
        >
          <IconComp className={`w-5 h-5 ${cfg.textColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <SeverityBadge severity={scenario.severity} />
          </div>
          <h3 className="text-base font-bold leading-tight">{scenario.title}</h3>
          <p className="text-white/40 text-xs mt-0.5">{scenario.subtitle}</p>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </button>

      {/* Body — collapsible */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`px-6 pb-6 pt-2 space-y-5 ${cfg.bg}`}>
              {/* Numbered steps */}
              <ol className="space-y-3">
                {scenario.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${cfg.border} ${cfg.textColor} ${cfg.bg} mt-0.5`}
                    >
                      {i + 1}
                    </span>
                    <p className="text-white/70 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>

              {/* Warning box */}
              {scenario.warning && (
                <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-800/40 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300/80 text-xs leading-relaxed">{scenario.warning}</p>
                </div>
              )}

              {/* Note box */}
              {scenario.note && (
                <div className="flex items-start gap-3 p-4 bg-white/4 border border-white/8 rounded-xl">
                  <Heart className="w-4 h-4 text-forest-500 shrink-0 mt-0.5" />
                  <p className="text-white/50 text-xs leading-relaxed italic">{scenario.note}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FirstAidPage() {
  const criticalScenarios = SCENARIOS.filter((s) => s.severity === 'critical')
  const urgentScenarios = SCENARIOS.filter((s) => s.severity === 'urgent')
  const generalScenarios = SCENARIOS.filter((s) => s.severity === 'general')

  return (
    <PageWrapper>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-forest-950 pt-8 pb-16 px-6">
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="fa-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fa-grid)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-blood font-black uppercase tracking-[0.4em] text-xs block mb-5 text-center"
          >
            Hunter's Emergency Reference
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-8xl font-display font-black italic uppercase text-center mb-4"
          >
            Field First Aid
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-white/40 text-sm text-center max-w-lg mx-auto mb-8"
          >
            Emergency protocols, evacuation priorities, and kit essentials for hunting in
            Mauritius. Keep this page accessible — seconds matter.
          </motion.p>

          {/* Heartbeat line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-2xl mx-auto h-16 mb-2"
          >
            <HeartbeatLine />
          </motion.div>
        </div>
      </section>

      {/* ── Emergency numbers ────────────────────────────────────────────── */}
      <section className="bg-red-950/25 border-y border-blood/30 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <Phone className="w-5 h-5 text-blood" />
              <h2 className="text-xs font-black uppercase tracking-[0.35em] text-blood">
                Mauritius Emergency Numbers
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EMERGENCY_NUMBERS.map((item) => (
                <motion.div
                  key={item.number}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-colors ${
                    item.priority
                      ? 'bg-red-950/50 border-blood/50 shadow-[0_0_20px_rgba(139,26,26,0.12)]'
                      : 'bg-forest-950/60 border-white/8'
                  }`}
                >
                  <div
                    className={`shrink-0 min-w-[56px] text-center py-2 px-3 rounded-xl font-display font-black italic text-xl ${
                      item.priority
                        ? 'bg-blood/20 text-red-300 border border-blood/40'
                        : 'bg-white/5 text-white/60 border border-white/10'
                    }`}
                  >
                    {item.number}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.label}</p>
                    <p className="text-white/40 text-xs mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Scenario accordion sections ───────────────────────────────────── */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto space-y-14">

          {/* Critical */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-blood animate-pulse" />
                <h2 className="text-lg font-black uppercase tracking-[0.3em] text-red-400">
                  Critical — Call 999 First
                </h2>
              </div>
            </ScrollReveal>
            <div className="space-y-4">
              {criticalScenarios.map((s) => (
                <AccordionCard key={s.id} scenario={s} />
              ))}
            </div>
          </div>

          {/* Urgent */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-fire" />
                <h2 className="text-lg font-black uppercase tracking-[0.3em] text-amber-glow">
                  Urgent — Seek Medical Attention Today
                </h2>
              </div>
            </ScrollReveal>
            <div className="space-y-4">
              {urgentScenarios.map((s) => (
                <AccordionCard key={s.id} scenario={s} />
              ))}
            </div>
          </div>

          {/* General */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-forest-600" />
                <h2 className="text-lg font-black uppercase tracking-[0.3em] text-forest-500">
                  General — Field Treatment
                </h2>
              </div>
            </ScrollReveal>
            <div className="space-y-4">
              {generalScenarios.map((s) => (
                <AccordionCard key={s.id} scenario={s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Kit essentials ────────────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-forest-900/15 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-forest-500" />
              <h2 className="text-xs font-black uppercase tracking-[0.35em] text-forest-500">
                Field Kit Essentials
              </h2>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold italic mb-2">
              12 Items Every Hunter Should Carry
            </h3>
            <p className="text-white/35 text-sm mb-8">
              A compact first-aid kit weighing under 1 kg can mean the difference between a
              manageable incident and a fatality in Mauritius's remote hunting terrain.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {KIT_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-forest-950/50 border border-white/6 rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 text-forest-500 shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── General safety reminder ───────────────────────────────────────── */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="p-8 bg-forest-900/20 border border-white/5 rounded-3xl flex flex-col md:flex-row items-start gap-5">
              <Heart className="w-8 h-8 text-blood shrink-0 mt-1" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-forest-500 mb-2">
                  Prevention Before Treatment
                </p>
                <p className="text-white/55 text-sm leading-relaxed">
                  The best first aid is avoiding the emergency entirely. Hunt with a buddy,
                  carry a charged mobile phone, share your location and expected return time
                  with someone off-site, wear appropriate footwear on rocky terrain, and stay
                  hydrated. Know the nearest road or track to your position before the hunt
                  begins — not when you need to evacuate.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-16" />
    </PageWrapper>
  )
}
