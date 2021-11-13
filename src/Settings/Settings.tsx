import React, { HTMLInputTypeAttribute, useContext } from 'react';
import { AppContext, TSetting} from '../App';
import { getRandomKey } from '../tools/getRandomKey';
import styles from './settings.module.css';

type TSettingLabel = {
    setting:TSetting,
    label:string,
    type:Extract<HTMLInputTypeAttribute,'checkbox'|'number'>,
    id?:string
};

const labels:Array<TSettingLabel> = [
    {setting:'taskTime',label:'Время на задачу, мин', type: 'number'},
    {setting:'shortbreakTime',label:'Время короткого перерыва, мин', type:'number'},
    {setting:'longBreakTime',label:'Время длинного перерыва, мин', type:'number'},
    {setting:'breaksForLongBreak',label:'Помидоров до длинного перерыва',type:'number'},
    {setting:'addButtonTime',label:'Кнопка Добавить, мин',type:'number'},
    {setting:'maxPomodorosPerTask',label:'Максимальное число помидоров на задачу', type:'number'},
    {setting:'enableNotifications',label:'Уведомления',type:'checkbox'},
];

for (let item of labels){
    item.id =getRandomKey();
}

export function Settings(){
    const [{settings},saveAppState] = useContext(AppContext);

    const onChange = (event:React.ChangeEvent<HTMLInputElement>,item:TSettingLabel)=>{
        const newValue = item.type === 'number' ? +event.currentTarget.value : event.currentTarget.checked;
        const newSettings = Object.assign({...settings},{[item.setting]:newValue});
        saveAppState({settings:newSettings});
    }

    const Input = function(item:TSettingLabel){
        return(
            <input 
                className={styles.input}
                type={item.type} 
                value={+settings[item.setting]} 
                onChange={(event)=>{onChange(event,item)}}
            />
        )
    }

    const Checkbox = function(item:TSettingLabel){
        return(
            <span>
                <input 
                    className={styles.checkbox}
                    type={item.type} 
                    value='1' 
                    checked={!!settings[item.setting]}
                    onChange={(event)=>{onChange(event,item)}}
                />
                <span className={styles.styledCheckbox}></span>
            </span>
        )
    }


    return (
        <div className={`${styles.settings} container`}>
            <h1>Настройки</h1>
            {
                labels.map((item)=>{
                    return (
                        <div key={item.id}>
                            <label className={styles.label}>
                                <span className={styles.span}>{item.label}</span>
                                {item.type === 'checkbox' ? Checkbox(item):Input(item)}
                            </label>
                        </div>
                    )        
                })
            }
        </div>
    )
}