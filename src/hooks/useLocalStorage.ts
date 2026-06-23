"use client";

import { useEffect, useRef, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue);
  const [value, setValue] = useState<T>(initialRef.current);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedValue = readStorage(key, initialRef.current);
    setValue(storedValue);

    if (typeof window !== "undefined" && !window.localStorage.getItem(key)) {
      writeStorage(key, initialRef.current);
    }

    setIsLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!isLoaded) return;
    writeStorage(key, value);
  }, [isLoaded, key, value]);

  return [value, setValue, isLoaded] as const;
}
