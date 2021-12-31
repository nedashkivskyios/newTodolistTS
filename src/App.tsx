import React, {useCallback, useEffect} from 'react'
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Menu} from '@mui/icons-material';
import {
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  createTodolistTC,
  deleteTodolistTC,
  FilterValuesType,
  setTodolistTC,
  TodolistDomainType,
} from './state/todolists-reducer';
import {addTaskTC, changeTaskStatusTC, changeTaskTitleTC, deleteTaskTC, TasksStateType} from './state/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TaskStatuses} from "./api/todolists-api";
import LinearProgress from '@mui/material/LinearProgress'
import {ErrorSnackbar} from "./ErrorSnackbar";
import {RequestAppStatuses} from "./state/app-reducer";


function App() {

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const status = useSelector<AppRootStateType, RequestAppStatuses>(state => state.app.status)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTodolistTC())
  }, [])

  const addTodolist = useCallback((params: { title: string }) => {
    dispatch(createTodolistTC({title: params.title}))
  }, [dispatch]);
  const changeTodolistTitle = useCallback((params: { todolistId: string, title: string }) => {
    dispatch(changeTodolistTitleTC({title: params.title, todolistId: params.todolistId}))
  }, []);
  const changeTodolistFilter = useCallback((params: { filter: FilterValuesType, todolistId: string }) => {
    const action = changeTodolistFilterAC({todolistId: params.todolistId, filter: params.filter});
    dispatch(action);
  }, []);
  const removeTodolist = useCallback((params: { todolistId: string }) => {
    dispatch(deleteTodolistTC({todolistId: params.todolistId}))
  }, []);
  const addTask = useCallback((params: { title: string, todolistId: string }) => {
    dispatch(addTaskTC({title: params.title, todolistId: params.todolistId}))
  }, []);
  const changeTaskStatus = useCallback((params: { taskId: string, status: TaskStatuses, todolistId: string }) => {
    dispatch(changeTaskStatusTC({taskId: params.taskId, status: params.status, todolistId: params.todolistId}))
  }, []);
  const changeTaskTitle = useCallback((params: { taskId: string, title: string, todolistId: string }) => {
    dispatch(changeTaskTitleTC({taskId: params.taskId, title: params.title, todolistId: params.todolistId}))
  }, []);
  const removeTask = useCallback((params: { taskId: string, todolistId: string }) => {
    dispatch(deleteTaskTC({todolistId: params.todolistId, taskId: params.taskId}))
  }, []);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu/>
          </IconButton>
          <Typography variant="h6">
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      {status === 'loading' && <LinearProgress color="success"/>}
      <Container fixed>
        <Grid container style={{padding: '20px'}}>
          <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
          {
            todolists.map(tl => {
              let allTodolistTasks = tasks[tl.id];

              return <Grid item key={tl.id}>
                <Paper style={{padding: '10px'}}>
                  <Todolist
                    todolist={tl}
                    tasks={allTodolistTasks}
                    removeTask={removeTask}
                    changeFilter={changeTodolistFilter}
                    addTask={addTask}
                    changeTaskStatus={changeTaskStatus}
                    removeTodolist={removeTodolist}
                    changeTaskTitle={changeTaskTitle}
                    changeTodolistTitle={changeTodolistTitle}
                  />
                </Paper>
              </Grid>
            })
          }
        </Grid>
        <ErrorSnackbar/>
      </Container>
    </div>
  );
}

export default App;
