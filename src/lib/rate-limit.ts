// Simple in-memory token bucket keyed by an arbitrary identifier (IP, user id).
// Adequate for local/single-instance use. Would need Redis for multi-instance.

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  {
    capacity,
    refillRate,
  }: {
    capacity: number;
    refillRate: number; // tokens per second
  },
): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: capacity, lastRefill: now };
    buckets.set(key, bucket);
  }

  // Refill based on elapsed time
  const elapsed = (now - bucket.lastRefill) / 1000;
  const refilled = Math.min(capacity, bucket.tokens + elapsed * refillRate);
  bucket.tokens = refilled;
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      resetAt:
        now + Math.ceil(((capacity - bucket.tokens) / refillRate) * 1000),
    };
  }

  const msUntilNextToken = Math.ceil(((1 - bucket.tokens) / refillRate) * 1000);
  return {
    allowed: false,
    remaining: 0,
    resetAt: now + msUntilNextToken,
  };
}

// For tests
export function _resetBuckets() {
  buckets.clear();
}
