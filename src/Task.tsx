import React, {ChangeEvent, useCallback, useState} from 'react'
import {EditableSpan} from './EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from "./api/todolists-api";

type TaskPropsType = {
  task: TaskType
  removeTodolistDisabled: boolean
  todolistId: string
  changeTaskStatus: (params: { taskId: string, status: TaskStatuses, todolistId: string }) => void
  changeTaskTitle: (params: { taskId: string, title: string, todolistId: string }) => void
  removeTask: (params: { taskId: string, todolistId: string }) => void
}
export const Task = React.memo((props: TaskPropsType) => {

  const [taskDisabler, setTaskDisabler] = useState(false)

  const onClickHandler = useCallback(() => {
    setTaskDisabler(true)
    props.removeTask({taskId: props.task.id, todolistId: props.todolistId})
  }, [props.task.id, props.todolistId]);
  const onChangeCheckboxHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked
    props.changeTaskStatus({
      taskId: props.task.id,
      status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
      todolistId: props.todolistId,
    })
  }, [props.task.id, props.todolistId]);
  const onChangeTitleHandler = useCallback((title: string) => {
    props.changeTaskTitle({taskId: props.task.id, title, todolistId: props.todolistId})
  }, [props.task.id, props.todolistId]);

  const disabled = taskDisabler ? true : props.removeTodolistDisabled

  return (
    <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
      <Checkbox
        disabled={disabled}
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeCheckboxHandler}
      />

      <EditableSpan disabled={disabled} value={props.task.title} onChange={onChangeTitleHandler}/>

      <IconButton disabled={disabled} onClick={onClickHandler}>
        <Delete/>
      </IconButton>
    </div>)
})
