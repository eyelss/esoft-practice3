
import { useContext, useMemo, useState } from 'react';
import { ThemeContext } from '../App';
import './SubWindow.css';

function generateRandomArray(size: number = 5): number[] {
  const retArray: number[] = [];
  for (let i = 0; i < size; i++) {
    retArray.push(Math.floor(Math.random() * 100));
  }

  return retArray;
}

function SubWindowUseMemo() {
  const theme = useContext(ThemeContext);
  const [numbers, setNumbers] = useState(generateRandomArray());

  const sum = useMemo(() => {
    return numbers.reduce((sum, x) => sum + x)
  }, [numbers]);

  return (
    <div className={`sub-window ${theme}`}>
      <h4>3. useMemo – оптимизация вычислений</h4>
      <h5>Массив: [{numbers.toString()}], их сумма: {sum}</h5>
      <button onClick={() => setNumbers(generateRandomArray())}>Сгенерировать массив</button>
    </div>
  );
}

export default SubWindowUseMemo;