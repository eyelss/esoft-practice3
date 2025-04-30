import { createContext, useState } from 'react';
import './App.css';
import Container from './Container';

// Дефолтные значения для темы и определение контекста темы.
type ThemeType = 'dark' | 'light';
const defaultTheme: ThemeType = localStorage.getItem('theme') as ThemeType ?? 'light'; 
const ThemeContext = createContext<ThemeType>(defaultTheme);

// Определение контекста для стейта (setTheme)
const ToggleThemeButtonContext = createContext<(() => void) | null>(null);

function App() {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);

  const toggleTheme = () => setTheme(theme => {
    const retTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', retTheme);
    return retTheme;
  });

  return (
    <>
      <ThemeContext.Provider value={theme}>
        <ToggleThemeButtonContext value={toggleTheme}>
          <Container/>
        </ToggleThemeButtonContext>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
export { ThemeContext, ToggleThemeButtonContext };