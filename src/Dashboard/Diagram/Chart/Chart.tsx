import styles from './chart.module.css';
import {getRandomKey} from '../../../tools/getRandomKey';
import { TWeekStatistic } from '../../../App';
import { useContext } from 'react';
import { dashboardContext } from '../..';


interface IChart {
    yMarks: Array<string>,
    weekStat: TWeekStatistic|undefined,
}


export function Chart({yMarks,weekStat=[]}:IChart){

    const [{selectedDay},setDashboardData] = useContext(dashboardContext);

    const maximumS = 6900;
    return (
        <div className={styles.chart}>
            {yMarks.map((mark)=>(
                    <div key={getRandomKey()} className={styles.line}>
                        <div className={styles.mark}>{mark}</div>
                    </div>
            ))}
            <div className={styles.columnContainer}>
                {weekStat.map((dayStat,index)=>{
                    let columnValue = (dayStat?.workS||0) / maximumS * 100;
                    columnValue = columnValue > 100 ? 100 : columnValue;
                    return (
                        <div 
                            key={getRandomKey()} 
                            style={columnValue ? {height:`${columnValue}%`}:{}} 
                            className={`
                                ${styles.column} 
                                ${!columnValue && styles.nodata} 
                                ${index === selectedDay && styles.selected}
                            `}
                            onClick={()=>{
                                setDashboardData((prevState)=>({...prevState,selectedDay:index}))
                            }}
                        >
                        </div>
                    )
                })}
            </div>

        </div>
    )
}