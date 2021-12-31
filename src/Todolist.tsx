import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from './AddItemForm'
import {EditableSpan} from './EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task'
import {FilterValuesType, TodolistDomainType} from "./state/todolists-reducer";
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {useDispatch} from "react-redux";
import {setTasksTC} from "./state/tasks-reducer";


type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  changeFilter: (params: { filter: FilterValuesType, todolistId: string }) => void
  addTask: (params: { title: string, todolistId: string }) => void
  changeTaskStatus: (params: { taskId: string, status: TaskStatuses, todolistId: string }) => void
  changeTaskTitle: (params: { taskId: string, title: string, todolistId: string }) => void
  removeTask: (params: { taskId: string, todolistId: string }) => void
  removeTodolist: (params: { todolistId: string }) => void
  changeTodolistTitle: (params: { todolistId: string, title: string }) => void

}

export const Todolist = React.memo(function (props: PropsType) {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setTasksTC({todolistId: props.todolist.id}))
  }, [])


  const addTask = useCallback((params: { title: string }) => {
    props.addTask({title: params.title, todolistId: props.todolist.id})
  }, [props.addTask, props.todolist.id])

  const removeTodolist = () => {
    props.removeTodolist({todolistId: props.todolist.id})
  }
  const changeTodolistTitle = useCallback((title: string) => {
    props.changeTodolistTitle({todolistId: props.todolist.id, title: title})
  }, [props.todolist.id, props.changeTodolistTitle])

  const onAllClickHandler = useCallback(() => props.changeFilter({
    filter: 'all',
    todolistId: props.todolist.id,
  }), [props.todolist.id, props.changeFilter])
  const onActiveClickHandler = useCallback(() => {
    props.changeFilter({filter: 'active', todolistId: props.todolist.id})
  }, [props.todolist.id, props.changeFilter])
  const onCompletedClickHandler = useCallback(() => props.changeFilter({
    filter: 'completed',
    todolistId: props.todolist.id,
  }), [props.todolist.id, props.changeFilter])


  let tasksForTodolist = props.tasks

  if (props.todolist.filter === 'active') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
  }
  if (props.todolist.filter === 'completed') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
  }

  const uiDisabler = props.todolist.entityStatus === 'loading'

  return (
    <div>
      <h3>
        <EditableSpan disabled={uiDisabler} value={props.todolist.title} onChange={changeTodolistTitle}/>
        <IconButton disabled={uiDisabler} onClick={removeTodolist}>
          <Delete/>
        </IconButton>
      </h3>
      <AddItemForm disabled={uiDisabler} addItem={addTask}/>
      <div>
        {
          tasksForTodolist.map(t => <Task key={t.id}
                                          task={t}
                                          removeTodolistDisabled={uiDisabler}
                                          todolistId={props.todolist.id}
                                          removeTask={props.removeTask}
                                          changeTaskTitle={props.changeTaskTitle}
                                          changeTaskStatus={props.changeTaskStatus}
          />)
        }
      </div>
      <div style={{paddingTop: '10px'}}>
        <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                onClick={onAllClickHandler}
                color={'inherit'}
        >All</Button>
        <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                onClick={onActiveClickHandler}
                color={'primary'}
        >Active</Button>
        <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                onClick={onCompletedClickHandler}
                color={'secondary'}
        >Completed</Button>
      </div>
    </div>)
})


