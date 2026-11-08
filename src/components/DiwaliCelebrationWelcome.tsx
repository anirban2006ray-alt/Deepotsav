import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/audio';
import {
  FirecrackerParticle,
  createRocketExplosion,
  createAnarSparks,
  createChakriSparks,
  createPhuljhadiSparks,
  updateParticles,
} from '../utils/firecrackers';
import { Sparkles, Flame, Volume2, X, Play } from 'lucide-react';

interface DiwaliCelebrationWelcomeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiwaliCelebrationWelcome: React.FC<DiwaliCelebrationWelcomeProps> = ({
  isOpen,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<FirecrackerParticle[]>([]);
  const animIdRef = useRef<number | null>(null);
  const [activePhuljhadi, setActivePhuljhadi] = useState<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvas render loop for firecracker particles
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // If active phuljhadi, emit sparks at mouse position
      if (activePhuljhadi && mousePosRef.current.x > 0) {
        particlesRef.current.push(
          ...createPhuljhadiSparks(mousePosRef.current.x, mousePosRef.current.y, 4)
        );
      }

      particlesRef.current = updateParticles(particlesRef.current, 0.08);

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        const alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Shimmering starburst tails for sparks
        if (p.sparkle && alpha > 0.4) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 2, p.y);
          ctx.lineTo(p.x + p.size * 2, p.y);
          ctx.moveTo(p.x, p.y - p.size * 2);
          ctx.lineTo(p.x, p.y + p.size * 2);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    // Initial celebratory opening volley of fireworks
    const initialTimers = [
      setTimeout(() => triggerRocket(width * 0.25, height * 0.3), 300),
      setTimeout(() => triggerRocket(width * 0.75, height * 0.28), 700),
      setTimeout(() => triggerRocket(width * 0.5, height * 0.22), 1200),
    ];

    return () => {
      window.removeEventListener('resize', handleResize);
      initialTimers.forEach(clearTimeout);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [isOpen, activePhuljhadi]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  // 1. Rocket launch & burst
  const triggerRocket = (targetX?: number, targetY?: number) => {
    sound.playFirework();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const tx = targetX ?? w * (0.2 + Math.random() * 0.6);
    const ty = targetY ?? h * (0.15 + Math.random() * 0.35);

    // Initial launch flash
    particlesRef.current.push(...createRocketExplosion(tx, ty, 65));
  };

  // 2. Anar fountain
  const triggerAnar = () => {
    sound.playFirework();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const anarX = w * 0.5 + (Math.random() - 0.5) * 160;
    const anarY = h * 0.82;

    let sparksCount = 0;
    const interval = setInterval(() => {
      particlesRef.current.push(...createAnarSparks(anarX, anarY, 12));
      sparksCount++;
      if (sparksCount > 25) clearInterval(interval);
    }, 60);
  };

  // 3. Chakri ground spinner
  const triggerChakri = () => {
    sound.playDiyaLight();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w * 0.5 + (Math.random() - 0.5) * 200;
    const cy = h * 0.78;

    let angle = 0;
    let ticks = 0;
    const interval = setInterval(() => {
      angle += 0.45;
      particlesRef.current.push(...createChakriSparks(cx, cy, angle, 8));
      ticks++;
      if (ticks > 35) clearInterval(interval);
    }, 45);
  };

  // 4. Toggle Phuljhadi (sparkler)
  const togglePhuljhadi = () => {
    sound.playDiyaLight();
    setActivePhuljhadi((prev) => !prev);
  };

  if (!isOpen) return null;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fadeIn"
      style={{ animationDuration: '0.4s' }}
    >
      {/* Interactive Firecrackers Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Colourful Festive Toran / Overhead Light Garland */}
      <div className="absolute top-0 inset-x-0 h-16 pointer-events-none flex justify-around items-start overflow-hidden z-20">
        {Array.from({ length: 24 }).map((_, i) => {
          const colors = ['#FF8C24', '#00E676', '#FFC857', '#E040FB', '#FF3D00', '#00B0FF'];
          const color = colors[i % colors.length];
          const delay = (i * 0.18) % 1.5;
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-white/20" />
              <div
                className="w-3.5 h-5 rounded-full shadow-lg"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 16px ${color}, 0 0 28px ${color}`,
                  animation: `pulse ${1.2 + (i % 3) * 0.4}s infinite ease-in-out ${delay}s`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Main 3D Festival Welcome Modal Box */}
      <div className="relative z-30 max-w-2xl w-full glass-card p-6 md:p-10 rounded-3xl border-2 border-[#FFC857]/50 shadow-[0_0_80px_rgba(255,140,36,0.35)] text-center my-auto">
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#D6BD8B] hover:text-white transition"
          aria-label="Close welcome celebration"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D Sacred Diya Icon with radiating light aura */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-[#FF8C24]/30 to-[#FFC857]/30 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-[#FFC857]/30 to-[#FF5B22]/20 border border-[#FFC857]/60 flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(255,200,87,0.6)]">
            🪔
          </div>
        </div>

        {/* Auspicious Sanskrit Headline */}
        <p className="text-sm md:text-base font-cinzel font-bold text-[#FFC857] tracking-[0.3em] uppercase mb-1">
          ✦ शुभ दीपावली ✦
        </p>

        {/* English Title with 3D Gold Gradient */}
        <h1 className="text-4xl md:text-6xl font-playfair font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE8A3] via-[#FFC857] to-[#FF8C24] drop-shadow-[0_4px_16px_rgba(255,140,36,0.4)] mb-3">
          HAPPY DIWALI
        </h1>

        <p className="text-xs md:text-sm text-[#D6BD8B] leading-relaxed max-w-lg mx-auto mb-6">
          May the divine light of millions of diyas bring peace, courage, radiant prosperity, and joyous togetherness to your heart and home.
        </p>

        {/* Interactive Patakha / Firecracker Control Deck */}
        <div className="bg-[#080B1A]/80 border border-[#DDAA42]/30 rounded-2xl p-4 md:p-5 mb-6">
          <p className="text-xs font-cinzel text-[#FFC857] tracking-wider uppercase mb-3 flex items-center justify-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#FF8C24]" />
            <span>Interactive Diwali Firecrackers (पटाखे)</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Rocket */}
            <button
              onClick={() => triggerRocket()}
              className="py-3 px-2 rounded-xl bg-gradient-to-b from-[#1E254A] to-[#12162E] border border-[#FF8C24]/40 hover:border-[#FFC857] hover:scale-105 active:scale-95 text-white transition flex flex-col items-center gap-1 group shadow-lg"
            >
              <span className="text-2xl group-hover:animate-bounce">🚀</span>
              <span className="text-[11px] font-cinzel font-bold text-[#FFC857]">Rocket</span>
              <span className="text-[9px] text-[#D6BD8B]/70">Sky Shot</span>
            </button>

            {/* Anar */}
            <button
              onClick={triggerAnar}
              className="py-3 px-2 rounded-xl bg-gradient-to-b from-[#1E254A] to-[#12162E] border border-[#FF8C24]/40 hover:border-[#FFC857] hover:scale-105 active:scale-95 text-white transition flex flex-col items-center gap-1 group shadow-lg"
            >
              <span className="text-2xl group-hover:scale-110">🌸</span>
              <span className="text-[11px] font-cinzel font-bold text-[#FFC857]">Anar</span>
              <span className="text-[9px] text-[#D6BD8B]/70">Flowerpot</span>
            </button>

            {/* Chakri */}
            <button
              onClick={triggerChakri}
              className="py-3 px-2 rounded-xl bg-gradient-to-b from-[#1E254A] to-[#12162E] border border-[#FF8C24]/40 hover:border-[#FFC857] hover:scale-105 active:scale-95 text-white transition flex flex-col items-center gap-1 group shadow-lg"
            >
              <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">🌀</span>
              <span className="text-[11px] font-cinzel font-bold text-[#FFC857]">Chakri</span>
              <span className="text-[9px] text-[#D6BD8B]/70">Ground Spinner</span>
            </button>

            {/* Phuljhadi Sparkler */}
            <button
              onClick={togglePhuljhadi}
              className={`py-3 px-2 rounded-xl border hover:scale-105 active:scale-95 text-white transition flex flex-col items-center gap-1 group shadow-lg ${
                activePhuljhadi
                  ? 'bg-[#FF8C24]/25 border-[#FFC857] shadow-[0_0_18px_rgba(255,200,87,0.4)]'
                  : 'bg-gradient-to-b from-[#1E254A] to-[#12162E] border-[#FF8C24]/40'
              }`}
            >
              <span className="text-2xl group-hover:animate-pulse">✨</span>
              <span className="text-[11px] font-cinzel font-bold text-[#FFC857]">
                {activePhuljhadi ? 'Sparkling!' : 'Phuljhadi'}
              </span>
              <span className="text-[9px] text-[#D6BD8B]/70">Magic Sparkler</span>
            </button>
          </div>

          {activePhuljhadi && (
            <p className="mt-2.5 text-[11px] text-[#FFC857] animate-pulse">
              ✨ Move your cursor or finger to twirl your golden magic sparkler!
            </p>
          )}
        </div>

        {/* Enter Celebration CTA */}
        <button
          onClick={() => {
            sound.playThemeSong().catch(() => {});
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF8C24] via-[#FFC857] to-[#DDAA42] text-[#080B1A] font-cinzel font-bold text-sm tracking-wider uppercase hover:opacity-95 transition shadow-[0_0_30px_rgba(255,140,36,0.5)] flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Enter The Celebration</span>
        </button>
      </div>
    </div>
  );
};
