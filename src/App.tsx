import React, { useState, useEffect, useRef } from 'react';
import { PageTab, Language } from './types';
import { getTranslation } from './utils/translations';
import { sound } from './utils/audio';
import { AuthProvider, SavedRangoliItem, SavedECardItem } from './context/AuthContext';
import { UserProfileModal } from './components/UserProfileModal';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { FestivalEffects } from './components/FestivalEffects';
import { HeroDiya3D } from './components/HeroDiya3D';
import { ThreeDiyaExperience } from './components/ThreeDiyaExperience';
import { RangoliStudio } from './components/RangoliStudio';
import { ECardGenerator } from './components/ECardGenerator';
import { RamayanaStory } from './components/RamayanaStory';
import { RavanaDahanCinematic } from './components/RavanaDahanCinematic';
import { DiwaliReturnScene } from './components/DiwaliReturnScene';
import { DiwaliGallery } from './components/DiwaliGallery';
import { AboutDiwali } from './components/AboutDiwali';
import { PdfShowcase } from './components/PdfShowcase';
import { AnimatedShowsTheater } from './components/AnimatedShowsTheater';
import { FestiveAdShowcase } from './components/FestiveAdShowcase';
import { Diwali3DLightingSymphony } from './components/Diwali3DLightingSymphony';
import { DesignSystemModal } from './components/DesignSystemModal';
import { NightSkyBackground } from './components/NightSkyBackground';
import { DiwaliCelebrationWelcome } from './components/DiwaliCelebrationWelcome';
import { 
  ArrowIcon, 
  DiyaIcon, 
  FlowerIcon, 
  StoryIcon, 
  SparkIcon 
} from './components/FestiveIcons';
import { 
  Sparkles, 
  Sun, 
  ShieldCheck, 
  Palette, 
  Heart 
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [lang, setLang] = useState<Language>('en');
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [loadedRangoli, setLoadedRangoli] = useState<SavedRangoliItem | null>(null);
  const [loadedECard, setLoadedECard] = useState<SavedECardItem | null>(null);
  const [isCelebrated, setIsCelebrated] = useState<boolean>(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('diwali_celebration_welcomed') !== 'true';
    }
    return true;
  });
  const [isNightSkyActive, setIsNightSkyActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('diwali_night_sky');
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });
  const strings = getTranslation(lang);

  const handleCloseCelebration = () => {
    setIsCelebrationOpen(false);
    try {
      sessionStorage.setItem('diwali_celebration_welcomed', 'true');
    } catch (e) {
      // ignore
    }
  };

  const handleToggleNightSky = () => {
    setIsNightSkyActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('diwali_night_sky', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const featureCardsRef = useRef<HTMLDivElement>(null);
  const [areCardsVisible, setAreCardsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!featureCardsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAreCardsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(featureCardsRef.current);
    return () => observer.disconnect();
  }, [currentTab]);

  // Automatic Theme Song on App Open
  useEffect(() => {
    // 1. Try to start the theme song immediately
    sound.playThemeSong().catch(() => {});

    // 2. Modern browsers require a user interaction (click/touch/key) before audio with sound can play.
    // Register a one-time gesture listener so the very first click or touch automatically starts the music.
    const handleFirstGesture = () => {
      sound.playThemeSong().catch(() => {});
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Listen to custom navigation events
  useEffect(() => {
    const handleNavEvent = (e: any) => {
      if (e.detail) {
        setCurrentTab(e.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('nav-tab', handleNavEvent);
    return () => window.removeEventListener('nav-tab', handleNavEvent);
  }, []);

  const handleTabChange = (tab: PageTab) => {
    setCurrentTab(tab);
    sound.playDiyaLight();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIlluminateWorld = () => {
    window.dispatchEvent(new Event('diwali:celebrate'));
    sound.playTempleBell();
    sound.playFirework();
    setIsCelebrated(true);
    setIsCelebrationOpen(true);
    setTimeout(() => setIsCelebrated(false), 3000);
  };

  const handleLoadRangoli = (item: SavedRangoliItem) => {
    setLoadedRangoli(item);
    setCurrentTab('rangoli');
    setIsProfileOpen(false);
    sound.playDiyaLight();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewECard = (card: SavedECardItem) => {
    setLoadedECard(card);
    setCurrentTab('ecard');
    setIsProfileOpen(false);
    sound.playDiyaLight();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#080B1A] text-[#F4EBDD] font-sans relative selection:bg-[#FF8C24] selection:text-white">
        {/* Festive Fairy Lights Garland across the top header */}
        <div className="festive-fairy-lights" aria-hidden="true">
          {Array.from({ length: 32 }).map((_, i) => {
            const colors = ['bulb-gold', 'bulb-saffron', 'bulb-ruby', 'bulb-emerald', 'bulb-lotus'];
            return <span key={i} className={`fairy-bulb ${colors[i % colors.length]}`} />;
          })}
        </div>

        {/* Toggleable Night Sky Starfield & Shooting Stars */}
        <NightSkyBackground active={isNightSkyActive} />

        {/* Global Particle Effects Layer */}
        <FestivalEffects />

        {/* Global Navigation Header */}
        <Navigation
          currentTab={currentTab}
          onSelectTab={handleTabChange}
          lang={lang}
          onSelectLang={setLang}
          onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          isNightSkyActive={isNightSkyActive}
          onToggleNightSky={handleToggleNightSky}
          onOpenCelebration={() => setIsCelebrationOpen(true)}
        />

      {/* Main Page Content */}
      <main>
        {currentTab === 'home' && (
          <div className="pt-20">
            {/* HERO SECTION */}
            <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 md:px-8 pt-10 pb-16">
              {/* Atmospheric layers from design */}
              <div className="star-field" aria-hidden="true" />
              <div className="hero-aura" aria-hidden="true" />
              <div className="floating-petal petal-a" aria-hidden="true" />
              <div className="floating-petal petal-b" aria-hidden="true" />

              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
                {/* Left Hero Copy */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11152B] border border-[#DDAA42]/30 text-xs font-cinzel text-[#FFC857] mb-6">
                    <SparkIcon className="w-3.5 h-3.5 text-[#FF8C24]" />
                    <span>{strings.heroKicker}</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-playfair font-bold text-white tracking-tight leading-[1.08] mb-6">
                    Celebrate the <br />
                    <span className="text-gold-gradient">Magic of Diwali</span>
                  </h1>

                  <p className="text-base sm:text-lg text-[#D6BD8B]/90 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                    {strings.heroSubtitle}
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <button
                      onClick={() => handleTabChange('diya')}
                      className="py-3.5 px-7 rounded-full bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-[0_0_25px_rgba(255,140,36,0.4)]"
                    >
                      <span>{strings.exploreExp}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleTabChange('about')}
                      className="py-3.5 px-7 rounded-full bg-[#11152B] border border-[#DDAA42]/40 text-[#FFC857] font-bold font-cinzel text-xs hover:border-[#FFC857] transition"
                    >
                      <span>{strings.ourTraditions}</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('pdf-showcase')}
                      className="py-3.5 px-6 rounded-full bg-[#11152B]/90 border border-[#FFC857]/60 text-[#FFC857] font-bold font-cinzel text-xs flex items-center gap-2 hover:bg-[#FFC857]/15 transition shadow-lg"
                    >
                      <span>📖 Original Design PDF</span>
                    </button>
                  </div>

                  {/* Micro stats */}
                  <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-center lg:justify-start gap-8 text-xs font-cinzel text-[#D6BD8B]/70">
                    <div>
                      <span className="block text-lg font-bold text-white font-playfair">3D PBR</span>
                      <span>Real-time Three.js</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <span className="block text-lg font-bold text-white font-playfair">6 Chapters</span>
                      <span>Ramayana Chronicle</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <span className="block text-lg font-bold text-white font-playfair">Custom Art</span>
                      <span>E-Cards & Rangoli</span>
                    </div>
                  </div>
                </div>

                {/* Right Hero: Real-time 3D Procedural Diya with Interactive Orbit */}
                <div className="relative flex items-center justify-center">
                  <div className="w-full max-w-lg aspect-square rounded-full border border-[#DDAA42]/20 p-4 bg-gradient-to-b from-[#11152B]/40 to-transparent backdrop-blur-sm relative">
                    <div className="absolute inset-4 rounded-full border border-dashed border-[#FFC857]/20 spin-slow pointer-events-none" />
                    <div className="absolute inset-12 rounded-full border border-[#FF8C24]/15 pointer-events-none" />

                    <HeroDiya3D isLit={true} />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: 3D ADVERTISEMENT REEL & CONTINUOUS VIDEO SLIDESHOW */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <FestiveAdShowcase onNavigateTab={handleTabChange} />
            </div>

            {/* SECTION: 3D AUDIO-REACTIVE LIGHTING & 10-LANGUAGE SYMPHONY */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <Diwali3DLightingSymphony />
            </div>

            {/* SECTION: FIVE LARGE INTERACTIVE FEATURE CARDS */}
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
              <div className="mandala-watermark" aria-hidden="true" />

              <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
                <span className="text-xs uppercase tracking-[0.25em] text-[#FF8C24] font-cinzel block mb-2">
                  ✦ ENTER THE CELEBRATION ✦
                </span>
                <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white">
                  Tradition. With a New Dimension.
                </h2>
                <p className="mt-3 text-sm text-[#D6BD8B]/80">
                  Select an interactive world to experience the beauty, craft, and stories of the Festival of Lights.
                </p>
              </div>

              <div 
                ref={featureCardsRef}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 feature-cards-grid ${areCardsVisible ? 'in-view' : ''}`}
              >
                {/* Card 1: 3D Diya */}
                <div
                  onClick={() => handleTabChange('diya')}
                  className="glass-card glass-card-hover p-7 rounded-3xl border border-[#DDAA42]/30 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-cinzel text-[#FF8C24] tracking-widest font-bold">
                        01 / EXPERIENCE
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#FF8C24]/15 flex items-center justify-center text-[#FF8C24] group-hover:scale-110 transition">
                        <DiyaIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-white group-hover:text-gold-gradient transition mb-2">
                      Light a Diya
                    </h3>
                    <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">
                      A quiet sacred ritual, beautifully reimagined. Interact with 5 distinct traditional brass and golden diya models with realistic flickering flames.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-cinzel text-[#FFC857] group-hover:translate-x-1 transition">
                    <span>Explore Diya Studio</span>
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Card 2: Rangoli Studio */}
                <div
                  onClick={() => handleTabChange('rangoli')}
                  className="glass-card glass-card-hover p-7 rounded-3xl border border-[#DDAA42]/30 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-cinzel text-[#F47AA5] tracking-widest font-bold">
                        02 / EXPERIENCE
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#F47AA5]/15 flex items-center justify-center text-[#F47AA5] group-hover:scale-110 transition">
                        <FlowerIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-white group-hover:text-gold-gradient transition mb-2">
                      Create Your Rangoli
                    </h3>
                    <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">
                      Let colour become a celebration. Place petals, lotus blooms, and peacock motifs with dynamic 4 to 16-fold symmetry, then export to 3D.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-cinzel text-[#FFC857] group-hover:translate-x-1 transition">
                    <span>Open Rangoli Canvas</span>
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Card 3: Ramayana */}
                <div
                  onClick={() => handleTabChange('ramayana')}
                  className="glass-card glass-card-hover p-7 rounded-3xl border border-[#DDAA42]/30 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-cinzel text-[#DDAA42] tracking-widest font-bold">
                        03 / EXPERIENCE
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#DDAA42]/15 flex items-center justify-center text-[#DDAA42] group-hover:scale-110 transition">
                        <StoryIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-white group-hover:text-gold-gradient transition mb-2">
                      Explore Ramayana
                    </h3>
                    <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">
                      A timeless journey of courage and devotion. Walk through six cinematic chapters with audio narration, subtitles in 3 languages, and AI reflections.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-cinzel text-[#FFC857] group-hover:translate-x-1 transition">
                    <span>Read the Chronicle</span>
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Card 4: Ravana Dahan */}
                <div
                  onClick={() => handleTabChange('ravana-dahan')}
                  className="glass-card glass-card-hover p-7 rounded-3xl border border-[#DDAA42]/30 flex flex-col justify-between cursor-pointer group md:col-span-1 lg:col-span-2"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-cinzel text-[#FF5B22] tracking-widest font-bold">
                        04 / CINEMATIC ATTRACTION
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#FF5B22]/15 flex items-center justify-center text-[#FF5B22] group-hover:scale-110 transition">
                        <SparkIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white group-hover:text-gold-gradient transition mb-2">
                      Experience Ravana Dahan
                    </h3>
                    <p className="text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed max-w-2xl">
                      Witness the symbolic victory of truth over darkness. Step into a 5-scene 3D festival ground with the ten-headed effigy, celestial arrow of light, controlled sparks, and grand celebration fireworks.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-cinzel text-[#FFC857] group-hover:translate-x-1 transition">
                    <span>Enter 3D Cinematic Grounds</span>
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Card 5: Share Happiness / E-Card */}
                <div
                  onClick={() => handleTabChange('ecard')}
                  className="glass-card glass-card-hover p-7 rounded-3xl border border-[#DDAA42]/30 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-cinzel text-[#168B78] tracking-widest font-bold">
                        05 / EXPERIENCE
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#168B78]/15 flex items-center justify-center text-[#168B78] group-hover:scale-110 transition">
                        <SparkIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-white group-hover:text-gold-gradient transition mb-2">
                      Share Diwali Happiness
                    </h3>
                    <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">
                      Craft personalized digital Diwali e-cards. Embed your custom rangoli artwork, add festive stickers, write or generate AI greetings, and share instantly.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-cinzel text-[#FFC857] group-hover:translate-x-1 transition">
                    <span>Create Festive Card</span>
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Card 6: 3D Cinema & Cartoons */}
                <div
                  onClick={() => handleTabChange('theater')}
                  className="glass-card glass-card-hover p-7 rounded-3xl border border-[#FF8C24]/40 flex flex-col justify-between cursor-pointer group bg-gradient-to-b from-[#141933]/80 to-[#1F1020]/60 md:col-span-1 lg:col-span-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-cinzel text-[#FFC857] tracking-widest font-bold">
                          06 / 3D ANIMATION & CINEMA
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF8C24]/20 text-[#FFC857] text-[10px] font-cinzel">
                          NEW
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white group-hover:text-gold-gradient transition mb-2">
                        3D Cinema, Cartoons & Beach Fireworks
                      </h3>
                      <p className="text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed max-w-3xl">
                        Watch "The Little Diya's Quest" procedural 3D cartoon, atmospheric beach firecracker simulations with water reflections, and grand aerial firework shows rendered with Python and WebGL.
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-[#FFC857]/20 border border-[#FFC857]/40 flex items-center justify-center text-2xl group-hover:scale-110 transition shrink-0">
                      🎬
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-cinzel text-[#FFC857] group-hover:translate-x-1 transition">
                    <span>Step into the 3D Cinema Theater</span>
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </section>

            {/* CINEMATIC FINALE VICTORY PANEL (From user design files) */}
            <section className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
              <div className="victory-panel">
                <div className="victory-sun" aria-hidden="true">
                  <SparkIcon className="w-32 h-32 text-[#7B260E] opacity-20" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#793213] font-cinzel font-bold mb-3 flex items-center gap-2">
                    <span className="w-6 h-px bg-[#793213]" /> The Cinematic Finale
                  </p>
                  <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl text-[#301308] font-bold leading-tight tracking-tight mb-4">
                    Witness the Victory of Light.
                  </h2>
                  <p className="text-sm md:text-base text-[#6E351C] leading-relaxed mb-8 max-w-xl">
                    Take aim in a symbolic Ravana Dahan—an atmospheric celebration of courage, wisdom, and good overcoming evil.
                  </p>
                  <button
                    onClick={() => handleTabChange('ravana-dahan')}
                    className="py-3.5 px-8 rounded-full bg-[#341308] text-[#FFE0A1] font-bold font-cinzel text-xs flex items-center gap-2 hover:bg-[#200A04] transition shadow-xl"
                  >
                    <span>Enter the Finale</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="effigy-silhouette hidden sm:block" aria-hidden="true">
                  <span className="head head-left" />
                  <span className="head head-center" />
                  <span className="head head-right" />
                  <span className="effigy-body" />
                </div>
              </div>
            </section>

            {/* SECTION: FESTIVAL MEANING & PILLARS */}
            <section className="py-20 px-4 md:px-8 border-y border-[#DDAA42]/20 bg-[#11152B]/40">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                <div>
                  <span className="text-xs uppercase tracking-widest font-cinzel text-[#FF8C24] block mb-2">
                    THE SPIRIT OF DIWALI
                  </span>
                  <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white leading-tight mb-4">
                    Light is a Language We All Understand.
                  </h2>
                  <p className="text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed mb-6">
                    A lamp at the doorway. A courtyard filled with rangoli powder. A fresh beginning shared with the people we cherish.
                  </p>
                  <button
                    onClick={() => handleTabChange('about')}
                    className="py-2.5 px-5 rounded-full border border-[#DDAA42]/40 text-xs font-cinzel text-[#FFC857] hover:border-[#FFC857] transition"
                  >
                    Discover the Cultural Meaning →
                  </button>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-[#080B1A]/80 border border-white/10">
                    <Sun className="w-6 h-6 text-[#FFC857] mb-3" />
                    <h3 className="font-cinzel text-base font-bold text-white mb-2">Triumph of Light</h3>
                    <p className="text-xs text-[#D6BD8B]/70 leading-relaxed">
                      The core truth that knowledge dispels ignorance, and a single quiet flame can push back an ocean of shadows.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#080B1A]/80 border border-white/10">
                    <ShieldCheck className="w-6 h-6 text-[#FF8C24] mb-3" />
                    <h3 className="font-cinzel text-base font-bold text-white mb-2">Duty & Righteousness</h3>
                    <p className="text-xs text-[#D6BD8B]/70 leading-relaxed">
                      Lord Rama's adherence to dharma exemplifies that courage and truth are moral daily choices.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#080B1A]/80 border border-white/10">
                    <Palette className="w-6 h-6 text-[#F47AA5] mb-3" />
                    <h3 className="font-cinzel text-base font-bold text-white mb-2">Hospitality & Rangoli</h3>
                    <p className="text-xs text-[#D6BD8B]/70 leading-relaxed">
                      Intricate patterns at the threshold invite Goddess Lakshmi, prosperity, and blessings for every visitor.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#080B1A]/80 border border-white/10">
                    <Heart className="w-6 h-6 text-[#168B78] mb-3" />
                    <h3 className="font-cinzel text-base font-bold text-white mb-2">Togetherness & Sharing</h3>
                    <p className="text-xs text-[#D6BD8B]/70 leading-relaxed">
                      Sharing mithai sweets, lighting sparklers, and sending blessings to family across oceans and borders.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CALL TO ACTION BANNER */}
            <section className="py-24 px-4 md:px-8 text-center max-w-4xl mx-auto">
              <span className="text-4xl text-[#FFC857] block mb-3 font-serif">शुभ दीपावली</span>
              <h2 className="text-3xl md:text-5xl font-playfair font-bold text-gold-gradient mb-4">
                Illuminate the World
              </h2>
              <p className="text-xs md:text-sm text-[#D6BD8B]/80 max-w-xl mx-auto leading-relaxed mb-8">
                Experience the Festival of Lights Through Art, Culture and Technology. Kindle your diya, create art, and share love with everyone.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleIlluminateWorld}
                  className="py-3.5 px-8 rounded-full bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-[0_0_25px_rgba(255,140,36,0.4)]"
                >
                  <SparkIcon className="w-4 h-4" />
                  <span>{isCelebrated ? 'The World is Glowing!' : 'Illuminate the World'}</span>
                </button>
                <button
                  onClick={() => handleTabChange('ecard')}
                  className="py-3.5 px-8 rounded-full bg-[#11152B] border border-[#DDAA42]/40 text-[#FFC857] font-bold font-cinzel text-xs hover:border-[#FFC857] transition"
                >
                  Create Diwali E-Card
                </button>
                <button
                  onClick={() => handleTabChange('pdf-showcase')}
                  className="py-3.5 px-8 rounded-full bg-[#11152B] border border-[#FFC857]/60 text-[#FFC857] font-bold font-cinzel text-xs flex items-center gap-2 hover:border-[#FFC857] hover:bg-[#FFC857]/10 transition shadow-lg"
                >
                  <span>📖 Original PDF Document</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {currentTab === 'diya' && (
          <div>
            <ThreeDiyaExperience />
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
              <Diwali3DLightingSymphony />
            </div>
          </div>
        )}
        {currentTab === 'rangoli' && (
          <RangoliStudio
            onOpenProfile={() => setIsProfileOpen(true)}
            initialRangoli={loadedRangoli}
          />
        )}
        {currentTab === 'ramayana' && <RamayanaStory />}
        {currentTab === 'ravana-dahan' && <RavanaDahanCinematic />}
        {currentTab === 'diwali-return' && <DiwaliReturnScene />}
        {currentTab === 'gallery' && <DiwaliGallery />}
        {currentTab === 'ecard' && (
          <ECardGenerator
            onOpenProfile={() => setIsProfileOpen(true)}
            initialCard={loadedECard}
          />
        )}
        {currentTab === 'theater' && <AnimatedShowsTheater />}
        {currentTab === 'about' && <AboutDiwali />}
        {currentTab === 'pdf-showcase' && <PdfShowcase onNavigateTab={handleTabChange} />}
      </main>

      {/* Global Footer */}
      <Footer
        onSelectTab={handleTabChange}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
      />

      {/* Design System Modal */}
      <DesignSystemModal
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
      />

      {/* Personal Account Profile & Saved Collections Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLoadRangoli={handleLoadRangoli}
        onViewECard={handleViewECard}
      />

      {/* Floating 3D Diwali Celebration & Patakha Launcher Button */}
      <button
        onClick={() => setIsCelebrationOpen(true)}
        className="fixed bottom-6 right-6 z-40 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#FF8C24] via-[#FFC857] to-[#DDAA42] text-[#080B1A] font-cinzel font-bold text-xs flex items-center gap-2 shadow-[0_0_30px_rgba(255,140,36,0.6)] hover:scale-105 active:scale-95 transition border border-[#FFF0B3]/40 group"
        title="Light Patakha & Open 3D Diwali Celebration"
        aria-label="Open Diwali Fireworks Celebration"
      >
        <span className="text-base group-hover:scale-125 transition-transform animate-pulse">🎆</span>
        <span className="hidden sm:inline">Light Patakha & Celebrate</span>
        <span className="sm:hidden">Celebrate</span>
      </button>

      {/* 3D Diwali Celebration Welcome with Interactive Indian Firecrackers & Lights */}
      <DiwaliCelebrationWelcome
        isOpen={isCelebrationOpen}
        onClose={handleCloseCelebration}
      />
    </div>
    </AuthProvider>
  );
}
