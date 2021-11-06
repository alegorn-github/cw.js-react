import { LegacyRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext, TTask, weekTemplate} from '../../App';
import { getClassName} from '../../tools/getClassName';
import {getMonday} from '../../tools/getMonday';
import styles from './timer.module.css';

interface ITimer {
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
let pauseStart:Date,pomodoroStart:Date;
let timerRemainMs = 0;

const monday = getMonday(new Date());
const weekDay = (new Date()).getDay();
let dayStat = {breaks:0,pausedS:0,pomodoroTimeS:0,pomodoros:0,workS:0};

export function Timer({taskIndex}:ITimer){
    const [appState,setAppState] = useContext(AppContext);
    const {addButtonTime,breaksForLongBreak,longBreakTime,shortbreakTime,taskTime,timerUpdateIntervalMs} = appState.settings;
    const [tik,setTik] = useState(false);
    const [minutes,setMinutes] = useState<number>(getMinutesAndSeconds(taskTime*60000)[0]);
    const [seconds,setSeconds] = useState<number>(getMinutesAndSeconds(taskTime*60000)[1]);
    const [[firstMinuteDigit,secondMinuteDigit,firstSecondDigit,secondSecondDigit],setTimerDigits] = useState([0,0,0,0]);
    const [timerCondition,setTimerCondition] = useState<TTimerCondition>('Waiting');
    const firstMinuteDigitRef = useRef<HTMLSpanElement>(null);
    const secondMinuteDigitRef = useRef<HTMLSpanElement>(null);
    const firstSecondDigitRef = useRef<HTMLSpanElement>(null);
    const secondSecondDigitRef = useRef<HTMLSpanElement>(null);

    const savedWeekStat = appState.statistic.find((stat)=>stat.monday===monday)?.stat||weekTemplate;
    dayStat = savedWeekStat[weekDay];

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
                calcPomodoroTimeStat();
                calcBreakStat();
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

    const saveStat = useCallback(() => {
        const newStatistic = [...appState.statistic];
        if (newStatistic[newStatistic.length - 1]?.monday !== monday){
            let newWeekStatistic = weekTemplate;
            newWeekStatistic[weekDay] = dayStat;
            newStatistic.push({monday:monday,stat:newWeekStatistic});
        }
        else {
            newStatistic[newStatistic.length - 1].stat[weekDay] = dayStat;
        }

        setAppState({statistic:[...newStatistic]});

    },[appState.statistic,setAppState]);

    const completePomodoro = useCallback((pomodoros:number = 1)=>{
        let taskList = [...appState.taskList];
        taskList[taskIndex].completedPomodoros = taskList[taskIndex].completedPomodoros + pomodoros;
        if (taskList[taskIndex].completedPomodoros === taskList[taskIndex].pomodoros) {
            taskList = taskList.filter((task,index)=> index !== taskIndex );
        }
        setAppState({taskList:[...taskList]});
        completedPomodoros++;
        calcPomodoroStat(pomodoros);
        calcPomodoroTimeStat();
        saveStat();
    },[appState.taskList,saveStat,setAppState,taskIndex]);

    function moveTimerCondition(newCondition:TTimerCondition){
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

    function calcPomodoroStat(pomodoros:number){
        dayStat.pomodoros += pomodoros;
    }

    function calcBreakStat(){
        dayStat.breaks++;
    }

    function calcWorkStat(){
        dayStat.workS += ((new Date()).getTime() - timerStart.getTime())/1000;
    }

    function calcPausedStat(){
        dayStat.pausedS += ((new Date()).getTime() - pauseStart.getTime())/1000;
    }

    function calcPomodoroTimeStat(){
        dayStat.pomodoroTimeS += ((new Date()).getTime() - pomodoroStart.getTime())/1000;
    }

    const startTimer = useCallback((timerTimeSec:number = timerRemainMs/1000)=>{
        clearInterval(timerInterval);
        if (timerCondition === 'Paused' || timerCondition === 'BreakPaused'){
            calcPausedStat();
            saveStat();
        }
        timerStart = new Date();
        timerEnd = addMinutes(timerStart,timerTimeSec/60);
        timerRemainMs = timerTimeSec*1000;
        timerInterval = setTimeout(()=>{setTik(!tik)},timerUpdateIntervalMs);
        if (timerCondition === 'Waiting') {
            pomodoroStart = new Date();
        }
    },[saveStat,tik,timerCondition,timerUpdateIntervalMs]);

    function pauseTimer(){
        pauseStart = new Date();
        clearInterval(timerInterval);
    };

    const updateTimerRemain = useCallback(()=>{
        const [minutes,seconds] = getMinutesAndSeconds(timerRemainMs);
        setMinutes(minutes);
        setSeconds(seconds);
    },[]);

    useEffect(
        ()=>{
            const newDigits = [Math.trunc(minutes/10),minutes % 10,Math.trunc(seconds/10),seconds % 10];
            const digits = [firstMinuteDigit,secondMinuteDigit,firstSecondDigit,secondSecondDigit];
            const refs = [firstMinuteDigitRef,secondMinuteDigitRef,firstSecondDigitRef,secondSecondDigitRef];

            const fadeOut = (event:AnimationEvent)=>{
                if (event.currentTarget instanceof HTMLElement){
                    event.currentTarget?.classList.remove(styles.fadeOut);
                }
                setTimerDigits([newDigits[0],newDigits[1],newDigits[2],newDigits[3]]);
            }
            newDigits.forEach((elem,index)=>{
                if (refs[index] instanceof HTMLElement ){
                    refs[index].current?.classList.add(styles.fadeOut);
                    refs[index].current?.addEventListener('animationend',fadeOut);
                }
            });

            // setTimerDigits((prevState)=>{
            //     if (secondSecondDigitRef.current instanceof HTMLElement){
            //         secondSecondDigitRef.current.classList.add(styles.fadeOut);
            //         secondSecondDigitRef.current.addEventListener('animationend',fadeOut);
            //     }
            //     return [newDigits[0],newDigits[1],newDigits[2],newDigits[3]];
            // });
            return ()=>{
                newDigits.forEach((elem,index)=>{
                    if (refs[index] instanceof HTMLElement ){
                        refs[index].current?.removeEventListener('animationend',fadeOut);
                    }
                });
                }
        },
        [minutes,seconds]
    );


    const stopTimer = useCallback(()=>{
        clearInterval(timerInterval);
        if (timerCondition === 'Running'){
            calcWorkStat();
            saveStat();
        }
        timerRemainMs = taskTime*60*1000;
        updateTimerRemain();        
    },[saveStat,taskTime,timerCondition,updateTimerRemain]);

    const timerTik = useCallback( ()=>{
        let now = new Date();
        timerRemainMs = timerEnd.getTime() - now.getTime();
        if (timerRemainMs <= timerUpdateIntervalMs) {
            stopTimer();
            if (timerCondition === 'Running'){
                let breakTime = (completedPomodoros % breaksForLongBreak === 0 && completedPomodoros > 0 ? longBreakTime: shortbreakTime)*60; 
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
    },[appState.taskList.length,breaksForLongBreak,completePomodoro,longBreakTime,shortbreakTime,startTimer,stopTimer,taskIndex,timerCondition,timerUpdateIntervalMs,updateTimerRemain]);

    const addTime = ()=>{
        if (timerRemainMs/60000 + addButtonTime  < 100 ){
            timerRemainMs = timerRemainMs + addButtonTime * 60000;
            if (timerEnd){
                timerEnd = addMinutes(timerEnd,addButtonTime);
            }
            updateTimerRemain();
        }
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
        [tik,timerCondition,timerUpdateIntervalMs,timerTik]
    );

    useEffect(
        ()=>{}
    )

    useEffect(
        ()=>{
            currentTask = ~taskIndex ? appState.taskList[taskIndex] : emptyTask;
        },
        [appState,taskIndex]
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
                    Помидор {(currentTask.completedPomodoros + (timerCondition === 'Break' || timerCondition === 'BreakPaused' ? 0 : 1))||1}
                </span>
            </div>
            <div className={styles.clock}>
                <span className={getClassName([
                    styles.numbers,
                    timerCondition === 'Running' ? styles.running : '',
                    timerCondition === 'Break' ? styles.break : ''
                ])}>
                    {/* {addLeadingZero(minutes)}:{addLeadingZero(seconds)} */}
                    <span ref={firstMinuteDigitRef}>{firstMinuteDigit}</span>
                    <span ref={secondMinuteDigitRef}>{secondMinuteDigit}</span>
                    :
                    <span ref={firstSecondDigitRef}>{firstSecondDigit}</span>
                    <span ref={secondSecondDigitRef}>{secondSecondDigit}</span>
                    <button
                        onClick={addTime} 
                        className={styles.addButton} 
                        disabled={!~taskIndex || timerRemainMs/60000 + addButtonTime  > 100}
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