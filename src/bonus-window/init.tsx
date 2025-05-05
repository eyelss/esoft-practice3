let idCount = 0;
export const generateId = () => idCount++;

export type IdType = number;
export type SolverType = {
  id: IdType;
  name: string;
};

const workers: SolverType[] = [
  {
    id: generateId(),
    name: 'Gandolfini J.',
  },
  {
    id: generateId(),
    name: 'Imperioli M.',
  },
];

export type TaskType = {
  id: IdType;
  statement: string;
  deadline: Date;
  completed: boolean;
};

const tasksClean: TaskType[] = [
  {
    id: generateId(),
    statement: 'Пропылесосить',
    deadline: new Date(2025, 5, 30),
    completed: true,
  },
  {
    id: generateId(),
    statement: 'Помыть полы',
    deadline: new Date(2025, 5, 30),
    completed: false,
  },
  {
    id: generateId(),
    statement: 'Вынести мусор',
    deadline: new Date(2025, 5, 30),
    completed: false,
  }
];

const tasksMath: TaskType[] = [
  {
    id: generateId(),
    statement: 'Найти дискриминант',
    deadline: new Date(2025, 2, 30),
    completed: false,
  },
  {
    id: generateId(),
    statement: 'Вычислить определенный интеграл',
    deadline: new Date(2025, 2, 30),
    completed: false,
  },
  {
    id: generateId(),
    statement: 'Подставить значения из таблицы функции Лапласа',
    deadline: new Date(2025, 2, 30),
    completed: false,
  },
  {
    id: generateId(),
    statement: 'Проверить выполнение критерия Фишера',
    deadline: new Date(2025, 2, 33),
    completed: false,
  }
];

export type ProblemType = {
  id: IdType;
  statement: string;
  solver: SolverType;
  tasks: TaskType[];
};

export const initProblems: ProblemType[] = [
  {
    id: generateId(),
    statement: 'Убраться в комнате',
    solver: workers[0],
    tasks: tasksClean,
  },
  {
    id: generateId(),
    statement: 'Сделать ДЗ по математике',
    solver: workers[1],
    tasks: tasksMath,
  }
];

export type FilterType = {
  hideCompleted: boolean;
  hideExpired: boolean;
  hideEmpty: boolean;
};

export const initFilterOptions: FilterType = {
  hideCompleted: false,
  hideExpired: false,
  hideEmpty: false,
};

export { workers as initWorkers };