import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createStarfield,
  calculateStarBrightness,
  updateStars,
  createShootingStar,
  updateShootingStar,
  shouldSpawnShootingStar,
} from './nightSky';

test('createStarfield generates the requested count of stars within bounds', () => {
  const count = 40;
  const width = 1200;
  const height = 800;
  const stars = createStarfield(count, width, height, () => 0.5);

  assert.equal(stars.length, count);
  for (const star of stars) {
    assert.ok(star.x >= 0 && star.x <= width, `Star x ${star.x} out of range`);
    assert.ok(star.y >= 0 && star.y <= height, `Star y ${star.y} out of range`);
    assert.ok(star.radius > 0, 'Star radius should be positive');
    assert.ok(star.baseAlpha > 0 && star.baseAlpha <= 1, 'Star baseAlpha between 0 and 1');
  }
});

test('calculateStarBrightness oscillates within safe alpha bounds', () => {
  const baseAlpha = 0.8;
  const time = 2.5;
  const speed = 1.5;
  const phase = 0;

  const brightness = calculateStarBrightness(baseAlpha, time, speed, phase);
  assert.ok(brightness >= 0.05, 'Brightness should never fall below floor');
  assert.ok(brightness <= 1.0, 'Brightness should not exceed 1.0');
});

test('updateStars advances position with wrap-around boundaries', () => {
  const width = 500;
  const height = 400;
  const initialStars = [
    {
      id: 1,
      x: 10,
      y: 10,
      radius: 1,
      baseAlpha: 0.8,
      alpha: 0.8,
      twinkleSpeed: 1,
      twinklePhase: 0,
      vx: -1.0, // Moving left
      vy: 1.0,  // Moving down
      color: 'rgba(255,255,255,',
    },
    {
      id: 2,
      x: 2,
      y: 395,
      radius: 1,
      baseAlpha: 0.8,
      alpha: 0.8,
      twinkleSpeed: 1,
      twinklePhase: 0,
      vx: -5.0, // Will wrap past 0
      vy: 5.0,  // Will wrap past 400
      color: 'rgba(255,255,255,',
    },
  ];

  const updated = updateStars(initialStars, width, height, 0.1, 1.0);
  assert.equal(updated.length, 2);

  // Star 1 should have moved
  assert.notEqual(updated[0].x, initialStars[0].x);
  assert.notEqual(updated[0].y, initialStars[0].y);

  // Star 2 should wrap around
  assert.ok(updated[1].x >= 0 && updated[1].x <= width, 'Star 2 x should wrap inside bounds');
  assert.ok(updated[1].y >= 0 && updated[1].y <= height, 'Star 2 y should wrap inside bounds');
});

test('createShootingStar initializes active shooting star with valid trajectory', () => {
  const width = 1440;
  const height = 900;
  const star = createShootingStar(width, height, 999, () => 0.5);

  assert.equal(star.id, 999);
  assert.equal(star.progress, 0);
  assert.ok(star.speed > 500, 'Shooting star speed should be high');
  assert.ok(star.length > 50, 'Shooting star should have visible trail');
  assert.ok(star.maxLifeSeconds > 0.5, 'Shooting star should have positive lifetime');
});

test('updateShootingStar advances progress, updates position, and flags expiration', () => {
  const width = 1000;
  const height = 1000;
  const star = createShootingStar(width, height, 1, () => 0.5);

  const dt = 0.2;
  const { updated, isAlive } = updateShootingStar(star, dt);

  assert.ok(updated.progress > 0, 'Progress should advance');
  assert.notEqual(updated.x, star.x, 'X position should advance');
  assert.notEqual(updated.y, star.y, 'Y position should advance');
  assert.equal(isAlive, true);

  // Advance past max life
  const { updated: expiredStar, isAlive: stillAlive } = updateShootingStar(
    { ...star, progress: 0.99 },
    1.0
  );
  assert.equal(expiredStar.progress, 1.0);
  assert.equal(stillAlive, false);
});

test('shouldSpawnShootingStar respects minimum and maximum interval gates', () => {
  assert.equal(shouldSpawnShootingStar(2.0, 4.0, 8.0, 0.01), false);
  assert.equal(shouldSpawnShootingStar(8.5, 4.0, 8.0, 0.99), true);
  // Between min and max, low random sample triggers spawn
  assert.equal(shouldSpawnShootingStar(6.0, 4.0, 8.0, 0.01), true);
  // High random sample does not trigger spawn
  assert.equal(shouldSpawnShootingStar(4.5, 4.0, 8.0, 0.95), false);
});
