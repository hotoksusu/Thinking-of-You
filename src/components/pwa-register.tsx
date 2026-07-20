"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      return;
    }

    const resetOldOfflineCache = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js?v=6", {
          updateViaCache: "none",
        });
        await registration.update();

        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      } catch {
        // The website still works normally when service workers are unavailable.
      }
    };

    void resetOldOfflineCache();
  }, []);

  return null;
}
