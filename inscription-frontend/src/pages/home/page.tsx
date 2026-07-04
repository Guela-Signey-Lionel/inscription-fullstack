import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import ProcessSection from './components/ProcessSection';
import TuitionFeesSection from './components/TuitionFeesSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsSection from './components/NewsSection';
import ContactSection from './components/ContactSection';
import CTASection from './components/CTASection';
import ServicesSection from './components/ServicesSection';

function AnimateOnScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`animate-hidden ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        const target = document.getElementById(state.scrollTo!);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location.state]);

  return (
    <main>
      <Navbar />
      <HeroSection />
      <AnimateOnScroll>
        <StatsSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <FeaturesSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ServicesSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ProcessSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <TuitionFeesSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <TestimonialsSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <NewsSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ContactSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <CTASection />
      </AnimateOnScroll>
      <Footer />
    </main>
  );
}