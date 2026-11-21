// Obvious-credential patterns shared by the guard hook and the factory validator.
// These catch common, well-formed secrets only. They are not a secret scanner.
export const SECRET_PATTERNS = [
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'private key block', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/ },
  { name: 'GitHub token', re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  { name: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'API secret key', re: /\bsk-[A-Za-z0-9_-]{24,}\b/ },
  {
    name: 'hard-coded credential',
    re: /\b(?:password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token)\b\s*[:=]\s*["'][^"'\s${}<>]{12,}["']/i,
  },
];

const SECRET_FILES = [
  /^\.env(\.(?!example$|sample$|template$|dist$)[\w.-]+)?$/i,
  /\.(pem|key|pfx|p12|keystore|jks)$/i,
  /^id_(rsa|dsa|ecdsa|ed25519)$/i,
  /^credentials(\.json)?$/i,
  /^secrets?\.(json|ya?ml|toml)$/i,
  /^\.npmrc$/i,
  /^\.pypirc$/i,
];

export function isSecretFile(basename) {
  return SECRET_FILES.some((re) => re.test(basename));
}

// Returns the names of the patterns found, never the matched text.
export function findSecrets(text) {
  if (!text) return [];
  return SECRET_PATTERNS.filter((p) => p.re.test(text)).map((p) => p.name);
}
