// Single source for HTTP response headers. Used by scripts/postbuild.mjs (host config files) and
// server/serve.mjs (local review server). Script/style hashes are delivered per page by Astro's CSP <meta>;
// the header policy below adds the directives a <meta> CSP cannot express.

export const securityHeaders = {
  'Content-Security-Policy': "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

/** Cache policy by path prefix: fingerprinted build assets are immutable; media changes rarely. */
export const cacheRules = [
  { prefix: '/_astro/', value: 'public, max-age=31536000, immutable' },
  { prefix: '/media/', value: 'public, max-age=2592000' },
  { prefix: '/brand/', value: 'public, max-age=604800' },
  { prefix: '/masks/', value: 'public, max-age=604800' },
];
