import { useContext, useEffect, useState } from 'react';
import { dashboardContext } from '..';
import { Dropdown } from '../../Dropdown';
import { getClassName } from '../../tools/getClassName';
import styles from './title.module.css';
import { getMonday } from '../../tools/getMonday';
import { getRandomKey } from '../../tools/getRandomKey';

const now = new Date();

const weeks = [
    {caption:'Эта неделя',monday:getMonday(now)},
    {caption:'Прошедшая неделя',monday:getMonday(new Date(now.getFullYear(),now.getMonth(),now.getDate() - 7 ))},
    {caption:'2 недели назад',monday:getMonday(new Date(now.getFullYear(),now.getMonth(),now.getDate() - 14 ))},
]


export function Title(){
    const [, setDashBoardContext] = useContext(dashboardContext);
    const [dropDownText,setDropDownText] = useState<string>(weeks[0].caption);
    const [isDropdownOpen,setIsDropdownOpen] = useState<boolean>(false);

    function selectWeek(week:number){
        setDropDownText(weeks[week].caption);
        setDashBoardContext((prevState)=>({...prevState,selectedWeek:weeks[week].monday}));
    }

    useEffect(()=>{setIsDropdownOpen(isDropdownOpen)},[isDropdownOpen]);

    return (
        <div className={styles.title}>
            <h1>Ваша активность</h1>
            <Dropdown
                button={(
                    <button className={getClassName([
                        styles.button,
                        isDropdownOpen ? styles.opened : '',
                    ])} onClick={()=>{setIsDropdownOpen(true)}}>
                        <span>{dropDownText}</span>
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 9L8 2L15 9" stroke="" strokeWidth="2"/>
                        </svg>
                    </button>
                )}
                isOpen={isDropdownOpen}
                onClose={()=>{setIsDropdownOpen(false)}}
            >
                <div className={styles.menu}>
                    {weeks.map((week,index)=>(
                        <button key={getRandomKey()} className={styles.menuButton} onClick={()=>{selectWeek(index)}}>{week.caption}</button>
                    ))}
                </div>
            </Dropdown>
        </div>
    )
}