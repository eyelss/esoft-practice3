import { useContext, useReducer, useRef } from 'react';
import { ThemeContext } from '../App';
import './SubWindow.css';

type TodoElementType = {
  task: string;
  completed: boolean;
};

enum TodoActionType {
  ADD_TODO,
  TOGGLE_TODO,
  DELETE_TODO,
};

type TodoAction =
| { type: TodoActionType.ADD_TODO, task: string}
| { type: TodoActionType.TOGGLE_TODO, index: number}
| { type: TodoActionType.DELETE_TODO, index: number}

function todoReducer(state: TodoElementType[], action: TodoAction): TodoElementType[] {
  switch (action.type) {
    case TodoActionType.ADD_TODO:
      return [...state, { task: action.task, completed: false }];
    case TodoActionType.TOGGLE_TODO:     
      return state.map((item, i) => (i === action.index) ? { task: item.task, completed: !item.completed } : item);
    case TodoActionType.DELETE_TODO:
      return state.filter((_, i) => action.index !== i);
    default:
      throw new Error('General validaiton error');
  }
}

function SubWindowReducer() {
  const theme = useContext(ThemeContext);
  const [todoList, todoListDispatch] = useReducer(todoReducer, [
    { task: 'Проснуться', completed: true },
    { task: 'Лечь спать', completed: false },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    todoListDispatch({ type: TodoActionType.ADD_TODO, task: inputRef.current!.value });
    inputRef.current!.focus();
  }

  const handleToggleTodo = (index: number) => {
    todoListDispatch({ type: TodoActionType.TOGGLE_TODO, index });
  }

  const handleDeleteTodo = (index: number) => {
    todoListDispatch({ type: TodoActionType.DELETE_TODO, index });
  }

  return (
    <div className={`sub-window ${theme}`}>
      
      <h4>5. useReducer – управление списком задач (Todo List)</h4>
      
      <ul>
        {todoList.map((item, index) => (
          <li 
            key={index}>
            <a 
              style={item.completed?{textDecoration: 'line-through'}:{}}
              onClick={() => handleToggleTodo(index)}>
                {item.task}
            </a>
            <a 
              onClick={() => handleDeleteTodo(index)}>
                ❌
            </a>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input ref={inputRef}/>
        <p><button type='submit'>Добавить</button></p>
      </form>
    
    </div>
  );
}

export default SubWindowReducer;