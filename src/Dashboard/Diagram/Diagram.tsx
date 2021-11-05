import styles from './diagram.module.css';
import {XAxis} from './XAxis/XAxis';
import {Chart} from './Chart/Chart';
import { TWeekStatistic } from '../../App';

interface IDiagram {
    yMarks: Array<string>,
    weekStat: TWeekStatistic|undefined,
}

export function Diagram({yMarks,weekStat}:IDiagram){
    return (
        <div className={styles.diagram}>
            <div className={styles.main}>
                <div className={styles.chartArea}><Chart yMarks={yMarks} weekStat={weekStat} /></div>  
            </div>
            <div className={styles.xAxis}><XAxis weekday={0}/></div>
        </div>
    )
}