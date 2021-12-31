import axios, {AxiosResponse} from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  headers: {
    'API-KEY': 'cb296593-09e8-482c-8587-896f9cf54a71',
  },
})

export const todolistsAPI = {
  getTodolists() {
    return instance.get<Array<TodolistType>>('/todo-lists')
  },
  createTodolist(params: { title: string }) {
    const payload = {title: params.title}
    return instance.post<ResponseType<{ item: TodolistType }>>('/todo-lists', payload)
  },
  deleteTodolist(params: { todolistId: string }) {
    return instance.delete<ResponseType>(`/todo-lists/${params.todolistId}`)
  },
  updateTodolistTitle(params: { todolistId: string, title: string }) {
    const payload = {title: params.title}
    return instance.put<ResponseType>(`/todo-lists/${params.todolistId}`, payload)
  },
  getTasks(params: { todolistId: string }) {
    return instance.get<GetTaskResponseType>(`/todo-lists/${params.todolistId}/tasks`)
  },
  createTask(params: { todolistId: string, title: string }) {
    const payload = {title: params.title}
    return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${params.todolistId}/tasks`, payload)
  },
  deleteTask(params: { todolistId: string, taskId: string }) {
    return instance.delete<ResponseType>(`/todo-lists/${params.todolistId}/tasks/${params.taskId}`)
  },
  updateTask(params: { todolistId: string, taskId: string, payload: UpdateTaskModelType }) {
    return instance.put<any, AxiosResponse<ResponseType<{ item: TaskType }>>, UpdateTaskModelType>(`/todo-lists/${params.todolistId}/tasks/${params.taskId}`, params.payload)
  },
}

export enum TaskStatuses {
  New,
  InProgress,
  Completed,
  Draft
}

export enum TaskPriorities {
  Low,
  Middle,
  Hi,
  Urgently,
  Later
}

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type ResponseType<D = {}> = {
  data: D
  messages: string[]
  fieldsErrors: string[]
  resultCode: number
}
export type TaskType = {
  id: string
  title: string
  description: string | null
  todoListId: string
  order: number
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string | null
  deadline: string | null
  addedDate: string
}

export type GetTaskResponseType = {
  items: Array<TaskType>
  totalCount: number
  error: string | null
}
export type UpdateTaskModelType = {
  title: string
  description: string | null
  status: number
  priority: number
  startDate: string | null
  deadline: string | null
}