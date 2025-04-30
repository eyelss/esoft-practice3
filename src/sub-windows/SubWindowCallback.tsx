import { useCallback, useContext, useState } from 'react';
import { ThemeContext } from '../App';
import './SubWindow.css';

/**
 * Структура для мониторинга переиспользования и создания новых обработчиков клика на кнопку.
 */
const CREATED_FUNCTIONS: (() => void)[] = [];
function functionExistsOrPush(func: () => void): boolean {
  for (const createdFn of CREATED_FUNCTIONS) {
    if (func === createdFn) {
      return true;
    }
  }

  CREATED_FUNCTIONS.push(func);
  return false;
}

function SubWindowCallback() {
  const [count, setCount] = useState(0);

  const theme = useContext(ThemeContext);

  const handleClick = () => {
    setCount(count => ++count);
  }

  const handleClickCallback = useCallback(() => {
    setCount(count => ++count);
  }, [setCount]);

  return (
    <div className={`sub-window ${theme}`}>
      <h4>2. useCallback – оптимизация обработчиков</h4>
      <h5>Counter: {count} (практическая разница применения в консоли)</h5>

      <ChildButton title='С useCallback' handleClick={handleClickCallback}/>
      <ChildButton title='Без useCallback' handleClick={handleClick}/>
    </div>
  );
}


type ChildButtonProps = {
  title: string;
  handleClick: () => void;
};

function ChildButton({ title, handleClick }: ChildButtonProps) {
  console.log(`Компонент '${title}': ${functionExistsOrPush(handleClick) ? 'handleClick переиспользован[+]' : 'handleClick переопределен[-]'}`);


  return (
    <button onClick={handleClick}>{title}</button>
  )
}

export default SubWindowCallback;