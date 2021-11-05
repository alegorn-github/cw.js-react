import styles from './yaxis.module.css';

interface IYaxis {
    marks: Array<string>,
}

export function YAxis({marks}:IYaxis){
    return (
        <div className={styles.yAxis}>
            {marks.map((mark)=>(
                <div className={styles.mark}>{mark}</div>
            ))}
        </div>
    )
}