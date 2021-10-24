import React, { useContext, useState } from "react";
import { AppContext, TAppData } from "../../App";
import styles from './taskform.module.css';

export function TaskForm(){
    const [appState,setAppState] = useContext(AppContext);

    const [taskName,setTaskName] = useState('');

    function onNameChange(event:React.FormEvent<HTMLInputElement>){
        setTaskName(event.currentTarget.value);
    }

    function saveTask(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const {taskList} = appState;
        const myTaskList = [...taskList];
        const newTask = {
            id:Math.random().toString(36).substring(2,15),
            name:taskName,
            pomodoros:1,
            completedPomodoros:0
        };

        console.log('newTask',newTask);
        setAppState((prevState:TAppData) => {
            return ({...prevState,'taskList':myTaskList.concat(newTask)})
        }); 

        setTaskName('');
    }

    return (
        <form onSubmit={saveTask} id='taskForm' className={styles.taskForm}>
            <input className={styles.taskName} type="text" name="taskName" value={taskName} onChange={onNameChange} placeholder="Название задачи"/>
            <button disabled={taskName.length <= 0}>Добавить</button>
        </form>
    )
}