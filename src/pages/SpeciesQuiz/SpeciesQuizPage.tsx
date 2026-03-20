import { useState, useMemo, useEffect } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, RotateCcw, Star, Crosshair } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import confetti from 'canvas-confetti'

// ─── Species silhouette SVGs ──────────────────────────────────────────────────

function DeerSilhouette() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
      <path d="M 100 155 L 80 190 L 90 190 L 95 165 L 100 155 Z" />
      <path d="M 100 155 L 120 190 L 110 190 L 105 165 L 100 155 Z" />
      <path d="M 75 160 L 60 190 L 70 190 L 78 168 L 75 160 Z" />
      <path d="M 125 160 L 140 190 L 130 190 L 122 168 L 125 160 Z" />
      <ellipse cx="100" cy="135" rx="40" ry="28" />
      <ellipse cx="100" cy="90" rx="22" ry="28" />
      <ellipse cx="100" cy="75" rx="14" ry="10" />
      {/* Antlers */}
      <path d="M 90 62 C 85 50 78 42 72 35 C 68 30 65 24 62 18 M 72 35 C 68 38 63 38 58 36 M 72 35 C 74 42 72 48 68 52" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 110 62 C 115 50 122 42 128 35 C 132 30 135 24 138 18 M 128 35 C 132 38 137 38 142 36 M 128 35 C 126 42 128 48 132 52" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

function BoarSilhouette() {
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full" fill="currentColor">
      {/* Body - hunched, powerful */}
      <ellipse cx="95" cy="110" rx="55" ry="38" />
      {/* Head - large, low */}
      <ellipse cx="152" cy="108" rx="32" ry="24" />
      {/* Snout */}
      <ellipse cx="182" cy="112" rx="12" ry="10" />
      {/* Tusks */}
      <path d="M 178 118 Q 186 128 180 132" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M 174 120 Q 182 130 176 134" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Legs */}
      <rect x="120" y="140" width="14" height="32" rx="6" />
      <rect x="100" y="142" width="14" height="30" rx="6" />
      <rect x="65" y="140" width="14" height="32" rx="6" />
      <rect x="45" y="142" width="14" height="30" rx="6" />
      {/* Bristly back ridge */}
      <path d="M 55 75 Q 95 65 140 78" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6"/>
      {/* Small eye */}
      <circle cx="162" cy="100" r="4" fill="white" opacity="0.3"/>
      {/* Ear */}
      <path d="M 148 88 L 140 76 L 152 80 Z" />
    </svg>
  )
}

function HareSilhouette() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
      {/* Body */}
      <ellipse cx="90" cy="135" rx="42" ry="30" />
      {/* Haunches - powerful rear */}
      <ellipse cx="68" cy="128" rx="30" ry="24" />
      {/* Head */}
      <ellipse cx="138" cy="105" rx="20" ry="18" />
      {/* Long ears */}
      <path d="M 132 90 C 128 65 130 40 134 18 C 136 10 140 8 142 18 C 144 35 142 62 138 88 Z" />
      <path d="M 142 90 C 144 68 148 44 154 22 C 156 14 160 12 160 24 C 160 42 155 66 148 88 Z" />
      {/* Ear inner */}
      <path d="M 133 88 C 130 68 131 44 134 24 C 135 18 137 17 138 24 C 139 40 138 65 136 86 Z" fill="white" opacity="0.2"/>
      {/* Eye */}
      <circle cx="146" cy="100" r="4" fill="white" opacity="0.3"/>
      {/* Nose */}
      <ellipse cx="156" cy="110" rx="4" ry="3" />
      {/* Long rear legs */}
      <path d="M 52 148 Q 38 162 30 185 L 44 185 Q 48 168 58 155 Z" />
      <path d="M 72 152 Q 62 168 58 188 L 72 188 Q 74 172 80 158 Z" />
      {/* Front legs */}
      <rect x="118" y="118" width="10" height="28" rx="5" />
      <rect x="132" y="120" width="10" height="26" rx="5" />
      {/* Tail - fluffy white */}
      <circle cx="48" cy="130" r="10" fill="white" opacity="0.4"/>
    </svg>
  )
}

function PartridgeSilhouette() {
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full" fill="currentColor">
      {/* Body - round and plump */}
      <ellipse cx="100" cy="120" rx="50" ry="36" />
      {/* Head */}
      <circle cx="148" cy="90" r="22" />
      {/* Beak */}
      <path d="M 168 88 L 180 90 L 168 94 Z" />
      {/* Eye */}
      <circle cx="154" cy="86" r="4" fill="white" opacity="0.4"/>
      <circle cx="155" cy="86" r="2" fill="black" opacity="0.6"/>
      {/* Wing feather texture */}
      <path d="M 58 105 Q 100 95 140 108" stroke="white" strokeWidth="2" fill="none" opacity="0.2"/>
      <path d="M 60 115 Q 100 106 138 118" stroke="white" strokeWidth="2" fill="none" opacity="0.2"/>
      {/* Tail feathers */}
      <path d="M 52 115 Q 38 108 30 100 Q 35 96 45 104 Q 38 98 42 92 Q 50 100 55 110 Z" />
      {/* Legs */}
      <line x1="95" y1="152" x2="90" y2="175" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <line x1="108" y1="152" x2="114" y2="175" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      {/* Feet */}
      <path d="M 84 175 L 90 175 L 96 175" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M 108 175 L 114 175 L 120 175" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      {/* Crest */}
      <path d="M 148 70 Q 152 55 156 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function GuineaFowlSilhouette() {
  return (
    <svg viewBox="0 0 200 190" className="w-full h-full" fill="currentColor">
      {/* Spotted body - large and round */}
      <ellipse cx="95" cy="125" rx="55" ry="42" />
      {/* Spots */}
      {[[70,110],[85,100],[105,98],[120,108],[130,120],[115,130],[95,135],[72,130],[80,120]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="white" opacity="0.2"/>
      ))}
      {/* Small helmeted head */}
      <ellipse cx="147" cy="88" rx="18" ry="18" />
      {/* Helmet/casque on top */}
      <path d="M 142 72 Q 147 60 152 72 Z" />
      {/* Red wattles */}
      <ellipse cx="152" cy="98" rx="5" ry="8" fill="#dc2626" opacity="0.7"/>
      {/* Beak */}
      <path d="M 163 87 L 174 88 L 163 92 Z" />
      {/* Eye */}
      <circle cx="151" cy="85" r="4" fill="white" opacity="0.4"/>
      {/* Tail - drooping */}
      <path d="M 42 118 Q 25 125 18 140 Q 28 140 35 130 Q 28 138 30 148 Q 40 138 44 126 Z" />
      {/* Legs */}
      <line x1="88" y1="163" x2="82" y2="188" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      <line x1="104" y1="163" x2="112" y2="188" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  )
}

function MongooseSilhouette() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" fill="currentColor">
      {/* Long body - lithe */}
      <ellipse cx="95" cy="105" rx="60" ry="22" />
      {/* Head - pointed */}
      <ellipse cx="152" cy="96" rx="22" ry="16" />
      {/* Pointed snout */}
      <path d="M 170 96 Q 182 98 180 100 Q 178 102 170 100 Z" />
      {/* Small ears */}
      <ellipse cx="144" cy="82" rx="6" ry="9" />
      <ellipse cx="155" cy="80" rx="6" ry="9" />
      {/* Eye */}
      <circle cx="158" cy="90" r="4" fill="white" opacity="0.3"/>
      {/* Bushy tail */}
      <path d="M 35 100 Q 15 92 10 80 Q 18 76 25 88 Q 18 82 22 72 Q 32 84 35 98 Z" />
      {/* Legs */}
      <rect x="128" y="118" width="10" height="22" rx="5" />
      <rect x="112" y="120" width="10" height="20" rx="5" />
      <rect x="72" y="118" width="10" height="22" rx="5" />
      <rect x="55" y="120" width="10" height="20" rx="5" />
    </svg>
  )
}

// ─── Quiz data ────────────────────────────────────────────────────────────────

type QuizQuestion = {
  id: string
  prompt: string
  silhouette: React.FC
  options: string[]
  correct: number
  fact: string
  isGame: boolean // true = legal to hunt, false = protected/non-game
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'Identify this animal from its silhouette',
    silhouette: DeerSilhouette,
    options: ['Rusa Deer', 'Sambar Deer', 'Fallow Deer', 'Roe Deer'],
    correct: 0,
    fact: 'Rusa Deer (Cervus timorensis) — the only deer species in Mauritius. Season: 1st Saturday of June to last Sunday of September. Fawns are protected year-round.',
    isGame: true,
  },
  {
    id: 'q2',
    prompt: 'What game animal is shown here?',
    silhouette: BoarSilhouette,
    options: ['Common Warthog', 'Wild Boar', 'Bushpig', 'Babirusa'],
    correct: 1,
    fact: 'Wild Boar (Sus spp.) — open season year-round in Mauritius. Tusks are distinctive. Dogs (bay hounds) are essential for effective boar hunting.',
    isGame: true,
  },
  {
    id: 'q3',
    prompt: 'Which small game animal is this?',
    silhouette: HareSilhouette,
    options: ['European Rabbit', 'Indian Hare', 'Springhare', 'Cottontail'],
    correct: 1,
    fact: 'Indian Hare (Lepus nigricollis) — open season year-round. Distinguished by its very long ears and powerful rear legs built for speed across open ground.',
    isGame: true,
  },
  {
    id: 'q4',
    prompt: 'Can you identify this bird species?',
    silhouette: PartridgeSilhouette,
    options: ['Rock Pigeon', 'Guinea Fowl', 'Partridge (Perdrix)', 'Quail'],
    correct: 2,
    fact: 'Partridge / Perdrix (Francolinus spp.) — season runs 2 April to 14 August. Shotguns with appropriate bird shot are the legal method. Dogs are useful for flushing.',
    isGame: true,
  },
  {
    id: 'q5',
    prompt: 'Identify this distinctive game bird',
    silhouette: GuineaFowlSilhouette,
    options: ['Turkey', 'Guinea Fowl (Pintade)', 'Peahen', 'Helmeted Hornbill'],
    correct: 1,
    fact: 'Wild Guinea Fowl / Pintade sauvage (Numida spp.) — season runs 16 April to 14 September. Recognisable by its spotted plumage and distinctive helmet (casque).',
    isGame: true,
  },
  {
    id: 'q6',
    prompt: 'Is this animal game or protected?',
    silhouette: MongooseSilhouette,
    options: ['Game — open season', 'Protected wildlife', 'Excluded from Act (Second Schedule)', 'No restrictions apply'],
    correct: 2,
    fact: 'The Indian Mongoose (Herpestes auropunctatus) is listed in the Second Schedule — excluded from the definition of "protected wildlife". It is not a game species but is not protected either.',
    isGame: false,
  },
  {
    id: 'q7',
    prompt: 'Which animal has the longest open season in Mauritius?',
    silhouette: HareSilhouette,
    options: ['Rusa Deer (Jun–Sep)', 'Hare — open all year', 'Partridge (Apr–Aug)', 'Guinea Fowl (Apr–Sep)'],
    correct: 1,
    fact: 'Hare (Lepus nigricollis) has a fully open season with no closed period. Wild Boar is also open year-round. Deer has the most restricted season (4 months).',
    isGame: true,
  },
  {
    id: 'q8',
    prompt: 'This animal is charging toward you on a boar hunt — what is it?',
    silhouette: BoarSilhouette,
    options: ['Young Rusa Deer (fawn)', 'Wild Boar (sow)', 'Wild Boar (adult male)', 'Indian Hare'],
    correct: 2,
    fact: 'A charging wild boar is almost certainly a defensive adult. Boar can reach 30–40kg and inflict serious tusk wounds. Bay dogs should hold the animal at distance — never encourage physical contact.',
    isGame: true,
  },
  {
    id: 'q9',
    prompt: 'A deer-like silhouette with no antlers — what is it most likely?',
    silhouette: DeerSilhouette,
    options: ['A legal trophy stag', 'A fawn or hind — do NOT shoot', 'A Sambar deer', 'A goat'],
    correct: 1,
    fact: 'Under the First Schedule, only adult deer "other than fawns" may be taken. If you cannot confirm antlers, do not shoot. Killing a fawn carries fines up to Rs 50,000 and/or 3 years imprisonment.',
    isGame: false,
  },
  {
    id: 'q10',
    prompt: 'Which bird\'s season runs April 2 to August 14?',
    silhouette: PartridgeSilhouette,
    options: ['Guinea Fowl only', 'Partridge and Quail', 'All game birds', 'Hare and Partridge'],
    correct: 1,
    fact: 'Both Partridge (Francolinus spp.) and Quail (Coturnix japonica) share the same season: 2 April to 14 August. Guinea Fowl season starts two weeks later: 16 April to 14 September.',
    isGame: true,
  },
]

const QUESTIONS_PER_ROUND = 7
const PASS_MARK = 0.7

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Score Screen ─────────────────────────────────────────────────────────────

function ScoreScreen({ score, total, onRetry }: { score: number; total: number; onRetry: () => void }) {
  const pct = score / total
  const passed = pct >= PASS_MARK

  useEffect(() => {
    if (passed) {
      const end = Date.now() + 3500
      const frame = () => {
        confetti({ particleCount: 7, spread: 85, origin: { x: Math.random(), y: Math.random() * 0.4 }, colors: ['#3a7a30', '#5aaa46', '#f5c842', '#ffffff'] })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [passed])

  const stars = pct === 1 ? 3 : pct >= 0.857 ? 2 : passed ? 1 : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`max-w-lg mx-auto rounded-3xl border p-10 text-center ${passed ? 'bg-forest-900/40 border-forest-600/40' : 'bg-blood/5 border-blood/20'}`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.15 }}
        className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 ${passed ? 'bg-forest-600 text-white' : 'bg-blood/80 text-white'}`}
      >
        {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {passed ? 'PASSED' : 'FAILED'}
      </motion.div>

      <h3 className="text-6xl font-display font-black italic mb-1">
        {score}<span className="text-white/20 text-3xl"> / {total}</span>
      </h3>
      <p className={`text-xl font-black mb-1 ${passed ? 'text-forest-400' : 'text-blood'}`}>{Math.round(pct * 100)}%</p>
      <p className="text-white/25 text-[11px] font-bold uppercase tracking-widest mb-8">
        Passing mark: {Math.round(PASS_MARK * 100)}%
      </p>

      <div className="flex justify-center gap-3 mb-8">
        {[0, 1, 2].map(i => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.12, type: 'spring' }}>
            <Star className={`w-10 h-10 ${i < stars ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
          </motion.div>
        ))}
      </div>

      <p className="text-white/40 text-sm mb-10">
        {passed ? 'You can identify Mauritius game species. Keep it up.' : 'Study the wildlife pages and try again to sharpen your identification skills.'}
      </p>

      <button onClick={onRetry} className="flex items-center justify-center gap-2 mx-auto px-8 py-3 rounded-full bg-forest-600 hover:bg-forest-500 text-white text-sm font-bold transition-all">
        <RotateCcw className="w-4 h-4" /> Try Again
      </button>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SpeciesQuizPage() {
  const [round, setRound] = useState(0)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const { addXP, earnBadge } = useAppStore()

  const questions = useMemo(() => shuffle(QUESTIONS).slice(0, QUESTIONS_PER_ROUND), [round])

  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === questions[current].correct
    setIsCorrect(correct)
    const newScore = score + (correct ? 1 : 0)
    if (correct) setScore(newScore)

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(q => q + 1)
        setSelected(null)
        setIsCorrect(null)
      } else {
        setFinalScore(newScore)
        setFinished(true)
        addXP(newScore * 8)
        if (newScore === QUESTIONS_PER_ROUND) earnBadge('species_expert')
      }
    }, 1600)
  }

  const handleRetry = () => {
    setRound(r => r + 1)
    setCurrent(0)
    setScore(0)
    setSelected(null)
    setIsCorrect(null)
    setFinished(false)
    setFinalScore(0)
  }

  const q = questions[current]

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-forest-950">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-forest-950" />
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-forest-400 font-black uppercase tracking-[0.4em] text-xs block mb-4">Wildlife Knowledge</span>
          <h1 className="text-5xl md:text-8xl font-display font-black italic uppercase mb-4">Species ID</h1>
          <p className="text-white/40 max-w-lg mx-auto text-sm">
            Identify Mauritius game animals from silhouettes. Can you tell a legal target from a protected species?
          </p>
        </motion.div>
      </section>

      <section className="py-8 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {finished ? (
              <ScoreScreen key="score" score={finalScore} total={QUESTIONS_PER_ROUND} onRetry={handleRetry} />
            ) : (
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Progress */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                    Question {current + 1} of {questions.length}
                  </span>
                  <div className="flex gap-1.5">
                    {questions.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < current ? 'w-6 bg-forest-500' : i === current ? 'w-8 bg-forest-400' : 'w-6 bg-white/5'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-forest-400 uppercase tracking-widest">{score} pts</span>
                </div>

                {/* Silhouette card */}
                <div className="relative">
                  <div className="aspect-[4/3] bg-forest-900/30 border border-white/5 rounded-3xl flex items-center justify-center overflow-hidden p-8">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-56 h-56 text-white/80"
                    >
                      <q.silhouette />
                    </motion.div>
                    {/* Dramatic lighting effect */}
                    <div className="absolute inset-0 bg-radial-gradient pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(58,122,48,0.08) 0%, transparent 70%)' }} />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-4 blur-2xl bg-forest-500/20 rounded-full" />
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-forest-950/80 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-white/40">
                    <Crosshair className="w-3 h-3" /> Identify
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-xl md:text-2xl font-display font-bold italic">{q.prompt}</h3>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((option, i) => {
                    const isSelected = selected === i
                    const showCorrect = selected !== null && i === q.correct && !isCorrect
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                          isSelected && isCorrect ? 'bg-forest-600/20 border-forest-500 text-white'
                          : isSelected && !isCorrect ? 'bg-blood/20 border-blood/50 text-white'
                          : showCorrect ? 'bg-forest-600/10 border-forest-500/50 text-white/80'
                          : selected !== null ? 'bg-white/2 border-white/5 text-white/25 cursor-not-allowed'
                          : 'bg-forest-900/20 border-white/5 text-white/70 hover:border-white/20 hover:text-white cursor-pointer'
                        }`}
                      >
                        <span className="font-medium text-sm">{option}</span>
                        {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-forest-400 shrink-0" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-blood shrink-0" />}
                        {showCorrect && <CheckCircle2 className="w-5 h-5 text-forest-500/60 shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                {/* Fact reveal */}
                <AnimatePresence>
                  {selected !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border text-sm leading-relaxed ${isCorrect ? 'bg-forest-900/30 border-forest-700/30 text-white/70' : 'bg-blood/5 border-blood/20 text-white/70'}`}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-widest block mb-2 ${isCorrect ? 'text-forest-400' : 'text-blood/80'}`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'} — Field Note
                      </span>
                      {q.fact}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageWrapper>
  )
}
