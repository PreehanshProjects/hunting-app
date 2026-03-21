import { useState, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ShieldCheck, ShieldAlert, Info, ChevronRight, Crosshair, Zap, Target, Wind } from 'lucide-react'
import { ScrollReveal } from '../../components/animations/ScrollReveal'

// ─── SVG Weapon Illustrations ─────────────────────────────────────────────────

function BoltActionSVG({ color = '#3a7a30' }: { color?: string }) {
  return (
    <svg viewBox="0 0 520 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Suppressor/muzzle tip */}
      <rect x="8" y="36" width="18" height="18" rx="3" fill={color} opacity="0.5" />
      {/* Barrel */}
      <rect x="24" y="39" width="230" height="12" rx="3" fill={color} opacity="0.9" />
      {/* Scope rail */}
      <rect x="200" y="29" width="100" height="5" rx="2" fill={color} opacity="0.4" />
      {/* Scope body */}
      <rect x="210" y="16" width="80" height="18" rx="6" fill={color} opacity="0.8" />
      {/* Scope lens front */}
      <circle cx="218" cy="25" r="6" fill={color} opacity="0.5" />
      <circle cx="218" cy="25" r="3" fill="white" opacity="0.15" />
      {/* Scope lens rear */}
      <circle cx="282" cy="25" r="7" fill={color} opacity="0.5" />
      <circle cx="282" cy="25" r="4" fill="white" opacity="0.15" />
      {/* Receiver */}
      <rect x="253" y="29" width="85" height="32" rx="5" fill={color} />
      {/* Bolt handle shaft */}
      <rect x="310" y="29" width="5" height="22" rx="2" fill="white" opacity="0.6" />
      {/* Bolt handle knob */}
      <circle cx="312" cy="54" r="7" fill="white" opacity="0.7" />
      {/* Trigger guard */}
      <path d="M 300 61 Q 310 75 330 72 L 332 61 Z" fill={color} opacity="0.5" />
      {/* Trigger */}
      <rect x="316" y="58" width="3" height="12" rx="1" fill="white" opacity="0.6" />
      {/* Magazine */}
      <rect x="268" y="61" width="28" height="18" rx="4" fill={color} opacity="0.7" />
      {/* Pistol grip */}
      <path d="M 335 61 L 348 61 L 355 82 Q 348 88 338 85 L 332 68 Z" fill={color} opacity="0.85" />
      {/* Stock */}
      <path d="M 348 38 L 500 38 Q 515 42 510 58 Q 515 68 500 72 L 350 72 L 348 61 L 355 52 Z" fill={color} opacity="0.75" />
      {/* Cheek piece bump */}
      <path d="M 410 38 Q 440 30 460 38" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.4" fill="none" />
      {/* Butt pad */}
      <rect x="500" y="40" width="10" height="30" rx="3" fill="white" opacity="0.2" />
    </svg>
  )
}

function PumpShotgunSVG({ color = '#b45309' }: { color?: string }) {
  return (
    <svg viewBox="0 0 520 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Muzzle */}
      <rect x="8" y="33" width="14" height="22" rx="3" fill={color} opacity="0.4" />
      {/* Barrel - top */}
      <rect x="20" y="35" width="220" height="10" rx="3" fill={color} opacity="0.9" />
      {/* Magazine tube - bottom */}
      <rect x="20" y="47" width="190" height="8" rx="3" fill={color} opacity="0.6" />
      {/* Forend / pump grip */}
      <rect x="110" y="44" width="45" height="16" rx="5" fill="white" opacity="0.25" />
      <rect x="113" y="46" width="3" height="12" rx="1" fill="white" opacity="0.3" />
      <rect x="119" y="46" width="3" height="12" rx="1" fill="white" opacity="0.3" />
      <rect x="125" y="46" width="3" height="12" rx="1" fill="white" opacity="0.3" />
      <rect x="131" y="46" width="3" height="12" rx="1" fill="white" opacity="0.3" />
      <rect x="137" y="46" width="3" height="12" rx="1" fill="white" opacity="0.3" />
      <rect x="143" y="46" width="3" height="12" rx="1" fill="white" opacity="0.3" />
      {/* Receiver */}
      <rect x="238" y="28" width="80" height="36" rx="5" fill={color} />
      {/* Ejection port */}
      <rect x="248" y="34" width="35" height="14" rx="3" fill="black" opacity="0.3" />
      {/* Trigger guard */}
      <path d="M 278 64 Q 292 78 312 75 L 316 64 Z" fill={color} opacity="0.5" />
      {/* Trigger */}
      <rect x="296" y="61" width="3" height="13" rx="1" fill="white" opacity="0.6" />
      {/* Pistol grip */}
      <path d="M 316 64 L 330 64 L 338 85 Q 330 90 320 88 L 313 72 Z" fill={color} opacity="0.85" />
      {/* Stock */}
      <path d="M 318 35 L 500 35 Q 514 40 510 55 Q 515 65 500 68 L 320 68 L 316 64 L 322 50 Z" fill={color} opacity="0.75" />
      {/* Butt pad */}
      <rect x="500" y="37" width="10" height="29" rx="3" fill="white" opacity="0.2" />
      {/* Bead sight */}
      <circle cx="26" cy="35" r="3" fill="white" opacity="0.6" />
    </svg>
  )
}

function OverUnderSVG({ color = '#92400e' }: { color?: string }) {
  return (
    <svg viewBox="0 0 520 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Muzzle caps */}
      <rect x="8" y="30" width="12" height="10" rx="2" fill={color} opacity="0.5" />
      <rect x="8" y="44" width="12" height="10" rx="2" fill={color} opacity="0.5" />
      {/* Top barrel */}
      <rect x="18" y="31" width="230" height="8" rx="3" fill={color} opacity="0.9" />
      {/* Bottom barrel */}
      <rect x="18" y="45" width="230" height="8" rx="3" fill={color} opacity="0.85" />
      {/* Barrel rib between */}
      <rect x="18" y="39" width="230" height="6" rx="1" fill={color} opacity="0.4" />
      {/* Rib connectors */}
      {[40, 80, 120, 160, 200].map(x => (
        <rect key={x} x={x} y={40} width="4" height="5" fill={color} opacity="0.3" />
      ))}
      {/* Action / hinge block */}
      <rect x="246" y="25" width="75" height="42" rx="6" fill={color} />
      {/* Hinge pin */}
      <circle cx="246" cy="47" r="5" fill="white" opacity="0.3" />
      {/* Trigger guard */}
      <path d="M 285 67 Q 300 82 318 78 L 320 67 Z" fill={color} opacity="0.5" />
      {/* Front trigger */}
      <rect x="295" y="64" width="3" height="13" rx="1" fill="white" opacity="0.6" />
      {/* Rear trigger */}
      <rect x="305" y="64" width="3" height="13" rx="1" fill="white" opacity="0.6" />
      {/* Stock wrist */}
      <path d="M 318 67 L 334 67 L 340 88 Q 330 94 320 92 L 316 74 Z" fill={color} opacity="0.85" />
      {/* Stock */}
      <path d="M 320 32 L 500 32 Q 514 38 510 55 Q 514 66 500 70 L 322 70 L 318 67 L 324 50 Z" fill={color} opacity="0.75" />
      {/* Cheek rest */}
      <path d="M 400 32 Q 435 22 460 32" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.35" fill="none" />
      {/* Butt pad */}
      <rect x="500" y="34" width="10" height="34" rx="3" fill="white" opacity="0.2" />
      {/* Bead sight */}
      <circle cx="24" cy="34" r="3" fill="white" opacity="0.6" />
    </svg>
  )
}

function LeverActionSVG({ color = '#3a7a30' }: { color?: string }) {
  return (
    <svg viewBox="0 0 520 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Muzzle cap */}
      <rect x="8" y="37" width="14" height="14" rx="3" fill={color} opacity="0.45" />
      {/* Barrel */}
      <rect x="20" y="39" width="220" height="10" rx="3" fill={color} opacity="0.9" />
      {/* Barrel rib */}
      <rect x="22" y="37" width="218" height="3" rx="1" fill={color} opacity="0.4" />
      {/* Front sight blade */}
      <rect x="28" y="34" width="4" height="6" rx="1" fill="white" opacity="0.5" />
      {/* Receiver */}
      <rect x="238" y="30" width="80" height="32" rx="5" fill={color} />
      {/* Receiver port */}
      <rect x="248" y="37" width="36" height="14" rx="3" fill="black" opacity="0.25" />
      {/* Rear sight */}
      <rect x="270" y="26" width="12" height="5" rx="2" fill={color} opacity="0.7" />
      <rect x="273" y="23" width="6" height="4" rx="1" fill="white" opacity="0.4" />
      {/* Lever loop — the iconic lever-action feature */}
      <path d="M 288 62 Q 310 85 332 72 L 330 62 Z" fill={color} opacity="0.55" />
      <path d="M 290 62 Q 308 80 326 68" stroke="white" strokeWidth="1.5" fill="none" opacity="0.2" />
      {/* Trigger inside loop */}
      <rect x="308" y="57" width="3" height="12" rx="1" fill="white" opacity="0.55" />
      {/* Wrist / grip */}
      <path d="M 316 62 L 328 62 L 334 82 Q 326 88 316 86 L 312 70 Z" fill={color} opacity="0.85" />
      {/* Straight stock (lever actions have straight stocks) */}
      <path d="M 318 38 L 500 36 Q 514 40 510 52 Q 514 62 500 64 L 320 64 L 316 62 L 320 50 Z" fill={color} opacity="0.72" />
      {/* Stock cap */}
      <rect x="500" y="38" width="10" height="26" rx="3" fill="white" opacity="0.18" />
      {/* Magazine tube under barrel */}
      <rect x="22" y="50" width="185" height="7" rx="3" fill={color} opacity="0.5" />
    </svg>
  )
}

function SideBySideSVG({ color = '#92400e' }: { color?: string }) {
  return (
    <svg viewBox="0 0 520 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Muzzle caps — side by side */}
      <rect x="8" y="32" width="12" height="10" rx="2" fill={color} opacity="0.5" />
      <rect x="8" y="44" width="12" height="10" rx="2" fill={color} opacity="0.5" />
      {/* Left barrel */}
      <rect x="18" y="33" width="230" height="8" rx="3" fill={color} opacity="0.9" />
      {/* Right barrel */}
      <rect x="18" y="45" width="230" height="8" rx="3" fill={color} opacity="0.85" />
      {/* Rib between barrels */}
      <rect x="18" y="41" width="230" height="4" rx="1" fill={color} opacity="0.3" />
      {/* Barrel band connectors */}
      {[50, 120, 200].map(x => (
        <rect key={x} x={x} y={33} width="6" height="20" rx="2" fill={color} opacity="0.25" />
      ))}
      {/* Action block */}
      <rect x="246" y="26" width="70" height="40" rx="6" fill={color} />
      {/* Hinge */}
      <circle cx="248" cy="46" r="5" fill="white" opacity="0.25" />
      {/* Lock plates — engraved box lock aesthetic */}
      <rect x="252" y="30" width="28" height="26" rx="3" fill="white" opacity="0.06" />
      <ellipse cx="266" cy="43" rx="8" ry="9" stroke="white" strokeWidth="0.8" fill="none" opacity="0.15" />
      {/* Trigger guard */}
      <path d="M 280 66 Q 296 80 314 77 L 316 66 Z" fill={color} opacity="0.5" />
      {/* Front trigger */}
      <rect x="290" y="63" width="3" height="13" rx="1" fill="white" opacity="0.6" />
      {/* Back trigger */}
      <rect x="300" y="63" width="3" height="13" rx="1" fill="white" opacity="0.6" />
      {/* Splinter forend */}
      <rect x="180" y="53" width="62" height="12" rx="4" fill={color} opacity="0.45" />
      {/* Stock with English grip (straight) */}
      <path d="M 316 66 L 330 66 L 336 86 Q 326 92 316 90 L 312 74 Z" fill={color} opacity="0.85" />
      <path d="M 316 32 L 500 30 Q 514 36 510 52 Q 514 64 500 66 L 318 66 L 316 66 L 320 48 Z" fill={color} opacity="0.74" />
      {/* Cheek rest */}
      <path d="M 390 30 Q 425 20 455 30" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.3" fill="none" />
      {/* Butt pad */}
      <rect x="500" y="32" width="10" height="34" rx="3" fill="white" opacity="0.18" />
      {/* Bead sight */}
      <circle cx="24" cy="37" r="3" fill="white" opacity="0.6" />
    </svg>
  )
}

function NightHuntSVG({ color = '#dc2626' }: { color?: string }) {
  return (
    <svg viewBox="0 0 520 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Suppressor */}
      <rect x="8" y="36" width="22" height="18" rx="4" fill={color} opacity="0.45" />
      {/* Barrel */}
      <rect x="28" y="39" width="220" height="12" rx="3" fill={color} opacity="0.8" />
      {/* Night vision / thermal scope — boxy, large objective */}
      <rect x="195" y="12" width="110" height="28" rx="8" fill={color} opacity="0.85" />
      {/* Large objective lens (night vision) */}
      <circle cx="205" cy="26" r="10" fill={color} opacity="0.5" />
      <circle cx="205" cy="26" r="7" fill="black" opacity="0.4" />
      <circle cx="205" cy="26" r="4" fill="#dc2626" opacity="0.6" />
      {/* Eyepiece */}
      <circle cx="297" cy="26" r="8" fill={color} opacity="0.5" />
      <circle cx="297" cy="26" r="5" fill="black" opacity="0.4" />
      {/* Scope controls / battery pack */}
      <rect x="230" y="8" width="18" height="8" rx="3" fill={color} opacity="0.5" />
      <rect x="255" y="8" width="12" height="8" rx="3" fill={color} opacity="0.4" />
      {/* Scope rail */}
      <rect x="195" y="39" width="110" height="5" rx="1" fill={color} opacity="0.35" />
      {/* Receiver */}
      <rect x="248" y="29" width="80" height="32" rx="5" fill={color} opacity="0.7" />
      {/* Bolt */}
      <rect x="305" y="29" width="5" height="20" rx="2" fill="white" opacity="0.5" />
      <circle cx="307" cy="52" r="6" fill="white" opacity="0.55" />
      {/* Trigger */}
      <rect x="314" y="58" width="3" height="12" rx="1" fill="white" opacity="0.5" />
      {/* Grip */}
      <path d="M 328 61 L 342 61 L 348 80 Q 340 86 330 83 L 326 68 Z" fill={color} opacity="0.75" />
      {/* Stock */}
      <path d="M 340 37 L 500 37 Q 514 42 510 56 Q 514 66 500 68 L 342 68 L 340 61 L 346 50 Z" fill={color} opacity="0.65" />
      {/* Butt pad */}
      <rect x="500" y="39" width="10" height="28" rx="3" fill="white" opacity="0.15" />
      {/* Big X */}
      <line x1="30" y1="10" x2="490" y2="80" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
      <line x1="490" y1="10" x2="30" y2="80" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

function RimfireSVG({ color = '#dc2626' }: { color?: string }) {
  return (
    <svg viewBox="0 0 520 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Barrel - thinner, shorter */}
      <rect x="20" y="32" width="200" height="8" rx="2" fill={color} opacity="0.7" />
      {/* Receiver */}
      <rect x="218" y="24" width="75" height="28" rx="4" fill={color} opacity="0.8" />
      {/* Magazine (tube) */}
      <rect x="230" y="52" width="22" height="18" rx="3" fill={color} opacity="0.6" />
      {/* Trigger guard */}
      <path d="M 265 52 Q 275 65 290 62 L 293 52 Z" fill={color} opacity="0.5" />
      {/* Trigger */}
      <rect x="277" y="49" width="3" height="12" rx="1" fill="white" opacity="0.5" />
      {/* Grip */}
      <path d="M 290 52 L 302 52 L 308 70 Q 300 75 292 73 L 288 60 Z" fill={color} opacity="0.8" />
      {/* Stock */}
      <path d="M 292 28 L 490 28 Q 504 33 500 46 Q 504 56 490 59 L 294 59 L 290 52 L 296 42 Z" fill={color} opacity="0.65" />
      {/* X mark overlay */}
      <line x1="30" y1="15" x2="490" y2="70" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="490" y1="15" x2="30" y2="70" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

function SemiAutoSVG({ color = '#dc2626' }: { color?: string }) {
  return (
    <svg viewBox="0 0 520 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Flash hider */}
      <rect x="8" y="36" width="20" height="14" rx="2" fill={color} opacity="0.4" />
      <line x1="12" y1="36" x2="12" y2="28" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="18" y1="36" x2="18" y2="28" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="24" y1="36" x2="24" y2="28" stroke={color} strokeWidth="2" opacity="0.4" />
      {/* Barrel */}
      <rect x="26" y="38" width="190" height="10" rx="2" fill={color} opacity="0.75" />
      {/* Handguard */}
      <rect x="80" y="34" width="120" height="18" rx="3" fill={color} opacity="0.45" />
      {/* Receiver upper */}
      <rect x="216" y="28" width="85" height="20" rx="4" fill={color} opacity="0.85" />
      {/* Receiver lower */}
      <rect x="216" y="48" width="85" height="18" rx="4" fill={color} opacity="0.7" />
      {/* Charging handle */}
      <rect x="216" y="24" width="12" height="8" rx="2" fill="white" opacity="0.4" />
      {/* Mag well + curved magazine */}
      <path d="M 235 66 L 255 66 L 260 86 Q 255 90 245 90 Q 235 90 232 86 Z" fill={color} opacity="0.7" />
      {/* Pistol grip */}
      <path d="M 284 66 L 298 66 L 304 87 Q 296 92 286 90 L 282 74 Z" fill={color} opacity="0.85" />
      {/* Buffer tube / stock */}
      <rect x="300" y="34" width="130" height="20" rx="4" fill={color} opacity="0.7" />
      {/* Stock adjustment notches */}
      <rect x="360" y="34" width="4" height="20" fill="black" opacity="0.2" />
      <rect x="375" y="34" width="4" height="20" fill="black" opacity="0.2" />
      <rect x="390" y="34" width="4" height="20" fill="black" opacity="0.2" />
      {/* Buttstock plate */}
      <rect x="426" y="30" width="8" height="28" rx="2" fill={color} opacity="0.9" />
      {/* X mark */}
      <line x1="30" y1="10" x2="490" y2="82" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
      <line x1="490" y1="10" x2="30" y2="82" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type Weapon = {
  id: string
  name: string
  subtitle: string
  category: 'rifle' | 'shotgun' | 'prohibited'
  legalFor: string[]
  calibre: string
  action: string
  range: number
  power: number
  accuracy: number
  recoil: number
  description: string
  legalNote: string
  accentColor: string
  svg: React.FC<{ color?: string }>
}

const WEAPONS: Weapon[] = [
  {
    id: 'bolt-308',
    name: '.308 Winchester',
    subtitle: 'Bolt-Action Rifle',
    category: 'rifle',
    legalFor: ['Deer', 'Wild Boar'],
    calibre: '7.62 × 51 mm NATO',
    action: 'Bolt-Action',
    range: 90,
    power: 82,
    accuracy: 88,
    recoil: 58,
    description: 'The gold standard for Mauritian deer hunting. Flat trajectory, excellent terminal performance at forest ranges, and wide ammunition availability make the .308 the most common choice among local hunters.',
    legalNote: 'Fully legal for deer (above .22). Must be bolt-action. Register with Commissioner of Police.',
    accentColor: '#3a7a30',
    svg: BoltActionSVG,
  },
  {
    id: 'bolt-243',
    name: '.243 Winchester',
    subtitle: 'Bolt-Action Rifle',
    category: 'rifle',
    legalFor: ['Deer', 'Wild Boar'],
    calibre: '6.16 × 51 mm',
    action: 'Bolt-Action',
    range: 88,
    power: 65,
    accuracy: 93,
    recoil: 35,
    description: 'Lower recoil and a flatter trajectory than larger calibres make the .243 ideal for newer hunters. Retains sufficient energy for clean ethical kills on Rusa deer at typical hunting distances.',
    legalNote: 'Legal for deer — calibre is above .22. Excellent beginner rifle choice.',
    accentColor: '#15803d',
    svg: BoltActionSVG,
  },
  {
    id: 'bolt-3006',
    name: '.30-06 Springfield',
    subtitle: 'Bolt-Action Rifle',
    category: 'rifle',
    legalFor: ['Deer', 'Wild Boar'],
    calibre: '7.62 × 63 mm',
    action: 'Bolt-Action',
    range: 92,
    power: 90,
    accuracy: 85,
    recoil: 72,
    description: 'One of the most proven hunting cartridges in the world. Carries exceptional energy at longer ranges and handles heavy boar with authority. A classic choice for experienced hunters.',
    legalNote: 'Fully legal for all game. Classic bolt-action, no restrictions beyond standard licence.',
    accentColor: '#166534',
    svg: BoltActionSVG,
  },
  {
    id: 'bolt-270',
    name: '.270 Winchester',
    subtitle: 'Bolt-Action Rifle',
    category: 'rifle',
    legalFor: ['Deer (Rusa)', 'Wild Boar'],
    calibre: '6.99 × 64 mm',
    action: 'Bolt-Action',
    range: 92,
    power: 80,
    accuracy: 92,
    recoil: 48,
    description: 'The .270 Winchester is one of the most loved deer calibres in the world. Fires a slim, high-BC 130gr bullet at over 3,000 fps for a laser-flat trajectory. Outstanding choice for Mauritius\'s open estate clearings and hillside shooting lanes where longer shots are common.',
    legalNote: 'Fully legal for deer — well above .22 minimum. Excellent balance of power, recoil, and range. Widely available through Mauritian licensed dealers.',
    accentColor: '#2d6a4f',
    svg: BoltActionSVG,
  },
  {
    id: 'bolt-65cm',
    name: '6.5 Creedmoor',
    subtitle: 'Bolt-Action Rifle',
    category: 'rifle',
    legalFor: ['Deer (Rusa)', 'Long Range'],
    calibre: '6.72 × 48 mm',
    action: 'Bolt-Action',
    range: 96,
    power: 74,
    accuracy: 97,
    recoil: 38,
    description: 'The modern benchmark of precision hunting. Exceptional ballistic coefficient (BC 0.625) makes it extraordinarily resistant to wind drift at range — ideal across Mauritius\'s sea-breeze-affected highlands. Match-grade accuracy with lethal terminal performance from a mild-recoiling platform.',
    legalNote: 'Fully legal for deer — centrefire, above .22. Growing in popularity among younger Mauritian hunters for its precision and manageable recoil.',
    accentColor: '#1a5c38',
    svg: BoltActionSVG,
  },
  {
    id: 'bolt-300wm',
    name: '.300 Win Mag',
    subtitle: 'Bolt-Action Rifle',
    category: 'rifle',
    legalFor: ['Deer', 'Wild Boar (heavy)'],
    calibre: '7.62 × 67 mm',
    action: 'Bolt-Action',
    range: 100,
    power: 98,
    accuracy: 82,
    recoil: 88,
    description: 'The most powerful bolt-action hunting rifle commonly found on Mauritian estates. Over 3,500 ft-lbs at the muzzle — nearly double a .308. For hunters who demand maximum authority at distance and on the heaviest trophy boar. Significant recoil requires proper technique.',
    legalNote: 'Fully legal for all game. Overkill for most situations but technically sound. Requires steady shooting position to manage recoil for follow-up shots.',
    accentColor: '#14532d',
    svg: BoltActionSVG,
  },
  {
    id: 'bolt-8x57',
    name: '8×57 JS Mauser',
    subtitle: 'Bolt-Action Rifle',
    category: 'rifle',
    legalFor: ['Wild Boar', 'Deer'],
    calibre: '8.22 × 57 mm',
    action: 'Bolt-Action',
    range: 78,
    power: 88,
    accuracy: 80,
    recoil: 70,
    description: 'The old-world workhorse — the cartridge of European battue hunting for over a century. Heavy 196gr bullets hit with authority at close-to-medium bush ranges. Commonly chambered in classic Mauser 98 actions still found on Mauritian estates passed down through generations.',
    legalNote: 'Fully legal for all game. Widely available through European ammunition suppliers serving Mauritius. Common in estate armouries.',
    accentColor: '#3a5c28',
    svg: BoltActionSVG,
  },
  {
    id: 'bolt-7x64',
    name: '7×64 Brenneke',
    subtitle: 'Bolt-Action Rifle',
    category: 'rifle',
    legalFor: ['Deer (Rusa)', 'Wild Boar'],
    calibre: '7.21 × 64 mm',
    action: 'Bolt-Action',
    range: 86,
    power: 87,
    accuracy: 86,
    recoil: 60,
    description: 'The European equivalent of the .280 Remington, designed by Wilhelm Brenneke in 1917. Extraordinarily popular among French and Belgian hunters — and widely seen on Mauritian private estates given the island\'s deep francophone hunting tradition. Flat shooting, powerful, and versatile for all Mauritian game.',
    legalNote: 'Fully legal for all game. The cartridge of choice for French-speaking hunting culture. Found in many Mauritian estate gun cabinets.',
    accentColor: '#2d6a4f',
    svg: BoltActionSVG,
  },
  {
    id: 'lever-3030',
    name: '.30-30 Winchester',
    subtitle: 'Lever-Action Rifle',
    category: 'rifle',
    legalFor: ['Wild Boar', 'Deer (close range)'],
    calibre: '7.62 × 51R mm',
    action: 'Lever-Action',
    range: 62,
    power: 72,
    accuracy: 75,
    recoil: 45,
    description: 'The iconic lever-action — fast follow-up shots, compact handling in dense bush, and a timeless silhouette. The .30-30 has taken more deer than any other cartridge in history. Limited to around 200m range but in Mauritius\'s thick forêt cover, shots rarely exceed that. Beloved for its quick cycling in driven hunts.',
    legalNote: 'Fully legal for deer — centrefire, above .22. Lever-action is an approved action type. Excellent for dense bush battue hunts.',
    accentColor: '#3a7a30',
    svg: LeverActionSVG,
  },
  {
    id: 'pump-12ga',
    name: '12-Gauge Pump',
    subtitle: 'Pump-Action Shotgun',
    category: 'shotgun',
    legalFor: ['Partridge', 'Quail', 'Guinea Fowl', 'Hare', 'Wild Boar (slug/buckshot)'],
    calibre: '12 Gauge',
    action: 'Pump-Action',
    range: 50,
    power: 78,
    accuracy: 68,
    recoil: 65,
    description: 'The workhorse of bird hunting. Reliable in all conditions, versatile with shot sizes for birds or slugs/buckshot for boar. The 12-gauge pump is the most accessible and practical shotgun for Mauritian hunters.',
    legalNote: 'Legal for birds and boar. DO NOT use lead shot for deer — illegal under s.19(1)(c)(ii).',
    accentColor: '#b45309',
    svg: PumpShotgunSVG,
  },
  {
    id: 'ou-12ga',
    name: '12-Gauge Over/Under',
    subtitle: 'Break-Action Shotgun',
    category: 'shotgun',
    legalFor: ['Partridge', 'Quail', 'Guinea Fowl', 'Hare'],
    calibre: '12 Gauge',
    action: 'Break-Action (O/U)',
    range: 48,
    power: 72,
    accuracy: 80,
    recoil: 60,
    description: 'The classic gentleman\'s bird gun. Two barrels allow two different choke settings — tight for crossing shots, open for close flushes. Favoured on partridge and guinea fowl drives across Mauritian estates.',
    legalNote: 'Legal for all bird species and hare. Two shots maximum before reloading — no semi-auto concerns.',
    accentColor: '#92400e',
    svg: OverUnderSVG,
  },
  {
    id: 'sxs-12ga',
    name: '12-Gauge Side-by-Side',
    subtitle: 'Break-Action Shotgun',
    category: 'shotgun',
    legalFor: ['Partridge', 'Quail', 'Guinea Fowl', 'Hare'],
    calibre: '12 Gauge',
    action: 'Break-Action (SxS)',
    range: 46,
    power: 72,
    accuracy: 76,
    recoil: 58,
    description: 'The traditional English game gun — twin barrels sitting side by side for a wide, instinctive sight plane. The side-by-side\'s slender forend and straight English grip make it the most elegant shotgun for driven bird days. A fixture of Mauritian estate hunts and a symbol of hunting heritage.',
    legalNote: 'Legal for all birds and hare. Two-shot break action — no semi-auto concerns. The traditional choice for estate-style driven hunts.',
    accentColor: '#7c3d0a',
    svg: SideBySideSVG,
  },
  {
    id: 'pump-20ga',
    name: '20-Gauge Pump',
    subtitle: 'Pump-Action Shotgun',
    category: 'shotgun',
    legalFor: ['Partridge', 'Quail', 'Guinea Fowl', 'Hare'],
    calibre: '20 Gauge',
    action: 'Pump-Action',
    range: 38,
    power: 58,
    accuracy: 70,
    recoil: 42,
    description: 'The 20-gauge delivers a lighter, more manageable package than its 12-gauge counterpart — significantly reduced recoil and a slimmer, lighter gun. Ideal for smaller-framed hunters or those spending long days on foot across Mauritian estates. More than sufficient energy for partridge, quail and guinea fowl at sensible ranges.',
    legalNote: 'Legal for birds and hare. No lead shot on deer regardless of gauge. An excellent choice for youth and recoil-sensitive hunters.',
    accentColor: '#a16207',
    svg: PumpShotgunSVG,
  },
  {
    id: 'nightscope',
    name: 'Night Vision / Thermal',
    subtitle: 'Prohibited Equipment',
    category: 'prohibited',
    legalFor: [],
    calibre: 'Any calibre',
    action: 'Any action',
    range: 80,
    power: 70,
    accuracy: 90,
    recoil: 50,
    description: 'Night vision and thermal imaging scopes are military-derived technologies that enable hunting after dark — which is expressly prohibited under the Act. Regardless of the host firearm\'s legality, fitting a night-vision or thermal optic for hunting constitutes a night-hunting offence.',
    legalNote: 'ILLEGAL — s.19(1)(a). All hunting after sunset is prohibited. Night-vision optics are seized under s.28 powers and the operator faces prosecution with fines and/or imprisonment.',
    accentColor: '#dc2626',
    svg: NightHuntSVG,
  },
  {
    id: 'rimfire-22',
    name: '.22 Rimfire',
    subtitle: 'Prohibited for Deer',
    category: 'prohibited',
    legalFor: [],
    calibre: '.22 LR / .22 Mag',
    action: 'Any action',
    range: 55,
    power: 20,
    accuracy: 85,
    recoil: 10,
    description: 'While popular for pest control and target shooting, any firearm of .22 calibre or smaller is expressly banned for hunting deer in Mauritius. Insufficient energy causes suffering rather than clean kills.',
    legalNote: 'ILLEGAL for deer — s.19(1)(c)(i). Using a .22 for deer is a criminal offence carrying fines up to Rs 50,000 and/or 3 years imprisonment.',
    accentColor: '#dc2626',
    svg: RimfireSVG,
  },
  {
    id: 'semi-auto',
    name: 'Semi / Full Automatic',
    subtitle: 'Prohibited Firearm Type',
    category: 'prohibited',
    legalFor: [],
    calibre: 'Any calibre',
    action: 'Semi-Auto / Automatic',
    range: 85,
    power: 88,
    accuracy: 70,
    recoil: 55,
    description: 'Any firearm capable of firing more than one round at a time is prohibited for hunting under the Act. This covers semi-automatic and fully automatic rifles and shotguns regardless of calibre.',
    legalNote: 'ILLEGAL for hunting — s.18(1)(c)(iv). Prosecution under s.26(2)(b): fine up to Rs 50,000 and/or imprisonment up to 3 years.',
    accentColor: '#dc2626',
    svg: SemiAutoSVG,
  },
]

const CATEGORIES = ['all', 'rifle', 'shotgun', 'prohibited'] as const
type Category = typeof CATEGORIES[number]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBar({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.FC<{ className?: string }> }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1.5 text-white/40">
          <Icon className="w-3 h-3" /> {label}
        </span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function WeaponCard({ weapon, isActive, onClick }: { weapon: Weapon; isActive: boolean; onClick: () => void }) {
  const isProhibited = weapon.category === 'prohibited'
  const SVGComp = weapon.svg

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className="cursor-pointer"
      style={{ perspective: 1200 }}
    >
      <motion.div
        whileHover={{ rotateY: isProhibited ? 0 : 4, rotateX: -3, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`rounded-3xl border p-7 space-y-6 transition-colors duration-300 ${
          isActive
            ? isProhibited
              ? 'bg-red-950/60 border-red-600/50 shadow-[0_0_40px_rgba(220,38,38,0.15)]'
              : 'bg-forest-900/60 border-forest-600/50 shadow-[0_0_40px_rgba(58,122,48,0.15)]'
            : 'bg-forest-950/40 border-white/5 hover:border-white/10'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: weapon.accentColor }}>
              {weapon.subtitle}
            </span>
            <h3 className="text-2xl font-display font-bold italic mt-0.5">{weapon.name}</h3>
          </div>
          <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isProhibited
              ? 'bg-red-900/40 text-red-400 border border-red-700/40'
              : 'bg-forest-900/60 text-forest-400 border border-forest-700/40'
          }`}>
            {isProhibited ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
            {isProhibited ? 'Prohibited' : 'Legal'}
          </div>
        </div>

        {/* Weapon SVG - floating animation */}
        <div className="relative py-2">
          <motion.div
            animate={isActive ? { y: [0, -6, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SVGComp color={weapon.accentColor} />
          </motion.div>
          {/* Glow under weapon */}
          {isActive && (
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 blur-2xl rounded-full opacity-40"
              style={{ backgroundColor: weapon.accentColor }}
            />
          )}
        </div>

        {/* Specs row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Calibre</p>
            <p className="text-sm font-bold">{weapon.calibre}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Action</p>
            <p className="text-sm font-bold">{weapon.action}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <StatBar label="Range" value={weapon.range} color={weapon.accentColor} icon={Wind} />
          <StatBar label="Power" value={weapon.power} color={weapon.accentColor} icon={Zap} />
          <StatBar label="Accuracy" value={weapon.accuracy} color={weapon.accentColor} icon={Target} />
          <StatBar label="Recoil" value={weapon.recoil} color={isProhibited ? '#dc2626' : '#f59e0b'} icon={Crosshair} />
        </div>

        {/* Legal for */}
        {weapon.legalFor.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Legal for</p>
            <div className="flex flex-wrap gap-2">
              {weapon.legalFor.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-forest-800/60 border border-forest-700/40 text-[11px] font-bold text-forest-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expand arrow */}
        <motion.div
          animate={{ x: isActive ? 4 : 0 }}
          className="flex items-center gap-2 text-[11px] font-bold text-white/20 uppercase tracking-widest"
        >
          <Info className="w-3.5 h-3.5" />
          {isActive ? 'Selected' : 'Tap for details'}
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function WeaponDetail({ weapon }: { weapon: Weapon }) {
  const isProhibited = weapon.category === 'prohibited'
  return (
    <motion.div
      key={weapon.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className={`sticky top-28 rounded-3xl border p-8 space-y-8 ${
        isProhibited
          ? 'bg-red-950/30 border-red-700/30'
          : 'bg-forest-900/30 border-forest-700/30'
      }`}
    >
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: weapon.accentColor }}>
          {weapon.category === 'prohibited' ? '⛔ Prohibited' : '✓ Permitted Weapon'}
        </span>
        <h2 className="text-4xl font-display font-bold italic mt-1">{weapon.name}</h2>
        <p className="text-white/40 text-sm mt-1">{weapon.subtitle}</p>
      </div>

      {/* Big SVG */}
      <div className="relative">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="py-4"
        >
          <weapon.svg color={weapon.accentColor} />
        </motion.div>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-6 blur-3xl rounded-full opacity-30"
          style={{ backgroundColor: weapon.accentColor }}
        />
      </div>

      {/* Description */}
      <p className="text-white/60 leading-relaxed text-sm">{weapon.description}</p>

      {/* Legal note */}
      <div className={`p-5 rounded-2xl border ${
        isProhibited
          ? 'bg-red-900/20 border-red-700/30'
          : 'bg-forest-900/20 border-forest-700/30'
      }`}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: weapon.accentColor }}>
          Legal Note — Wildlife & National Parks Act 1993
        </p>
        <p className="text-sm text-white/70 leading-relaxed">{weapon.legalNote}</p>
      </div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ArsenalPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [activeWeapon, setActiveWeapon] = useState<Weapon>(WEAPONS[0])
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const filtered = WEAPONS.filter(w => activeCategory === 'all' || w.category === activeCategory)

  const catLabels: Record<Category, string> = {
    all: 'All Weapons',
    rifle: 'Rifles',
    shotgun: 'Shotguns',
    prohibited: 'Prohibited',
  }

  return (
    <PageWrapper>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[55vh] overflow-hidden flex items-center justify-center">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-forest-950">
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating weapon silhouette behind title */}
        <motion.div
          animate={{ y: [0, -12, 0], opacity: [0.04, 0.07, 0.04] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-20"
        >
          <BoltActionSVG color="white" />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/60 via-transparent to-forest-950/60" />

        <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-forest-400 font-black uppercase tracking-[0.4em] text-xs block mb-6"
          >
            Wildlife & National Parks Act 1993
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-9xl font-display font-black italic uppercase"
          >
            Arsenal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-white/40 mt-4 max-w-lg mx-auto text-sm"
          >
            Permitted and prohibited firearms for hunting in Mauritius — know your weapon, know the law.
          </motion.p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-forest-950 to-transparent" />
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Category filter tabs */}
          <ScrollReveal>
            <div className="flex justify-center mb-14">
              <div className="bg-forest-900/40 p-1.5 rounded-full border border-white/5 flex gap-1 flex-wrap justify-center">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat
                        ? cat === 'prohibited'
                          ? 'bg-red-700 text-white shadow-lg'
                          : 'bg-forest-600 text-white shadow-lg'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {catLabels[cat]}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Weapon grid + detail panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
              <AnimatePresence mode="popLayout">
                {filtered.map(weapon => (
                  <WeaponCard
                    key={weapon.id}
                    weapon={weapon}
                    isActive={activeWeapon.id === weapon.id}
                    onClick={() => setActiveWeapon(weapon)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <WeaponDetail key={activeWeapon.id} weapon={activeWeapon} />
              </AnimatePresence>
            </div>
          </div>

          {/* Ground rules strip */}
          <ScrollReveal>
            <div className="mt-32 p-10 md:p-16 bg-forest-900/20 border border-white/5 rounded-[40px]">
              <h2 className="text-3xl md:text-4xl font-display font-bold italic mb-10 text-center">
                Key Firearm Rules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: ShieldCheck,
                    color: 'text-forest-400',
                    bg: 'bg-forest-900/40 border-forest-700/30',
                    title: 'Above .22 for Deer',
                    body: 'Only centrefire calibres above .22 are legal for hunting Rusa deer. This ensures sufficient energy for a humane, ethical kill.',
                    ref: 's.19(1)(c)(i)'
                  },
                  {
                    icon: ShieldCheck,
                    color: 'text-forest-400',
                    bg: 'bg-forest-900/40 border-forest-700/30',
                    title: 'No Lead Shot on Deer',
                    body: 'A shotgun loaded with lead shot is expressly forbidden for deer — even if the gauge is large. Use slugs or buckshot for boar only.',
                    ref: 's.19(1)(c)(ii)'
                  },
                  {
                    icon: ShieldAlert,
                    color: 'text-red-400',
                    bg: 'bg-red-950/20 border-red-700/20',
                    title: 'No Semi/Full-Auto',
                    body: 'Any firearm capable of firing more than one round at a time is prohibited for all hunting, regardless of species or calibre.',
                    ref: 's.18(1)(c)(iv)'
                  },
                  {
                    icon: ShieldAlert,
                    color: 'text-red-400',
                    bg: 'bg-red-950/20 border-red-700/20',
                    title: 'No Explosives or Poison',
                    body: 'Using explosives, drugs, poison, poisoned bait or fire to hunt any wildlife is a serious criminal offence.',
                    ref: 's.18(1)(c)'
                  },
                  {
                    icon: ShieldCheck,
                    color: 'text-forest-400',
                    bg: 'bg-forest-900/40 border-forest-700/30',
                    title: 'Register Your Firearm',
                    body: 'Every hunting firearm must be registered under the Firearms Act and declared to the Commissioner of Police on your game licence application.',
                    ref: 's.20 & Firearms Act'
                  },
                  {
                    icon: ShieldAlert,
                    color: 'text-red-400',
                    bg: 'bg-red-950/20 border-red-700/20',
                    title: 'No Snares or Traps',
                    body: 'Hunting with, purchasing, selling or possessing a snare or gin trap is illegal under the Act — with no permit exception.',
                    ref: 's.18(2)'
                  },
                ].map((rule, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-6 rounded-2xl border space-y-3 ${rule.bg}`}
                  >
                    <rule.icon className={`w-6 h-6 ${rule.color}`} />
                    <h4 className="font-bold text-base">{rule.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{rule.body}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{rule.ref}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </PageWrapper>
  )
}
