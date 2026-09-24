import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Pricing from '../components/landing/Pricing';
import BuyACow from '../components/landing/BuyACow';
import Features from '../components/landing/Features';
import About from '../components/landing/About';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="grow">
        <Hero />
        <Stats />
        <Pricing />
        <BuyACow />
        <Features />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}