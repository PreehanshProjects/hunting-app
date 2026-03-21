import { useState } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Wrench,
  Droplets,
  Package,
  Archive,
  CheckCircle2,
  AlertTriangle,
  CircleDot,
  Layers,
  Wind,
  Flame,
  Lock,
  Thermometer,
  ChevronRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionType = 'bolt' | 'semi' | 'pump' | 'double'

interface CleaningStep {
  icon: React.ComponentType<{ className?: string }>
  title: string
  detail: string
  warning?: string
}

interface ActionGuide {
  id: ActionType
  label: string
  tagline: string
  steps: CleaningStep[]
}

interface FrequencyRow {
  interval: string
  badge: 'every' | 'monthly' | 'annual'
  tasks: string[]
}

interface SupplyItem {
  name: string
  purpose: string
  icon: React.ComponentType<{ className?: string }>
}

interface StorageTip {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  accent?: boolean
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ACTION_GUIDES: ActionGuide[] = [
  {
    id: 'bolt',
    label: 'Bolt-Action',
    tagline: 'Most reliable action for Mauritian deer stalking',
    steps: [
      {
        icon: ShieldCheck,
        title: 'Unload & Verify Safe',
        detail:
          'Open the bolt and visually inspect the chamber. Remove the magazine. Point in a safe direction. Confirm twice — once by eye, once by finger.',
        warning: 'Never skip this step. Treat every firearm as loaded until proven otherwise.',
      },
      {
        icon: Layers,
        title: 'Remove the Bolt',
        detail:
          'Press the bolt-release button (if fitted) while lifting and withdrawing the bolt fully from the receiver. Set the receiver safely aside.',
      },
      {
        icon: CircleDot,
        title: 'Clean the Barrel',
        detail:
          'Run a dry patch through the bore first. Follow with a bore brush (brass) soaked in CLP, then alternate dry and oiled patches until patches emerge clean.',
      },
      {
        icon: Wrench,
        title: 'Clean the Bolt',
        detail:
          'Wipe the bolt body, locking lugs, and bolt face with a clean cloth. Use a small brush on the extractor claw and firing-pin channel. Remove old oil and fouling.',
      },
      {
        icon: Droplets,
        title: 'Oil Lightly',
        detail:
          'Apply a very thin film of CLP or gun oil to locking lugs, bolt body, and a single patch down the bore. In tropical Mauritius humidity, less oil is better to avoid fouling.',
        warning: 'Excess oil attracts dust and can cause misfires. One drop per surface is enough.',
      },
      {
        icon: Archive,
        title: 'Reassemble',
        detail:
          'Reinsert the bolt, ensuring it indexes into the receiver correctly. Reattach the magazine. Confirm the safety is on.',
      },
      {
        icon: CheckCircle2,
        title: 'Function Check',
        detail:
          'With an empty chamber, cycle the bolt fully several times. Engage and disengage the safety. Dry-fire only if safe and approved for your specific rifle.',
      },
    ],
  },
  {
    id: 'semi',
    label: 'Semi-Auto',
    tagline: 'Gas or recoil operated — requires thorough action cleaning',
    steps: [
      {
        icon: ShieldCheck,
        title: 'Unload & Verify Safe',
        detail:
          'Remove the magazine, lock the bolt open, and visually and physically inspect the chamber. Semi-autos can retain a round after magazine removal.',
        warning: 'Always remove the magazine before racking the bolt. The round in the chamber will eject.',
      },
      {
        icon: Layers,
        title: 'Field Strip',
        detail:
          "Follow the manufacturer's takedown procedure to separate: upper/lower receiver (or receiver and barrel assembly), bolt carrier group, charging handle, and recoil spring.",
      },
      {
        icon: CircleDot,
        title: 'Clean the Barrel & Gas Port',
        detail:
          'Patch and brush the bore as with bolt-action. For gas-operated guns, clean the gas tube and piston with a dedicated brush to remove carbon buildup.',
      },
      {
        icon: Wrench,
        title: 'Clean the Bolt Carrier Group',
        detail:
          'Scrape carbon from the bolt carrier, bolt tail, and gas rings. Use a nylon or bronze brush on the bolt face and extractor. Clean the firing pin channel with a solvent-soaked patch.',
      },
      {
        icon: Droplets,
        title: 'Oil Lightly',
        detail:
          'Lubricate the bolt carrier rails, bolt cam pin, and charging-handle channel. A thin wipe of oil on the barrel extension. Avoid the gas tube interior.',
        warning: 'Over-lubrication in humid Mauritius heat causes carbon to cake faster. Use sparingly.',
      },
      {
        icon: Archive,
        title: 'Reassemble',
        detail:
          'Reverse the takedown steps. Ensure the bolt carrier seats fully, the recoil spring is seated correctly, and takedown pins are fully seated.',
      },
      {
        icon: CheckCircle2,
        title: 'Function Check',
        detail:
          'Lock the bolt back, release with the bolt catch, and ride the charging handle forward. Check safety engages and disengages. Perform a trigger function check per manual.',
      },
    ],
  },
  {
    id: 'pump',
    label: 'Pump Shotgun',
    tagline: 'Reliable and common for driven Mauritius boar hunts',
    steps: [
      {
        icon: ShieldCheck,
        title: 'Unload & Verify Safe',
        detail:
          'Cycle all shells out of the magazine tube by operating the action. Check the chamber visually and by hand. Depress any remaining shells in the tube.',
        warning: 'Pump shotguns can retain shells in the magazine tube after cycling. Count your rounds.',
      },
      {
        icon: Layers,
        title: 'Field Strip',
        detail:
          'Unscrew the magazine cap and remove the barrel. Slide the forearm and bolt assembly forward and out of the receiver. Separate the trigger group if a deep clean is needed.',
      },
      {
        icon: CircleDot,
        title: 'Clean the Barrel & Choke',
        detail:
          'Run patches and a bore brush through the barrel from breech to muzzle. Remove and brush the choke tube separately. Clean the choke tube threads with a small brush and re-lube lightly before reinstalling.',
      },
      {
        icon: Wrench,
        title: 'Clean the Action Bars & Receiver',
        detail:
          'Wipe the twin action bars clean. Use a nylon brush on the receiver interior to remove powder residue and plastic wad fouling from the chamber area.',
      },
      {
        icon: Droplets,
        title: 'Oil Lightly',
        detail:
          'Apply a thin wipe to the action bars, bolt rails, and inside the magazine tube. Lightly oil the choke tube threads to prevent seizing in tropical humidity.',
      },
      {
        icon: Archive,
        title: 'Reassemble',
        detail:
          'Reverse disassembly: reinstall the bolt and forearm, slide onto the receiver, attach the barrel, and hand-tighten the magazine cap. Do not overtighten.',
      },
      {
        icon: CheckCircle2,
        title: 'Function Check',
        detail:
          'Cycle the action several times dry. Check the safety. Confirm the action locks up in battery and the trigger resets correctly after each pump.',
      },
    ],
  },
  {
    id: 'double',
    label: 'Double Barrel',
    tagline: 'Side-by-side or over-under — traditional and dependable',
    steps: [
      {
        icon: ShieldCheck,
        title: 'Unload & Verify Safe',
        detail:
          'Break open the action and remove both shells. Visually inspect both chambers. Leave the action open while cleaning.',
        warning: 'Some double barrels have automatic ejectors that can fling fired cases. Keep muzzle pointed safely.',
      },
      {
        icon: Layers,
        title: 'Break Open & Separate',
        detail:
          'With the action open, if the fore-end is detachable, remove it. The barrels will lift clear of the action body. This gives full access to both bores and the action face.',
      },
      {
        icon: CircleDot,
        title: 'Clean Both Barrels',
        detail:
          'Use a cleaning rod with a bore brush sized for the gauge, working through each barrel independently. Follow with alternating solvent and dry patches until clean.',
      },
      {
        icon: Wrench,
        title: 'Clean the Action Face & Ejectors',
        detail:
          'Wipe the standing breech face and both barrel lumps with a cloth. Use a small brush around the firing pins, extractors, and ejector springs. Remove carbon and primer residue.',
      },
      {
        icon: Droplets,
        title: 'Oil Sparingly',
        detail:
          'A single drop of oil on each hinge pin and a wipe inside each barrel is sufficient. Apply a very light coat to the action face. Fine double guns can be damaged by excess oil in the woodwork.',
        warning: 'Never oil the stock wood. Oil rots the wood and weakens the grip of the action.',
      },
      {
        icon: Archive,
        title: 'Reassemble',
        detail:
          'Seat the barrels onto the action, ensuring the locking bolts engage fully when the action is closed. Reattach the fore-end until the Anson latch clicks.',
      },
      {
        icon: CheckCircle2,
        title: 'Function Check',
        detail:
          'Open and close the action several times to confirm smooth lockup. Test both triggers (if double trigger). Test the safety lever. Confirm ejectors or extractors operate correctly.',
      },
    ],
  },
]

const FREQUENCY_ROWS: FrequencyRow[] = [
  {
    interval: 'After Every Use',
    badge: 'every',
    tasks: [
      'Wipe down exterior with a gun cloth',
      'Patch the bore with a lightly oiled patch',
      'Clean the bolt face and extractor',
      'Inspect for visible corrosion or damage',
      'Store unloaded in a clean, dry location',
    ],
  },
  {
    interval: 'Monthly',
    badge: 'monthly',
    tasks: [
      'Full field strip and bore cleaning',
      'Clean trigger group (blow out with compressed air)',
      'Inspect magazine lips, followers, and springs',
      'Check stock screws for tightness',
      'Reapply light coat of CLP to all metal surfaces',
    ],
  },
  {
    interval: 'Annual Deep Clean',
    badge: 'annual',
    tasks: [
      'Complete disassembly including trigger group',
      'Ultrasonic cleaning or solvent bath of metal parts',
      'Inspect crown for damage and barrel for pitting',
      'Replace worn springs and O-rings',
      'Professional inspection recommended for regulated firearms in Mauritius',
    ],
  },
]

const SUPPLIES: SupplyItem[] = [
  {
    name: 'Bore Snake',
    purpose: 'Quick one-pass bore cleaning, ideal for field use after a hunt',
    icon: CircleDot,
  },
  {
    name: 'Cleaning Rod & Jag',
    purpose: 'Calibre-matched rod for patch-pushing; brass jags prevent bore damage',
    icon: Wrench,
  },
  {
    name: 'Cotton Patches',
    purpose: 'Disposable absorbent squares for solvent and oil application',
    icon: Layers,
  },
  {
    name: 'CLP Oil',
    purpose: 'Combined cleaner, lubricant, and protectant — standard for tropical climates',
    icon: Droplets,
  },
  {
    name: 'Brass Bore Brush',
    purpose: 'Removes stubborn powder fouling and copper deposits without scratching',
    icon: Wind,
  },
  {
    name: 'Gun Cloth',
    purpose: 'Silicone-impregnated cloth for final wipe-down and rust prevention',
    icon: ShieldCheck,
  },
]

const STORAGE_TIPS: StorageTip[] = [
  {
    icon: Thermometer,
    title: 'Cool, Dry Location',
    body: 'Mauritius humidity averages 80%+ year-round. Store firearms away from coastal air and direct sunlight. A temperature-stable interior room is ideal.',
    accent: true,
  },
  {
    icon: Lock,
    title: 'Safe & Secure Storage',
    body: 'Mauritian law requires secure storage. A certified gun safe with anti-theft anchoring satisfies both legal and safety requirements. Store ammunition separately.',
  },
  {
    icon: Flame,
    title: 'Dehumidifier Rod',
    body: 'A plug-in dehumidifier rod (Golden Rod or equivalent) inside the gun safe reduces internal humidity to under 50%, preventing rust and mould on timber stocks.',
    accent: true,
  },
  {
    icon: Wind,
    title: 'Avoid Foam-Lined Cases Long-Term',
    body: 'Closed foam cases trap moisture against the metal. Use open gun socks or padded hangers for long-term storage. Only use hard cases for transport.',
  },
  {
    icon: ShieldCheck,
    title: 'Corrosion Prevention Routine',
    body: 'Before storing for longer than two weeks, run an oiled patch through the bore and wipe all external metal. A wax-based protectant (like RIG grease) offers extra protection in sea air.',
  },
  {
    icon: AlertTriangle,
    title: 'Store Unloaded',
    body: 'Always store firearms unloaded with the action open or in a half-cocked position where applicable. Remove magazines. Verify empty before placing in the safe.',
    accent: true,
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-[#0d1a0d] border-b border-[#1e3320]">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[#1a2e1a] border border-[#2a4a2a]">
              <Wrench className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-xs font-semibold tracking-widest text-green-500 uppercase">
              Firearm Care
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Firearm Maintenance
            <span className="text-green-400"> Guide</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            Keep your hunting firearms safe, legal, and reliable in Mauritius's tropical climate.
            Follow these guidelines after every hunt and throughout the season.
          </p>
        </motion.div>
        <motion.div
          className="mt-8 h-px bg-gradient-to-r from-green-500/60 via-green-400/20 to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function ActionTabs({
  selected,
  onSelect,
}: {
  selected: ActionType
  onSelect: (id: ActionType) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTION_GUIDES.map((guide) => (
        <button
          key={guide.id}
          onClick={() => onSelect(guide.id)}
          className={[
            'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            'border focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
            selected === guide.id
              ? 'bg-green-500/15 border-green-500/60 text-green-300'
              : 'bg-[#0f1a0f] border-[#1e3320] text-gray-400 hover:border-green-700 hover:text-gray-200',
          ].join(' ')}
        >
          {selected === guide.id && (
            <motion.span
              layoutId="tab-indicator"
              className="absolute inset-0 rounded-lg bg-green-500/10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative">{guide.label}</span>
        </button>
      ))}
    </div>
  )
}

function StepCard({ step, index, total }: { step: CleaningStep; index: number; total: number }) {
  const Icon = step.icon
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: 'easeOut' }}
      className="flex gap-4 p-4 rounded-xl bg-[#0f1a0f] border border-[#1e3320] hover:border-green-800 transition-colors duration-200"
    >
      <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-0.5">
        <div className="w-7 h-7 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
          <span className="text-xs font-bold text-green-400">{index + 1}</span>
        </div>
        {index < total - 1 && <div className="w-px flex-1 bg-[#1e3320] min-h-[20px]" />}
      </div>
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-green-400 flex-shrink-0" />
          <h4 className="text-sm font-semibold text-white">{step.title}</h4>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{step.detail}</p>
        {step.warning && (
          <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-amber-500/8 border border-amber-500/25">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300 leading-relaxed">{step.warning}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CleaningGuideSection() {
  const [selected, setSelected] = useState<ActionType>('bolt')
  const guide = ACTION_GUIDES.find((g) => g.id === selected)!

  return (
    <section>
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#1a2e1a] border border-[#2a4a2a]">
            <Wrench className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Step-by-Step Cleaning Guide</h2>
            <p className="text-sm text-gray-500">Select your action type below</p>
          </div>
        </div>
        <ActionTabs selected={selected} onSelect={setSelected} />
      </ScrollReveal>

      <div className="mt-4 mb-6 p-3 rounded-lg bg-[#0d1a0d] border border-[#1e3320] flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-green-500 flex-shrink-0" />
        <p className="text-sm text-gray-400 italic">{guide.tagline}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3"
        >
          {guide.steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} total={guide.steps.length} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

const BADGE_STYLES: Record<FrequencyRow['badge'], string> = {
  every: 'bg-green-500/15 text-green-400 border-green-500/30',
  monthly: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  annual: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
}

function FrequencySection() {
  return (
    <ScrollReveal>
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#1a2e1a] border border-[#2a4a2a]">
            <CircleDot className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Cleaning Frequency Guide</h2>
            <p className="text-sm text-gray-500">Know what to do — and when</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#1e3320]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0d1a0d] border-b border-[#1e3320]">
                <th className="text-left px-4 py-3 text-gray-400 font-semibold w-40">Interval</th>
                <th className="text-left px-4 py-3 text-gray-400 font-semibold">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {FREQUENCY_ROWS.map((row, i) => (
                <tr
                  key={row.interval}
                  className={[
                    'border-b border-[#1a2e1a] last:border-0',
                    i % 2 === 0 ? 'bg-[#0f1a0f]' : 'bg-[#0a0f0a]',
                  ].join(' ')}
                >
                  <td className="px-4 py-4 align-top">
                    <span
                      className={[
                        'inline-block px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap',
                        BADGE_STYLES[row.badge],
                      ].join(' ')}
                    >
                      {row.interval}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <ul className="space-y-1.5">
                      {row.tasks.map((task) => (
                        <li key={task} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ScrollReveal>
  )
}

function SuppliesSection() {
  return (
    <ScrollReveal>
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#1a2e1a] border border-[#2a4a2a]">
            <Package className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Essential Cleaning Supplies</h2>
            <p className="text-sm text-gray-500">Build a complete cleaning kit</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUPPLIES.map((item, i) => {
            const Icon = item.icon
            return (
              <ScrollReveal key={item.name} delay={i * 0.06}>
                <div className="flex gap-3 p-4 rounded-xl bg-[#0f1a0f] border border-[#1e3320] hover:border-green-800 transition-colors duration-200 h-full">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white mb-0.5">{item.name}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.purpose}</p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>
    </ScrollReveal>
  )
}

function StorageSection() {
  return (
    <ScrollReveal>
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#1a2e1a] border border-[#2a4a2a]">
            <Archive className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Storage Tips</h2>
            <p className="text-sm text-gray-500">Protecting firearms in Mauritius's tropical climate</p>
          </div>
        </div>

        <div className="mb-5 p-4 rounded-xl bg-amber-500/8 border border-amber-500/25 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-200 leading-relaxed">
            <span className="font-semibold">Mauritius climate alert:</span> High year-round humidity
            (75–90%), salt air near the coast, and rapid temperature swings accelerate corrosion on
            unprotected steel. Consistent storage habits are essential.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STORAGE_TIPS.map((tip, i) => {
            const Icon = tip.icon
            return (
              <ScrollReveal key={tip.title} delay={i * 0.07}>
                <div
                  className={[
                    'p-4 rounded-xl border transition-colors duration-200 h-full',
                    tip.accent
                      ? 'bg-[#0f1a0f] border-green-800/50 hover:border-green-700'
                      : 'bg-[#0f1a0f] border-[#1e3320] hover:border-green-800',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      className={[
                        'w-4 h-4 flex-shrink-0',
                        tip.accent ? 'text-green-400' : 'text-gray-400',
                      ].join(' ')}
                    />
                    <h4 className="text-sm font-semibold text-white">{tip.title}</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{tip.body}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>
    </ScrollReveal>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MaintenancePage() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0a0f0a]">
        <HeroBanner />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">
          {/* 1 — Step-by-step cleaning guide with action type selector */}
          <CleaningGuideSection />

          {/* 2 — Cleaning frequency table */}
          <FrequencySection />

          {/* 3 — Essential supplies */}
          <SuppliesSection />

          {/* 4 — Storage tips */}
          <StorageSection />

          {/* Footer note */}
          <ScrollReveal>
            <div className="pt-4 border-t border-[#1e3320] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Always follow the manufacturer's manual for your specific firearm model. Mauritius
                firearms law requires licensed holders to maintain their weapons in safe working
                order. When in doubt, consult a licensed gunsmith.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageWrapper>
  )
}
