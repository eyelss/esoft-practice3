import { useContext, useRef, useState } from 'react';
import { ThemeContext } from '../App';
import './SubWindow.css';

function SubWindowRef() {
  const theme = useContext(ThemeContext);
  
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [prevInput, setPrevInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrevInput(inputRef.current?.value ?? '')
    inputRef.current!.focus();
  }

  return (
    <div className={`sub-window ${theme}`}>
      <h4>4. useRef – фокус на input и сохранение предыдущего значения</h4>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef}/>
        <p><button type='submit'>Фокус</button></p>
        <h5>Прошлое значение: '{prevInput}'</h5>
      </form>
    </div>
  );
}

export default SubWindowRef;