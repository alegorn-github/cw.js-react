import styles from './daystat.module.css';
import { weekDays } from '../Dashboard';
import { getTimePhrase } from '../../tools/getTimePhrase';

interface IDayStat {
    selectedDay:number;
    workTime: number;
}

export function DayStat({workTime,selectedDay}:IDayStat){
    return (
        <div className={styles.dayStat}>
            <span className={styles.dayName}>{weekDays[selectedDay]}</span>
            {!!workTime &&( 
                <span>
                    Вы работали над задачами в течение
                    <span className={styles.workTime}> {getTimePhrase(workTime,'long')}</span>
                </span>
            )}
            {!workTime && (<span>Нет данных</span>)}
        </div>
    )
}