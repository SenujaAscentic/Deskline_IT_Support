import { useEffect, useState } from "react";

const STORAGE_KEY = "reduceMotion";

function systemPrefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") return true;
    if (saved === "false") return false;
    // No explicit choice saved yet — defer to the OS setting.
    return systemPrefersReducedMotion();
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-motion", reduced ? "reduced" : "full");
    localStorage.setItem(STORAGE_KEY, String(reduced));
  }, [reduced]);

  function toggleReducedMotion() {
    setReduced((r) => !r);
  }

  return { reduced, toggleReducedMotion };
}