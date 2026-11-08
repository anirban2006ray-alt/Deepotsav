import test from 'node:test';
import assert from 'node:assert/strict';
import { getTranslation } from './translations';
import { LANGUAGE_OPTIONS } from '../components/LanguageDropdown';

test('language options contains all supported languages with flags', () => {
  const codes = LANGUAGE_OPTIONS.map((opt) => opt.code);
  assert.deepEqual(codes, ['en', 'hi', 'bn']);

  const english = LANGUAGE_OPTIONS.find((opt) => opt.code === 'en');
  assert.ok(english);
  assert.equal(english.name, 'English');
  assert.equal(english.nativeName, 'English');
  assert.ok(english.flag);

  const hindi = LANGUAGE_OPTIONS.find((opt) => opt.code === 'hi');
  assert.ok(hindi);
  assert.equal(hindi.name, 'Hindi');
  assert.equal(hindi.nativeName, 'हिन्दी');
  assert.ok(hindi.flag);

  const bengali = LANGUAGE_OPTIONS.find((opt) => opt.code === 'bn');
  assert.ok(bengali);
  assert.equal(bengali.name, 'Bengali');
  assert.equal(bengali.nativeName, 'বাংলা');
  assert.ok(bengali.flag);
});

test('translations return appropriate localized strings', () => {
  const en = getTranslation('en');
  assert.equal(en.siteTitle, 'DIWALI 3D');
  assert.equal(en.celebrateCta, 'Celebrate Diwali');

  const hi = getTranslation('hi');
  assert.equal(hi.siteTitle, 'दीवाली 3D');
  assert.equal(hi.navHome, 'मुखपृष्ठ');

  const bn = getTranslation('bn');
  assert.equal(bn.siteTitle, 'দীপাবলি 3D');
  assert.equal(bn.navHome, 'হোম');
});
