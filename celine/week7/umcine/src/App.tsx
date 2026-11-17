import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<Theme>("light");

function ThemeStatus() {
  const theme = useContext(ThemeContext);

  return <p>현재 테마: {theme}</p>;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>("light");

  function handleToggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }

  return (
    <ThemeContext value={theme}>
      <ThemeStatus />
      <button onClick={handleToggleTheme}>
        테마 바꾸기
      </button>
    </ThemeContext>
  );
}