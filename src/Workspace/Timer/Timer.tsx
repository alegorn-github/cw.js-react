import { useContext, useEffect, useState } from 'react';
import { AppContext, TTask } from '../../App';
import { getClassName} from '../../tools/getClassName';
import styles from './timer.module.css';

interface ITimer {
    // name: string;
    // currentPomodoro: number;
    taskIndex: number;
}

type TTimerCondition =  'Waiting'|'Running'|'Paused'|'Break'|'BreakPaused';

type TButtonParams = {
    title: string;
    disabled?: boolean;
    class?: string;
    onClick: ()=> void;
}
type TTimerStateParams = {
    leftButton: TButtonParams,
    rightButton: TButtonParams,
}

type TTimerGraph = {
    [key in TTimerCondition]?: TTimerStateParams;
};

const emptyTask:TTask = {
    name:'Задач пока нет',
    pomodoros: 1,
    id: '0',
    completedPomodoros: 0
};
let currentTask = emptyTask;
let completedPomodoros = 0;

let timerInterval:NodeJS.Timer;
let timerStart:Date,timerEnd:Date;
let timerRemainMs = 0;

export function Timer({taskIndex}:ITimer){
    const [appState,setAppState] = useContext(AppContext);
    const {addButtonTime,breaksForLongBreak,longBreakTime,shortbreakTime,taskTime,timerUpdateIntervalMs} = appState.settings;
    const [tik,setTik] = useState(false);
    const [minutes,setMinutes] = useState<number>(getMinutesAndSeconds(taskTime*60000)[0]);
    const [seconds,setSeconds] = useState<number>(getMinutesAndSeconds(taskTime*60000)[1]);
    const [timerCondition,setTimerCondition] = useState<TTimerCondition>('Waiting');

    timerRemainMs = timerRemainMs || taskTime*60*1000;
    currentTask = ~taskIndex ? appState.taskList[taskIndex] : emptyTask;
    
    const timerGraph:TTimerGraph = {
        'Waiting': {
            leftButton:{title:'Старт', onClick: ()=>{
                startTimer();
                moveTimerCondition('Running')
            }, disabled:appState.taskList.length === 0},
            rightButton:{title:'Стоп', onClick: ()=>null, disabled:true},
        },
        'Running': {
            leftButton:{title:'Пауза', onClick: ()=>{
                pauseTimer();
                moveTimerCondition('Paused')
            }},
            rightButton:{title:'Стоп', onClick: ()=>{
                stopTimer();
                moveTimerCondition('Waiting');
            }},
        },
        'Paused': {
            leftButton:{title:'Продолжить', onClick: ()=>{
                startTimer();
                moveTimerCondition('Running');
            }},
            rightButton:{title:'Сделано', onClick: ()=>{
                stopTimer();
                completePomodoro();
                moveTimerCondition('Waiting');
            }},
        },
        'Break': {
            leftButton:{
                title:'Пауза',
                onClick: ()=>{
                    pauseTimer();
                    moveTimerCondition('BreakPaused');
                }
            },
            rightButton:{
                title:'Пропустить',
                onClick: ()=>{
                    stopTimer();
                    moveTimerCondition('Waiting');
                }

            }
        },
        'BreakPaused': {
            leftButton:{
                title:'Продолжить',
                onClick: ()=>{
                    startTimer();
                    moveTimerCondition('Break');
                }
            },
            rightButton:{
                title:'Пропустить',
                onClick: ()=>{
                    stopTimer();
                    moveTimerCondition('Waiting');
                }

            }
        }

    }

    function getMinutesAndSeconds(timeMs:number){
        let minutes = Math.trunc(timeMs / 1000 / 60);
        let seconds = Math.trunc((timeMs - minutes*60*1000) / 1000);
        return [minutes,seconds];
    }

    function completePomodoro(pomodoros:number = 1){
        let taskList = [...appState.taskList];
        taskList[taskIndex].completedPomodoros = taskList[taskIndex].completedPomodoros + pomodoros;
        if (taskList[taskIndex].completedPomodoros === taskList[taskIndex].pomodoros) {
            taskList = taskList.filter((task,index)=> index !== taskIndex );
        }
        setAppState((prevState)=>({...prevState,taskList:[...taskList]}));
        completedPomodoros++;
    }

    function moveTimerCondition(newCondition:TTimerCondition){
        console.log('Move condition to ',newCondition);
        setTimerCondition(newCondition);
    }

    function addLeadingZero(number:number):string{
        return (number > 9 ? '' : '0') + number;
    }

    function addMinutes(date:Date,minutes:number){
        const newDate = new Date();
        newDate.setTime(date.getTime() + (minutes * 60 * 1000))
        return newDate;
    }

    function startTimer(timerTimeSec:number = timerRemainMs/1000){
        clearInterval(timerInterval);
        timerStart = new Date();
        timerEnd = addMinutes(timerStart,timerTimeSec/60);
        timerRemainMs = timerTimeSec*1000;
        timerInterval = setTimeout(()=>{setTik(!tik)},timerUpdateIntervalMs);
    }

    function pauseTimer(){
        clearInterval(timerInterval);
    };

    function stopTimer(){
        clearInterval(timerInterval);
        timerRemainMs = taskTime*60*1000;
        updateTimerRemain();        
    }

    function updateTimerRemain(){
        const [minutes,seconds] = getMinutesAndSeconds(timerRemainMs);
        setMinutes(minutes);
        setSeconds(seconds);
    }

    function timerTik(){
        let now = new Date();
        timerRemainMs = timerEnd.getTime() - now.getTime();
        if (timerRemainMs <= timerUpdateIntervalMs) {
            stopTimer();
            if (timerCondition === 'Running'){
                let breakTime = (completedPomodoros % breaksForLongBreak === 0 && completedPomodoros > 0 ? longBreakTime: shortbreakTime)*60 
                completePomodoro();
                if (currentTask.pomodoros <= completedPomodoros && taskIndex === appState.taskList.length - 1){
                    moveTimerCondition('Waiting');
                }
                else {
                    startTimer(breakTime);
                    moveTimerCondition('Break');
                }
            }
            else if (timerCondition === 'Break'){
                moveTimerCondition('Waiting');
            }
        }
        updateTimerRemain();
    }

    useEffect(
        ()=>{
            if (timerCondition === 'Running'||timerCondition === 'Break'){
                timerTik();
            }
            if (timerCondition === 'Running'||timerCondition === 'Break'){
                timerInterval = setTimeout(()=>{setTik(!tik)},timerUpdateIntervalMs);
            }
        },
        [tik,timerCondition]
    );

    useEffect(
        ()=>{
            currentTask = ~taskIndex ? appState.taskList[taskIndex] : emptyTask;
        },
        [appState,taskIndex]
    );

    useEffect(
        ()=>{
            const addTime = ()=>{
                timerRemainMs = timerRemainMs + addButtonTime * 60 * 1000;
                if (timerEnd){
                    timerEnd = addMinutes(timerEnd,addButtonTime);
                }
                updateTimerRemain();
            }
            document.getElementById('addButton')?.addEventListener('click',addTime);

            return ()=>{
                document.getElementById('addButton')?.removeEventListener('click',addTime);
            }

        }
    );

    return (
        <div className={styles.timer}>
            <div className={getClassName([
                styles.header,
                timerCondition === 'Running' || timerCondition === 'Paused'  ? styles.running : '',
                timerCondition === 'Break' || timerCondition === 'BreakPaused' ? styles.break : ''
            ])}>
                <span className={styles.taskName}>
                    {`${currentTask.name}`}
                </span>
                <span>
                    Помидор {currentTask.completedPomodoros + (timerCondition === 'Break' || timerCondition === 'BreakPaused' ? 0 : 1)}
                </span>
            </div>
            <div className={styles.clock}>
                <span className={getClassName([
                    styles.numbers,
                    timerCondition === 'Running' ? styles.running : '',
                    timerCondition === 'Break' ? styles.break : ''
                ])}>
                    {addLeadingZero(minutes)}:{addLeadingZero(seconds)}
                    <button 
                        className={styles.addButton} 
                        disabled={!~taskIndex}
                        id='addButton'
                    >
                    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25" cy="25" r="25" />
                        <path d="M26.2756 26.1321V33H23.7244V26.1321H17V23.7029H23.7244V17H26.2756V23.7029H33V26.1321H26.2756Z" fill="white"/>
                    </svg>
                </button>
                </span>
            </div>
            <div className={styles.taskInfo}>
                {!!~taskIndex && (
                    <span className={styles.taskNumber}>Задача {taskIndex + 1} - </span>
                )}
                <span>{currentTask.name}</span>
            </div>
            <div className={styles.toolBar}>
                <button className={getClassName([styles.timerButton,styles.leftButton,timerGraph[timerCondition]?.leftButton.class||''])} onClick={timerGraph[timerCondition]?.leftButton.onClick} disabled={timerGraph[timerCondition]?.leftButton.disabled || !~taskIndex}>{timerGraph[timerCondition]?.leftButton.title}</button>
                <button className={getClassName([styles.timerButton,styles.rightButton,timerGraph[timerCondition]?.rightButton.class||''])} onClick={timerGraph[timerCondition]?.rightButton.onClick} disabled={timerGraph[timerCondition]?.rightButton.disabled || !~taskIndex}>{timerGraph[timerCondition]?.rightButton.title}</button>
            </div>

        </div>

    )
}