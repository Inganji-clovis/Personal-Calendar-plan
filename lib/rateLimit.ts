// Lightweight in-memory fixed-window rate limiter.
//
// NOTE: This protects a single server instance (local + a single Vercel
// function). For multi-instance production traffic, back this with a shared
// store (e.g. Upstash Redis). It still meaningfully blocks abusive bursts.

type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (now > v.reset) buckets.delete(k);
    }
  }

  const existing = buckets.get(key);
  if (!existing || now > existing.reset) {
    const reset = now + windowMs;
    buckets.set(key, { count: 1, reset });
    return { allowed: true, remaining: limit - 1, reset, limit };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, reset: existing.reset, limit };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, reset: existing.reset, limit };
}

/**
 * Best-effort client identifier for rate limiting: authenticated user id when
 * available, otherwise the forwarded client IP.
 */
export function clientKey(request: Request, userId?: string | null): string {
  if (userId) return `user:${userId}`;
  const fwd = request.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
  return `ip:${ip}`;
}
