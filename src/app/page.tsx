import { HeroSection } from '@/components/home/hero-section'
import { FeaturedRaces } from '@/components/home/featured-races'
import { StatsSection } from '@/components/home/stats-section'
import { CTASection } from '@/components/home/cta-section'

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedRaces />
      <StatsSection />
      <CTASection />
    </div>
  )
}
