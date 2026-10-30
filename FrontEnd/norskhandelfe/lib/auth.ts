//login data returned by POST /api/Auth /login
export interface AuthUser {
  token: string;
  expiresAt: string;
  customerId: number;
  name: string;
  role: "Admin" | "Customer" | "Guest";
}
const STORAGE_KEY = "norskhandverk_auth";

export function saveAuth(auth: AuthUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

// Returns the stored login, or null if there is none or the token has expired
export function loadAuth(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const auth = JSON.parse(raw) as AuthUser;
    if (new Date(auth.expiresAt) <= new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return auth;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}
