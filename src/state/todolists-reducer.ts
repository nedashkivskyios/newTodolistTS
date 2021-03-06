import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppReducerActionsType, RequestAppStatuses, setAppStatus} from "./app-reducer";
import {handleNetworkAppError, handleServerAppError} from "../utils/error-utils";

const initialState: Array<TodolistDomainType> = []

// REDUCER
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'REMOVE-TODOLIST': {
      return state.filter(tl => tl.id !== action.todolistId)
    }
    case 'ADD-TODOLIST': {
      return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
    }
    case 'CHANGE-TODOLIST-TITLE': {
      return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
    }
    case 'CHANGE-TODOLIST-FILTER': {
      return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
    }
    case "SET-TODOLISTS": {
      return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    }
    case "SET-ENTITY-STATUS": {
      return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus} : tl)
    }
    default:
      return state;
  }
}

// ACTION CREATORS
export const addTodolistAC = (params: { todolist: TodolistType }) => ({
  type: 'ADD-TODOLIST',
  todolist: params.todolist,
} as const)
export const setTodolistsAC = (params: { todolists: Array<TodolistType> }) => ({
  type: 'SET-TODOLISTS',
  todolists: params.todolists,
} as const)
export const removeTodolistAC = (params: { todolistId: string }) => ({
  type: 'REMOVE-TODOLIST',
  todolistId: params.todolistId,
} as const)
export const changeTodolistTitleAC = (params: { todolistId: string, title: string }) => ({
  type: 'CHANGE-TODOLIST-TITLE',
  todolistId: params.todolistId,
  title: params.title,
} as const)
export const changeTodolistFilterAC = (params: { todolistId: string, filter: FilterValuesType }) => ({
  type: 'CHANGE-TODOLIST-FILTER',
  todolistId: params.todolistId,
  filter: params.filter,
} as const)

export const setAppEntityStatusAC = (params: { entityStatus: RequestAppStatuses, todolistId: string }) => ({
  type: 'SET-ENTITY-STATUS',
  entityStatus: params.entityStatus,
  todolistId: params.todolistId,
} as const)

// THUNK CREATORS
export const setTodolistTC = () => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatus('loading'))
  todolistsAPI.getTodolists().then(res => {
    dispatch(setTodolistsAC({todolists: res.data}))
    dispatch(setAppStatus('succeded'))
  }).catch(error => {
    handleNetworkAppError({error, dispatch})
  })
}
export const deleteTodolistTC = (params: { todolistId: string }) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatus('loading'))
  dispatch(setAppEntityStatusAC({entityStatus: 'loading', todolistId: params.todolistId}))
  todolistsAPI.deleteTodolist({todolistId: params.todolistId}).then(res => {
    if (res.data.resultCode === 0) {
      dispatch(removeTodolistAC({todolistId: params.todolistId}))
      dispatch(setAppStatus('succeded'))
    } else {
      handleServerAppError({data: res.data, dispatch})
    }
  }).catch(error => {
    handleNetworkAppError({error, dispatch})
  })
}
export const createTodolistTC = (params: { title: string }) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatus('loading'))
  todolistsAPI.createTodolist({title: params.title})
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(addTodolistAC({todolist: res.data.data.item}))
        dispatch(setAppStatus('succeded'))
      } else {
        handleServerAppError({data: res.data, dispatch})
      }
    }).catch(error => {
    handleNetworkAppError({error, dispatch})
  })
}
export const changeTodolistTitleTC = (params: { todolistId: string, title: string }) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatus('loading'))
  todolistsAPI.updateTodolistTitle({todolistId: params.todolistId, title: params.title}).then(res => {
    if (res.data.resultCode === 0) {
      dispatch(changeTodolistTitleAC({todolistId: params.todolistId, title: params.title}))
      dispatch(setAppStatus('succeded'))
    } else {
      handleServerAppError({data: res.data, dispatch})
    }
  }).catch(error => {
    handleNetworkAppError({error, dispatch})
  })
}

// TYPES

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType,
  entityStatus: RequestAppStatuses
}

type ThunkDispatchType = Dispatch<ActionsType | AppReducerActionsType>
type ActionsType = RemoveTodolistActionType | AddTodolistActionType
  | SetTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof setAppEntityStatusAC>

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>





