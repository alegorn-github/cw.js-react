import React, { createContext, useContext, useState } from 'react';
import { Title } from './Title/Title';
import styles from './dashboard.module.css';
import { DayStat } from './DayStat/DayStat';
import {Pomodoros} from './Pomodoros/Pomodoros';
import {Card} from './Card/Card';
import {Diagram} from './Diagram/Diagram';
import { getMonday } from '../tools/getMonday';
import { AppContext, dayTemplate, weekTemplate } from '../App';
import { getTimePhrase } from '../tools/getTimePhrase';

type TDashboardData = {
    selectedWeek:number,
    selectedDay:number
}

type TDashboardContext = [
    TDashboardData,
    React.Dispatch<React.SetStateAction<TDashboardData>>,
]

export const dashboardContext = createContext<TDashboardContext>([{selectedDay:0,selectedWeek:0},()=>{}]);

export const weekDays = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
export const shortWeekDays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const yMarks = ['1ч 40мин','1ч 15мин','50мин','25мин'];

const timeMultiplier = 60; // Each second is minute. For debugging only. Set it to 1 before deploy!


export function Dashboard(){

    const [dashboardData,setDashboardData] = useState<TDashboardData>({selectedDay:0,selectedWeek:getMonday(new Date())});

    const {selectedDay,selectedWeek} = dashboardData;
    const [{statistic},] = useContext(AppContext);

    const week = statistic.find((week)=>week.monday===selectedWeek)||{monday:0,stat:weekTemplate};

    const weekStat = [...week.stat].map((dayStat)=>({ 
        ...dayStat,
        pausedS:dayStat.pausedS * timeMultiplier,
        workS:dayStat.workS * timeMultiplier,
        pomodoroTimeS:dayStat.pomodoroTimeS * timeMultiplier,
    }));

    weekStat.splice(6,0,weekStat.splice(0,1)[0]);

    const dayStat = weekStat[selectedDay]||dayTemplate

    function calcFocus(pomodoroTime:number,totalTime:number){
        if (pomodoroTime > 0){
            return `${Math.trunc(totalTime / pomodoroTime * 100)}%`
        }
        else {
            return '0%';
        }
    }

    return (
        <dashboardContext.Provider value={[dashboardData,setDashboardData]}>
            <main className={`${styles.dashboard} container`}>
                <Title/>
                <div className={styles.topContainer}>
                    <div className={styles.mainStatContainer}>
                        <div className={`${styles.card}`}>
                            <DayStat workTime={dayStat.workS} selectedDay={selectedDay}/>
                        </div>
                        <div className={styles.card}>
                            <Pomodoros count={dayStat.pomodoros}/>
                        </div>
                    </div>
                    <div className={styles.diagram}>
                        <Diagram yMarks={yMarks} weekStat={weekStat}  />
                    </div>
                </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.card}>
                        <Card 
                            header='Фокус' 
                            stat={calcFocus(dayStat.pomodoroTimeS,dayStat.workS)}
                            cardStyle='orange'
                            empty={dayStat.pomodoroTimeS * dayStat.workS === 0}
                            image={(
                                <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M64.5 102C85.2107 102 102 85.2107 102 64.5C102 43.7893 85.2107 27 64.5 27C43.7893 27 27 43.7893 27 64.5C27 85.2107 43.7893 102 64.5 102Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M64.5 85C75.8218 85 85 75.8218 85 64.5C85 53.1782 75.8218 44 64.5 44C53.1782 44 44 53.1782 44 64.5C44 75.8218 53.1782 85 64.5 85Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg> 
                            )}
                        />
                    </div>
                    <div className={styles.card}>
                        <Card 
                            header='Время на паузе' 
                            stat={getTimePhrase(dayStat.pausedS,'shortest')}
                            cardStyle='purple'
                            empty={dayStat.workS === 0}
                            image={(
                                <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M64.3154 37.1579V64.3158L77.8944 77.8947" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        />
                    </div>
                    <div className={styles.card}>
                        <Card 
                            header='Остановки' 
                            stat={dayStat.breaks.toString()}
                            cardStyle='blue'
                            empty={dayStat.workS === 0}
                            image={(
                                <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M64.3158 118.632C94.3136 118.632 118.632 94.3136 118.632 64.3158C118.632 34.318 94.3136 10 64.3158 10C34.318 10 10 34.318 10 64.3158C10 94.3136 34.318 118.632 64.3158 118.632Z" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M28 27L102 101" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        />
                    </div>
                </div>
            </main>
        </dashboardContext.Provider>
    )
}