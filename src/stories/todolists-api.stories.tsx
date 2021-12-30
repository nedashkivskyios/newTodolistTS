import React, {useEffect, useState} from 'react'
import {todolistsAPI} from "../api/todolists-api";

export default {
  title: 'API',
}


export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistsAPI.getTodolists().then(res => setState(res.data))
  }, [])

  return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistsAPI.createTodolist({title: 'NEWNEWNEW'}).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  const todolistId = 'eb9eb6fe-c01b-4ad1-a410-b0e8d10f1965'
  useEffect(() => {
    todolistsAPI.deleteTodolist({todolistId})
      .then(res => {
        setState(res.data)
      })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  const todolistId = 'e6fcad63-0f78-44e5-baf8-d7a262cd8a6e'
  const title = 'AL;SDJFALS;DKFJ'
  useEffect(() => {
    todolistsAPI.updateTodolistTitle({todolistId, title})
      .then(res => {
        setState(res.data)
      })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
  const [state, setState] = useState<any>(null)
  const todolistId = 'e6fcad63-0f78-44e5-baf8-d7a262cd8a6e'
  useEffect(() => {
    todolistsAPI.getTasks({todolistId}).then(res => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
  const [state, setState] = useState<any>(null)
  const todolistId = 'e6fcad63-0f78-44e5-baf8-d7a262cd8a6e'
  const title = 'ONE'

  useEffect(() => {
    todolistsAPI.createTask({todolistId, title}).then(res => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
  const [state, setState] = useState<any>(null)
  const todolistId = 'e6fcad63-0f78-44e5-baf8-d7a262cd8a6e'
  const taskId = '49ef7787-b592-4266-8621-f2b24b2ef0ac'

  useEffect(() => {
    todolistsAPI.deleteTask({todolistId, taskId}).then(res => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const UpdateTaskTitle = () => {
  const [state, setState] = useState<any>(null)
  const todolistId = 'e6fcad63-0f78-44e5-baf8-d7a262cd8a6e'
  const taskId = '9a281ba4-bdbe-494a-a98c-278380df2d33'
  const payload = {
    title: 'TWO',
    description: null,
    status: 0,
    priority: 1,
    startDate: null,
    deadline:  null,
  }

  useEffect(() => {
    todolistsAPI.updateTask({todolistId, taskId, payload}).then(res => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

