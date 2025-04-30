import { memo, useContext, useState, useEffect, useRef, useCallback, Ref } from 'react';
import { ThemeContext } from '../App';
import './SubWindow.css';

function SubWindowMemo() {
  const theme = useContext(ThemeContext);

  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [number3, setNumber3] = useState(0);
  
  const handleClick1 = useCallback(() => setNumber1(num => ++num), [setNumber1]);
  const handleClick2 = useCallback(() => setNumber2(num => ++num), [setNumber2]);
  const handleClick3 = useCallback(() => setNumber3(num => ++num), [setNumber3]);

  return (
    <div className={`sub-window ${theme}`}>
      <h4>6. React.memo – оптимизация рендеринга</h4>
      <h5>Оранжевая подсветка означает ререндер компонента</h5>
      <h5>Счетчики:</h5>
      <ChildButton handleClick={handleClick1} title='Стаднарт' count={number1}/>
      <ChildButton handleClick={handleClick2} title='Стандарт' count={number2}/>
      <MemoButton handleClick={handleClick3} title='Мемоизация' count={number3}/>
    </div>
  );
}

type ChildButtonProps = {
  title: string;
  count: number;
  handleClick: () => void;
};

const ChildButton = ({ title, count, handleClick }: ChildButtonProps) => {
  const ref = useRenderHighlight();

  return (
    <button
      ref={ref}
      onClick={handleClick}>
        {title}: {count}
    </button>
  );
}

const MemoButton = memo(ChildButton);

// Сниппет для подсветки ререндера
function useRenderHighlight(color = '#FF5722'): Ref<HTMLButtonElement> {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transition = 'border 0.3s';
      ref.current.style.border = `2px solid ${color}`;
      
      const timer = setTimeout(() => {
        if (ref.current) {
          ref.current.style.border = '2px solid transparent';
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  });

  return ref;
}

export default SubWindowMemo;