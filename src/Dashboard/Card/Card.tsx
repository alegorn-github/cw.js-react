import styles from './card.module.css';

interface ICard {
    stat:string,
    header: string,
    cardStyle:'orange'|'purple'|'blue'|'disabled',
    empty:boolean,
    image: React.ReactNode,
}

export function Card({stat,header,image,cardStyle,empty}:ICard){
    return (
        <div className={`${styles.card} ${!empty && styles[cardStyle]}`}>
            <div className={styles.sign}>
                <h2 className={styles.header}>{header}</h2>
                <span className={styles.stat}>{stat}</span>
            </div>
            {image}
        </div>
    )
}