import HeroSection from './HeroSection';
import FeaturesGrid from './FeaturesGrid';
import AIPlatformSection from './AIPlatformSection';
import ArchitectureSection from './ArchitectureSection';
import DemoSection from './DemoSection';
import QuickStartSection from './QuickStartSection';

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <HeroSection />
        <FeaturesGrid />
        <AIPlatformSection />
        <ArchitectureSection />
        <DemoSection />
        <QuickStartSection />
      </div>
    </div>
  );
}
