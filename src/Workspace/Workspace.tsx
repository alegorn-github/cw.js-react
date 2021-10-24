import {getClassName} from '../tools/getClassName';
import styles from './workspace.module.css';
import {TaskForm} from './TaskForm/TaskForm';
import { TaskList } from './TaskList/TaskList';
import {Timer} from './Timer/Timer';
import { useContext } from 'react';
import { AppContext } from '../App';

export function Workspace(){

    const [{taskList},] = useContext(AppContext);

    return(
        <main className={getClassName(['container',styles.workspace])}>
            <div className={getClassName([styles.taskbar])}>
                <h2 className={styles.header}>Ура! Теперь можно начать работать</h2>
                <ul className={styles.list}>
                    <li>Выберите категорию и напишите название текущей задачи</li>
                    <li>Запустите таймер («помидор»)</li>
                    <li>Работайте пока «помидор» не прозвонит</li>
                    <li>Сделайте короткий перерыв (3-5 минут)</li>
                    <li>Продолжайте работать «помидор» за «помидором», пока задача не будут выполнена. Каждые 4 «помидора» делайте длинный перерыв (15-30 минут).</li>
                </ul>
                <TaskForm/>
                <TaskList/>
            </div>
            <div className={getClassName([styles.timer])}>
                <Timer taskIndex={taskList.findIndex((task)=>task.pomodoros > task.completedPomodoros)}/>
            </div>
        </main>
    )
}