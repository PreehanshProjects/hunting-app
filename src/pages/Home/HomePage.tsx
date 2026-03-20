import { PageWrapper } from '../../components/layout/PageWrapper'
import { HeroSection } from './sections/HeroSection'
import { StatsBanner } from './sections/StatsBanner'
import { FeaturedAnimal } from './sections/FeaturedAnimal'
import { QuickLawWarning } from './sections/QuickLawWarning'
import { ExploreGrid } from './sections/ExploreGrid'
import { SoundModeToggle } from './sections/SoundModeToggle'
import { ScrollReveal } from '../../components/animations/ScrollReveal'

export default function HomePage() {
  return (
    <PageWrapper>
      <HeroSection />
      
      <ScrollReveal>
        <StatsBanner />
      </ScrollReveal>

      <ScrollReveal>
        <FeaturedAnimal />
      </ScrollReveal>

      <ScrollReveal>
        <QuickLawWarning />
      </ScrollReveal>

      <ScrollReveal>
        <ExploreGrid />
      </ScrollReveal>

      <ScrollReveal>
        <SoundModeToggle />
      </ScrollReveal>
    </PageWrapper>
  )
}
