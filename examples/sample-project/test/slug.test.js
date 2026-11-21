import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/slug.js';

test('AC1 lowercases and collapses non-alphanumeric runs into one hyphen', () => {
  assert.equal(slugify('Hello, World!'), 'hello-world');
  assert.equal(slugify('a  --  b__c'), 'a-b-c');
});

test('AC2 has no leading or trailing hyphen', () => {
  assert.equal(slugify('  --Hello--  '), 'hello');
});

test('AC3 removes diacritics', () => {
  assert.equal(slugify('Crème Brûlée'), 'creme-brulee');
});

test('AC4 truncates to maxLength and never ends with a hyphen', () => {
  assert.equal(slugify('abc def', { maxLength: 4 }), 'abc');
  assert.equal(slugify('a'.repeat(100)).length, 60);
  assert.equal(slugify('abcdef', { maxLength: 3 }), 'abc');
});

test('AC5 rejects non-strings and returns "" when nothing usable remains', () => {
  assert.throws(() => slugify(42), TypeError);
  assert.throws(() => slugify(null), TypeError);
  assert.equal(slugify('!!!'), '');
  assert.equal(slugify(''), '');
});

test('T-003 AC1 rejects a maxLength that is not a non-negative integer', () => {
  for (const maxLength of [-1, 1.5, NaN, '5', Infinity]) {
    assert.throws(() => slugify('abc', { maxLength }), RangeError);
  }
});

test('T-003 AC2 treats null options like no options', () => {
  assert.equal(slugify('x', null), slugify('x'));
});

test('T-003 AC3 transliterates letters that do not decompose', () => {
  assert.equal(slugify('Straße'), 'strasse');
  assert.equal(slugify('Æther'), 'aether');
  assert.equal(slugify('Łódź'), 'lodz');
  assert.equal(slugify('Ørsted'), 'orsted');
});

test('T-003 AC4 covers maxLength 0 and a default-length cut on a hyphen', () => {
  assert.equal(slugify('abc', { maxLength: 0 }), '');
  assert.equal(slugify('a'.repeat(59) + ' b'), 'a'.repeat(59));
});
