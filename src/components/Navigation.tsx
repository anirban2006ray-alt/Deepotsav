import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PageTab, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { sound } from '../utils/audio';
import { 
  Flame, 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  Layers,
  Music,
  FileText,
  User as UserIcon,
  Moon
} from 'lucide-react';
import { LanguageDropdown } from './LanguageDropdown';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenDesignSystem: () => void;
  onOpenProfile: () => void;
  isNightSkyActive?: boolean;
  onToggleNightSky?: () => void;
  onOpenCelebration?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onSelectLang,
  onOpenDesignSystem,
  onOpenProfile,
  isNightSkyActive = true,
  onToggleNightSky,
  onOpenCelebration,
}) => {
  const { user, savedRangolis, savedECards } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const strings = getTranslation(lang);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMusicState = (e: any) => {
      if (e.detail && typeof e.detail.isPlaying === 'boolean') {
        setIsMusicPlaying(e.detail.isPlaying);
      }
    };
    window.addEventListener('diwali:music-state-changed', handleMusicState);
    return () => window.removeEventListener('diwali:music-state-changed', handleMusicState);
  }, []);

  const navLinks: Array<{ tab: PageTab; label: string }> = [
    { tab: 'home', label: strings.navHome },
    { tab: 'diya', label: strings.navDiya },
    { tab: 'rangoli', label: strings.navRangoli },
    { tab: 'ramayana', label: strings.navRamayana },
    { tab: 'ravana-dahan', label: strings.navRavanaDahan },
    { tab: 'diwali-return', label: strings.navDiwaliReturn },
    { tab: 'gallery', label: strings.navGallery },
    { tab: 'ecard', label: strings.navGreetings },
    { tab: 'theater', label: strings.navTheater || '3D Cinema' },
    { tab: 'about', label: strings.navAbout },
    { tab: 'pdf-showcase', label: strings.navPdf || 'Original PDF' },
  ];

  const handleCelebrateDiwali = () => {
    sound.playTempleBell();
    sound.playFirework();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.2 },
      colors: ['#FFC857', '#FF8C24', '#FF5B22', '#F47AA5', '#168B78', '#DDAA42'],
    });
    if (onOpenCelebration) {
      onOpenCelebration();
    }
  };

  const handleToggleMusic = async () => {
    const active = await sound.toggleAmbientMusic();
    setIsMusicPlaying(active);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080B1A]/95 border-b border-[#DDAA42]/30 backdrop-blur-md py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#080B1A]/90 to-transparent py-4 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF5B22] to-[#FFC857] p-0.5 shadow-[0_0_15px_rgba(255,140,36,0.4)] transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#080B1A] flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#FFC857] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="font-cinzel text-base md:text-lg font-bold tracking-wider text-gold-gradient leading-none">
              DIWALI <span className="text-[#FF8C24]">3D</span>
            </div>
            <div className="text-[9px] uppercase font-cinzel text-[#D6BD8B]/70 tracking-[0.2em]">
              A Magical Celebration
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6" aria-label="Main Navigation">
          {navLinks.map((item) => (
            <button
              key={item.tab}
              onClick={() => onSelectTab(item.tab)}
              className={`text-xs uppercase font-cinzel tracking-wider transition-colors relative py-1 ${
                currentTab === item.tab
                  ? 'text-[#FFC857] font-bold'
                  : 'text-[#D6BD8B]/80 hover:text-white'
              }`}
            >
              {item.label}
              {currentTab === item.tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF8C24] to-[#FFC857] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right Action Icons & CTA */}
        <div className="flex items-center gap-3">
          {/* Night Sky Mode Toggle */}
          <button
            onClick={onToggleNightSky}
            className={`p-2 rounded-full border text-xs flex items-center gap-1.5 transition ${
              isNightSkyActive
                ? 'border-[#FFC857] bg-[#FFC857]/15 text-[#FFC857] shadow-[0_0_12px_rgba(255,200,87,0.35)]'
                : 'border-white/10 text-[#D6BD8B]/70 hover:border-white/30'
            }`}
            title={isNightSkyActive ? 'Night Sky Active: Animated Starfield & Shooting Stars' : 'Enable Night Sky Background'}
            aria-label="Toggle Night Sky starfield background"
            aria-pressed={isNightSkyActive}
          >
            <Moon className={`w-3.5 h-3.5 transition-transform ${isNightSkyActive ? 'text-[#FFC857] fill-[#FFC857]/20 scale-110' : ''}`} />
            <span className="hidden md:inline text-[11px] font-cinzel">
              {isNightSkyActive ? 'Night Sky' : 'Sky Off'}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${isNightSkyActive ? 'bg-[#FFC857] shadow-[0_0_6px_#FFC857]' : 'bg-white/20'}`} />
          </button>

          {/* Ambient Music Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`p-2 rounded-full border text-xs flex items-center gap-1.5 transition ${
              isMusicPlaying
                ? 'border-[#FFC857] bg-[#FF8C24]/15 text-[#FFC857] shadow-[0_0_12px_rgba(255,200,87,0.3)]'
                : 'border-white/10 text-[#D6BD8B]/70 hover:border-white/30'
            }`}
            title={isMusicPlaying ? 'Stop Ambient Music' : 'Play Festive Tanpura Drone'}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
            <span className="hidden md:inline text-[11px] font-cinzel">
              {isMusicPlaying ? 'Music On' : 'Music Off'}
            </span>
          </button>

          {/* Language Selection Dropdown with Flag and Slide-Down Animation */}
          <LanguageDropdown
            lang={lang}
            onSelectLang={onSelectLang}
          />

          {/* Personal Account & Saved Designs Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#DDAA42]/30 hover:border-[#FFC857] bg-[#11152B]/90 text-xs font-cinzel text-[#F4EBDD] hover:text-[#FFC857] transition-all shadow-sm"
            title={user ? `Profile: ${user.displayName || user.email}` : 'Sign In / Profile'}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Account'}
                className="w-4 h-4 rounded-full object-cover border border-[#FFC857]"
              />
            ) : (
              <UserIcon className="w-3.5 h-3.5 text-[#FF8C24]" />
            )}
            <span className="hidden md:inline font-semibold">
              {user ? user.displayName?.split(' ')[0] || 'Profile' : 'Profile'}
            </span>
            {(savedRangolis.length > 0 || savedECards.length > 0) && (
              <span className="w-4 h-4 rounded-full bg-[#FF8C24] text-[10px] text-[#080B1A] font-bold flex items-center justify-center">
                {savedRangolis.length + savedECards.length}
              </span>
            )}
          </button>

          {/* Design System button */}
          <button
            onClick={onOpenDesignSystem}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DDAA42]/30 text-xs font-cinzel text-[#D6BD8B] hover:text-[#FFC857] hover:border-[#FFC857] transition"
            title="Open Design System & Brand Identity"
          >
            <Layers className="w-3.5 h-3.5 text-[#FF8C24]" />
            <span className="hidden lg:inline">Design System</span>
          </button>

          {/* Celebrate Diwali CTA */}
          <button
            onClick={handleCelebrateDiwali}
            className="hidden sm:flex py-2 px-3.5 rounded-full bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs items-center gap-1.5 hover:opacity-95 transition shadow-[0_0_20px_rgba(255,140,36,0.35)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{strings.celebrateCta}</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#080B1A]/98 border-b border-[#DDAA42]/30 p-6 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <button
                key={item.tab}
                onClick={() => {
                  onSelectTab(item.tab);
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 px-4 rounded-xl text-left text-sm font-cinzel uppercase tracking-wider transition ${
                  currentTab === item.tab
                    ? 'bg-[#FF8C24]/15 border border-[#FF8C24] text-[#FFC857] font-bold'
                    : 'text-[#D6BD8B] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenDesignSystem();
                setIsMobileMenuOpen(false);
              }}
              className="py-2 px-4 rounded-xl text-left text-sm font-cinzel uppercase tracking-wider text-[#D6BD8B] border border-white/10 flex items-center gap-2 mt-2"
            >
              <Layers className="w-4 h-4 text-[#FF8C24]" />
              <span>Design System</span>
            </button>
            <button
              onClick={() => {
                onOpenProfile();
                setIsMobileMenuOpen(false);
              }}
              className="py-2 px-4 rounded-xl text-left text-sm font-cinzel uppercase tracking-wider text-[#FFC857] border border-[#FFC857]/30 bg-[#FF8C24]/10 flex items-center justify-between mt-2"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#FF8C24]" />
                <span>{user ? `Account (${user.displayName || 'Signed In'})` : 'Sign In / Profile'}</span>
              </div>
              {(savedRangolis.length > 0 || savedECards.length > 0) && (
                <span className="px-2 py-0.5 rounded-full bg-[#FF8C24] text-[10px] text-[#080B1A] font-bold">
                  {savedRangolis.length + savedECards.length}
                </span>
              )}
            </button>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between px-2 mt-2">
              <div className="flex items-center gap-2">
                <Moon className={`w-4 h-4 ${isNightSkyActive ? 'text-[#FFC857]' : 'text-[#D6BD8B]/70'}`} />
                <span className="text-xs font-cinzel text-[#D6BD8B]/90 uppercase tracking-wider">Night Sky Mode</span>
              </div>
              <button
                onClick={onToggleNightSky}
                className={`px-3 py-1 rounded-full text-xs font-cinzel border transition ${
                  isNightSkyActive
                    ? 'border-[#FFC857] bg-[#FFC857]/20 text-[#FFC857] font-bold'
                    : 'border-white/10 text-[#D6BD8B]/60'
                }`}
              >
                {isNightSkyActive ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between px-2 mt-2">
              <span className="text-xs font-cinzel text-[#D6BD8B]/70 uppercase tracking-wider">Language</span>
              <LanguageDropdown lang={lang} onSelectLang={onSelectLang} isMobileDrawer={true} />
            </div>
            <button
              onClick={() => {
                handleCelebrateDiwali();
                setIsMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{strings.celebrateCta}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
