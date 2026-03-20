export interface Animal {
  id: string
  name: string
  scientificName: string
  localName: string        // Creole name
  difficulty: 1 | 2 | 3 | 4 | 5
  season: string
  habitat: string[]
  description: string
  longDescription: string
  techniques: string[]
  legalNotes: string[]
  imageUrl: string
  images?: string[]
  videoUrl?: string
  stats: {
    speed: number
    stealth: number
    rarity: number
    weight: string
  }
}

export interface LawCard {
  id: string
  category: string
  title: string
  description: string
  isLegal: boolean
  penalty?: string
  source: string
}

export interface HuntingZone {
  id: string
  name: string
  coords: [number, number]   // [lat, lng]
  difficulty: 'easy' | 'medium' | 'hard'
  animals: string[]
  isPrivate: boolean
  description: string
  animalDensity: number       // 1-10
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  xpRequired: number
  earned: boolean
  earnedAt?: Date
}

export interface UserProfile {
  id: string
  name: string
  xp: number
  level: number
  badges: Badge[]
  savedGuides: string[]
  checklist: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  category: 'legal' | 'gear' | 'safety' | 'preparation'
}
