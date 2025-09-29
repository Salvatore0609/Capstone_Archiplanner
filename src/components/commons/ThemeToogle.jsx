import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FiSun } from "react-icons/fi";
import { IoMoon } from "react-icons/io5";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    setIsDark(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (dark) => {
    const theme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(newDark);
  };

  return (
    <Button
      onClick={toggleTheme}
      className="btn btn-outline-primary rounded-pill px-4"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px",
        border: "2px solid",
        borderColor: isDark ? "var(--primary)" : "var(--primary)",
        backgroundColor: "transparent",
        color: "var(--primary)",
        transition: "all 0.3s ease",
      }}
      title={isDark ? "Passa a tema chiaro" : "Passa a tema scuro"}
    >
      {isDark ? <FiSun size={30} /> : <IoMoon size={30} color="var(--primary)" />}
    </Button>
  );
};

export default ThemeToggle;
