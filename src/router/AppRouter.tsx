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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </BrowserRouter>
  )
}
