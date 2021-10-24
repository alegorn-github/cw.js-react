import 'normalize.css';
import React, { createContext, useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Header} from './Header';
import { Workspace } from './Workspace/Workspace';
import { Dashboard } from './Dashboard';


export type TTask = {
  id: string;
  index ?:number;
  name:string;
  pomodoros:number;
  completedPomodoros: number;
}

export type TDayStatistic = {
  pomodoros: number;
  workTime: number;
  pomodoroTime: number;
  paused: number;
  breaks: number;
};

export type TWeekStatistic = [TDayStatistic,TDayStatistic,TDayStatistic,TDayStatistic,TDayStatistic,TDayStatistic,TDayStatistic];

export type TTaskList = Array<TTask>;
export type TStatistic = Array<{week:number,stats:TWeekStatistic}>;
export type TSettings = {
  timerUpdateIntervalMs: number,
  taskTime: number,
  shortbreakTime: number,
  longBreakTime: number,
  breaksForLongBreak: number,
  addButtonTime: number,
  maxPomodorosPerTask: number,
}
export type TAppData = {taskList:TTaskList,statistic:TStatistic,settings:TSettings};
export type TAppContext = [TAppData,React.Dispatch<React.SetStateAction<TAppData>>]

const settings:TSettings = {
  timerUpdateIntervalMs: 300,
  taskTime: 1,
  shortbreakTime: 30/60,
  longBreakTime: 1,
  breaksForLongBreak: 3,
  addButtonTime: 30/60,
  maxPomodorosPerTask: 9,
}


export const AppContext = createContext<TAppContext>([{taskList:[],statistic:[],settings},(p)=>{}
]);


function App() {

  const [appData,setAppData] = useState<TAppData>({taskList:[],statistic:[],settings});

  return (
    <Router>
      <AppContext.Provider value={[appData,setAppData]}>
        <Header/>
        <Switch>
          <Route path="/dashboard">
            <Dashboard></Dashboard>
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
