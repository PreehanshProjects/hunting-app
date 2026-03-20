import { useState } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChefHat,
  Scissors,
  BookOpen,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Thermometer,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = 'dressing' | 'butchering' | 'recipes' | 'legal'

interface Step {
  number: string
  title: string
  body: string
  icon?: React.ReactNode
  warning?: boolean
  legal?: boolean
}

// ─── Butchering Cuts SVG ──────────────────────────────────────────────────────

function ButcheringDiagramSVG() {
  const cuts = [
    { label: 'Neck', sub: 'Stew / Mince', path: 'M 235 68 Q 258 55 268 65 Q 278 76 272 88 Q 258 96 240 90 Z', cx: 253, cy: 78 },
    { label: 'Shoulder', sub: 'Braise / Slow-cook', path: 'M 195 88 Q 215 70 240 78 Q 248 92 240 110 Q 218 118 196 112 Z', cx: 218, cy: 96 },
    { label: 'Loin / Backstrap', sub: 'Finest cut — sirloin equivalent', path: 'M 120 78 Q 148 68 195 80 Q 196 112 148 118 Q 118 110 116 92 Z', cx: 156, cy: 96 },
    { label: 'Ribs / Rack', sub: 'Marinate & Grill', path: 'M 116 92 Q 118 110 148 118 Q 148 140 116 138 Q 96 128 96 110 Z', cx: 122, cy: 116 },
    { label: 'Hindquarters', sub: 'Rump steaks / Leg roast', path: 'M 54 88 Q 80 68 116 78 Q 116 138 96 140 Q 70 142 50 128 Q 40 112 54 88 Z', cx: 78, cy: 108 },
    { label: 'Offal', sub: 'Liver & Heart — sauté fresh', path: 'M 140 105 Q 158 100 170 110 Q 168 126 150 130 Q 134 126 136 114 Z', cx: 153, cy: 116 },
  ]

  const cutColors: Record<string, string> = {
    'Neck': '#6b4518',
    'Shoulder': '#8b5e2a',
    'Loin / Backstrap': '#3a7a30',
    'Ribs / Rack': '#2a5522',
    'Hindquarters': '#1e7060',
    'Offal': '#8b1a1a',
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        {/* ── Body outline (simplified deer/boar silhouette) ── */}
        {/* Main body torso */}
        <ellipse cx="165" cy="108" rx="118" ry="44" fill="#162b12" stroke="#2a5522" strokeWidth="1.5" />
        {/* Neck */}
        <path d="M 235 68 Q 258 55 268 65 Q 278 76 272 88 Q 258 96 240 90 Z" fill="#1e3d19" stroke="#2a5522" strokeWidth="1.5" />
        {/* Head */}
        <ellipse cx="280" cy="60" rx="26" ry="22" fill="#1e3d19" stroke="#2a5522" strokeWidth="1.5" />
        {/* Antlers suggestion */}
        <path d="M 276 38 L 272 18 M 272 18 L 264 10 M 272 18 L 280 10" stroke="#3a7a30" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M 284 39 L 288 20 M 288 20 L 296 12 M 288 20 L 280 12" stroke="#3a7a30" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        {/* Eye */}
        <circle cx="290" cy="56" r="4" fill="black" opacity="0.6" />
        <circle cx="291" cy="55" r="1.5" fill="white" opacity="0.5" />
        {/* Ear */}
        <path d="M 266 48 Q 254 36 258 26 Q 268 30 272 44 Z" fill="#2a5522" stroke="#2a5522" strokeWidth="1" />
        {/* Front legs */}
        <rect x="216" y="148" width="16" height="36" rx="8" fill="#162b12" stroke="#2a5522" strokeWidth="1.5" />
        <rect x="192" y="148" width="16" height="36" rx="8" fill="#162b12" stroke="#2a5522" strokeWidth="1.5" />
        {/* Rear legs */}
        <rect x="86" y="148" width="16" height="36" rx="8" fill="#162b12" stroke="#2a5522" strokeWidth="1.5" />
        <rect x="62" y="148" width="16" height="36" rx="8" fill="#162b12" stroke="#2a5522" strokeWidth="1.5" />
        {/* Hooves */}
        <ellipse cx="224" cy="184" rx="10" ry="5" fill="#0f1f0c" stroke="#2a5522" strokeWidth="1" />
        <ellipse cx="200" cy="184" rx="10" ry="5" fill="#0f1f0c" stroke="#2a5522" strokeWidth="1" />
        <ellipse cx="94" cy="184" rx="10" ry="5" fill="#0f1f0c" stroke="#2a5522" strokeWidth="1" />
        <ellipse cx="70" cy="184" rx="10" ry="5" fill="#0f1f0c" stroke="#2a5522" strokeWidth="1" />
        {/* Tail */}
        <path d="M 47 100 Q 32 95 30 108 Q 32 118 47 118" fill="#1e3d19" stroke="#2a5522" strokeWidth="1.5" />

        {/* ── Cut zone overlays ── */}
        {cuts.map(cut => (
          <path
            key={cut.label}
            d={cut.path}
            fill={cutColors[cut.label]}
            fillOpacity="0.55"
            stroke={cutColors[cut.label]}
            strokeWidth="1"
            strokeOpacity="0.8"
          />
        ))}

        {/* ── Cut labels ── */}
        {/* Hindquarters */}
        <text x="78" y="100" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Inter, sans-serif" opacity="0.9">Hindquarters</text>
        <text x="78" y="110" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="Inter, sans-serif" opacity="0.65">Rump / Leg roast</text>
        {/* Ribs */}
        <text x="104" y="122" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="bold" fontFamily="Inter, sans-serif" opacity="0.9">Ribs</text>
        {/* Loin */}
        <text x="156" y="90" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Inter, sans-serif" opacity="0.9">Loin / Backstrap</text>
        <text x="156" y="100" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="Inter, sans-serif" opacity="0.65">Finest cut</text>
        {/* Shoulder */}
        <text x="218" y="92" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Inter, sans-serif" opacity="0.9">Shoulder</text>
        <text x="218" y="102" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="Inter, sans-serif" opacity="0.65">Braise / Slow-cook</text>
        {/* Neck */}
        <text x="253" y="75" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="bold" fontFamily="Inter, sans-serif" opacity="0.9">Neck</text>
        {/* Offal — small label with line */}
        <line x1="153" y1="130" x2="166" y2="152" stroke="#8b1a1a" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
        <text x="168" y="158" textAnchor="middle" fill="#f87171" fontSize="6.5" fontWeight="bold" fontFamily="Inter, sans-serif" opacity="0.9">Offal</text>
        <text x="168" y="166" textAnchor="middle" fill="#f87171" fontSize="5" fontFamily="Inter, sans-serif" opacity="0.65">Liver &amp; Heart</text>

        {/* Legend note */}
        <text x="8" y="12" fill="#3a7a30" fontSize="7" fontFamily="Inter, sans-serif" opacity="0.5">Rusa deer / Wild boar — indicative cut zones</text>
      </svg>

      {/* Cut cards below SVG */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {[
          { name: 'Hindquarters', desc: 'Rump steaks, leg roast. Most meat on the animal — the primary prize.', color: '#1e7060' },
          { name: 'Loin / Backstrap', desc: 'Finest cut. Equivalent to beef sirloin. Minimal cooking needed; medallions or whole roast.', color: '#3a7a30' },
          { name: 'Shoulder', desc: 'Best braised or slow-cooked for 4–6 hours. Alternatively mince for sausages.', color: '#8b5e2a' },
          { name: 'Ribs / Rack', desc: 'Marinate overnight. Grill over high heat. Score between bones before marinating.', color: '#2a5522' },
          { name: 'Neck', desc: 'Stew, braise, or mince. High connective tissue melts to gelatine with slow cooking.', color: '#6b4518' },
          { name: 'Offal', desc: 'Liver: sauté in butter with onions within hours of the kill — extremely perishable. Heart: stuff and slow-roast.', color: '#8b1a1a' },
        ].map((cut) => (
          <div
            key={cut.name}
            className="rounded-xl p-3 border"
            style={{ backgroundColor: `${cut.color}18`, borderColor: `${cut.color}40` }}
          >
            <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: cut.color }} />
            <p className="text-xs font-semibold mb-1" style={{ color: cut.color }}>{cut.name}</p>
            <p className="text-[10px] text-white/50 leading-relaxed">{cut.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Field Dressing Steps ─────────────────────────────────────────────────────

const dressingSteps: Step[] = [
  {
    number: '01',
    title: 'Safety First',
    body: 'Confirm the animal is dead before approaching. Walk in from behind, prod with the muzzle of an unloaded (or safe) firearm, and watch carefully for an eye-blink reflex. Clear the firearm and set it to safe. Mark the location on your phone — GPS pin or waypoint — before moving the carcass.',
    icon: <Shield className="w-5 h-5" />,
    warning: true,
  },
  {
    number: '02',
    title: 'Legal Requirement',
    body: 'Under s.19(3) of the Wildlife and National Parks Act, an animal taken under crop-protection authority must be surrendered to the nearest police station. For a licensed hunt: attach your game licence carcass tag to the animal immediately — before any other processing step. Failure to tag constitutes an offence under s.24.',
    icon: <Shield className="w-5 h-5" />,
    legal: true,
  },
  {
    number: '03',
    title: 'Position the Carcass',
    body: 'Lay the animal on its back on a slope with the head uphill — gravity will assist evisceration. If on flat ground, use logs or rocks to prop it. Work quickly: in Mauritius\'s tropical heat, bacterial multiplication in the gut cavity accelerates dramatically within 30 minutes of death.',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    number: '04',
    title: 'Opening Incision',
    body: 'Make a shallow incision from the sternum (breastbone) down to the pelvis. Use two fingers inserted beneath the skin as a guide to lift it away from the underlying organs — this prevents puncturing the stomach or intestines. Keep the blade angled upward and use short, controlled strokes.',
    icon: <Scissors className="w-5 h-5" />,
  },
  {
    number: '05',
    title: 'Evisceration',
    body: 'Carefully roll out the stomach and intestines to one side. Sever the oesophagus near the throat and the rectum near the pelvis, then remove the entire digestive tract as one unit. Recover the liver and heart — both are prized cuts. Inspect the liver: a healthy liver is deep red and firm; spots or unusual colouring indicate disease — discard if in doubt and contact NPCS.',
    icon: <ChefHat className="w-5 h-5" />,
  },
  {
    number: '06',
    title: 'Cooling the Cavity',
    body: 'Prop the body cavity open using a clean stick (30–40 cm) wedged between the ribs. Move the carcass immediately into shade and maximum airflow. If available, pour ice water into the cavity or pack with ice in a bag — this dramatically improves final meat quality. In Mauritius conditions, you have a maximum of 30 minutes before quality begins to degrade.',
    icon: <Thermometer className="w-5 h-5" />,
    warning: true,
  },
  {
    number: '07',
    title: 'Transport',
    body: 'Hang or carry the carcass with the cavity open for airflow. Avoid plastic bags which trap heat. Deliver to a processing location — a cool shed or cold room — within 2–3 hours in tropical conditions. Skinning can wait until the processing location if done within this window. Notify NPCS if required under your licence conditions.',
    icon: <CheckCircle className="w-5 h-5" />,
  },
]

// ─── Recipes ─────────────────────────────────────────────────────────────────

const recipes = [
  {
    number: '01',
    name: 'Braised Rusa Deer Leg',
    origin: 'Classic Mauritius Estate Recipe',
    cut: 'Hindquarter leg — bone-in preferred',
    color: '#3a7a30',
    ingredients: [
      '1 whole deer leg (~2–3 kg)',
      '1 bottle dry red wine (Cabernet or Shiraz)',
      '6 garlic cloves, crushed',
      '4 sprigs fresh thyme',
      '2 bay leaves, 1 sprig rosemary',
      '2 onions, 2 carrots, rough-chopped',
      'Olive oil, salt, black pepper',
    ],
    method: [
      'Marinate the leg overnight (minimum 12 hours) in red wine, garlic, thyme, rosemary, and bay leaves. Refrigerate.',
      'Pat dry. Brown in a heavy casserole in olive oil over high heat — 4–5 minutes per side. Remove and set aside.',
      'Sauté onions and carrots until softened. Deglaze with the reserved marinade.',
      'Return the leg. Cover and braise at 150 °C (or in a slow cooker on low) for 4–5 hours until the meat falls from the bone.',
      'Rest 20 minutes before serving with crushed breadfruit or roast sweet potato.',
    ],
    notes: 'Venison is very lean — braising at low temperature prevents drying. The overnight marinade also helps tenderise older bucks.',
  },
  {
    number: '02',
    name: 'Venison Rougaille',
    origin: 'Mauritian Fusion — Tomato-based Curry',
    cut: 'Backstrap or shoulder, cut into 3 cm cubes',
    color: '#c2410c',
    ingredients: [
      '800 g venison steak, cubed',
      '4 ripe tomatoes, crushed (or 400 g tinned)',
      '3 garlic cloves + 2 cm fresh ginger, pounded to paste',
      '1 large onion, thinly sliced',
      '1 tsp turmeric, 1 tsp cumin seeds',
      'Fresh coriander, green chillies to taste',
      'Salt, oil, 200 ml water',
    ],
    method: [
      'Season venison with salt and brown in hot oil in batches — do not crowd the pan. Set aside.',
      'In the same pan, fry cumin seeds until they pop. Add onion and cook until golden.',
      'Add garlic-ginger paste, fry 2 minutes. Add tomatoes and turmeric; cook until oil separates.',
      'Return venison. Add water, cover, and simmer 45–60 minutes until tender. Venison is done when it flakes easily.',
      'Finish with fresh coriander. Serve with steamed basmati and rougaille bread (baguette).',
    ],
    notes: 'A staple of Mauritius Creole cooking. The tomato-and-ginger base complements the mild gaminess of rusa deer perfectly.',
  },
  {
    number: '03',
    name: 'Wild Boar Vindaye',
    origin: 'Traditional Mauritian Preservation Method',
    cut: 'Shoulder, bone-out, cut into 4 cm pieces',
    color: '#92400e',
    ingredients: [
      '1 kg wild boar shoulder, cubed',
      '150 ml white wine vinegar',
      '1 tsp turmeric, 2 tsp brown mustard seeds',
      '3 dried red chillies, cracked',
      '4 garlic cloves, sliced thin',
      '2 large onions, sliced into rings',
      'Oil, salt',
    ],
    method: [
      'Fry boar pieces in oil until cooked through and slightly caramelised (~15 min). Drain and set aside.',
      'In a clean pan, heat oil. Fry mustard seeds until they pop, then add turmeric, chillies, and garlic for 1 minute.',
      'Add onion rings and fry until just softened — do not caramelise.',
      'Add vinegar and bring to a simmer. Return the boar and stir to coat every piece well.',
      'Cool completely. Store in a sealed jar — vindaye improves over 24–48 hours as the flavours meld. Serve cold or at room temperature.',
    ],
    notes: 'Vindaye was originally a preservation method in a pre-refrigeration climate. The vinegar and turmeric inhibit bacterial growth, making it an ideal field recipe when refrigeration is limited.',
  },
]

// ─── Legal Requirements Data ──────────────────────────────────────────────────

const legalPoints = [
  {
    icon: <Shield className="w-5 h-5" />,
    color: '#3a7a30',
    title: 'Tagging — s.24 Wildlife Act',
    body: 'Every carcass from a licensed hunt must be tagged with the hunter\'s game licence tag before any processing. Tags are single-use and must be secured to the carcass in a way that prevents transfer. Hunting with an expired or forged tag is treated the same as possession without a tag.',
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    color: '#d97706',
    title: 'Crop-Protection Takes — s.19(3)',
    body: 'Animals shot under a crop-protection permit are not the property of the shooter. The entire carcass must be surrendered to the nearest police station or NPCS officer. Retention of any part — including the head, offal, or hide — without written NPCS permission constitutes an offence.',
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    color: '#7c3aed',
    title: 'NPCS Reporting Obligations',
    body: 'Licensed hunters are required to report the take of each animal to the National Parks and Conservation Service within 24 hours. The report must include species, sex, estimated age, GPS location of the kill, and the licence tag number applied. NPCS may conduct carcass inspections.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    color: '#8b1a1a',
    title: 'Poaching — s.28 Seizure Powers',
    body: 'Any wildlife officer or police officer may seize a carcass, vehicle, firearm, or hunting equipment where they reasonably believe an offence under the Act has been committed. Seized items are forfeited to the State. The burden of proving lawful possession rests with the holder. Penalties include fines and imprisonment.',
  },
  {
    icon: <Thermometer className="w-5 h-5" />,
    color: '#2a5522',
    title: 'Hygiene Standards',
    body: 'Venison intended for sale or commercial supply must be processed in an NPCS-approved facility. Home consumption is permitted but must comply with basic food safety standards: carcass temperature below 4 °C within 4 hours of slaughter, or immediate cooking. Diseased animals must not enter the food chain — report to NPCS and the Ministry of Health.',
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    color: '#1e7060',
    title: 'Transport Documentation',
    body: 'When transporting a tagged carcass on a public road, the hunter must carry: the original game licence, a copy of the licence tag number attached to the carcass, and the NPCS take-report acknowledgement (if issued electronically). Police and NPCS have power to stop and inspect at any time.',
  },
]

// ─── Tab Definitions ──────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'dressing', label: 'Field Dressing', icon: <Scissors className="w-4 h-4" /> },
  { key: 'butchering', label: 'Butchering Cuts', icon: <ChefHat className="w-4 h-4" /> },
  { key: 'recipes', label: 'Venison Recipes', icon: <BookOpen className="w-4 h-4" /> },
  { key: 'legal', label: 'Legal Requirements', icon: <Shield className="w-4 h-4" /> },
]

// ─── Step Card Component ──────────────────────────────────────────────────────

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <ScrollReveal delay={index * 0.08}>
      <div
        className={`relative flex gap-5 rounded-2xl p-5 border transition-colors ${
          step.warning
            ? 'bg-amber-900/10 border-amber-600/20'
            : step.legal
            ? 'bg-blood/10 border-blood/20'
            : 'bg-forest-900/50 border-white/5'
        }`}
      >
        {/* Large step number */}
        <div className="hidden md:flex flex-col items-center gap-2 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
            className="text-4xl font-display font-bold italic leading-none select-none"
            style={{ color: step.warning ? '#d97706' : step.legal ? '#8b1a1a' : '#3a7a30', opacity: 0.9 }}
          >
            {step.number}
          </motion.div>
          {/* Connector line — shown when not last */}
          {index < dressingSteps.length - 1 && (
            <div className="w-px flex-1 min-h-[2rem]" style={{ background: 'linear-gradient(to bottom, #2a552240, transparent)' }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {/* Mobile step number */}
            <span
              className="md:hidden text-2xl font-display font-bold italic select-none"
              style={{ color: step.warning ? '#d97706' : step.legal ? '#8b1a1a' : '#3a7a30' }}
            >
              {step.number}
            </span>
            {/* Icon */}
            <div
              className="p-1.5 rounded-lg"
              style={{
                color: step.warning ? '#d97706' : step.legal ? '#f87171' : '#3a7a30',
                backgroundColor: step.warning ? '#d9770618' : step.legal ? '#8b1a1a18' : '#3a7a3018',
              }}
            >
              {step.icon}
            </div>
            <h3
              className="font-display font-bold text-base leading-tight"
              style={{ color: step.warning ? '#fbbf24' : step.legal ? '#fca5a5' : 'white' }}
            >
              {step.title}
            </h3>
            {step.legal && (
              <span className="text-[10px] uppercase tracking-widest font-bold text-red-400 bg-red-900/30 rounded px-2 py-0.5 border border-red-500/30">
                Legal
              </span>
            )}
            {step.warning && (
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400 bg-amber-900/30 rounded px-2 py-0.5 border border-amber-500/30 flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" /> Critical
              </span>
            )}
          </div>
          <p className="text-sm text-white/55 leading-relaxed">{step.body}</p>
        </div>
      </div>
    </ScrollReveal>
  )
}

// ─── Recipe Card ──────────────────────────────────────────────────────────────

function RecipeCard({ recipe, index }: { recipe: typeof recipes[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <ScrollReveal delay={index * 0.1}>
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: `${recipe.color}35`, backgroundColor: `${recipe.color}08` }}
      >
        {/* Header */}
        <button
          className="w-full text-left p-5 flex items-start gap-4"
          onClick={() => setOpen(v => !v)}
        >
          <motion.span
            className="text-5xl font-display font-bold italic leading-none flex-shrink-0 select-none"
            style={{ color: `${recipe.color}50` }}
          >
            {recipe.number}
          </motion.span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: recipe.color }}>
              {recipe.origin}
            </p>
            <h3 className="text-lg font-display font-bold">{recipe.name}</h3>
            <p className="text-xs text-white/40 mt-1">
              <span className="font-mono" style={{ color: `${recipe.color}90` }}>Cut:</span> {recipe.cut}
            </p>
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-white/40 text-2xl leading-none flex-shrink-0 mt-1"
          >
            +
          </motion.div>
        </button>

        {/* Expandable body */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 border-t" style={{ borderColor: `${recipe.color}20` }}>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  {/* Ingredients */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: recipe.color }}>
                      Ingredients
                    </p>
                    <ul className="space-y-1.5">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex gap-2 text-xs text-white/60">
                          <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: recipe.color }} />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Method */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: recipe.color }}>
                      Method
                    </p>
                    <ol className="space-y-2.5">
                      {recipe.method.map((step, i) => (
                        <li key={i} className="flex gap-2.5 text-xs text-white/60">
                          <span
                            className="flex-shrink-0 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold mt-0.5"
                            style={{ backgroundColor: `${recipe.color}30`, color: recipe.color }}
                          >
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                {/* Notes */}
                <div
                  className="mt-4 rounded-xl px-4 py-3 border"
                  style={{ backgroundColor: `${recipe.color}10`, borderColor: `${recipe.color}25` }}
                >
                  <p className="text-xs text-white/50 italic leading-relaxed">
                    <span className="font-semibold not-italic" style={{ color: recipe.color }}>Note: </span>
                    {recipe.notes}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  )
}

// ─── Tab Content ──────────────────────────────────────────────────────────────

function DressingTab() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-white/5" />
          <p className="text-xs text-white/30 uppercase tracking-widest">7 steps · immediately after the shot</p>
          <div className="h-px flex-1 bg-white/5" />
        </div>
      </ScrollReveal>
      {dressingSteps.map((step, i) => (
        <StepCard key={step.number} step={step} index={i} />
      ))}
    </div>
  )
}

function ButcheringTab() {
  return (
    <div className="max-w-4xl mx-auto">
      <ScrollReveal>
        <div className="text-center mb-8">
          <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
            The diagram below shows approximate cut zones for both rusa deer and wild boar.
            Exact yield varies by animal size and condition. Always work with a sharp, clean knife.
          </p>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <div
          className="rounded-2xl border border-white/5 p-6 md:p-10"
          style={{ background: 'radial-gradient(ellipse at center, #162b1230 0%, #0a120880 100%)' }}
        >
          <ButcheringDiagramSVG />
        </div>
      </ScrollReveal>
    </div>
  )
}

function RecipesTab() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-white/5" />
          <p className="text-xs text-white/30 uppercase tracking-widest">3 Mauritius-influenced recipes</p>
          <div className="h-px flex-1 bg-white/5" />
        </div>
      </ScrollReveal>
      {recipes.map((recipe, i) => (
        <RecipeCard key={recipe.number} recipe={recipe} index={i} />
      ))}
    </div>
  )
}

function LegalTab() {
  return (
    <div className="max-w-3xl mx-auto">
      <ScrollReveal>
        <div
          className="rounded-2xl border border-blood/25 bg-blood/8 p-5 mb-8 flex gap-4 items-start"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300 mb-1">Important Disclaimer</p>
            <p className="text-xs text-white/50 leading-relaxed">
              This is a summary guide only. Always consult the full text of the Wildlife and National Parks Act of Mauritius
              and seek advice from the NPCS or a qualified legal practitioner. Legislation changes — verify the current
              version before relying on any provision cited here.
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div className="space-y-4">
        {legalPoints.map((point, i) => (
          <ScrollReveal key={i} delay={i * 0.08}>
            <div
              className="rounded-2xl border p-5 flex gap-4"
              style={{ borderColor: `${point.color}30`, backgroundColor: `${point.color}0c` }}
            >
              <div
                className="p-2 rounded-xl flex-shrink-0 h-fit mt-0.5"
                style={{ color: point.color, backgroundColor: `${point.color}20` }}
              >
                {point.icon}
              </div>
              <div>
                <h4 className="text-sm font-display font-bold mb-1.5" style={{ color: point.color }}>{point.title}</h4>
                <p className="text-xs text-white/55 leading-relaxed">{point.body}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProcessingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('dressing')

  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <section className="relative px-6 pt-16 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(ellipse, #3a7a30 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-forest-500 font-bold uppercase tracking-[0.4em] text-xs"
          >
            Field Guide · Mauritius
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-display font-bold italic mt-4 leading-none"
          >
            Field Dressing,
            <br />
            <span className="text-forest-500">Butchering</span>
            <br />
            <span className="text-3xl md:text-4xl text-white/50">& Venison Guide</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 text-white/45 max-w-2xl leading-relaxed text-sm md:text-base"
          >
            From the moment the animal goes down to the plate — step-by-step field dressing, butchering
            cut reference, Mauritius-inspired venison recipes, and the legal obligations every hunter must know.
          </motion.p>

          {/* Quick stat bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            {[
              { label: '7 Steps', sub: 'Field Dressing', icon: <Scissors className="w-4 h-4" />, color: '#3a7a30' },
              { label: '6 Cuts', sub: 'Butchering Guide', icon: <ChefHat className="w-4 h-4" />, color: '#8b5e2a' },
              { label: '3 Recipes', sub: 'Mauritius Cuisine', icon: <BookOpen className="w-4 h-4" />, color: '#7c3aed' },
              { label: 'Legal', sub: 'Wildlife Act', icon: <Shield className="w-4 h-4" />, color: '#8b1a1a' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 border"
                style={{ borderColor: `${stat.color}30`, backgroundColor: `${stat.color}12` }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
                <div>
                  <p className="text-xs font-bold leading-none" style={{ color: stat.color }}>{stat.label}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <section className="px-6 pb-4 sticky top-20 z-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1 bg-forest-950/90 backdrop-blur border border-white/5 rounded-2xl p-1.5 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0"
                style={{ color: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.4)' }}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tabBg"
                    className="absolute inset-0 rounded-xl bg-forest-800 border border-forest-600/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tab Content ── */}
      <section className="px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'dressing' && <DressingTab />}
            {activeTab === 'butchering' && <ButcheringTab />}
            {activeTab === 'recipes' && <RecipesTab />}
            {activeTab === 'legal' && <LegalTab />}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Bottom CTA / Note ── */}
      <ScrollReveal>
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-2xl border border-forest-600/20 bg-forest-900/30 p-8 flex flex-col md:flex-row gap-6 items-start md:items-center"
            >
              <div className="p-3 rounded-xl bg-forest-800/60 border border-forest-600/20 flex-shrink-0">
                <ChefHat className="w-8 h-8 text-forest-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg mb-1">Respect the Animal, Honour the Harvest</h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  Proper processing is both a legal obligation and a mark of respect for the game. A well-handled
                  carcass is safe to eat, delicious, and honours the effort of the hunt. Poor handling wastes meat
                  and risks health. Take the time to do it right.
                </p>
              </div>
              <div
                className="flex-shrink-0 text-xs font-mono px-4 py-2 rounded-xl border"
                style={{ color: '#3a7a30', borderColor: '#3a7a3030', backgroundColor: '#3a7a3012' }}
              >
                Tag · Cool · Process
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </PageWrapper>
  )
}
