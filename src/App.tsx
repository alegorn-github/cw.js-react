import 'normalize.css';
import { createContext, useEffect, useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Header} from './Header';
import { Workspace } from './Workspace/Workspace';
import { Dashboard } from './Dashboard';
import {Settings} from './Settings/Settings';
import {changeTheme} from './tools/changeTheme';

export type TDayStatistic = {
  pomodoros: number;
  workS: number;
  pomodoroTimeS: number;
  pausedS: number;
  breaks: number;
};
export type TWeekStatistic = Array<TDayStatistic>;
export type TStatistic = Array<{monday:number, stat:TWeekStatistic}>;

export type TSettings = {
  'timerUpdateIntervalMs': number,
  'taskTime': number,
  'shortbreakTime': number,
  'longBreakTime': number,
  'breaksForLongBreak': number,
  'addButtonTime': number,
  'maxPomodorosPerTask': number,
  'enableNotifications': boolean,
}

export type TSetting = keyof TSettings;

export type TTask = {
  id: string;
  index ?:number;
  name:string;
  pomodoros:number;
  completedPomodoros: number;
  created: boolean;
  deleted: boolean;
}
export type TTaskList = Array<TTask>;
export type TAppData = {taskList:TTaskList,statistic:TStatistic,settings:TSettings,darkTheme: boolean};
export type TAppContext = [TAppData,(p:Partial<TAppData>)=>void]

const settings:TSettings = {
  'timerUpdateIntervalMs': 300,
  'taskTime': 25,
  'shortbreakTime': 5,
  'longBreakTime': 20,
  'breaksForLongBreak': 3,
  'addButtonTime': 1,
  'maxPomodorosPerTask': 9,
  'enableNotifications': true
}

export const dayTemplate:TDayStatistic = {breaks:0,pausedS:0,pomodoroTimeS:0,pomodoros:0,workS:0};
export const weekTemplate:()=>TWeekStatistic = ()=>((new Array<TDayStatistic>(7)).fill({...dayTemplate}));

export const AppContext = createContext<TAppContext>([{taskList:[],statistic:[],settings,darkTheme:false},(p)=>p]);


function App() {

  let initialAppData:TAppData = {taskList:[],statistic:[],settings,darkTheme:false};

  const storageAppData = localStorage.getItem('appData')||'';
  if (storageAppData){
    initialAppData = JSON.parse(storageAppData);
    initialAppData.statistic.reverse().filter((elem,index)=>index > 3).reverse();
  }

  const [appData,setAppData] = useState<TAppData>(initialAppData);

  function saveAppData(newAppData:Partial<TAppData>){

    setAppData((prevState)=>{
      localStorage.setItem('appData',JSON.stringify({...prevState, ...newAppData}));
      return {...prevState, ...newAppData}
    });
  }

  useEffect(
    ()=>{
      changeTheme(appData.darkTheme);
    },
    [appData.darkTheme]
  );

  return (
    <Router>
      <AppContext.Provider value={[appData,saveAppData]}>
        <Header/>
        <Switch>
          <Route path="/dashboard">
            <Dashboard></Dashboard>
          </Route>
          <Route path="/settings">
            <Settings></Settings>
          </Route>
          <Route path="/">
            <Workspace></Workspace>
          </Route>
        </Switch>
      </AppContext.Provider>
    </Router>
  );
}

export default App;


