import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {AppReducerActionsType, RequestAppStatuses, setAppError, setAppStatus} from "./app-reducer";


const initialState: TasksStateType = {}


// REDUCER
export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case 'REMOVE-TASK': {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId),
      }
    }
    case 'ADD-TASK': {
      return {
        ...state,
        [action.todolistId]: [action.task, ...state[action.todolistId]],
      }
    }
    case 'CHANGE-TASK-STATUS': {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
          ...t,
          status: action.status,
        } : t),
      }
    }
    case 'CHANGE-TASK-TITLE': {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
          ...t,
          title: action.title,
        } : t),
      }
    }
    case 'ADD-TODOLIST': {
      return {
        ...state,
        [action.todolist.id]: [],
      }
    }
    case 'REMOVE-TODOLIST': {
      const copyState = {...state};
      delete copyState[action.todolistId];
      return copyState;
    }
    case "SET-TODOLISTS": {
      let copyState = {...state}
      action.todolists.forEach(tl => {
        copyState[tl.id] = []
      })
      return copyState
    }
    case "SET-TASKS": {
      let copyState = {...state}
      copyState[action.todoListId] = action.tasks
      return copyState
    }
    case "SET-TASK-ENTITY-STATUS": {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
          ...t,
          taskEntityStatus: action.taskEntityStatus,
        } : t),
      }
    }
    default:
      return state;
  }
}

// ACTION CREATORS
export const setTasksAC = (params: { todolistId: string, tasks: Array<TaskType> }) => ({
  type: 'SET-TASKS',
  todoListId: params.todolistId,
  tasks: params.tasks,
} as const)
export const removeTaskAC = (params: { taskId: string, todolistId: string }) => {
  return {type: 'REMOVE-TASK', taskId: params.taskId, todolistId: params.todolistId} as const
}
export const addTaskAC = (params: { task: TaskType, todolistId: string }) => {
  return {type: 'ADD-TASK', task: params.task, todolistId: params.todolistId} as const
}
export const changeTaskStatusAC = (params: { taskId: string, status: TaskStatuses, todolistId: string }) => {
  return {
    type: 'CHANGE-TASK-STATUS',
    status: params.status,
    todolistId: params.todolistId,
    taskId: params.taskId,
  } as const
}
export const changeTaskTitleAC = (params: { taskId: string, title: string, todolistId: string }) => {
  return {type: 'CHANGE-TASK-TITLE', title: params.title, todolistId: params.todolistId, taskId: params.taskId} as const
}
export const setTaskEntityStatus = (params: { taskId: string, taskEntityStatus: RequestAppStatuses, todolistId: string }) => ({
  type: 'SET-TASK-ENTITY-STATUS',
  taskId: params.taskId,
  taskEntityStatus: params.taskEntityStatus,
  todolistId: params.todolistId,
} as const)

// THUNK CREATORS
export const setTasksTC = (params: { todolistId: string }) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatus('loading'))
  todolistsAPI.getTasks({todolistId: params.todolistId}).then(res => {
    dispatch(setTasksAC({todolistId: params.todolistId, tasks: res.data.items}))
    dispatch(setAppStatus('succeded'))
  })
}
export const deleteTaskTC = (params: { todolistId: string, taskId: string }) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatus('loading'))
  dispatch(setTaskEntityStatus({taskEntityStatus: "loading", taskId: params.taskId, todolistId: params.todolistId}))
  todolistsAPI.deleteTask({todolistId: params.todolistId, taskId: params.taskId}).then(res => {
    dispatch(removeTaskAC({taskId: params.taskId, todolistId: params.todolistId}))
    dispatch(setAppStatus('succeded'))
  })
}
export const addTaskTC = (params: { title: string, todolistId: string }) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatus('loading'))
  todolistsAPI.createTask({todolistId: params.todolistId, title: params.title}).then(res => {
    if (res.data.resultCode === 0) {
      dispatch(addTaskAC({task: res.data.data.item, todolistId: params.todolistId}))
      dispatch(setAppStatus('succeded'))
    } else {
      if (res.data.messages.length !== 0) {
        dispatch(setAppError(res.data.messages[0]))
        dispatch(setAppStatus('failed'))
      } else {
        dispatch(setAppError('Some error ocured'))
        dispatch(setAppStatus('failed'))
      }
    }
  })
}
export const changeTaskStatusTC = (params: { taskId: string, status: TaskStatuses, todolistId: string }) =>
  (dispatch: ThunkDispatchType, getState: () => AppRootStateType) => {
    dispatch(setAppStatus('loading'))
    const task = getState().tasks[params.todolistId].find(t => t.id === params.taskId)
    if (!task) {
      console.log('Task Not Found')
      return
    }
    const payload: UpdateTaskModelType = {
      ...task,
      status: params.status,
    }
    todolistsAPI.updateTask({todolistId: params.todolistId, taskId: params.taskId, payload}).then(res => {
      dispatch(changeTaskStatusAC({taskId: params.taskId, status: params.status, todolistId: params.todolistId}))
      dispatch(setAppStatus('succeded'))
    })
  }
export const changeTaskTitleTC = (params: { taskId: string, title: string, todolistId: string }) =>
  (dispatch: ThunkDispatchType, getState: () => AppRootStateType) => {
    dispatch(setAppStatus('loading'))
    const task = getState().tasks[params.todolistId].find(t => t.id === params.taskId)
    if (!task) {
      console.log('Task Not Found')
      return
    }
    const payload: UpdateTaskModelType = {
      ...task,
      title: params.title,
    }
    todolistsAPI.updateTask({todolistId: params.todolistId, taskId: params.taskId, payload}).then(res => {
        dispatch(changeTaskTitleAC({taskId: params.taskId, title: params.title, todolistId: params.todolistId}))
        dispatch(setAppStatus('succeded'))
      },
    )
  }


// TYPES
type ThunkDispatchType = Dispatch<ActionsType | AppReducerActionsType>

export type TasksStateType = {
  [key: string]: Array<TaskType>
}

type ActionsType = ReturnType<typeof addTaskAC>
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof changeTaskStatusAC>
  | ReturnType<typeof changeTaskTitleAC>
  | ReturnType<typeof setTaskEntityStatus>
  | AddTodolistActionType
  | SetTodolistActionType
  | RemoveTodolistActionType