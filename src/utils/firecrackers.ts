/**
 * Physics and particle logic for Diwali Firecrackers (Patakhas):
 * Rockets, Anar (Flowerpot Fountain), Chakri (Ground Spinner), Phuljhadi (Sparklers)
 */

export type FirecrackerType = 'rocket' | 'anar' | 'chakri' | 'phuljhadi' | 'ladi';

export interface FirecrackerParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  glowColor: string;
  decay: number;
  sparkle?: boolean;
}

export interface RocketTrail {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  exploded: boolean;
  color: string;
}

export const FESTIVE_HUES = [
  { color: '#FFD700', glow: '#FFA500' }, // Gold / Amber
  { color: '#FF5722', glow: '#FF1744' }, // Saffron / Crimson
  { color: '#00E676', glow: '#00B0FF' }, // Emerald / Cyan
  { color: '#E040FB', glow: '#7C4DFF' }, // Royal Amaranth
  { color: '#FFFFFF', glow: '#FFE082' }, // Brilliant White
  { color: '#FF9100', glow: '#FF3D00' }, // Vivid Orange
];

/**
 * Creates rocket explosion particles in a dazzling spherical shell with velocity dispersion
 */
export function createRocketExplosion(
  x: number,
  y: number,
  count = 60,
  randomFn = Math.random
): FirecrackerParticle[] {
  const particles: FirecrackerParticle[] = [];
  const palette = FESTIVE_HUES[Math.floor(randomFn() * FESTIVE_HUES.length)];

  for (let i = 0; i < count; i++) {
    const angle = randomFn() * Math.PI * 2;
    const speed = 2.5 + randomFn() * 5.5;
    const maxLife = 40 + Math.floor(randomFn() * 35);

    particles.push({
      id: i,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife,
      size: 1.8 + randomFn() * 2.2,
      color: palette.color,
      glowColor: palette.glow,
      decay: 0.982,
      sparkle: randomFn() > 0.4,
    });
  }

  return particles;
}

/**
 * Creates fountain particles for an Anar (flowerpot)
 */
export function createAnarSparks(
  originX: number,
  originY: number,
  count = 14,
  randomFn = Math.random
): FirecrackerParticle[] {
  const particles: FirecrackerParticle[] = [];

  for (let i = 0; i < count; i++) {
    // Upward cone with spread between -35deg and +35deg
    const spreadAngle = (-90 + (randomFn() - 0.5) * 55) * (Math.PI / 180);
    const speed = 4.5 + randomFn() * 6.5;

    particles.push({
      id: Math.floor(randomFn() * 100000),
      x: originX + (randomFn() - 0.5) * 8,
      y: originY,
      vx: Math.cos(spreadAngle) * speed,
      vy: Math.sin(spreadAngle) * speed,
      life: 0,
      maxLife: 35 + Math.floor(randomFn() * 30),
      size: 1.6 + randomFn() * 2.0,
      color: randomFn() > 0.3 ? '#FFE082' : '#FF7043',
      glowColor: '#FFAB00',
      decay: 0.98,
      sparkle: true,
    });
  }

  return particles;
}

/**
 * Creates spinning centrifugal sparks for a Zameen Chakri
 */
export function createChakriSparks(
  originX: number,
  originY: number,
  angleRad: number,
  count = 10,
  randomFn = Math.random
): FirecrackerParticle[] {
  const particles: FirecrackerParticle[] = [];

  for (let i = 0; i < count; i++) {
    const burstAngle = angleRad + (randomFn() - 0.5) * 0.7;
    const speed = 3.2 + randomFn() * 4.8;

    particles.push({
      id: Math.floor(randomFn() * 100000),
      x: originX,
      y: originY,
      vx: Math.cos(burstAngle) * speed,
      vy: Math.sin(burstAngle) * speed,
      life: 0,
      maxLife: 25 + Math.floor(randomFn() * 25),
      size: 1.8 + randomFn() * 1.8,
      color: randomFn() > 0.5 ? '#69F0AE' : '#FFD54F',
      glowColor: '#00E676',
      decay: 0.975,
      sparkle: true,
    });
  }

  return particles;
}

/**
 * Creates a burst of sparks for a Phuljhadi (handheld sparkler)
 */
export function createPhuljhadiSparks(
  x: number,
  y: number,
  count = 8,
  randomFn = Math.random
): FirecrackerParticle[] {
  const particles: FirecrackerParticle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = randomFn() * Math.PI * 2;
    const speed = 1.8 + randomFn() * 4.2;

    particles.push({
      id: Math.floor(randomFn() * 100000),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 20 + Math.floor(randomFn() * 25),
      size: 1.4 + randomFn() * 1.8,
      color: randomFn() > 0.4 ? '#FFFFFF' : '#FFE57F',
      glowColor: '#FFD700',
      decay: 0.965,
      sparkle: true,
    });
  }

  return particles;
}

/**
 * Updates physics of particles with gravity and velocity decay
 */
export function updateParticles(
  particles: FirecrackerParticle[],
  gravity = 0.08
): FirecrackerParticle[] {
  const surviving: FirecrackerParticle[] = [];

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.life += 1;

    if (p.life < p.maxLife) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.decay;
      p.vy = p.vy * p.decay + gravity;
      surviving.push(p);
    }
  }

  return surviving;
}
