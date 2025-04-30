import { useContext } from 'react';
import { ToggleThemeButtonContext, ThemeContext } from '../App';
import './SubWindow.css';

function SubWindowContext() {
  const theme = useContext(ThemeContext);
  const toggleTheme = useContext(ToggleThemeButtonContext);
  
  return (
    <div className={`sub-window ${theme}`}>
      <h4>1. useContex – темная/светлая тема</h4>
      
      <button onClick={() => toggleTheme && toggleTheme()}>Сменить тему</button>
    </div>
  );
}

export default SubWindowContext;