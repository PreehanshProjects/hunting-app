import { useState } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { ScrollReveal } from '../../components/animations/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle,
  Eye,
  Thermometer,
  Users,
  Scissors,
  Wind,
} from 'lucide-react'

// ─── Blood Drop SVG ───────────────────────────────────────────────────────────

function BloodDropSVG({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2 C12 2 4 10 4 15 C4 19.4 7.6 23 12 23 C16.4 23 20 19.4 20 15 C20 10 12 2 12 2 Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M9 16 C9 14.3 10.1 12.8 11.5 12"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  )
}

// ─── Animated Blood Trail Line ────────────────────────────────────────────────

function BloodTrailLine({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 400 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0 24 C 40 24 50 14 80 24 C 110 34 120 19 160 22 C 200 25 210 29 250 22 C 290 15 300 26 340 24 C 365 23 380 24 400 24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.65 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />
      {[60, 130, 200, 270, 340].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={24 + (i % 2 === 0 ? -5 : 7)}
          r={2.5 + (i % 3)}
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ delay: 0.3 + i * 0.22, duration: 0.35 }}
        />
      ))}
    </svg>
  )
}

// ─── SVG Blood Splatter Illustrations ─────────────────────────────────────────

function LungBloodSVG() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="80" cy="68" rx="52" ry="34" fill="#c0392b" opacity="0.55" />
      {[
        [58, 58, 9], [75, 52, 11], [92, 57, 8], [68, 70, 10], [85, 72, 9],
        [100, 62, 7], [50, 68, 8], [78, 62, 6], [95, 75, 8],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="#e74c3c" opacity="0.7" />
          <circle cx={cx} cy={cy} r={(r as number) * 0.55} fill="white" opacity="0.35" />
          <circle cx={(cx as number) - (r as number) * 0.2} cy={(cy as number) - (r as number) * 0.25} r={(r as number) * 0.25} fill="white" opacity="0.5" />
        </g>
      ))}
      {[
        [30, 45, 5], [140, 50, 4], [25, 75, 4], [138, 80, 5], [40, 95, 4],
        [120, 95, 3], [55, 30, 4], [105, 28, 5],
      ].map(([cx, cy, r], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={r} ry={(r as number) * 0.7} fill="#e74c3c" opacity="0.45" />
      ))}
      <ellipse cx="80" cy="65" rx="38" ry="22" fill="#e8b4b8" opacity="0.18" />
    </svg>
  )
}

function LiverBloodSVG() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="80" cy="70" rx="40" ry="24" fill="#4a0e2e" opacity="0.85" />
      <ellipse cx="80" cy="68" rx="28" ry="16" fill="#6b1540" opacity="0.8" />
      {[
        [42, 48, 7], [120, 52, 8], [35, 70, 7], [128, 74, 6],
        [58, 35, 6], [100, 32, 7], [50, 86, 7], [112, 88, 6],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#5c1233" opacity={0.7 - i * 0.03} />
      ))}
      <path d="M 80 46 L 75 26 L 80 30 L 85 26 Z" fill="#5c1233" opacity="0.6" />
      <path d="M 60 72 L 40 68 L 45 74 L 40 78 Z" fill="#5c1233" opacity="0.5" />
    </svg>
  )
}

function GutBloodSVG() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {[
        [80, 75, 8, '#5a6e2a'], [55, 60, 6, '#4e6020'], [100, 58, 5, '#6b7a30'],
        [40, 80, 5, '#4e6020'], [118, 78, 6, '#5a6e2a'], [68, 42, 5, '#4e6020'],
        [92, 38, 4, '#6b7a30'], [50, 90, 4, '#5a6e2a'], [110, 92, 4, '#4e6020'],
      ].map(([cx, cy, r, fill], i) => (
        <circle key={i} cx={cx as number} cy={cy as number} r={r as number} fill={fill as string} opacity={0.7 - i * 0.02} />
      ))}
      <ellipse cx="80" cy="70" rx="22" ry="12" fill="#5a6e2a" opacity="0.3" />
      {[
        [62, 52], [88, 48], [45, 68], [116, 65], [70, 88], [98, 85], [30, 72],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill="#6b7a30" opacity="0.5" />
      ))}
      <polyline
        points="80,102 88,88 72,78 85,62 70,52 80,38"
        stroke="#5a6e2a"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        fill="none"
        opacity="0.35"
      />
    </svg>
  )
}

function MuscleBloodSVG() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {[
        [80, 70, 9], [62, 58, 7], [98, 55, 7], [50, 74, 7], [110, 72, 6],
        [68, 44, 6], [92, 42, 6],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#e53e3e" opacity={0.65 - i * 0.04} />
      ))}
      {[
        [36, 52, 4], [124, 56, 3], [40, 68, 4], [128, 72, 3], [55, 30, 3],
        [108, 28, 3], [30, 80, 3],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#fc4444" opacity={0.4 - i * 0.02} />
      ))}
      <polyline
        points="80,100 92,82 68,72 88,58 65,46 80,30"
        stroke="#e53e3e"
        strokeWidth="1.5"
        strokeDasharray="5 6"
        fill="none"
        opacity="0.4"
      />
    </svg>
  )
}

function HighLungBloodSVG() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="80" cy="68" rx="44" ry="26" fill="#f472b6" opacity="0.3" />
      {[
        [68, 58, 8], [82, 52, 9], [94, 60, 7], [72, 70, 8], [88, 72, 7],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="#f9a8d4" opacity="0.55" />
          <circle cx={cx} cy={cy} r={(r as number) * 0.5} fill="white" opacity="0.4" />
        </g>
      ))}
      {[
        [32, 42, 4], [136, 48, 4], [28, 72, 3], [135, 75, 4], [48, 94, 3],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#f9a8d4" opacity="0.4" />
      ))}
    </svg>
  )
}

function ClearBloodSVG() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {[
        [80, 78, 4], [62, 62, 3], [98, 60, 3],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#94a3b8" opacity={0.55 - i * 0.1} />
      ))}
      {[
        [55, 45], [95, 42], [45, 72], [118, 70], [68, 90], [102, 88],
        [40, 56], [122, 55], [74, 32], [88, 34],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2} fill="#94a3b8" opacity={0.3 - i * 0.015} />
      ))}
      {[[72, 68], [78, 66], [84, 68], [76, 72], [82, 70]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="1.5" ry="3" fill="#aaa" opacity="0.45" transform={`rotate(${i * 18} ${cx} ${cy})`} />
      ))}
      <polyline
        points="80,100 82,88 79,78 81,64 80,52 80,36"
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="3 9"
        fill="none"
        opacity="0.3"
      />
    </svg>
  )
}

// ─── Wound Type Data ──────────────────────────────────────────────────────────

type WoundUrgency = 'immediate' | 'wait' | 'extended'

interface WoundType {
  id: string
  title: string
  subtitle: string
  waitTime: string
  urgency: WoundUrgency
  bloodHex: string
  bloodLabel: string
  bloodDesc: string
  signs: string[]
  actions: string[]
  warning?: string
  SVG: React.FC
}

const WOUND_TYPES: WoundType[] = [
  {
    id: 'heart-lung',
    title: 'Heart / Lung Hit',
    subtitle: 'High-probability lethal shot',
    waitTime: '30 minutes',
    urgency: 'wait',
    bloodHex: '#ef4444',
    bloodLabel: 'Bright Red — Frothy',
    bloodDesc:
      'Oxygenated arterial blood with fine pink foam or air bubbles from lung tissue. Heavy volume, often spattered widely on vegetation.',
    signs: [
      'Animal may run hard then drops within 100–200 m.',
      'Loud cracking sound on impact — rib contact.',
      'Animal kicks or hunches sharply on the shot.',
      'Trail is heavy and consistent from the start.',
    ],
    actions: [
      'Wait 30 minutes before approaching the shot location.',
      'Mark your exact shooting position before moving.',
      'Look for a strong blood trail beginning within 30 m of the shot.',
      'Track confidently — recovery rate is very high.',
      'If the trail stops, check thick cover; the animal likely bedded nearby.',
    ],
    SVG: LungBloodSVG,
  },
  {
    id: 'liver',
    title: 'Liver Hit',
    subtitle: 'Lethal — requires patience',
    waitTime: '4–6 hours',
    urgency: 'extended',
    bloodHex: '#7f1d1d',
    bloodLabel: 'Dark Red — Thick',
    bloodDesc:
      'Dark venous blood, often in large dark pools. May carry small liver tissue fragments. Faint bile smell possible at impact site.',
    signs: [
      'Animal humps its back and walks away slowly at first.',
      'Often beds down within 150–300 m.',
      'Blood trail may start slow and become heavier over distance.',
      'Dark maroon color, sometimes with small tissue pieces.',
    ],
    actions: [
      'Wait a minimum of 4–6 hours — ideally overnight if shot late in the day.',
      'Do NOT pressure the animal; it will bed and die if left undisturbed.',
      'If bumped too soon, it can run kilometres and may not be recovered.',
      'Mark the last blood and grid-search slowly after the wait period.',
      'Check all thick bedding cover along the line of travel.',
    ],
    warning:
      'Pushing a liver-hit animal too soon is the most common cause of lost game. Patience is mandatory.',
    SVG: LiverBloodSVG,
  },
  {
    id: 'gut',
    title: 'Gut Shot',
    subtitle: 'Lethal but demanding — long wait required',
    waitTime: '8–12 hours',
    urgency: 'extended',
    bloodHex: '#78716c',
    bloodLabel: 'Green / Brown — Foul',
    bloodDesc:
      'Gut contents mixed with blood. Unmistakable foul odor at impact site. Green or brown tint, sometimes with visible stomach matter.',
    signs: [
      'Animal hunches severely, may kick out rear legs.',
      'Walks away slowly, often ducking into cover immediately.',
      'Strong smell of stomach contents at the hit site.',
      'Green or brown material visible on vegetation or ground.',
    ],
    actions: [
      'Wait 8–12 hours — overnight is strongly preferred.',
      'Back out immediately and leave the area completely quiet.',
      'Return at dawn the next morning if the shot was taken in the afternoon.',
      'The blood trail is often sparse — rely on disturbed ground and smell.',
      'Check all dense thickets and gullies in the direction of travel.',
      'Wear gloves during recovery — gut contents carry significant bacteria.',
    ],
    warning:
      'A gut-hit animal that is pushed will run for kilometres. Back out, wait, and return with a dog if available.',
    SVG: GutBloodSVG,
  },
  {
    id: 'leg-shoulder',
    title: 'Leg / Shoulder Hit',
    subtitle: 'Non-lethal without follow-up — track promptly',
    waitTime: '1–2 hours, then track hard',
    urgency: 'immediate',
    bloodHex: '#f97316',
    bloodLabel: 'Bright Red — Steady',
    bloodDesc:
      'Bright red blood from muscle or bone. May splatter widely on vegetation at impact height (30–60 cm). Volume decreases over distance.',
    signs: [
      'Animal may stumble or favor a limb immediately.',
      'Blood spatters at impact height on vegetation.',
      'Track pattern changes — irregular stride, dragging marks.',
      'No froth or gut material at the hit site.',
    ],
    actions: [
      'Wait 1–2 hours, then begin aggressive tracking immediately.',
      'Look for bone fragments or hair at the shot site.',
      'The trail will be consistent if a major vessel was hit.',
      'If trail becomes sparse, slow down and use a grid search.',
      'A tracking dog is highly recommended for shoulder wounds.',
      'Consider a follow-up shot if you relocate the animal at close range.',
    ],
    warning:
      'Leg and shoulder hits can result in the animal escaping if tracking is delayed too long. Track promptly.',
    SVG: MuscleBloodSVG,
  },
  {
    id: 'high-lung',
    title: 'High Lung — Pink Frothy',
    subtitle: 'Often dramatic — high recovery rate',
    waitTime: '20–30 minutes',
    urgency: 'wait',
    bloodHex: '#f9a8d4',
    bloodLabel: 'Pink / Frothy — Bubbly',
    bloodDesc:
      'Fine pink foam with air bubbles from upper lung tissue. Lighter in color than a full lung hit but unmistakably frothy.',
    signs: [
      'Animal may drop immediately if spine is clipped.',
      'If spine missed, animal runs but frothy blood appears quickly.',
      'Thin, airy pink blood on vegetation at mid-body height.',
      'May hear a distinct wheezing or whooshing sound after the shot.',
    ],
    actions: [
      'Wait 20–30 minutes to ensure the animal is down.',
      'Approach cautiously from behind — a downed animal may still be dangerous.',
      'Follow the frothy trail — it is unmistakable and consistent.',
      'Recovery is typically rapid if the trail is followed promptly.',
    ],
    SVG: HighLungBloodSVG,
  },
  {
    id: 'muscle-graze',
    title: 'Muscle / Graze Wound',
    subtitle: 'Non-lethal — recovery uncertain',
    waitTime: 'Track immediately — reassess at 200 m',
    urgency: 'immediate',
    bloodHex: '#94a3b8',
    bloodLabel: 'Watery / Clear — Sparse',
    bloodDesc:
      'Light pink or clear fluid from muscle capillaries. Very sparse trail that often disappears within 100–200 m as muscle tissue seals.',
    signs: [
      'Animal shows no immediate reaction or runs off as if unhurt.',
      'Very light blood spatter, often only at the hit site.',
      'Trail disappears within 50–100 m.',
      'No hunching, no slow walk — normal escape behavior.',
    ],
    actions: [
      'Investigate the shot site thoroughly for any sign.',
      'Track as far as the trail allows, marking each drop.',
      'If the trail disappears completely after 100 m with no body, the animal likely survived.',
      'Return the next day and check the area for secondary signs.',
      'Record the shot in your hunting journal — honest self-assessment is essential.',
    ],
    SVG: ClearBloodSVG,
  },
]

// ─── Blood Color Data ─────────────────────────────────────────────────────────

interface BloodColor {
  id: string
  label: string
  hex: string
  meaning: string
  organs: string
  action: string
}

const BLOOD_COLORS: BloodColor[] = [
  {
    id: 'bright-red',
    label: 'Bright Red',
    hex: '#ef4444',
    meaning: 'Oxygenated arterial blood',
    organs: 'Heart, aorta, femoral artery',
    action: 'Wait 30 min. Very high recovery.',
  },
  {
    id: 'dark-red',
    label: 'Dark Red',
    hex: '#7f1d1d',
    meaning: 'Deoxygenated venous blood',
    organs: 'Liver, kidney, veins',
    action: 'Wait 4–6 hours. Do not push.',
  },
  {
    id: 'pink-frothy',
    label: 'Pink / Frothy',
    hex: '#f9a8d4',
    meaning: 'Air-mixed blood from lung tissue',
    organs: 'Lungs (upper zone)',
    action: 'Wait 20–30 min. High recovery.',
  },
  {
    id: 'green-brown',
    label: 'Green / Brown',
    hex: '#78716c',
    meaning: 'Gut contents mixed with blood',
    organs: 'Stomach, intestines, bowel',
    action: 'Wait 8–12 hours. Back out.',
  },
  {
    id: 'watery-clear',
    label: 'Watery / Clear',
    hex: '#94a3b8',
    meaning: 'Muscle serum — superficial wound',
    organs: 'Muscle, subcutaneous tissue',
    action: 'Track immediately. Uncertain.',
  },
]

// ─── Tracking Steps Data ──────────────────────────────────────────────────────

interface TrackingStep {
  number: number
  title: string
  body: string
  icon: React.ComponentType<{ className?: string }>
  tip?: string
}

const TRACKING_STEPS: TrackingStep[] = [
  {
    number: 1,
    title: 'Mark Your Shot Position',
    body: "Immediately after the shot, mark your exact position — a hat on the ground, broken branch, or GPS pin. You will need to return to this point. Note landmarks before you move, and identify the animal's last visible position.",
    icon: MapPin,
    tip: 'Use a bright orange ribbon tied to a branch at eye height — visible at distance even in dense cover.',
  },
  {
    number: 2,
    title: 'Wait the Appropriate Time',
    body: 'Refer to the wound type guide and wait the recommended period without exception. Sit down, keep quiet, and do not let impatience drive you in too early. Note the exact time of the shot. If you hear the animal crash down, still wait 20 minutes.',
    icon: Clock,
    tip: 'Use this time to note wind direction, terrain features, and the direction the animal traveled.',
  },
  {
    number: 3,
    title: 'Examine the Shot Site',
    body: "Walk to where the animal stood at the time of the shot. Look for blood (note color and quantity), hair (color and coarseness indicates hit location), bone fragments, and stomach contents. Note the direction of departure before disturbing anything.",
    icon: Eye,
    tip: 'Hair cut cleanly at both ends = pass-through. Short curled hair = body hit. Long coarse hair = outer legs.',
  },
  {
    number: 4,
    title: 'Follow the Blood Trail',
    body: 'Walk parallel to the trail, not on it. Mark each blood sign with a stick, ribbon, or flagging tape. Keep the last marker in sight as you move forward. If the trail is sparse, get low — blood on grass blades becomes visible at ground level.',
    icon: MapPin,
    tip: 'A head torch at ground level reveals blood on grass and leaf litter far better than ambient daylight.',
  },
  {
    number: 5,
    title: 'Grid Search if the Trail is Lost',
    body: "If blood stops, return to the last confirmed marker. Conduct a grid search in 20-metre sweeps outward from that point. Check gullies, thickets, and water sources — wounded animals often seek water. In Mauritius's terrain, work downhill.",
    icon: Eye,
    tip: "Wounded animals almost always move downhill. Check all gullies and stream lines in Mauritius's volcanic terrain.",
  },
  {
    number: 6,
    title: 'Call for Help or a Dog',
    body: 'If the trail goes cold after a thorough search, do not continue alone. Contact other hunters, a tracking dog handler, or the estate manager. Mark the last blood with GPS coordinates and a physical marker before leaving the area.',
    icon: Users,
  },
]

// ─── Recovery Tips Data ───────────────────────────────────────────────────────

interface RecoveryTip {
  id: string
  title: string
  body: string
  icon: React.ComponentType<{ className?: string }>
}

const RECOVERY_TIPS: RecoveryTip[] = [
  {
    id: 'weather',
    title: 'Weather and Time Pressure',
    body: "In Mauritius's tropical climate, meat deterioration begins within 2–3 hours in warm, humid conditions. Once the animal is found, begin field dressing within 30 minutes. If temperatures exceed 28°C, work quickly. A light cloud cover extends your window slightly but do not rely on it.",
    icon: Thermometer,
  },
  {
    id: 'dogs',
    title: 'Using Tracking Dogs',
    body: 'A well-trained tracking dog can follow a scent trail with no visible blood for hundreds of metres. Contact the dog handler before your hunt if possible and have the number saved. The dog should be brought in at the last confirmed blood — not sent in blind from the shooting position.',
    icon: Wind,
  },
  {
    id: 'approach',
    title: 'Approaching a Downed Animal',
    body: 'Always approach from behind, watching the eyes. Open, glazed eyes indicate death. A closed eye or blinking eye means the animal is alive and potentially dangerous — especially boar. Touch the open eye lightly with a stick; no reaction confirms death. Never step over a downed animal.',
    icon: Eye,
  },
  {
    id: 'field-dressing',
    title: 'Field Dressing After Recovery',
    body: 'Remove the entrails first to allow the carcass to cool from the inside. Avoid puncturing the stomach or intestines — gut contamination ruins meat rapidly. Prop the chest cavity open with a stick for airflow. In Mauritius, getting the carcass to processing or ice within 4 hours is the target.',
    icon: Scissors,
  },
  {
    id: 'reporting',
    title: 'Reporting and Legal Requirements',
    body: 'Under Mauritius hunting regulations, all harvested game must be reported to the estate manager or hunt organiser. If you cannot recover an animal before dark, mark the last blood with GPS coordinates and a physical marker. Return at first light and notify the estate — they may assist with a dog or additional trackers.',
    icon: Users,
  },
]

// ─── Urgency Config ───────────────────────────────────────────────────────────

const URGENCY_CONFIG: Record<
  WoundUrgency,
  { label: string; dot: string; border: string; bg: string; headerBg: string; textColor: string }
> = {
  immediate: {
    label: 'TRACK NOW',
    dot: 'bg-amber-400',
    border: 'border-amber-600/40',
    bg: 'bg-amber-950/25',
    headerBg: 'bg-amber-950/40',
    textColor: 'text-amber-400',
  },
  wait: {
    label: 'SHORT WAIT',
    dot: 'bg-green-500',
    border: 'border-green-700/40',
    bg: 'bg-green-950/25',
    headerBg: 'bg-green-950/40',
    textColor: 'text-green-400',
  },
  extended: {
    label: 'LONG WAIT',
    dot: 'bg-red-500',
    border: 'border-red-700/40',
    bg: 'bg-red-950/25',
    headerBg: 'bg-red-950/40',
    textColor: 'text-red-400',
  },
}

// ─── Wound Accordion Card ─────────────────────────────────────────────────────

function WoundCard({ wound, defaultOpen = false }: { wound: WoundType; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const cfg = URGENCY_CONFIG[wound.urgency]
  const WoundSVG = wound.SVG

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border overflow-hidden ${cfg.border}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left px-6 py-5 flex items-center gap-4 transition-colors ${cfg.headerBg} hover:brightness-110`}
        aria-expanded={open}
      >
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border"
          style={{ borderColor: `${wound.bloodHex}40`, backgroundColor: `${wound.bloodHex}18` }}
        >
          <BloodDropSVG color={wound.bloodHex} size={22} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${cfg.border} ${cfg.textColor} ${cfg.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
              {cfg.label}
            </span>
          </div>
          <h3 className="text-base font-bold leading-tight">{wound.title}</h3>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-white/40 text-xs">{wound.subtitle}</p>
            <span className="text-white/20 text-xs">·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-white/30" />
              <span className="text-white/35 text-xs font-mono">{wound.waitTime}</span>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`px-6 pb-6 pt-4 space-y-5 ${cfg.bg}`}>
              {/* SVG + Blood color description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div
                  className="rounded-xl p-4 border flex items-center justify-center aspect-video"
                  style={{ borderColor: `${wound.bloodHex}25`, backgroundColor: `${wound.bloodHex}08` }}
                >
                  <div className="w-32 h-24">
                    <WoundSVG />
                  </div>
                </div>
                <div
                  className="rounded-xl p-4 border flex flex-col justify-between"
                  style={{ borderColor: `${wound.bloodHex}35`, backgroundColor: `${wound.bloodHex}10` }}
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <BloodDropSVG color={wound.bloodHex} size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: wound.bloodHex }}>
                        {wound.bloodLabel}
                      </span>
                    </div>
                    <p className="text-white/55 text-xs leading-relaxed">{wound.bloodDesc}</p>
                  </div>
                  <div className="mt-3 h-6">
                    <BloodTrailLine color={wound.bloodHex} />
                  </div>
                </div>
              </div>

              {/* Field signs */}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-2.5">
                  Field Signs at Impact Site
                </p>
                <ul className="space-y-1.5">
                  {wound.signs.map((sign, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                        style={{ backgroundColor: wound.bloodHex }}
                      />
                      <span className="text-white/60 text-xs leading-relaxed">{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-2.5">
                  Recommended Actions
                </p>
                <ol className="space-y-2">
                  {wound.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${cfg.border} ${cfg.textColor} ${cfg.bg} mt-0.5`}
                      >
                        {i + 1}
                      </span>
                      <p className="text-white/65 text-xs leading-relaxed">{action}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Warning */}
              {wound.warning && (
                <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-800/40 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300/80 text-xs leading-relaxed">{wound.warning}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Blood Colors Section ─────────────────────────────────────────────────────

function BloodColorsSection() {
  return (
    <section className="py-16 px-6 bg-[#080c08]/70 border-y border-white/5">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.35em] text-red-400">
              Blood Trail Color Guide
            </h2>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold italic mb-2">
            What the Color Tells You
          </h3>
          <p className="text-white/35 text-sm mb-10 max-w-2xl">
            Blood color is the fastest diagnostic available at the shot site. Identify it
            accurately before deciding how long to wait and how aggressively to track.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLOOD_COLORS.map((bc, i) => (
            <ScrollReveal key={bc.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ scale: 1.025, y: -3 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-2xl border border-white/6 bg-white/3 overflow-hidden"
              >
                <div className="h-2 w-full" style={{ backgroundColor: bc.hex }} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <BloodDropSVG color={bc.hex} size={22} />
                    <span className="text-sm font-bold" style={{ color: bc.hex }}>
                      {bc.label}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed mb-3">{bc.meaning}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-white/25 w-14 shrink-0 mt-0.5">
                        Organs
                      </span>
                      <span className="text-xs text-white/50">{bc.organs}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-white/25 w-14 shrink-0 mt-0.5">
                        Action
                      </span>
                      <span className="text-xs text-white/75 font-medium">{bc.action}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Tracking Steps Section ───────────────────────────────────────────────────

function TrackingStepsSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.35em] text-amber-500">
              Post-Shot Procedure
            </h2>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold italic mb-2">
            Tracking Steps
          </h3>
          <p className="text-white/35 text-sm mb-10 max-w-2xl">
            Follow this sequence on every shot, regardless of how confident you are about the
            hit. Consistent procedure leads to consistent recovery rates.
          </p>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[22px] top-8 bottom-8 w-px bg-gradient-to-b from-amber-600/40 via-amber-600/15 to-transparent hidden sm:block" />

          <div className="space-y-4">
            {TRACKING_STEPS.map((step, i) => {
              const IconComp = step.icon
              return (
                <ScrollReveal key={step.number} delay={i * 0.07}>
                  <div className="flex gap-5">
                    <div className="shrink-0">
                      <div className="w-11 h-11 rounded-full bg-amber-950/50 border border-amber-600/40 flex items-center justify-center">
                        <span className="text-amber-400 font-black text-sm">{step.number}</span>
                      </div>
                    </div>
                    <div className="flex-1 rounded-2xl border border-white/6 bg-white/3 p-5 mb-1">
                      <div className="flex items-center gap-2.5 mb-2">
                        <IconComp className="w-4 h-4 text-amber-500/70 shrink-0" />
                        <h4 className="text-sm font-bold">{step.title}</h4>
                      </div>
                      <p className="text-white/55 text-xs leading-relaxed mb-3">{step.body}</p>
                      {step.tip && (
                        <div className="flex items-start gap-2.5 p-3 bg-amber-950/25 border border-amber-700/25 rounded-xl">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-amber-300/70 text-xs leading-relaxed italic">
                            {step.tip}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Recovery Tips Section ────────────────────────────────────────────────────

function RecoveryTipsSection() {
  return (
    <section className="py-16 px-6 bg-[#080c08]/70 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.35em] text-green-500">
              After Recovery
            </h2>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold italic mb-2">
            Recovery &amp; Field Care
          </h3>
          <p className="text-white/35 text-sm mb-10 max-w-2xl">
            Recovering the animal is only half the task. Proper handling in the field
            determines meat quality and legal compliance in Mauritius.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {RECOVERY_TIPS.map((tip, i) => {
            const IconComp = tip.icon
            return (
              <ScrollReveal key={tip.id} delay={i * 0.09}>
                <motion.div
                  whileHover={{ scale: 1.015, y: -2 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="rounded-2xl border border-white/6 bg-white/3 p-6 h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-green-950/50 border border-green-700/30 flex items-center justify-center shrink-0">
                      <IconComp className="w-4 h-4 text-green-400" />
                    </div>
                    <h4 className="text-sm font-bold">{tip.title}</h4>
                  </div>
                  <p className="text-white/55 text-xs leading-relaxed">{tip.body}</p>
                </motion.div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Quick Reference Banner ───────────────────────────────────────────────────

function QuickRefBanner() {
  const refs = [
    { label: 'Heart / Lung', wait: '30 min', hex: '#ef4444' },
    { label: 'Liver', wait: '4–6 hrs', hex: '#7f1d1d' },
    { label: 'Gut', wait: '8–12 hrs', hex: '#78716c' },
    { label: 'Muscle / Graze', wait: 'Track now', hex: '#94a3b8' },
  ]

  return (
    <ScrollReveal>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <p className="text-[10px] uppercase tracking-widest font-black text-white/30 mb-4 text-center">
            Quick Reference — Wait Times
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {refs.map((r) => (
              <div
                key={r.label}
                className="rounded-xl p-3 border text-center"
                style={{ borderColor: `${r.hex}30`, backgroundColor: `${r.hex}10` }}
              >
                <div className="flex justify-center">
                  <BloodDropSVG color={r.hex} size={20} />
                </div>
                <p className="text-xs font-bold mt-2 mb-1" style={{ color: r.hex }}>
                  {r.label}
                </p>
                <p className="text-[11px] text-white/50 font-mono">{r.wait}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BloodTrailPage() {
  return (
    <PageWrapper>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a0f0a] pt-8 pb-16 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.025]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="bt-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bt-grid)" />
          </svg>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 40% at 50% 0%, #7f1d1d18 0%, transparent 65%)',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-red-700 font-black uppercase tracking-[0.4em] text-xs block mb-5 text-center"
          >
            Hunter's Field Reference · Mauritius
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-8xl font-display font-black italic uppercase text-center mb-2 leading-none"
          >
            Blood Trail
            <br />
            <span className="text-red-800">&amp; Wound Guide</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-white/40 text-sm text-center max-w-lg mx-auto mt-6 mb-10"
          >
            Diagnose your shot placement from field signs. Know when to wait, when to track,
            and how to recover your game in Mauritius's hunting terrain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-2xl mx-auto h-12"
          >
            <BloodTrailLine color="#991b1b" />
          </motion.div>
        </div>
      </section>

      {/* ── Quick Reference ───────────────────────────────────────────────── */}
      <QuickRefBanner />

      {/* ── 1. Shot Assessment — wound type accordions ────────────────────── */}
      <section className="py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
                Shot Assessment
              </h2>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold italic mb-2">
              Wound Type Identification
            </h3>
            <p className="text-white/35 text-sm mb-8 max-w-2xl">
              Match the blood color, volume, and animal behavior to the wound type below.
              Each entry provides a wait time, blood trail description, field signs, and
              recommended actions.
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {WOUND_TYPES.map((wound, i) => (
              <WoundCard key={wound.id} wound={wound} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Blood Trail Colors ──────────────────────────────────────────── */}
      <BloodColorsSection />

      {/* ── 3. Tracking Steps ─────────────────────────────────────────────── */}
      <TrackingStepsSection />

      {/* ── 4. Recovery Tips ──────────────────────────────────────────────── */}
      <RecoveryTipsSection />

      {/* ── Ethical obligation disclaimer ─────────────────────────────────── */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="p-7 bg-white/3 border border-white/5 rounded-3xl flex flex-col sm:flex-row items-start gap-5">
              <AlertTriangle className="w-7 h-7 text-amber-600/70 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/70 mb-2">
                  Ethical Hunting Obligation
                </p>
                <p className="text-white/45 text-xs leading-relaxed">
                  Every hunter has a legal and ethical obligation to make every reasonable effort
                  to recover wounded game. Under Mauritius hunting regulations, a wounded animal
                  must be pursued and, where possible, dispatched humanely. Do not give up on a
                  blood trail without exhausting every option — use dogs, additional hunters, and
                  grid searches before concluding that recovery is not possible. Record all
                  wounding events in your hunting journal.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-16" />
    </PageWrapper>
  )
}
