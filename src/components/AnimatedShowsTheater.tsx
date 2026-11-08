import React, { useState, useRef, useEffect } from 'react';
import { 
  Film, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Sparkles, 
  RotateCcw, 
  ExternalLink, 
  Download, 
  Code2, 
  Flame, 
  Layers, 
  Share2,
  Tv,
  Music,
  Globe
} from 'lucide-react';
import { sound } from '../utils/audio';

export interface AnimatedShow {
  id: string;
  title: string;
  category: string;
  duration: string;
  aspectRatio: string;
  description: string;
  videoSrc: string;
  audioSrc: string;
  interactiveHtml?: string;
  pythonScript?: string;
  badge: string;
  tags: string[];
  directorNotes: string;
}

export const SHOWS: AnimatedShow[] = [
  {
    id: 'cartoon',
    title: "The Little Diya's Quest – 3D Cartoon Animation",
    category: '3D Anime Cartoon',
    duration: '0:32',
    aspectRatio: '9:16',
    description: 'A charming 3D cartoon following a brave little earthen diya traversing an ancient village at twilight to illuminate the grand temple and dispel shadows with friendship.',
    videoSrc: '/assets/aistudio/diwali_cartoon_903d1f42.mp4',
    audioSrc: '/assets/aistudio/audio_242fa111.m4a',
    interactiveHtml: '/assets/aistudio/anime_diwali_5d00ea03.html',
    pythonScript: 'render_cartoon_e8d5c199.py',
    badge: '★ Featured 3D Cartoon',
    tags: ['Frame-by-Frame 3D', 'Vedic Village', 'Harmonious Soundtrack'],
    directorNotes: 'Rendered at 24fps using custom Python procedural keyframing and synchronized with a traditional flute and sitar soundscape.',
  },
  {
    id: 'beach-crackers',
    title: 'Festival of Sparks – Beach Crackers 3D',
    category: '3D Pyro Simulation',
    duration: '0:11',
    aspectRatio: '9:16',
    description: 'Atmospheric 3D physics simulation of celebratory fireworks, sparkler fountains (anars), and ground chakras on the coastal sands with ocean reflections at sunset.',
    videoSrc: '/assets/aistudio/crackers_beach_b47c7a22.mp4',
    audioSrc: '/assets/aistudio/audio_d813651c.m4a',
    pythonScript: 'render_crackers_df449a89.py & pyro.py',
    badge: 'Physics Simulation',
    tags: ['Ocean Reflections', 'Particle Physics', 'Crackling Acoustics'],
    directorNotes: 'Uses custom velocity drag equations, ember gravity decay, and acoustic reverb captured on coastal nightscapes.',
  },
  {
    id: 'fireworks-show',
    title: 'Celestial Night – Grand 3D Fireworks Spectacular',
    category: '3D Sky Show',
    duration: '0:08',
    aspectRatio: '9:16',
    description: 'An aerial 3D celebration featuring cascading golden chrysanthemums, emerald rings, and dazzling willow trails lighting up the Ayodhya temple skyline.',
    videoSrc: '/assets/aistudio/fireworks_show_66373bc4.mp4',
    audioSrc: '/assets/aistudio/audio_717f4967.m4a',
    interactiveHtml: '/assets/aistudio/fireworks_3d_9ba300d9.html',
    pythonScript: 'render_fireworks_10704bcf.py',
    badge: 'Grand Finale',
    tags: ['Chrysanthemum Bursts', 'Temple Skyline', 'Stereo Symphony'],
    directorNotes: 'Simulates multi-stage aerial pyrotechnics with spherical particle bursts and ambient illumination reflecting off ancient temple domes.',
  },
  {
    id: 'diwali-ghat',
    title: 'Diwali Night Ghat & Flying Lanterns – 3D Video',
    category: '3D Aerial Ghat & Lanterns',
    duration: '0:16',
    aspectRatio: '16:9',
    description: 'Diwali night montage along sacred river ghats: 34,000 pilgrims, aerial golden chrysanthemums, drifting paper sky lanterns, and glowing hand diyas with the authentic "Happy Diwali" theme song.',
    videoSrc: '/assets/aistudio/diwali_nightsky_lanterns.mp4',
    audioSrc: '/assets/aistudio/whatsapp-theme-song.mpeg',
    interactiveHtml: '/assets/aistudio/diwali_ghat_3d.html',
    pythonScript: 'render_ghat.py & render_lyrics.py',
    badge: '★ 3D Ghat Montage',
    tags: ['Aerial Ghat', 'Sky Lanterns', 'Full Theme Song'],
    directorNotes: 'Features 7,000 spark particles, 650 3D sky lanterns, and multi-stage camera transitions synchronized to the timeless Diwali song.',
  },
  {
    id: 'diwali-symphony',
    title: 'Sacred Diya & 10-Language Symphony – Live 3D',
    category: '3D Audio Shader',
    duration: '0:20',
    aspectRatio: '16:9',
    description: 'Real-time 3D Three.js lighting animation with custom GLSL flame shaders, rotating ring of 12 sacred diyas, floating lanterns, beat-synced fireworks, and multilingual greetings in 10 languages.',
    videoSrc: '/assets/aistudio/fireworks_show_66373bc4.mp4',
    audioSrc: '/assets/aistudio/whatsapp-theme-song.mpeg',
    interactiveHtml: '/assets/aistudio/diwali_lighting_3d.html',
    pythonScript: 'diwali_ursina_3d.py & render_lyrics.py',
    badge: 'Interactive WebGL',
    tags: ['GLSL Flame Shader', '10 Languages', 'Beat Reactive'],
    directorNotes: 'GLSL vertex and fragment shaders animate procedural flame flickering and beat-reactive expansions synced to devotional rhythms.',
  },
];

export const AnimatedShowsTheater: React.FC = () => {
  const [selectedShow, setSelectedShow] = useState<AnimatedShow>(SHOWS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [activeInteractiveModal, setActiveInteractiveModal] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    video.currentTime = 0;
    audio.currentTime = 0;
    audio.muted = isMuted;

    if (hasStarted) {
      Promise.all([video.play(), audio.play()])
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      audio.pause();
      setIsPlaying(false);
    }
  }, [selectedShow, hasStarted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    if (isPlaying) {
      video.pause();
      audio.pause();
      setIsPlaying(false);
    } else {
      setHasStarted(true);
      audio.currentTime = video.currentTime;
      audio.muted = isMuted;
      Promise.all([video.play(), audio.play()])
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
    sound.playDiyaLight();
  };

  const toggleMute = () => {
    if (!videoRef.current || !audioRef.current) return;
    setIsMuted(!isMuted);
    sound.playDiyaLight();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setDuration(video.duration || 0);
    if (audio && Math.abs(audio.currentTime - video.currentTime) > 0.25) {
      audio.currentTime = video.currentTime;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      if (audioRef.current) audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const [autoSlideshow, setAutoSlideshow] = useState<boolean>(true);

  const playNextShow = () => {
    if (!autoSlideshow) return;
    const currentIndex = SHOWS.findIndex((show) => show.id === selectedShow.id);
    const nextIndex = (currentIndex + 1) % SHOWS.length;
    setSelectedShow(SHOWS[nextIndex]);
    setHasStarted(true);
    sound.playDiyaLight();
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11152B] border border-[#DDAA42]/30 text-xs font-cinzel text-[#FFC857] mb-4">
          <Film className="w-3.5 h-3.5 text-[#FF8C24]" />
          <span>FESTIVAL CINEMA & 3D ANIMATION STUDIO</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-white mb-3">
          3D Animated Shows & Cartoons
        </h1>
        <p className="text-xs sm:text-sm text-[#D6BD8B]/80 leading-relaxed">
          Watch procedural 3D Diwali cartoon retellings, physics-driven beach fireworks simulations, and grand aerial firework spectacles created with Python and WebGL.
        </p>
      </div>

      {/* Main Theater Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left: Video Player Marquee */}
        <div className="lg:col-span-8 bg-[#11152B]/80 border border-[#DDAA42]/30 rounded-3xl p-4 md:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center border border-white/10 group">
            <video
              ref={videoRef}
              src={selectedShow.videoSrc}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onEnded={playNextShow}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              playsInline
            />
            <audio ref={audioRef} src={selectedShow.audioSrc} preload="auto" />

            {/* Ambient Overlay Glow */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Video Watermark / Title */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FF8C24] text-[#080B1A] font-cinzel font-bold text-[10px] tracking-wider uppercase shadow-lg">
                {selectedShow.badge}
              </span>
              <span className="text-xs font-cinzel text-white/90 drop-shadow-md hidden sm:inline">
                {selectedShow.title}
              </span>
            </div>

            {/* Big Play/Pause Button on Screen */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#080B1A]/70 border border-[#FFC857]/50 text-[#FFC857] flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-110 shadow-2xl"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>

            {!hasStarted && (
              <button
                onClick={togglePlay}
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#FF8C24] via-[#FFC857] to-[#DDAA42] px-6 py-3.5 text-sm font-bold font-cinzel text-[#080B1A] shadow-[0_0_30px_rgba(255,140,36,0.6)] hover:scale-105 active:scale-95 transition flex items-center gap-2 border border-[#FFF0B3]/40"
              >
                <Play className="w-4 h-4 fill-[#080B1A]" />
                <span>Play slideshow with sound</span>
              </button>
            )}

            {/* Player Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2 z-20">
              {/* Progress Slider */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-[#FF8C24] h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs text-[#D6BD8B]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF8C24] hover:text-[#080B1A] transition text-white"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF8C24] hover:text-[#080B1A] transition text-white"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-[11px]">
                    {Math.floor(currentTime)}s / {Math.floor(duration || 0)}s
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedShow.interactiveHtml && (
                    <button
                      onClick={() => setActiveInteractiveModal(selectedShow.interactiveHtml!)}
                      className="px-2.5 py-1 rounded-lg bg-[#DDAA42]/20 border border-[#DDAA42]/40 text-[#FFC857] text-[11px] font-cinzel hover:bg-[#DDAA42]/30 transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#FF8C24]" />
                      <span>Live 3D Canvas</span>
                    </button>
                  )}

                  <a
                    href={selectedShow.videoSrc}
                    download
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF8C24] hover:text-[#080B1A] transition text-white"
                    title="Download MP4"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <button
                    onClick={handleFullscreen}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF8C24] hover:text-[#080B1A] transition text-white"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Show Info Banner */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-cinzel font-bold text-[#FF8C24]">{selectedShow.category}</span>
                <span className="text-xs text-white/40">•</span>
                <span className="text-xs font-mono text-[#D6BD8B]/70">{selectedShow.duration}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-white mb-1">
                {selectedShow.title}
              </h2>
              <p className="text-xs text-[#D6BD8B]/80 max-w-xl">
                {selectedShow.description}
              </p>
              {selectedShow.directorNotes && (
                <p className="text-[11px] text-[#FFC857]/80 mt-2 italic">
                  💡 {selectedShow.directorNotes}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {selectedShow.interactiveHtml && (
                <button
                  onClick={() => setActiveInteractiveModal(selectedShow.interactiveHtml!)}
                  className="py-2 px-3.5 rounded-xl bg-[#21143B] border border-[#FFC857]/40 text-[#FFC857] hover:border-[#FF8C24] text-xs font-cinzel flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF8C24]" />
                  <span>Open 3D Canvas</span>
                </button>
              )}
              <a
                href={selectedShow.videoSrc}
                download
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-1.5 hover:opacity-95 transition shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save MP4 Video</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Show Playlist & Selection */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1 flex-wrap gap-2">
            <h3 className="font-cinzel text-sm font-bold text-[#FFC857] flex items-center gap-2">
              <Tv className="w-4 h-4 text-[#FF8C24]" />
              <span>Cinema Playlist ({SHOWS.length} Shows)</span>
            </h3>

            <button
              onClick={() => setAutoSlideshow(!autoSlideshow)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-cinzel border transition flex items-center gap-1.5 ${
                autoSlideshow
                  ? 'border-[#4EE2C0] bg-[#4EE2C0]/15 text-[#4EE2C0]'
                  : 'border-white/20 text-[#D6BD8B]/60'
              }`}
              title="Continuous non-stop slideshow: 1 video after 1 video"
            >
              <Sparkles className="w-3 h-3" />
              <span>Slideshow: {autoSlideshow ? 'ON (1 by 1)' : 'OFF'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {SHOWS.map((show) => {
              const isSelected = selectedShow.id === show.id;
              return (
                <div
                  key={show.id}
                  onClick={() => {
                    setSelectedShow(show);
                    sound.playDiyaLight();
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#1A1F3C] border-[#FFC857] shadow-[0_0_20px_rgba(255,200,87,0.2)]'
                      : 'bg-[#11152B]/80 border-white/10 hover:border-[#DDAA42]/50 hover:bg-[#141933]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#080B1A] border border-white/10 flex items-center justify-center shrink-0 text-[#FFC857] group-hover:scale-105 transition">
                      {isSelected ? (
                        <Play className="w-4 h-4 text-[#FF8C24] fill-[#FF8C24]" />
                      ) : (
                        <Film className="w-4 h-4 text-[#D6BD8B]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-cinzel font-bold text-[#FF8C24] uppercase tracking-wider">
                          {show.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#D6BD8B]/60">
                          {show.duration}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-playfair font-bold text-white truncate group-hover:text-[#FFC857] transition">
                        {show.title}
                      </h4>
                      <p className="text-[11px] text-[#D6BD8B]/70 line-clamp-2 mt-1 leading-snug">
                        {show.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-cinzel text-[#D6BD8B]/70">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {show.tags.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-black/30 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                    {isSelected && (
                      <span className="text-[#FFC857] font-bold">Now Playing</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technology Pipeline Box */}
          <div className="p-5 rounded-2xl bg-[#080B1A]/80 border border-[#DDAA42]/30 mt-2">
            <h4 className="font-cinzel text-xs font-bold text-[#FFC857] mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[#FF8C24]" />
              <span>One-Command Build Pipeline</span>
            </h4>
            <p className="text-[11px] text-[#D6BD8B]/80 leading-relaxed mb-3">
              These animations were built with procedural Python scripts, real-time WebGL rendering, and high-fidelity AAC audio muxing:
            </p>
            <div className="bg-black/60 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-[#4EE2C0] overflow-x-auto space-y-1">
              <div># 1. Extract audio & synthesize pyro</div>
              <div className="text-[#FFE0A1]">ffmpeg -i input.mp4 -vn -c:a aac audio.m4a</div>
              <div># 2. Render 3D keyframe sequences</div>
              <div className="text-[#FFE0A1]">python3 {selectedShow.pythonScript}</div>
              <div># 3. Output synchronized MP4 video</div>
              <div className="text-[#4EE2C0]">✓ Generated: {selectedShow.videoSrc.split('/').pop()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3D Canvas Modal (for HTML browser versions) */}
      {activeInteractiveModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-[#080B1A] border border-[#DDAA42]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
            <div className="p-4 bg-[#11152B] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF8C24]" />
                <span className="font-cinzel text-xs font-bold text-white">
                  Interactive 3D WebGL Canvas Environment
                </span>
              </div>
              <button
                onClick={() => setActiveInteractiveModal(null)}
                className="py-1 px-3 rounded-lg bg-white/10 text-xs text-white hover:bg-[#FF8C24] hover:text-[#080B1A] transition"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1 bg-black relative">
              <iframe
                src={activeInteractiveModal}
                className="w-full h-full border-none"
                title="Interactive 3D Show"
                allow="autoplay; encrypted-media; fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
