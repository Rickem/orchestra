const DEFAULT_MAX_LENGTH = 60;

const TRANSLITERATIONS = { 'ß': 'ss', 'æ': 'ae', 'ø': 'o', 'ł': 'l' };

export function slugify(title, options) {
  const { maxLength = DEFAULT_MAX_LENGTH } = options ?? {};
  if (typeof title !== 'string') throw new TypeError('slugify: title must be a string');
  if (!Number.isInteger(maxLength) || maxLength < 0) {
    throw new RangeError('slugify: maxLength must be a non-negative integer');
  }
  const slug = title
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[ßæøł]/g, (c) => TRANSLITERATIONS[c])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // Truncation can expose a hyphen at the cut, so trim again.
  return slug.slice(0, maxLength).replace(/-+$/, '');
}
