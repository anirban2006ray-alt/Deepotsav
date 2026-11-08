import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRocketExplosion,
  createAnarSparks,
  createChakriSparks,
  createPhuljhadiSparks,
  updateParticles,
} from './firecrackers';

test('createRocketExplosion creates expected number of particles with valid properties', () => {
  const count = 30;
  const particles = createRocketExplosion(400, 300, count, () => 0.5);

  assert.equal(particles.length, count);
  for (const p of particles) {
    assert.equal(p.x, 400);
    assert.equal(p.y, 300);
    assert.ok(p.size > 0);
    assert.ok(p.maxLife > 0);
  }
});

test('createAnarSparks generates upward-directed particles', () => {
  const particles = createAnarSparks(200, 500, 10, () => 0.5);

  assert.equal(particles.length, 10);
  for (const p of particles) {
    // Upward velocity has negative vy
    assert.ok(p.vy < 0, `Expected vy < 0, got ${p.vy}`);
  }
});

test('createChakriSparks generates radial spinning particles', () => {
  const angle = Math.PI / 4;
  const particles = createChakriSparks(150, 150, angle, 8, () => 0.5);

  assert.equal(particles.length, 8);
  for (const p of particles) {
    assert.ok(p.vx !== 0 || p.vy !== 0);
  }
});

test('updateParticles updates positions and removes expired particles', () => {
  const particles = [
    {
      id: 1,
      x: 100,
      y: 100,
      vx: 2,
      vy: 2,
      life: 0,
      maxLife: 10,
      size: 2,
      color: '#FFF',
      glowColor: '#FFF',
      decay: 0.9,
    },
    {
      id: 2,
      x: 200,
      y: 200,
      vx: 1,
      vy: 1,
      life: 9,
      maxLife: 10, // will expire on next tick
      size: 2,
      color: '#FFF',
      glowColor: '#FFF',
      decay: 0.9,
    },
  ];

  const updated = updateParticles(particles, 0.1);
  assert.equal(updated.length, 1);
  assert.equal(updated[0].id, 1);
  assert.notEqual(updated[0].x, 100);
  assert.notEqual(updated[0].y, 100);
});
