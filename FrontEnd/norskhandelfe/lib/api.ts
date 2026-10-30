import { loadAuth } from "./auth";
import { BASE_API_URL } from "./constants";



// fetch wrapper: prefixes the API url and adds the JWT token when the user is logged in
export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(options.headers);

  const auth = loadAuth();
  if (auth) {
    headers.set("Authorization", `Bearer ${auth.token}`);
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${BASE_API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });
}
