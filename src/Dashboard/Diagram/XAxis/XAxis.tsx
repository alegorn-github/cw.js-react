import styles from './xaxis.module.css';
import {shortWeekDays} from '../../Dashboard';
import {getRandomKey} from '../../../tools/getRandomKey';
import { useContext } from 'react';
import { dashboardContext } from '../..';

interface IXAxis {
    weekday: number,
}

export function XAxis({weekday}:IXAxis){
    const [{selectedDay},saveDashboradData] = useContext(dashboardContext);
    return (
        <div className={styles.xAxis}>
            {shortWeekDays.map((day,index)=>(
                <div 
                    key={getRandomKey()} 
                    className={`
                        ${styles.day} 
                        ${(index === selectedDay) && styles.selected} 
                    `}
                    onClick={()=>{
                        saveDashboradData((prevState)=>({...prevState,selectedDay:index}))
                    }}
                >{day}</div>
            ))}
        </div>
    )
}