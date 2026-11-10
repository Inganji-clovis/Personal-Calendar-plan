import { createClient } from "@supabase/supabase-js";

/**
 * Server-side session verification for API routes.
 *
 * The browser client authenticates with Supabase and forwards its access token
 * as `Authorization: Bearer <token>`. We verify that token against Supabase so
 * an unauthenticated caller cannot invoke paid endpoints (AI credits, SMS/email).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isAuthConfigured(): boolean {
  return Boolean(
    url &&
      anonKey &&
      url.startsWith("http") &&
      !url.includes("YOUR-PROJECT") &&
      !anonKey.includes("YOUR_SUPABASE")
  );
}

export interface AuthResult {
  userId: string | null;
  email: string | null;
  /** Whether Supabase auth is configured on the server at all. */
  configured: boolean;
}

export async function verifyRequestAuth(request: Request): Promise<AuthResult> {
  if (!isAuthConfigured()) {
    return { userId: null, email: null, configured: false };
  }

  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return { userId: null, email: null, configured: true };
  }

  try {
    const sb = createClient(url as string, anonKey as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await sb.auth.getUser(token);
    if (error || !data.user) {
      return { userId: null, email: null, configured: true };
    }
    return { userId: data.user.id, email: data.user.email ?? null, configured: true };
  } catch {
    return { userId: null, email: null, configured: true };
  }
}
