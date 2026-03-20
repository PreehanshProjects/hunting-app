import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import HomePage from '../pages/Home/HomePage'
import WildlifePage from '../pages/Wildlife/WildlifePage'
import AnimalDetailPage from '../pages/Wildlife/AnimalDetailPage'
import GuidePage from '../pages/HuntingGuide/GuidePage'
import LawPage from '../pages/LawHub/LawPage'
import ZonesMapPage from '../pages/ZonesMap/ZonesMapPage'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import ArsenalPage from '../pages/Arsenal/ArsenalPage'
import DogsPage from '../pages/Dogs/DogsPage'
import JournalPage from '../pages/Journal/JournalPage'
import TrophyPage from '../pages/Trophy/TrophyPage'
import TracksPage from '../pages/Tracks/TracksPage'
import EstatesPage from '../pages/Estates/EstatesPage'
import CalendarPage from '../pages/Calendar/CalendarPage'
import AmmoPage from '../pages/Ammo/AmmoPage'
import ProcessingPage from '../pages/Processing/ProcessingPage'
import FirstAidPage from '../pages/FirstAid/FirstAidPage'
import SpeciesQuizPage from '../pages/SpeciesQuiz/SpeciesQuizPage'
import NotFoundPage from '../pages/NotFound/NotFoundPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wildlife" element={<WildlifePage />} />
          <Route path="/wildlife/:id" element={<AnimalDetailPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/law" element={<LawPage />} />
          <Route path="/zones" element={<ZonesMapPage />} />
          <Route path="/arsenal" element={<ArsenalPage />} />
          <Route path="/dogs" element={<DogsPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/trophy" element={<TrophyPage />} />
          <Route path="/tracks" element={<TracksPage />} />
          <Route path="/estates" element={<EstatesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/ammo" element={<AmmoPage />} />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/firstaid" element={<FirstAidPage />} />
          <Route path="/speciesquiz" element={<SpeciesQuizPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </BrowserRouter>
  )
}
