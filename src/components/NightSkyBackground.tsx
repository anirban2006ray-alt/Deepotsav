import React, { useEffect, useRef } from 'react';
import {
  Star,
  ShootingStar,
  createStarfield,
  updateStars,
  createShootingStar,
  updateShootingStar,
  shouldSpawnShootingStar,
} from '../utils/nightSky';

interface NightSkyBackgroundProps {
  active: boolean;
}

export const NightSkyBackground: React.FC<NightSkyBackgroundProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive star count (optimal density ~1 star per 8500px²)
    const starCount = Math.max(75, Math.min(220, Math.floor((width * height) / 8500)));
    let stars: Star[] = createStarfield(starCount, width, height);
    let shootingStars: ShootingStar[] = [];

    let lastTime = performance.now();
    let timeSinceLastSpawn = 2.0; // Initial head start for shooting star
    let nextShootingStarInterval = 4.5 + Math.random() * 3.5; // 4.5s to 8s
    let shootingStarCounter = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = createStarfield(starCount, width, height);
    };

    window.addEventListener('resize', handleResize);

    const render = (now: number) => {
      // Delta time in seconds, clamped to 0.1 to avoid spiral of death on tab switch
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      const timeSeconds = now / 1000;

      timeSinceLastSpawn += dt;

      // Check shooting star spawn cadence
      if (!prefersReducedMotion && shouldSpawnShootingStar(timeSinceLastSpawn, 3.8, nextShootingStarInterval)) {
        shootingStarCounter++;
        shootingStars.push(createShootingStar(width, height, shootingStarCounter));
        timeSinceLastSpawn = 0;
        nextShootingStarInterval = 4.2 + Math.random() * 4.0;
      }

      // Update positions
      if (!prefersReducedMotion) {
        stars = updateStars(stars, width, height, dt, timeSeconds);
      }

      // Clear canvas with clearRect
      ctx.clearRect(0, 0, width, height);

      // Render Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${star.alpha.toFixed(3)})`;
        ctx.fill();

        // Subtle cross-flare for larger, brighter stars
        if (star.radius > 1.6 && star.alpha > 0.65) {
          ctx.strokeStyle = `${star.color}${(star.alpha * 0.45).toFixed(3)})`;
          ctx.lineWidth = 0.75;
          const flare = star.radius * 2.2;
          ctx.beginPath();
          ctx.moveTo(star.x - flare, star.y);
          ctx.lineTo(star.x + flare, star.y);
          ctx.moveTo(star.x, star.y - flare);
          ctx.lineTo(star.x, star.y + flare);
          ctx.stroke();
        }
      }

      // Render Shooting Stars
      if (!prefersReducedMotion && shootingStars.length > 0) {
        const survivingStars: ShootingStar[] = [];

        for (let j = 0; j < shootingStars.length; j++) {
          const { updated, isAlive } = updateShootingStar(shootingStars[j], dt);

          if (isAlive) {
            survivingStars.push(updated);

            // Calculate tail coordinates
            const tailX = updated.x - Math.cos(updated.angle) * updated.length;
            const tailY = updated.y - Math.sin(updated.angle) * updated.length;

            // Draw glowing trailing streak
            const gradient = ctx.createLinearGradient(tailX, tailY, updated.x, updated.y);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.65, `${updated.color}${Math.floor(updated.opacity * 0.65 * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `#FFFFFF${Math.floor(updated.opacity * 255).toString(16).padStart(2, '0')}`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(updated.x, updated.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.9;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Comet head luminous spark
            ctx.beginPath();
            ctx.arc(updated.x, updated.y, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `#FFFFFF${Math.floor(updated.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.shadowColor = updated.color;
            ctx.shadowBlur = 12;
            ctx.fill();

            // Reset shadow blur
            ctx.shadowBlur = 0;
          }
        }

        shootingStars = survivingStars;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Deep cosmic nebula atmosphere */}
      <div className="absolute inset-0 bg-radial-[at_50%_-15%] from-[#1B1138]/60 via-[#0B0D1E]/40 to-transparent pointer-events-none" />

      {/* Starfield Canvas */}
      <canvas
        ref={canvasRef}
        data-testid="night-sky-canvas"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
