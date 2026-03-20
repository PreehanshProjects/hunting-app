import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  // Sound
  soundEnabled: boolean
  toggleSound: () => void

  // XP & Gamification
  xp: number
  level: number
  badges: string[]         // badge IDs earned
  addXP: (amount: number) => void
  earnBadge: (badgeId: string) => void

  // User
  userName: string
  setUserName: (name: string) => void

  // Checklist
  checklist: Record<string, boolean>
  toggleChecklistItem: (id: string) => void

  // Saved guides
  savedGuides: string[]
  toggleSavedGuide: (id: string) => void

  // Quiz
  quizScore: number
  setQuizScore: (score: number) => void
}

// Use persist middleware so XP/badges survive refresh
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      soundEnabled: false,
      toggleSound: () => set(s => ({ soundEnabled: !s.soundEnabled })),

      xp: 0,
      level: 1,
      badges: [],
      addXP: (amount) => set(s => {
        const newXP = s.xp + amount
        const newLevel = Math.floor(newXP / 200) + 1  // every 200xp = 1 level
        return { xp: newXP, level: newLevel }
      }),
      earnBadge: (badgeId) => set(s => ({
        badges: s.badges.includes(badgeId) ? s.badges : [...s.badges, badgeId]
      })),

      userName: 'Hunter',
      setUserName: (name) => set({ userName: name }),

      checklist: {},
      toggleChecklistItem: (id) => set(s => ({
        checklist: { ...s.checklist, [id]: !s.checklist[id] }
      })),

      savedGuides: [],
      toggleSavedGuide: (id) => set(s => ({
        savedGuides: s.savedGuides.includes(id)
          ? s.savedGuides.filter(g => g !== id)
          : [...s.savedGuides, id]
      })),

      quizScore: 0,
      setQuizScore: (score) => set({ quizScore: score }),
    }),
    { name: 'hunting-app-store' }
  )
)
