/**
 * Pure logic and state management for Night Sky Starfield & Shooting Stars
 */

export interface Star {
  id: number;
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  color: string;
}

export interface ShootingStar {
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  angle: number;
  speed: number;
  length: number;
  progress: number; // 0 to 1
  maxLifeSeconds: number;
  opacity: number;
  color: string;
}

export const STAR_PALETTE = [
  'rgba(255, 255, 255, ',   // Pure silver white
  'rgba(255, 235, 180, ',   // Warm starlight gold
  'rgba(255, 200, 87, ',    // Festive amber
  'rgba(180, 220, 255, ',   // Cool ethereal blue
  'rgba(255, 180, 200, ',   // Soft celestial rose
];

/**
 * Generates an array of stars distributed over a width & height
 */
export function createStarfield(
  count: number,
  width: number,
  height: number,
  randomFn: () => number = Math.random
): Star[] {
  const stars: Star[] = [];
  const safeCount = Math.max(1, count);
  const safeWidth = Math.max(100, width);
  const safeHeight = Math.max(100, height);

  for (let i = 0; i < safeCount; i++) {
    const depth = randomFn(); // 0 (far) to 1 (near)
    const baseAlpha = 0.25 + depth * 0.65;
    const radius = 0.5 + depth * 1.6;
    const colorTemplate = STAR_PALETTE[Math.floor(randomFn() * STAR_PALETTE.length)];

    stars.push({
      id: i,
      x: randomFn() * safeWidth,
      y: randomFn() * safeHeight,
      radius,
      baseAlpha,
      alpha: baseAlpha,
      twinkleSpeed: 0.8 + randomFn() * 2.2,
      twinklePhase: randomFn() * Math.PI * 2,
      // Slow, subtle celestial drift towards left-down
      vx: -(0.04 + depth * 0.12),
      vy: 0.02 + depth * 0.08,
      color: colorTemplate,
    });
  }

  return stars;
}

/**
 * Calculates current twinkling alpha of a star
 */
export function calculateStarBrightness(
  baseAlpha: number,
  timeSeconds: number,
  speed: number,
  phase: number
): number {
  const osc = Math.sin(timeSeconds * speed + phase);
  // Range from 0.45 * baseAlpha to 1.15 * baseAlpha
  const factor = 0.8 + 0.35 * osc;
  return Math.max(0.05, Math.min(1.0, baseAlpha * factor));
}

/**
 * Updates positions and shimmering brightness of stars with toroidal boundary wrapping
 */
export function updateStars(
  stars: Star[],
  width: number,
  height: number,
  dtSeconds: number,
  timeSeconds: number
): Star[] {
  const safeWidth = Math.max(100, width);
  const safeHeight = Math.max(100, height);

  return stars.map((star) => {
    let nextX = star.x + star.vx * dtSeconds * 30;
    let nextY = star.y + star.vy * dtSeconds * 30;

    // Boundary wrapping
    if (nextX < 0) nextX += safeWidth;
    else if (nextX > safeWidth) nextX -= safeWidth;

    if (nextY < 0) nextY += safeHeight;
    else if (nextY > safeHeight) nextY -= safeHeight;

    const nextAlpha = calculateStarBrightness(
      star.baseAlpha,
      timeSeconds,
      star.twinkleSpeed,
      star.twinklePhase
    );

    return {
      ...star,
      x: nextX,
      y: nextY,
      alpha: nextAlpha,
    };
  });
}

/**
 * Creates a shooting star starting from the upper regions of the sky
 */
export function createShootingStar(
  width: number,
  height: number,
  id: number = Date.now(),
  randomFn: () => number = Math.random
): ShootingStar {
  const safeWidth = Math.max(100, width);
  const safeHeight = Math.max(100, height);

  // Spawn in the top 45% or slightly off-screen to the right/top
  const startX = randomFn() * (safeWidth * 1.1);
  const startY = randomFn() * (safeHeight * 0.45);

  // Diagonal trajectory: typically 30deg to 60deg (radians: ~0.52 to ~1.05)
  // or heading down-left (~2.1 to ~2.6 rad)
  const isHeadingLeft = randomFn() > 0.4;
  const angle = isHeadingLeft
    ? (130 + randomFn() * 30) * (Math.PI / 180)
    : (40 + randomFn() * 30) * (Math.PI / 180);

  const speed = 650 + randomFn() * 550; // px/sec
  const length = 90 + randomFn() * 110;  // length of trail in px
  const maxLifeSeconds = 0.8 + randomFn() * 0.7; // 0.8s to 1.5s total life

  const colors = [
    '#FFF8DC', // Cornsilk / gold
    '#FFE082', // Saffron gold
    '#FFFFFF', // Brilliant white
    '#80DEEA', // Celestial cyan
  ];
  const color = colors[Math.floor(randomFn() * colors.length)];

  return {
    id,
    x: startX,
    y: startY,
    startX,
    startY,
    angle,
    speed,
    length,
    progress: 0,
    maxLifeSeconds,
    opacity: 1,
    color,
  };
}

/**
 * Updates a shooting star's position and calculates fading opacity
 */
export function updateShootingStar(
  star: ShootingStar,
  dtSeconds: number
): { updated: ShootingStar; isAlive: boolean } {
  const newProgress = Math.min(1.0, star.progress + dtSeconds / star.maxLifeSeconds);
  const newX = star.x + Math.cos(star.angle) * star.speed * dtSeconds;
  const newY = star.y + Math.sin(star.angle) * star.speed * dtSeconds;

  // Opacity profile: rapid ease-in at start, intense peak, gentle fade-out towards end
  let opacity = 1.0;
  if (newProgress < 0.15) {
    opacity = newProgress / 0.15;
  } else if (newProgress > 0.6) {
    opacity = Math.max(0, 1 - (newProgress - 0.6) / 0.4);
  }

  const isAlive = newProgress < 1.0;

  return {
    updated: {
      ...star,
      x: newX,
      y: newY,
      progress: newProgress,
      opacity,
    },
    isAlive,
  };
}

/**
 * Determines whether a new shooting star should spawn based on interval
 */
export function shouldSpawnShootingStar(
  timeSinceLastSpawnSeconds: number,
  minIntervalSeconds = 4.0,
  maxIntervalSeconds = 8.5,
  randomSample = Math.random()
): boolean {
  if (timeSinceLastSpawnSeconds < minIntervalSeconds) return false;
  if (timeSinceLastSpawnSeconds >= maxIntervalSeconds) return true;

  // Probability ramp between min and max
  const progress = (timeSinceLastSpawnSeconds - minIntervalSeconds) / (maxIntervalSeconds - minIntervalSeconds);
  return randomSample < progress * 0.25;
}
