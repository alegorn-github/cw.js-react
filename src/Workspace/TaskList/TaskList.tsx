import styles from './tasklist.module.css';
import {Task} from './Task/Task';
import { useContext } from 'react';
import { AppContext, TTaskList } from '../../App';
import {getRandomKey} from '../../tools/getRandomKey';
import {getTimePhrase} from '../../tools/getTimePhrase';

export function TaskList(){

    const [appState,] = useContext(AppContext);
    const {taskList} = appState;

    const {taskTime:pomodoroTime} = appState.settings;

    function getTotal(tasks:TTaskList):string{
        const total = tasks.reduce((totalTime,task)=> task.pomodoros*pomodoroTime + totalTime,0);
        return getTimePhrase(total*60);
    }

    return (
        <div>
            <ul className={styles.taskList}>
                { taskList.map((task, index)=>(
                    <Task key={getRandomKey()} 
                        id={task.id} 
                        name={task.name} 
                        pomodoros={task.pomodoros} 
                        completedPomodoros = {task.completedPomodoros}
                        index={index} 
                        created={task.created||false} 
                        deleted={task.deleted||false}
                    />
                ))}
            </ul>
            <div className={styles.totalTime}>{
                getTotal(taskList)
            }</div>
        </div>
    )
}