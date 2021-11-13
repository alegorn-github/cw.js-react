import styles from './task.module.css';
import { Dropdown } from '../../../Dropdown';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppContext, TTask, TTaskList} from '../../../App';
import { getClassName } from '../../../tools/getClassName';
import { Modal } from '../../../Modal/Modal';

export function Task({id,name,pomodoros,index:taskIndex=0,created,deleted,completedPomodoros}:TTask){
    const [appState,setAppState] = useContext(AppContext);
    const {taskList,settings} = appState;
    const {maxPomodorosPerTask} = settings;
    const myTaskList = useMemo(()=>[...taskList],[taskList]);
    const [taskName,setTaskName] = useState(name);
    const [addButtonEnabled, setAddButtonEnabled] = useState(pomodoros < maxPomodorosPerTask);
    const [extractButtonEnabled, setExtractButtonEnabled] = useState(pomodoros > 1);
    const [isTaskEdited, setIsTaskEdited] = useState(false);
    const [isShowModal,setIsShowModal] = useState(false);
    const taskNameRef = useRef<HTMLInputElement>(null);
    const taskRef = useRef<HTMLLIElement>(null);

    useEffect(
        ()=>{
            setAddButtonEnabled(pomodoros < maxPomodorosPerTask);
            setExtractButtonEnabled(pomodoros > completedPomodoros + 1);
        },[pomodoros,completedPomodoros,maxPomodorosPerTask]
    );

    const saveState = useCallback((newTaskList:TTaskList=myTaskList)=>{
        setAppState({taskList:[...newTaskList]});
    },[myTaskList,setAppState]);

    function addPomodoro(){
        myTaskList[taskIndex].pomodoros = myTaskList[taskIndex].pomodoros + 1;
        saveState();
    }

    function extractPomodoro(){
        myTaskList[taskIndex].pomodoros = myTaskList[taskIndex].pomodoros - 1;
        saveState();
    }

    function editTask(){
        setIsTaskEdited(true);
    }

    function deleteTask(){
        myTaskList[taskIndex].deleted = true;
        saveState();
    }

    function onTaskNameChage(event:React.FormEvent<HTMLInputElement>){
        setTaskName(event.currentTarget.value);
    }

    useEffect(
        ()=>{
            if (taskNameRef.current instanceof HTMLInputElement && isTaskEdited){
                const taskNameElement = taskNameRef.current;

                const stopTaskEdit = ()=>{setIsTaskEdited(false)};
                const onTaskEdit = (event:KeyboardEvent)=>{
                    if (event.key === 'Enter'){
                        event.preventDefault();
                        myTaskList[taskIndex].name = taskName;
                        saveState();
                        setIsTaskEdited(false);
                    }
            
                }

                taskNameElement.focus();
                taskNameElement.addEventListener('keydown',onTaskEdit);
                taskNameElement.addEventListener('blur',stopTaskEdit);

                return ()=>{
                    taskNameElement.removeEventListener('keydown',onTaskEdit);
                    taskNameElement.removeEventListener('blur',stopTaskEdit);
                }

            }
        },
        [taskNameRef,isTaskEdited,myTaskList,saveState,taskIndex,taskName]
        
    );

    useEffect (
        ()=>{
            const hookTaskRef = taskRef.current;

            const fadeInEnd = ()=>{
                if (hookTaskRef instanceof HTMLLIElement){
                    hookTaskRef?.classList.remove(styles.fadeIn);
                    saveState(myTaskList.map((elem,index)=> {
                        if (index === taskIndex){
                            elem.created = false;
                        }
                        return elem;
                    }))
                }
            }

            const fadeOutEnd = ()=>{
                if (hookTaskRef instanceof HTMLLIElement){
                    hookTaskRef?.classList.remove(styles.fadeOut);
                    saveState(myTaskList.filter((elem,index)=> index !== taskIndex ))
                }

            }

            if (created){
                if (hookTaskRef instanceof HTMLLIElement){
                    hookTaskRef.classList.remove(styles.hidden);
                    hookTaskRef.classList.add(styles.fadeIn);
                    hookTaskRef.addEventListener('animationend',fadeInEnd,{once:true})
                }
            }

            if (deleted){
                if (hookTaskRef instanceof HTMLLIElement){
                    hookTaskRef.classList.add(styles.fadeOut);
                    hookTaskRef.addEventListener('animationend',fadeOutEnd,{once:true})
                }
            }


            return ()=>{
                if (hookTaskRef instanceof HTMLLIElement){
                    hookTaskRef.removeEventListener('animationend',fadeInEnd)
                    hookTaskRef.removeEventListener('animationend',fadeOutEnd)
                    hookTaskRef.classList.remove(styles.fadeIn);
                    hookTaskRef.classList.remove(styles.fadeOut);
                }

            }

        },[created,deleted,myTaskList,saveState,taskIndex]

    );

    return (
        <li className={`${styles.task} ${created && styles.hidden}`} ref={taskRef} >
            <div>
                <div className={styles.pomodoroCounter} >{pomodoros}</div>
                <span className={getClassName([
                    styles.taskName,
                    isTaskEdited?styles.taskIsEdited:'',
                ])} >{taskName}</span>
                <input ref={taskNameRef} type='text' className={getClassName([styles.taskInput,isTaskEdited?styles.taskIsEdited:''])} value={taskName} onChange={onTaskNameChage}/>
            </div>
            {isShowModal && (
                <Modal onClose={()=>{setIsShowModal(false)}}>
                    <span className="modal__header">Удалить задачу?</span>
                    <button className="modal__submitButton" onClick={deleteTask}>Удалить</button>
                    <button className="modal__cancelButton" onClick={()=>{setIsShowModal(false)}}>Отмена</button>
                </Modal>
            )}
            <div>
                <Dropdown button={(
                    <button className={styles.menuButton}>
                        <svg width="26" height="6" viewBox="0 0 26 6"  xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3" cy="3" r="3" />
                            <circle cx="13" cy="3" r="3" />
                            <circle cx="23" cy="3" r="3" />
                        </svg>
                    </button>
                    )}
                >
                    <div className={styles.menu}>
                        <button className={styles.menuItem} onClick={addPomodoro} disabled={!addButtonEnabled}>
                            <svg width="16" height="16" viewBox="0 0 16 16"  xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.75 4.25H7.25V7.25H4.25V8.75H7.25V11.75H8.75V8.75H11.75V7.25H8.75V4.25ZM8 0.5C3.8675 0.5 0.5 3.8675 0.5 8C0.5 12.1325 3.8675 15.5 8 15.5C12.1325 15.5 15.5 12.1325 15.5 8C15.5 3.8675 12.1325 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z" />
                            </svg>
                            Увеличить
                        </button>
                        <button className={styles.menuItem} onClick={extractPomodoro} disabled={!extractButtonEnabled}>
                            <svg width="18" height="18" viewBox="0 0 18 18"  xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 1.5C4.8675 1.5 1.5 4.8675 1.5 9C1.5 13.1325 4.8675 16.5 9 16.5C13.1325 16.5 16.5 13.1325 16.5 9C16.5 4.8675 13.1325 1.5 9 1.5ZM9 15C5.6925 15 3 12.3075 3 9C3 5.6925 5.6925 3 9 3C12.3075 3 15 5.6925 15 9C15 12.3075 12.3075 15 9 15Z" />
                                <path d="M5.25 8.25H8.25H9.75H12.75V9.75H9.75H8.25H5.25V8.25Z" />
                            </svg>
                            Уменьшить
                        </button>
                        <button className={styles.menuItem} onClick={editTask}>
                            <svg width="18" height="18" viewBox="0 0 18 18"  xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.545 6.765L11.235 7.455L4.44 14.25H3.75V13.56L10.545 6.765ZM13.245 2.25C13.0575 2.25 12.8625 2.325 12.72 2.4675L11.3475 3.84L14.16 6.6525L15.5325 5.28C15.825 4.9875 15.825 4.515 15.5325 4.2225L13.7775 2.4675C13.6275 2.3175 13.44 2.25 13.245 2.25ZM10.545 4.6425L2.25 12.9375V15.75H5.0625L13.3575 7.455L10.545 4.6425Z" />
                            </svg>
                            Редактировать
                        </button>
                        <button className={styles.menuItem} onClick={()=>{setIsShowModal(true)}}>
                            <svg width="18" height="18" viewBox="0 0 18 18"  xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 6.75V14.25H6V6.75H12ZM10.875 2.25H7.125L6.375 3H3.75V4.5H14.25V3H11.625L10.875 2.25ZM13.5 5.25H4.5V14.25C4.5 15.075 5.175 15.75 6 15.75H12C12.825 15.75 13.5 15.075 13.5 14.25V5.25Z" />
                            </svg>
                            Удалить
                        </button>

                    </div>
                </Dropdown>
            </div>
        </li>
    )
}