/**
 * Pure generator and synthesis utilities for AI Rangoli & Festive Wish Card creation
 */

export interface GeneratedRangoliCard {
  title: string;
  symmetry: 4 | 6 | 8 | 12 | 16;
  canvasBg: string;
  elements: Array<{
    type: 'lotus' | 'flower' | 'diya' | 'peacock' | 'dot' | 'mandala';
    x: number; // 0 to 1 distance from center
    y: number; // angle offset in radians
    size: number;
    color: string;
  }>;
  cardHeadline: string;
  cardWish: string;
  cardTheme: 'royal-gold' | 'peacock-teal' | 'midnight-saffron' | 'lotus-rose' | 'deep-ruby';
  cardBackdrop: 'city-fireworks' | 'golden-diya' | 'starry-sky' | 'ayodhya-ghats';
  recipient: string;
  sender: string;
  promptUsed: string;
}

export const INSPIRATION_PROMPTS = [
  'Royal peacock feather mandala with luminous gold and emerald powder for Diwali blessings',
  'Sacred 8-fold lotus blossom in rose pink and warm turmeric gold welcoming Goddess Lakshmi',
  'Celestial sunburst mandala with radiant earthen diyas and marigold petals',
  'Cosmic midnight mandala with sparkling starry dots and traditional ruby flour',
  'Traditional South Indian Kolam with intricate geometric rice powder and crimson vermillion',
  'Sacred temple concentric rings with 12 golden oil lamps and lotus buds for prosperity',
  'Modern radiant saffron and fixed star mandala with warm festive wishes',
  'Vibrant 16-fold harmony mandala with peacocks, lotuses, and flickering flame petals',
];

/**
 * Returns a random inspiration prompt
 */
export function getRandomPrompt(excludePrompt?: string, randomFn = Math.random): string {
  const candidates = INSPIRATION_PROMPTS.filter((p) => p !== excludePrompt);
  return candidates[Math.floor(randomFn() * candidates.length)] || INSPIRATION_PROMPTS[0];
}

/**
 * Deterministically generates an AI Rangoli and Card configuration from user prompt
 */
export function synthesizeRangoliFromPrompt(
  prompt: string,
  recipient = 'Meera & Family',
  sender = 'Anirban Ray'
): GeneratedRangoliCard {
  const p = prompt.toLowerCase();

  let symmetry: 4 | 6 | 8 | 12 | 16 = 8;
  if (p.includes('16') || p.includes('harmony') || p.includes('cosmic')) symmetry = 16;
  else if (p.includes('12') || p.includes('temple') || p.includes('peacock')) symmetry = 12;
  else if (p.includes('6') || p.includes('hex')) symmetry = 6;
  else if (p.includes('4') || p.includes('quad')) symmetry = 4;

  let cardTheme: GeneratedRangoliCard['cardTheme'] = 'royal-gold';
  let cardBackdrop: GeneratedRangoliCard['cardBackdrop'] = 'city-fireworks';
  let cardHeadline = 'शुभ दीपावली';
  let title = 'Sacred Festive Mandala';

  let elements: GeneratedRangoliCard['elements'] = [];

  if (p.includes('peacock') || p.includes('emerald') || p.includes('teal')) {
    cardTheme = 'peacock-teal';
    cardBackdrop = 'starry-sky';
    title = 'Royal Mayura Peacock Mandala';
    cardHeadline = 'दीपोत्सव की हार्दिक शुभकामनाएं';
    elements = [
      { type: 'peacock', x: 0.22, y: 0, size: 28, color: '#168B78' },
      { type: 'lotus', x: 0.44, y: 0.2, size: 24, color: '#FFC857' },
      { type: 'dot', x: 0.65, y: 0.1, size: 10, color: '#8B48B8' },
      { type: 'diya', x: 0.85, y: 0.2, size: 20, color: '#FF8C24' },
      { type: 'dot', x: 0.94, y: 0, size: 7, color: '#FFD700' },
    ];
  } else if (p.includes('lotus') || p.includes('rose') || p.includes('pink') || p.includes('lakshmi')) {
    cardTheme = 'lotus-rose';
    cardBackdrop = 'golden-diya';
    title = 'Mahalakshmi Padma Lotus Mandala';
    cardHeadline = 'श्री महालक्ष्म्यै नमः • शुभ दीपावली';
    elements = [
      { type: 'lotus', x: 0.18, y: 0, size: 36, color: '#FFB4C8' },
      { type: 'flower', x: 0.42, y: 0.25, size: 26, color: '#F47AA5' },
      { type: 'diya', x: 0.68, y: 0, size: 22, color: '#FFC857' },
      { type: 'dot', x: 0.86, y: 0.25, size: 10, color: '#FF8C24' },
    ];
  } else if (p.includes('sunburst') || p.includes('gold') || p.includes('marigold') || p.includes('temple')) {
    cardTheme = 'royal-gold';
    cardBackdrop = 'ayodhya-ghats';
    title = 'Surya Tejas Golden Temple Mandala';
    cardHeadline = 'तमसो मा ज्योतिर्गमय';
    elements = [
      { type: 'mandala', x: 0.2, y: 0, size: 32, color: '#FFC857' },
      { type: 'flower', x: 0.42, y: 0.15, size: 24, color: '#FF8C24' },
      { type: 'diya', x: 0.66, y: 0, size: 22, color: '#DDAA42' },
      { type: 'dot', x: 0.82, y: 0.15, size: 9, color: '#F4EBDD' },
      { type: 'dot', x: 0.93, y: 0, size: 6, color: '#FF5B22' },
    ];
  } else {
    // Default celebratory mandala
    cardTheme = 'midnight-saffron';
    cardBackdrop = 'city-fireworks';
    title = 'Deepotsav Radiance Mandala';
    cardHeadline = 'शुभ दीपावली';
    elements = [
      { type: 'lotus', x: 0.2, y: 0, size: 30, color: '#FFC857' },
      { type: 'flower', x: 0.45, y: 0.2, size: 24, color: '#FF8C24' },
      { type: 'diya', x: 0.72, y: 0, size: 22, color: '#FF5B22' },
      { type: 'dot', x: 0.88, y: 0.1, size: 8, color: '#FFD700' },
    ];
  }

  const cardWish = `May the radiant sacred symmetry of this Diwali illuminate your life with infinite joy, courage, creative abundance, and heartfelt togetherness. May every doorstep you cross be blessed with the golden warmth of a thousand glowing diyas.`;

  return {
    title,
    symmetry,
    canvasBg: 'midnight',
    elements,
    cardHeadline,
    cardWish,
    cardTheme,
    cardBackdrop,
    recipient,
    sender,
    promptUsed: prompt,
  };
}
