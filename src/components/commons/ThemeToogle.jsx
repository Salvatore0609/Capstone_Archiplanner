import { Button } from "react-bootstrap";
import { FiSun } from "react-icons/fi";
import { IoMoon } from "react-icons/io5";
import { useTheme } from "../../hooks/UseTheme";

const ThemeToggle = () => {
  const [isDark, toggleTheme] = useTheme(false);

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
        borderColor: "var(--primary)",
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
