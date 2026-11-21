const DEFAULT_MAX_LENGTH = 60;

export function slugify(title, { maxLength = DEFAULT_MAX_LENGTH } = {}) {
  if (typeof title !== 'string') throw new TypeError('slugify: title must be a string');
  const slug = title
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // Truncation can expose a hyphen at the cut, so trim again.
  return slug.slice(0, maxLength).replace(/-+$/, '');
}
