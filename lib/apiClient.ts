import { supabase } from "./supabase";

/**
 * Returns an Authorization header carrying the current Supabase access token,
 * so API routes can verify the caller is authenticated.
 */
export async function authHeaders(): Promise<Record<string, string>> {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}
