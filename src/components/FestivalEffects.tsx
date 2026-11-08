import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: number;
};

export function FestivalEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId = 0;
    const particles: Particle[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px` ;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const burst = (x: number, y: number) => {
      // Golden yellow (42) or Lotus pink/magenta (335) or Saffron (25)
      const hues = [42, 335, 25, 48, 168];
      const hue = hues[Math.floor(Math.random() * hues.length)];

      for (let index = 0; index < 50; index += 1) {
        const angle = (Math.PI * 2 * index) / 50;
        const speed = 1.4 + Math.random() * 3.6;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: 45 + Math.random() * 35,
          hue,
        });
      }
    };

    const celebrate = () => {
      for (let index = 0; index < 6; index += 1) {
        window.setTimeout(() => {
          burst(
            width * (0.15 + Math.random() * 0.7),
            height * (0.1 + Math.random() * 0.4)
          );
        }, index * 160);
      }
    };

    // Ambient floating embers every 2 seconds
    let ambientTimer = window.setInterval(() => {
      if (particles.length < 30) {
        particles.push({
          x: Math.random() * width,
          y: height + 10,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.6 - Math.random() * 1.2,
          life: 0,
          max: 120 + Math.random() * 80,
          hue: Math.random() > 0.4 ? 42 : 28,
        });
      }
    }, 400);

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.life += 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.985;
        particle.vy = particle.vy * 0.985 + 0.02; // slight gravity
        const alpha = Math.max(0, 1 - particle.life / particle.max);
        context.beginPath();
        context.arc(particle.x, particle.y, 1.8, 0, Math.PI * 2);
        context.fillStyle = `hsla(${particle.hue}, 95%, 70%, ${alpha})`;
        context.shadowBlur = 10;
        context.shadowColor = `hsla(${particle.hue}, 100%, 60%, ${alpha})`;
        context.fill();
      });
      context.shadowBlur = 0;
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        if (particles[index].life >= particles[index].max) {
          particles.splice(index, 1);
        }
      }
      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('diwali:celebrate', celebrate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearInterval(ambientTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('diwali:celebrate', celebrate);
    };
  }, []);

  return <canvas className="festival-canvas fixed inset-0 pointer-events-none z-50" ref={canvasRef} aria-hidden="true" />;
}
