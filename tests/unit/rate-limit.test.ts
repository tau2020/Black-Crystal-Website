import { describe, expect, it } from 'vitest';
import { RateLimiter } from '../../src/lib/contact/rate-limit';

describe('RateLimiter', () => {
  it('allows up to the limit within the window, then blocks with a retry time', () => {
    let now = 0;
    const limiter = new RateLimiter(2, 60_000, () => now);
    expect(limiter.hit('ip').allowed).toBe(true);
    expect(limiter.hit('ip').allowed).toBe(true);
    const blocked = limiter.hit('ip');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(60);
    now = 61_000;
    expect(limiter.hit('ip').allowed).toBe(true);
  });

  it('tracks keys independently', () => {
    const limiter = new RateLimiter(1, 60_000, () => 0);
    expect(limiter.hit('a').allowed).toBe(true);
    expect(limiter.hit('b').allowed).toBe(true);
    expect(limiter.hit('a').allowed).toBe(false);
  });
});
