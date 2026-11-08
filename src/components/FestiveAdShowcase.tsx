import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
  Sparkles, 
  Film, 
  Tv, 
  Maximize, 
  Download, 
  Flame, 
  ExternalLink,
  ChevronRight,
  Radio,
  Minimize2
} from 'lucide-react';
import { sound } from '../utils/audio';

export interface AdVideoItem {
  id: string;
  adNumber: number;
  totalAds: number;
  title: string;
  tagline: string;
  brandSponsor: string;
  duration: string;
  durationSec: number;
  videoSrc: string;
  badge: string;
  aspectRatio: string;
  ctaText: string;
  ctaTab: string;
  highlights: string[];
}

export const AD_VIDEOS: AdVideoItem[] = [
  {
    id: 'ad-cartoon',
    adNumber: 1,
    totalAds: 4,
    title: "The Little Diya's Quest – 3D Cartoon Story",
    tagline: 'A brave earthen diya traverses ancient India to rekindle the celestial temple flame.',
    brandSponsor: 'Deepotsav Animation Studios',
    duration: '0:32',
    durationSec: 32,
    videoSrc: '/assets/aistudio/diwali_cartoon_903d1f42.mp4',
    badge: '3D Anime Cartoon Ad',
    aspectRatio: '9:16',
    ctaText: 'Explore in 3D Cinema',
    ctaTab: 'theater',
    highlights: ['Procedural 3D Keyframing', 'Authentic Indian Village', 'Synchronized Flute & Dholak'],
  },
  {
    id: 'ad-beach',
    adNumber: 2,
    totalAds: 4,
    title: 'Festival of Sparks – Beach Crackers 3D',
    tagline: 'High-speed pyrotechnic rocket breaking into a giant willow shell over ocean surf.',
    brandSponsor: 'PyroPhysics 3D Lab',
    duration: '0:11',
    durationSec: 11,
    videoSrc: '/assets/aistudio/crackers_beach_b47c7a22.mp4',
    badge: 'Pyro Simulation Ad',
    aspectRatio: '9:16',
    ctaText: 'Experience Fireworks 3D',
    ctaTab: 'ravana-dahan',
    highlights: ['Water Reflection Glint', 'Particle Physics Simulation', 'True Reverberation Audio'],
  },
  {
    id: 'ad-fireworks',
    adNumber: 3,
    totalAds: 4,
    title: 'Celestial Night – Grand Fireworks Spectacular',
    tagline: 'Golden chrysanthemums, emerald rings, and willow cascades lighting the night sky.',
    brandSponsor: 'Ayodhya Sky Fest 2026',
    duration: '0:08',
    durationSec: 8,
    videoSrc: '/assets/aistudio/fireworks_show_66373bc4.mp4',
    badge: 'Grand Finale Ad',
    aspectRatio: '9:16',
    ctaText: 'Light Sacred Diyas',
    ctaTab: 'diya',
    highlights: ['Multi-Stage Aerial Shells', 'Temple Dome Lighting', 'Stereo Symphony'],
  },
  {
    id: 'ad-lanterns',
    adNumber: 4,
    totalAds: 4,
    title: 'Diwali Night Ghat & Flying Lanterns',
    tagline: 'Over 34,000 pilgrims lighting lanterns on the ghats to the beloved Diwali song.',
    brandSponsor: 'Deepam Cultural Heritage',
    duration: '0:16',
    durationSec: 16,
    videoSrc: '/assets/aistudio/diwali_nightsky_lanterns.mp4',
    badge: 'Sacred Montage Ad',
    aspectRatio: '16:9',
    ctaText: 'View Ramayana Chronicle',
    ctaTab: 'ramayana',
    highlights: ['3D Sky Lanterns (Aakash Kandil)', 'Full "Happy Diwali" Theme Song', 'River Ghat Reflections'],
  },
];

interface FestiveAdShowcaseProps {
  onNavigateTab?: (tab: any) => void;
}

export const FestiveAdShowcase: React.FC<FestiveAdShowcaseProps> = ({ onNavigateTab }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [autoSlideshow, setAutoSlideshow] = useState<boolean>(true);
  const [isFloatingMini, setIsFloatingMini] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentAd = AD_VIDEOS[currentAdIndex];

  // When currentAdIndex changes, play the next video automatically (slideshow behavior: 1 video after 1 video)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser policy blocks autoplay with sound, mute temporarily and play
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        });
    }
  }, [currentAdIndex]);

  // Handle video end: automatically slide to the next video in sequence!
  const handleVideoEnded = () => {
    if (autoSlideshow) {
      setCurrentAdIndex((prev) => (prev + 1) % AD_VIDEOS.length);
      sound.playDiyaLight();
    } else {
      setIsPlaying(false);
    }
  };

  const handleNextVideo = () => {
    sound.playDiyaLight();
    setCurrentAdIndex((prev) => (prev + 1) % AD_VIDEOS.length);
  };

  const handlePrevVideo = () => {
    sound.playDiyaLight();
    setCurrentAdIndex((prev) => (prev - 1 + AD_VIDEOS.length) % AD_VIDEOS.length);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    sound.playDiyaLight();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
    sound.playDiyaLight();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="relative w-full my-12">
      {/* Outer Glow Container */}
      <div className="relative rounded-3xl overflow-hidden border border-[#DDAA42]/50 bg-gradient-to-b from-[#13072B] via-[#0A0D22] to-[#14062A] shadow-[0_0_50px_rgba(255,140,36,0.3)] p-4 sm:p-7 backdrop-blur-xl">
        {/* Top Commercial Billboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#DDAA42]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5B22] to-[#FFC857] p-0.5 shadow-[0_0_20px_rgba(255,140,36,0.5)] flex-shrink-0 animate-pulse">
              <div className="w-full h-full rounded-2xl bg-[#080B1A] flex items-center justify-center">
                <Tv className="w-5 h-5 text-[#FFC857]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF8C24]/20 border border-[#FF8C24]/60 text-[10px] font-cinzel font-bold text-[#FFC857] uppercase tracking-wider">
                  <Radio className="w-3 h-3 text-[#FF5B22] animate-ping" />
                  <span>Live Video Advertisement Reel</span>
                </span>
                <span className="text-[11px] font-mono text-[#4EE2C0] hidden md:inline">
                  ● 1 Video After 1 Video Slideshow
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-white mt-1">
                Diwali 3D Commercial Spotlight & Video Slideshow
              </h2>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Auto-slideshow toggle */}
            <button
              onClick={() => setAutoSlideshow(!autoSlideshow)}
              className={`px-3 py-1.5 rounded-full border text-xs font-cinzel transition flex items-center gap-1.5 ${
                autoSlideshow
                  ? 'border-[#4EE2C0] bg-[#4EE2C0]/15 text-[#4EE2C0] shadow-[0_0_12px_rgba(78,226,192,0.3)]'
                  : 'border-white/10 text-white/50 hover:border-white/30'
              }`}
              title="Toggle automatic slideshow transitions"
            >
              <Sparkles className="w-3 h-3" />
              <span>Slideshow: {autoSlideshow ? 'NON-STOP ON' : 'PAUSED'}</span>
            </button>

            {/* Dock/Popout toggle */}
            <button
              onClick={() => setIsFloatingMini(!isFloatingMini)}
              className="p-2 rounded-full border border-white/15 text-[#D6BD8B] hover:text-[#FFC857] hover:border-[#FFC857] transition hidden md:flex items-center"
              title={isFloatingMini ? 'Restore Full Player' : 'Dock Picture-in-Picture Mini Player'}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advertisement Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Video Screen with Ad Overlays (8 Cols) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-black border border-[#FFC857]/40 shadow-2xl group aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
            <video
              ref={videoRef}
              src={currentAd.videoSrc}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              autoPlay
              playsInline
            />

            {/* Subtle cinematic gradient vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-black/40" />

            {/* Top Left: Ad Badge & Sequential Indicator (1 of 4) */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF8C24] to-[#FF5B22] text-[#080B1A] font-cinzel font-bold text-[11px] tracking-wider uppercase shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-[#080B1A]" />
                <span>AD {currentAd.adNumber} of {currentAd.totalAds}</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] font-mono text-[#FFE8A3] backdrop-blur-md">
                {currentAd.badge}
              </span>
            </div>

            {/* Top Right: Skip Ad / Next Video Button */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={handleNextVideo}
                className="px-3.5 py-1.5 rounded-full bg-[#080B1A]/85 hover:bg-[#FF8C24] hover:text-[#080B1A] text-white border border-[#FFC857]/40 font-cinzel text-xs font-bold transition flex items-center gap-1 shadow-xl backdrop-blur-md"
                title="Next Video in Slideshow"
              >
                <span>Next Video ❯❯</span>
              </button>
            </div>

            {/* Center Big Play Button (when hovered or paused) */}
            <button
              onClick={togglePlay}
              className={`absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#080B1A]/80 border border-[#FFC857] text-[#FFC857] flex items-center justify-center transition duration-300 hover:scale-110 shadow-2xl z-20 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 scale-105'
              }`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1 fill-[#FFC857]" />}
            </button>

            {/* Bottom Controls & Ad Ticker Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 z-20 flex flex-col gap-2 bg-gradient-to-t from-black via-black/85 to-transparent">
              {/* Slideshow Progress Bar */}
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-[#FF8C24] via-[#FFC857] to-[#4EE2C0] h-full transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#D6BD8B] mt-1">
                {/* Left: Playback controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handlePrevVideo}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF8C24] hover:text-[#080B1A] transition text-white"
                    title="Previous Video"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg bg-[#FF8C24] text-[#080B1A] font-bold hover:opacity-90 transition"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-[#080B1A]" /> : <Play className="w-4 h-4 fill-[#080B1A]" />}
                  </button>

                  <button
                    onClick={handleNextVideo}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF8C24] hover:text-[#080B1A] transition text-white"
                    title="Next Video"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                    title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-4 h-4 text-[#FF5B22]" />
                        <span className="text-[11px] font-cinzel text-[#FF5B22]">Unmute</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#4EE2C0]" />
                        <span className="text-[11px] font-cinzel text-[#4EE2C0]">Sound ON</span>
                      </>
                    )}
                  </button>

                  <span className="font-mono text-[11px] text-[#D6BD8B]/80 hidden sm:inline">
                    {Math.floor(currentTime)}s / {Math.floor(duration || currentAd.durationSec)}s
                  </span>
                </div>

                {/* Right: Sponsored Call to Action button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab(currentAd.ctaTab);
                      sound.playDiyaLight();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-cinzel font-bold text-xs flex items-center gap-1.5 hover:opacity-95 transition shadow-lg"
                  >
                    <span>{currentAd.ctaText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={currentAd.videoSrc}
                    download
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                    title="Download Video"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Ad Queue & Interactive Playlist Carousel (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-cinzel text-xs font-bold text-[#FFC857] uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#FF8C24]" />
                <span>Next in Video Slideshow</span>
              </span>
              <span className="text-[10px] font-mono text-[#D6BD8B]/70">
                4 Commercials
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {AD_VIDEOS.map((item, idx) => {
                const isSelected = idx === currentAdIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentAdIndex(idx);
                      sound.playDiyaLight();
                    }}
                    className={`p-3 rounded-2xl border transition cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-[#1D1638] border-[#FFC857] shadow-[0_0_20px_rgba(255,200,87,0.25)] ring-1 ring-[#FFC857]/50'
                        : 'bg-[#0E122C]/70 border-white/10 hover:border-[#DDAA42]/50 hover:bg-[#13193B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#080B1A] border border-white/10 flex items-center justify-center shrink-0 text-[#FFC857] group-hover:scale-105 transition">
                        {isSelected ? (
                          <Play className="w-4 h-4 text-[#FF8C24] fill-[#FF8C24] animate-pulse" />
                        ) : (
                          <span className="font-cinzel text-xs font-bold text-[#D6BD8B]">{item.adNumber}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-cinzel font-bold text-[#FF8C24] uppercase">
                            {item.badge}
                          </span>
                          <span className="text-[10px] font-mono text-[#D6BD8B]/70">
                            {item.duration}
                          </span>
                        </div>
                        <h4 className="text-xs font-playfair font-bold text-white truncate group-hover:text-[#FFC857] transition">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-[#D6BD8B]/70 line-clamp-1 mt-0.5">
                          {item.tagline}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                        <span className="text-[#4EE2C0] font-cinzel font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4EE2C0] animate-ping" />
                          Playing Live
                        </span>
                        <span className="text-[#FFC857] font-cinzel">Auto-advancing ❯</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ad Sponsor Callout */}
            <div className="p-3.5 rounded-2xl bg-[#080B1A]/70 border border-[#DDAA42]/20 text-[11px] text-[#D6BD8B]/80 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#FF8C24] shrink-0" />
              <span>Continuous 3D festival advertising slideshow rendered with high-definition audio and WebGL physics.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Picture-in-Picture Mini Player (when enabled) */}
      {isFloatingMini && (
        <div className="fixed bottom-6 right-6 z-50 w-72 sm:w-80 rounded-2xl overflow-hidden bg-[#080B1A] border-2 border-[#FFC857] shadow-2xl animate-fadeIn">
          <div className="p-2.5 bg-[#14062A] border-b border-white/10 flex items-center justify-between">
            <span className="font-cinzel text-[11px] font-bold text-[#FFC857] flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-[#FF8C24]" />
              <span>Ad {currentAd.adNumber}/4 • {currentAd.badge}</span>
            </span>
            <button
              onClick={() => setIsFloatingMini(false)}
              className="text-xs text-white/70 hover:text-white px-2 py-0.5 rounded bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="relative aspect-video bg-black flex items-center justify-center">
            <video
              src={currentAd.videoSrc}
              className="w-full h-full object-contain"
              autoPlay
              muted={isMuted}
              onEnded={handleVideoEnded}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="p-1 rounded-full bg-black/70 text-white hover:text-[#FFC857]"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleNextVideo}
                className="p-1 rounded-full bg-black/70 text-white hover:text-[#FFC857]"
                title="Next Video"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
