import HeroSection from '../components/hero-section';
import MainFeatureSection from '../components/MainFeatureSection';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <MainFeatureSection />
    </div>
  );
};

export default Homepage;