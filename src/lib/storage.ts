export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function removeStorageByPrefix(prefix: string) {
  if (typeof window === "undefined") return;

  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => window.localStorage.removeItem(key));
}
