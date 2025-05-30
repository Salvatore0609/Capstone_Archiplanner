import { useEffect, useState } from "react";

export function useDarkMode() {
  // Leggiamo da localStorage: se esiste "dark", inizializziamo a "dark", altrimenti "light"
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Ogni volta che cambia `mode`, aggiorniamo <html> e localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [mode]);

  // Funzione per cambiare tema
  const toggleMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return [mode, toggleMode];
}
