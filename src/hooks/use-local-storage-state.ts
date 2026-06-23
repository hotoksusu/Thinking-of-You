"use client";

import { useLocalStorage } from "./useLocalStorage";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  return useLocalStorage(key, initialValue);
}
