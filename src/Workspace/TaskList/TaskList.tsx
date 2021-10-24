import styles from './tasklist.module.css';
import {Task} from './Task/Task';
import { useContext } from 'react';
import { AppContext, TTaskList } from '../../App';

export function TaskList(){

    const [appState,] = useContext(AppContext);
    const {taskList} = appState;

    const {taskTime:pomodoroTime} = appState.settings;

    function getTotal(tasks:TTaskList):string{
        const total = tasks.reduce((totalTime,task)=> task.pomodoros*pomodoroTime + totalTime,0);
        const hours = Math.trunc(total / 60);
        const minutes = Math.trunc(total % 60);
        return `${hours > 0? hours + ' час ': ''}${minutes} мин`;
    }
    
    return (
        <div>
            <ul className={styles.taskList}>
                { taskList.map((task, index)=>(
                    <Task key={Math.random().toString(36).substring(2,15)} id={task.id} name={task.name} pomodoros={task.pomodoros} index={index}/>
                ))}
            </ul>
            <div className={styles.totalTime}>{
                getTotal(taskList)
            }</div>
        </div>
    )
}