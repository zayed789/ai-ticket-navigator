import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HeroSection } from '@/components/home/HeroSection';
import { MetricsBar } from '@/components/home/MetricsBar';
import { ProductAnimationSection } from '@/components/home/ProductAnimationSection';
import { Footer } from '@/components/home/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      <main>
        <HeroSection />
        <MetricsBar />
        <ProductAnimationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
