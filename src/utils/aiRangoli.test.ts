import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getRandomPrompt,
  synthesizeRangoliFromPrompt,
  INSPIRATION_PROMPTS,
} from './aiRangoli';

test('getRandomPrompt returns a valid non-empty prompt from candidates', () => {
  const prompt = getRandomPrompt(undefined, () => 0);
  assert.ok(prompt && prompt.length > 10);
  assert.ok(INSPIRATION_PROMPTS.includes(prompt));
});

test('synthesizeRangoliFromPrompt handles peacock theme with emerald and symmetry', () => {
  const result = synthesizeRangoliFromPrompt('Royal peacock mandala with emerald powder');
  assert.equal(result.cardTheme, 'peacock-teal');
  assert.equal(result.symmetry, 12);
  assert.ok(result.elements.some((e) => e.type === 'peacock'));
  assert.ok(result.cardHeadline.length > 0);
});

test('synthesizeRangoliFromPrompt handles lotus theme with soft pinks', () => {
  const result = synthesizeRangoliFromPrompt('Sacred lotus flowers for goddess lakshmi');
  assert.equal(result.cardTheme, 'lotus-rose');
  assert.ok(result.elements.some((e) => e.type === 'lotus'));
});

test('synthesizeRangoliFromPrompt handles cosmic 16-fold symmetry', () => {
  const result = synthesizeRangoliFromPrompt('Cosmic 16-fold harmony mandala');
  assert.equal(result.symmetry, 16);
});
