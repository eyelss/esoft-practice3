import { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react';
import { initWorkers, initProblems, initFilterOptions, ProblemType, TaskType, SolverType, FilterType, IdType, generateId } from './init';
import './BonusWindow.css';

/**
 * Мне стыдно за то что ниже. Читаемость кода была не в приоритете.
 */

const HandleAddTaskContext = createContext<((problemId: IdType, task: TaskType) => void) | null>(null);
const WorkersContext = createContext(initWorkers);
const ProblemContext = createContext(initProblems);
const FilterContext = createContext(initFilterOptions);

enum ProblemActionType {
  ADD_PROBLEM,
  ADD_TASK,
  TOGGLE_TASK,
}

type ProblemAction =
| { type: ProblemActionType.ADD_PROBLEM, problem: ProblemType }
| { type: ProblemActionType.ADD_TASK, problemId: IdType, task: TaskType }
| { type: ProblemActionType.TOGGLE_TASK, problemId: IdType, taskId: IdType }

enum FilterActionType {
  TOGGLE_COMPLETED,
  TOGGLE_EXPIRED,
  TOGGLE_EMPTY,
}

type FilterAction = { type: FilterActionType }

function problemsReducer(problems: ProblemType[], action: ProblemAction): ProblemType[] {
  switch (action.type) {
    case ProblemActionType.ADD_PROBLEM:
      return [
        ...problems,
        action.problem,
      ];
    case ProblemActionType.ADD_TASK:
      return problems.map(problem => {
        return {
          ...problem,
          tasks: problem.id == action.problemId ? [...problem.tasks, action.task] : problem.tasks,
        }
      });
    default:
      throw new Error('Error general validaiton.');
  }
}

function filterReducer(filterOptions: FilterType, action: FilterAction): FilterType {
  switch (action.type) {
    case FilterActionType.TOGGLE_COMPLETED:
      return {
        ...filterOptions,
        hideCompleted: !filterOptions.hideCompleted,
      }
    case FilterActionType.TOGGLE_EMPTY:
      return {
        ...filterOptions,
        hideEmpty: !filterOptions.hideEmpty,
      }
    case FilterActionType.TOGGLE_EXPIRED:
      return {
        ...filterOptions,
        hideExpired: !filterOptions.hideExpired,
      }
    default:
      throw new Error('Error general validaiton.');
  }
}

function BonusWindow() {
  const [problems, dispatchProblems] = useReducer(problemsReducer, initProblems);
  const [filterOptions, filterDispatch] = useReducer(filterReducer, initFilterOptions);
  const [workers, setWorkers] = useState(initWorkers);

  const handleActionAddWorker = useCallback((formData: FormData): void => {
    const name = formData.get('worker_name')?.toString();
    if (name) {
      setWorkers(workers => {
        return [...workers, { id: generateId(), name }];
      });
    }
  }, [setWorkers]);

  const handleActionAddProblem = useCallback((formData: FormData): void => {
    const statement = formData.get('problem_statement')?.toString() ?? '';
    const workerId = parseInt(formData.get('worker_select')!.toString());
    const worker = workers.find(worker => worker.id == workerId);
    
    if (worker) {
      dispatchProblems({ type: ProblemActionType.ADD_PROBLEM, problem: { id: generateId(), solver: worker, statement, tasks: [] } });
    }
  }, [dispatchProblems, workers]);

  const handleActionAddTask = useCallback((problemId: IdType, task: TaskType): void => {
    if (isNaN(task.deadline.getTime())) { 
      console.error('Wrong deadline date');
      return;
    }

    dispatchProblems({
      type: ProblemActionType.ADD_TASK,
      problemId,
      task,
    });
  }, [dispatchProblems]);

  const filterDispatchCallback = useCallback((action: FilterAction) => filterDispatch(action), [filterDispatch]);

  return (
    <div className="bonus-window">
      <h4>Бонусное задание. Комбинирование хуков. (useReducer, useMemo, useCallback, useContext)</h4>

      <HandleAddTaskContext.Provider value={handleActionAddTask}>
      <WorkersContext.Provider value={workers}>
      <ProblemContext.Provider value={problems}>
      <FilterContext.Provider value={filterOptions}>
        
        <AddWorkerComponent handleAction={handleActionAddWorker}/>
        <AddProblemComponent handleAction={handleActionAddProblem}/>
        <FilterComponent filterDispatch={filterDispatchCallback}/>
        <ProblemListComponent problems={problems}/>
      
      </FilterContext.Provider>
      </ProblemContext.Provider>
      </WorkersContext.Provider>
      </HandleAddTaskContext.Provider>
    </div>
  )
}

function FilterComponent({ filterDispatch }: { filterDispatch: (action: FilterAction) => void }) {
  const filterOptions = useContext(FilterContext);

  return (
    <div className="filter-component">
      <h5>Фильтрация: </h5>
      <label htmlFor="hide_filtred">Скрыть сделанное: </label>
      <input name="hide_filtred" type="checkbox" 
        checked={filterOptions.hideCompleted} 
        onChange={() => filterDispatch({ type: FilterActionType.TOGGLE_COMPLETED })}
      />
      <label htmlFor="hide_expired">Скрыть просроченные: </label>
      <input name="hide_expired" type="checkbox" 
        checked={filterOptions.hideExpired}
        onChange={() => filterDispatch({ type: FilterActionType.TOGGLE_EXPIRED })}
      />
      <label htmlFor="hide_empty">Скрыть проблемы без задач: </label>
      <input name="hide_empty" type="checkbox" 
        checked={filterOptions.hideEmpty}
        onChange={() => filterDispatch({ type: FilterActionType.TOGGLE_EMPTY })}
      />
    </div>
  )
}

function AddWorkerComponent({ handleAction }: { handleAction: (formData: FormData) => void }) {
  
  return (
    <div className="add-worker">
      <h5>Добавление рабочего: </h5>
      <form action={handleAction}>
        <label htmlFor="worker_name">Имя: </label>
        <input name="worker_name"/>
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}

function AddProblemComponent({ handleAction }: { handleAction: (formData: FormData) => void }) {

  return (
    <div className="add-problem">
      <h5>Добавление проблемы:</h5>
      <form action={handleAction}>
        <WorkerSelector/>
        <label htmlFor="problem_statement">Проблематика: </label>
        <input name="problem_statement"/>
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}

function WorkerSelector() {
  const [selectedWorker, setSelectedWorker] = useState<SolverType | undefined>(undefined);
  const workers = useContext(WorkersContext);
  
  return (
    <>
      <label htmlFor="worker_select">Рабочий: </label>
      <select
        name="worker_select"
        value={selectedWorker?.id}
        onChange={(e) => setSelectedWorker(() => workers.find(worker => worker!.id == parseInt(e.target.value)))}
      >
        {workers.map(worker => (
          <option key={worker.id} value={worker.id}>
            {worker.name}
          </option>
        ))}
      </select>
    </>
  );
}

function ProblemListComponent({ problems }: { problems: ProblemType[] }) {
  const filterOptions = useContext(FilterContext);
  
  const filtredMemo = useMemo(() => {
    let filtredProblems = problems.map(problem => {
      const ret = { ...problem };
  
      if (filterOptions.hideCompleted) {
        ret.tasks = ret.tasks.filter(task => !task.completed);
      }
  
      if (filterOptions.hideExpired) {
        const today = new Date();
        ret.tasks = ret.tasks.filter(task => task.deadline >= today);
      }
  
      return ret;
    });
  
    if (filterOptions.hideEmpty) {
      filtredProblems = filtredProblems.filter(problems => problems.tasks.length > 0);
    }

    return filtredProblems;
  }, [problems, filterOptions]);

  return (
    <ul>
      {filtredMemo.map(problem => 
        <li key={problem.id}>
          <ProblemComponent problem={problem}/>
        </li>)}
    </ul>
  );
}

function ProblemComponent({ problem }: { problem: ProblemType }) {
  const problemDeadline = useMemo(() => {
    if (problem.tasks.length === 0) {
      return undefined;
    }

    return problem.tasks.reduce((acc, cur) => cur.deadline > acc ? cur.deadline : acc, problem.tasks[0].deadline);
  }, [problem]);


  return (
    <details>
      <summary>{problem.solver.name}, '{problem.statement}', {problemDeadline?.toLocaleDateString('ru-RU')}</summary>
        <ol>
          {problem.tasks.map(task =>
            <li key={task.id}>
              <TaskComponent task={task}/>
            </li>
          )}
        </ol>
      <AddTaskComponent problem={problem}/>
    </details>
  );
}

function TaskComponent({ task }: { task: TaskType }) {
  const today = new Date();
  const taskStatusClass = 
    task.completed ? 'task-completed' :
    today > task.deadline ? 'task-expired' : '';

  return (
    <a
      className={taskStatusClass}
    >'{task.statement}', {task.deadline.toLocaleDateString('ru-RU')}</a>
  );
}

function AddTaskComponent({ problem }: { problem: ProblemType }) {
  const handleAddTask = useContext(HandleAddTaskContext);

  const handleAction = (formData: FormData): void => {
    const statement = formData.get('task_statement')!.toString();
    const deadline = new Date(formData.get('deadline')!.toString());
    
    const task: TaskType = {
      id: generateId(),
      statement,
      deadline,
      completed: false,
    };

    handleAddTask!(problem.id, task);
  }

  return (
    <form action={handleAction}>
      <label htmlFor="task_statement">Постановка: </label>
      <input name="task_statement" />
      <label htmlFor="deadline">Дедлайн: </label>
      <input name="deadline" type="date" />
      <button type="submit">Добавить</button>
    </form>
  );
}

export default BonusWindow;