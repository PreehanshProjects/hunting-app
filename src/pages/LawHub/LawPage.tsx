import { useState, useRef, useMemo, useEffect } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { laws } from '../../data/laws'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ShieldCheck, ShieldAlert, Gavel, HelpCircle, CheckCircle2, XCircle, Star, Trophy, RotateCcw, Calendar } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { staggerContainer } from '../../animations/variants'
import { useTranslation } from 'react-i18next'
import confetti from 'canvas-confetti'

export default function LawPage() {
  const [filter, setFilter] = useState<'legal' | 'illegal'>('legal')
  const { addXP, earnBadge, setQuizScore } = useAppStore()
  const [showQuiz, setShowQuiz] = useState(false)
  const { t } = useTranslation()
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const filteredLaws = laws.filter(l => l.isLegal === (filter === 'legal'))

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <section ref={heroRef} className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-0 w-full h-[130%] -top-[15%]"
        >
          <img
            src="/common/Dogs-with-Hunting-Vests.jpg"
            alt="Hunting dogs"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/50 to-forest-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/60 via-transparent to-forest-950/60" />

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
            {t('law.tag')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-8xl font-display font-bold italic"
          >
            {t('law.title')}
          </motion.h1>
        </motion.div>

        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest-950 to-transparent" />
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Toggle */}
          <div className="flex justify-center mb-16">
            <div className="bg-forest-900/40 p-1 rounded-full border border-white/5 flex gap-1">
              <button
                onClick={() => setFilter('legal')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  filter === 'legal' ? 'bg-forest-600 text-white shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> {t('law.toggle_legal')}
              </button>
              <button
                onClick={() => setFilter('illegal')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  filter === 'illegal' ? 'bg-blood text-white shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4" /> {t('law.toggle_illegal')}
              </button>
            </div>
          </div>

          {/* Grid */}
          <motion.div
            layout
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredLaws.map((law) => (
                <motion.div
                  key={law.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <LawCard law={law} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Game Seasons */}
          <GameSeasons />

          {/* Quiz Section */}
          <div className="mt-32">
            {!showQuiz ? (
              <div className="max-w-4xl mx-auto p-12 bg-forest-900/20 border border-white/5 rounded-3xl text-center">
                <HelpCircle className="w-16 h-16 text-forest-500 mx-auto mb-6" />
                <h2 className="text-3xl font-display font-bold italic mb-4">{t('law.quiz_title')}</h2>
                <p className="text-white/40 mb-8 max-w-lg mx-auto">
                  {t('law.quiz_subtitle')}
                </p>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-10 py-4 bg-forest-600 text-white font-bold rounded-full hover:bg-forest-500 transition-all"
                >
                  {t('law.start')}
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <LegalQuiz onComplete={(score) => {
                  setQuizScore(score)
                  if (score === 8) {
                    earnBadge('law_expert')
                    addXP(100)
                  }
                  setShowQuiz(false)
                }} />
              </div>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

const SEASONS = [
  { animal: 'Deer (Cerfs)', latin: 'Cervus timorensis', period: '1st Sat of June → Last Sun of September', note: 'Fawns excluded', color: 'forest' },
  { animal: 'Partridge (Perdrix)', latin: 'Francolinus spp.', period: '2 April → 14 August', note: '', color: 'amber' },
  { animal: 'Quail (Caille)', latin: 'Coturnix japonica', period: '2 April → 14 August', note: '', color: 'amber' },
  { animal: 'Guinea Fowl (Pintade)', latin: 'Numida spp.', period: '16 April → 14 September', note: '', color: 'amber' },
  { animal: 'Hare (Lièvre)', latin: 'Lepus nigricollis', period: 'Open Season — all year', note: '', color: 'blue' },
  { animal: 'Wild Boar (Cochon marron)', latin: 'Sus spp.', period: 'Open Season — all year', note: '', color: 'blue' },
]

function GameSeasons() {
  return (
    <div className="mt-32 space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-forest-800 rounded-xl flex items-center justify-center shrink-0">
          <Calendar className="w-6 h-6 text-forest-400" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold italic">Hunting Seasons</h2>
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1">First Schedule — Wildlife & National Parks Act 1993</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SEASONS.map((s) => (
          <div
            key={s.animal}
            className={`p-7 rounded-2xl border flex flex-col gap-3 ${
              s.color === 'forest' ? 'bg-forest-900/30 border-forest-700/40'
              : s.color === 'amber' ? 'bg-amber-900/10 border-amber-700/30'
              : 'bg-blue-900/10 border-blue-700/20'
            }`}
          >
            <div>
              <h4 className="font-display font-bold italic text-lg">{s.animal}</h4>
              <p className="text-white/30 text-[11px] italic">{s.latin}</p>
            </div>
            <p className={`text-sm font-bold ${
              s.color === 'forest' ? 'text-forest-400'
              : s.color === 'amber' ? 'text-amber-400'
              : 'text-blue-400'
            }`}>
              {s.period}
            </p>
            {s.note && (
              <span className="text-[11px] font-bold uppercase tracking-widest text-blood/70">{s.note}</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-white/20 text-xs">Seasons may be amended by Ministerial Regulation. Always verify with NPCS before hunting.</p>
    </div>
  )
}

function LawCard({ law }: { law: any }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { t } = useTranslation()

  return (
    <div
      className="relative h-80 perspective-1000 cursor-pointer group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-forest-900/40 border border-white/5 rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${law.isLegal ? 'bg-forest-800' : 'bg-blood/20'}`}>
              {law.isLegal ? <ShieldCheck className="w-6 h-6 text-forest-400" /> : <ShieldAlert className="w-6 h-6 text-blood" />}
            </div>
            <h3 className="text-2xl font-display font-bold italic mb-4">{law.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed line-clamp-3">{law.description}</p>
          </div>
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-white/20">
            <span>{law.category}</span>
            <span className="group-hover:text-white/40 transition-colors">{t('law.hover')}</span>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden bg-forest-800 border border-white/10 rounded-2xl p-8 flex flex-col justify-between rotate-y-180">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-forest-400 mb-4">{t('law.detailed')}</h4>
            <p className="text-white/80 text-sm leading-relaxed mb-6">{law.description}</p>
            {!law.isLegal && (
              <div className="p-4 bg-blood/10 border border-blood/20 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-blood block mb-1">{t('law.penalty')}</span>
                <p className="text-xs text-white/60 font-medium">{law.penalty}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 truncate">
            <Gavel className="w-3 h-3" /> {law.source}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const QUESTION_BANK = [
  {
    q: "Under the Wildlife and National Parks Act 1993, is hunting at night permitted?",
    options: ["Yes, with a special night permit", "No, hunting between sunset and sunrise is prohibited", "Only on private land with the owner's consent"],
    correct: 1,
    ref: "s.18(1)(b) – Prohibited acts"
  },
  {
    q: "What is the minimum firearm calibre permitted for hunting deer in Mauritius?",
    options: [".22 LR rimfire", ".17 HMR", "Above .22 calibre (any centrefire above .22)"],
    correct: 2,
    ref: "s.19(1)(c) – Hunting of game"
  },
  {
    q: "Which firearm type is explicitly banned for hunting deer, in addition to the calibre restriction?",
    options: ["Bolt-action rifles", "A shotgun loaded with lead shot", "Lever-action rifles"],
    correct: 1,
    ref: "s.19(1)(c)(ii) – Hunting of game"
  },
  {
    q: "The maximum fine for most offences under the Act (other than Fourth Schedule species) is:",
    options: ["Rs 10,000", "Rs 50,000", "Rs 200,000"],
    correct: 1,
    ref: "s.26(2)(b) – Penalties"
  },
  {
    q: "Offences involving Fourth Schedule species (e.g. Mauritius pink pigeon, Mauritius kestrel) carry a penalty of:",
    options: ["Fine up to Rs 50,000 and/or 3 years imprisonment", "Fine up to Rs 100,000 and/or 5 years imprisonment", "A written warning from NPCS"],
    correct: 1,
    ref: "s.26(2)(a) – Penalties for Fourth Schedule species"
  },
  {
    q: "Game licence applications in Mauritius are submitted to:",
    options: ["The Director of NPCS", "The Commissioner of Police", "The Permanent Secretary of Environment"],
    correct: 1,
    ref: "s.20(1)(a) – Game licences"
  },
  {
    q: "Which of the following persons is ineligible to obtain a game licence?",
    options: ["A non-citizen visiting Mauritius", "A person convicted of an offence under the Act within the last 5 years", "A gamekeeper employed by a private estate"],
    correct: 1,
    ref: "s.21(1)(b) – Restriction on issue of game licences"
  },
  {
    q: "Is a game licence transferable between family members?",
    options: ["Yes, to an immediate family member only", "No, it is personal and non-transferable", "Yes, with written approval from the Commissioner of Police"],
    correct: 1,
    ref: "s.22(1) – Transfer of game licences"
  },
  {
    q: "The use of poison, drugs, explosives or fire to hunt any wildlife is:",
    options: ["Legal if authorised by NPCS for pest control", "Prohibited for game hunting under all circumstances", "Legal only for wild boar removal"],
    correct: 1,
    ref: "s.18(1)(c) – Prohibited methods"
  },
  {
    q: "Hunting, purchasing or possessing a snare or gin trap is:",
    options: ["Legal with a trapping permit from NPCS", "Legal only for hare", "Illegal under the Act with no permit exception"],
    correct: 2,
    ref: "s.18(2) – Snares and gin traps"
  },
  {
    q: "Using a vehicle to pursue or herd game is:",
    options: ["Permitted on private land if the landowner consents", "Prohibited under the Act", "Permitted during NPCS-authorised culls only"],
    correct: 1,
    ref: "s.19(1)(a)(ii) – Hunting from a vehicle"
  },
  {
    q: "Using artificial light to locate or shoot game is:",
    options: ["Legal if the hunter holds a night-vision endorsement", "Prohibited", "Legal only for hare during open season"],
    correct: 1,
    ref: "s.19(1)(a)(iii) – Artificial light prohibited"
  },
  {
    q: "Which of the following animals has an open (year-round) hunting season?",
    options: ["Rusa deer (Cervus timorensis)", "Wild boar (Sus spp.)", "Guinea fowl (Numida spp.)"],
    correct: 1,
    ref: "First Schedule – Game species and seasons"
  },
  {
    q: "What is the official open-season window for Rusa deer in Mauritius?",
    options: ["1 January to 31 March", "1st Saturday of June to last Sunday of September", "1 April to 30 June"],
    correct: 1,
    ref: "First Schedule – Deer season"
  },
  {
    q: "Can fawns (young deer calves) be hunted during the deer open season?",
    options: ["Yes, they count toward the bag limit", "No, the First Schedule explicitly excludes fawns", "Only if they weigh more than 20 kg"],
    correct: 1,
    ref: "First Schedule – 'other than fawns'"
  },
  {
    q: "The open season for Partridge (Perdrix) and Quail (Caille) in Mauritius runs from:",
    options: ["2 April to 14 August", "1 June to 30 September", "1 January to 28 February"],
    correct: 0,
    ref: "First Schedule – Partridge & Quail season"
  },
  {
    q: "Wild Guinea Fowl (Pintade sauvage) may legally be hunted between:",
    options: ["2 April and 14 August", "16 April and 14 September", "1 June and 30 September"],
    correct: 1,
    ref: "First Schedule – Guinea Fowl season"
  },
  {
    q: "The Mauritius pink pigeon and Mauritius kestrel are listed in:",
    options: ["The First Schedule as game species", "The Second Schedule as unprotected species", "The Fourth Schedule, attracting the most severe penalties"],
    correct: 2,
    ref: "Fourth Schedule – Severely protected species"
  },
  {
    q: "Which body is responsible for preparing management plans for National Parks?",
    options: ["The Commissioner of Police", "The Director of NPCS", "The Ministry of Tourism"],
    correct: 1,
    ref: "s.13 – Management plans for reserved land"
  },
  {
    q: "A landowner whose crops are being damaged by straying game may hunt that game, but must:",
    options: ["Send the carcass to the nearest police station immediately", "Report to NPCS within 7 days and retain the carcass", "Simply dispose of the carcass on their property"],
    correct: 0,
    ref: "s.19(3) – Crop-protection hunting"
  },
  {
    q: "A berried (egg-carrying) female camaron may be caught and sold under which conditions?",
    options: ["Any time, provided it measures more than 8.5 cm", "Never — this is prohibited at all times", "Only between June and September"],
    correct: 1,
    ref: "s.24(1)(a) – Camarons and shrimps"
  },
  {
    q: "Introducing a living animal (other than livestock or fish) into Mauritius requires:",
    options: ["No permit if the animal is privately owned", "A permit from the authorised officer", "Only a customs declaration form"],
    correct: 1,
    ref: "s.23(1) – Introduction of animals"
  },
  {
    q: "A semi-automatic or automatic firearm may be used for hunting:",
    options: ["Only on private estates with owner consent", "Never — such firearms are prohibited for hunting under the Act", "Only for wild boar control"],
    correct: 1,
    ref: "s.18(1)(c)(iv) – Automatic firearms prohibited"
  },
]

const QUESTIONS_PER_ROUND = 8

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const PASS_MARK = 0.7 // 70%

function ScoreScreen({ score, total, onRetry, onDone }: { score: number; total: number; onRetry: () => void; onDone: () => void }) {
  const pct = score / total
  const passed = pct >= PASS_MARK

  useEffect(() => {
    if (passed) {
      const duration = 4000
      const end = Date.now() + duration
      const frame = () => {
        confetti({
          particleCount: 8,
          spread: 90,
          origin: { x: Math.random(), y: Math.random() * 0.35 },
          colors: ['#3a7a30', '#5aaa46', '#f5c842', '#ffffff', '#fbbf24'],
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [passed])

  const passMessage = pct === 1
    ? "Perfect score! You are a certified law expert."
    : pct >= 0.875
    ? "Outstanding — top marks on Mauritian hunting law."
    : "Well done — you meet the legal knowledge standard."

  const failMessage = pct >= 0.5
    ? "So close! Review the sections you missed and try again."
    : "Keep studying the Wildlife and National Parks Act 1993."

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-3xl p-8 md:p-14 text-center border ${
        passed
          ? 'bg-forest-900/50 border-forest-600/40'
          : 'bg-blood/5 border-blood/20'
      }`}
    >
      {/* Pass / Fail badge */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.15, stiffness: 200 }}
        className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 ${
          passed
            ? 'bg-forest-600 text-white'
            : 'bg-blood/80 text-white'
        }`}
      >
        {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {passed ? 'PASSED' : 'FAILED'}
      </motion.div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <p className="text-white/30 text-sm font-bold uppercase tracking-widest mb-1">Your Score</p>
        <h3 className="text-6xl md:text-7xl font-display font-black italic mb-1">
          {score}
          <span className="text-white/20 text-4xl"> / {total}</span>
        </h3>
        <p className={`text-xl font-black mb-2 ${passed ? 'text-forest-400' : 'text-blood'}`}>
          {Math.round(pct * 100)}%
        </p>
        <p className="text-white/25 text-[11px] font-bold uppercase tracking-widest">
          Passing mark: {Math.round(PASS_MARK * 100)}% ({Math.ceil(total * PASS_MARK)}/{total} correct)
        </p>
      </motion.div>

      {/* Stars (only on pass) */}
      {passed && (
        <div className="flex justify-center gap-3 my-8">
          {[0, 1, 2].map(i => {
            const filled = pct === 1 ? 3 : pct >= 0.875 ? 2 : 1
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.45 + i * 0.12, type: 'spring' }}
              >
                <Star className={`w-10 h-10 ${i < filled ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Icon for fail */}
      {!passed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
          className="w-20 h-20 mx-auto my-8 rounded-full bg-blood/10 border border-blood/20 flex items-center justify-center"
        >
          <Trophy className="w-10 h-10 text-blood/40" />
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/50 text-sm mb-10 max-w-xs mx-auto leading-relaxed"
      >
        {passed ? passMessage : failMessage}
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-bold transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
        <button
          onClick={onDone}
          className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white text-sm font-bold transition-all ${
            passed ? 'bg-forest-600 hover:bg-forest-500' : 'bg-blood/70 hover:bg-blood'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Done
        </button>
      </div>
    </motion.div>
  )
}

function LegalQuiz({ onComplete }: { onComplete: (score: number) => void }) {
  const [round, setRound] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const questions = useMemo(
    () => shuffle(QUESTION_BANK).slice(0, QUESTIONS_PER_ROUND),
    [round] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return
    setSelectedOption(idx)
    const correct = idx === questions[currentQuestion].correct
    setIsCorrect(correct)
    const newScore = score + (correct ? 1 : 0)
    if (correct) setScore(newScore)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(q => q + 1)
        setSelectedOption(null)
        setIsCorrect(null)
      } else {
        setFinalScore(newScore)
        setFinished(true)
        onComplete(newScore)
      }
    }, 1400)
  }

  const handleRetry = () => {
    setRound(r => r + 1)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedOption(null)
    setIsCorrect(null)
    setFinished(false)
    setFinalScore(0)
  }

  if (finished) {
    return (
      <ScoreScreen
        score={finalScore}
        total={QUESTIONS_PER_ROUND}
        onRetry={handleRetry}
        onDone={() => onComplete(finalScore)}
      />
    )
  }

  const q = questions[currentQuestion]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="bg-forest-900/40 border border-white/5 rounded-3xl p-8 md:p-12"
      >
        <div className="flex justify-between items-center mb-10">
          <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < currentQuestion ? 'w-6 bg-forest-500' : i === currentQuestion ? 'w-8 bg-forest-400' : 'w-6 bg-white/5'
                }`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-display font-bold italic mb-8 leading-snug">
          {q.q}
        </h3>

        <div className="space-y-3 mb-8">
          {q.options.map((option, i) => {
            const isSelected = selectedOption === i
            const isWrong = isSelected && !isCorrect
            const isRight = isSelected && isCorrect
            const showCorrect = selectedOption !== null && i === q.correct && !isCorrect
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedOption !== null}
                className={`w-full p-5 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  isRight ? 'bg-forest-600/20 border-forest-500 text-white'
                  : isWrong ? 'bg-blood/20 border-blood/50 text-white'
                  : showCorrect ? 'bg-forest-600/10 border-forest-500/50 text-white/80'
                  : selectedOption !== null ? 'bg-forest-900/10 border-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-forest-900/20 border-white/5 text-white/60 hover:border-white/20 hover:text-white cursor-pointer'
                }`}
              >
                <span className="font-medium text-sm">{option}</span>
                {isRight && <CheckCircle2 className="w-5 h-5 text-forest-400 shrink-0" />}
                {isWrong && <XCircle className="w-5 h-5 text-blood shrink-0" />}
                {showCorrect && <CheckCircle2 className="w-5 h-5 text-forest-500/60 shrink-0" />}
              </button>
            )
          })}
        </div>

        {selectedOption !== null && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-white/30 font-bold uppercase tracking-widest"
          >
            Ref: {q.ref}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
