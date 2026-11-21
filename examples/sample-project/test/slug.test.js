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
