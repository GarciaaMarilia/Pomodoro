import { useCallback, useEffect, useState } from "react";
import { useInterval } from "../hooks/use-interval";

import { Timer } from "./timer";
import { Button } from "./button";
import { secondsToTime } from "../utils/seconds-to-time";

interface PomodoroTimerProps {
 pomodoroTime: number;
 shortRestTime: number;
 longRestTime: number;
 cycles: number;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require("../sounds/bell-start.mp3");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require("../sounds/bell-finish.mp3");

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

export function PomodoroTimer({
 cycles,
 longRestTime,
 pomodoroTime,
 shortRestTime,
}: PomodoroTimerProps): JSX.Element {
 const [mainTime, setMainTime] = useState<number>(pomodoroTime);
 const [timeCounting, setTimeCounting] = useState<boolean>(false);
 const [working, setWorking] = useState<boolean>(false);
 const [resting, setResting] = useState<boolean>(false);

 const [completedCycles, setCompletedCycles] = useState<number>(0);
 const [fullWorkingTime, setFullWorkingTime] = useState<number>(0);
 const [numberOfPomodoros, setNumberOfPomodoros] = useState<number>(0);
 const [cyclesQtdManager, setCyclesQtdManager] = useState<boolean[]>(
  new Array(cycles - 1).fill(true)
 );

 useInterval(
  () => {
   setMainTime(mainTime - 1);
   if (working) setFullWorkingTime(fullWorkingTime + 1);
  },
  timeCounting ? 1000 : null
 );

 const configureWork = useCallback(() => {
  setTimeCounting(true);
  setWorking(true);
  setResting(false);
  setMainTime(pomodoroTime);

  audioStartWorking.play();
 }, [setTimeCounting, setWorking, setResting, setMainTime, pomodoroTime]);

 const configureRest = useCallback(
  (long: boolean) => {
   setTimeCounting(true);
   setWorking(false);
   setResting(true);

   if (long) {
    setMainTime(longRestTime); // define tipo de descanso
   } else {
    setMainTime(shortRestTime); //
   }

   audioStopWorking.play();
  },
  [
   setTimeCounting,
   setResting,
   setWorking,
   setMainTime,
   longRestTime,
   shortRestTime,
  ]
 );

 useEffect(() => {
  if (mainTime > 0) return;

  if (working && cyclesQtdManager.length > 0) {
   configureRest(false);
   cyclesQtdManager.pop();
  } else if (working && cyclesQtdManager.length <= 0) {
   configureRest(true);
   setCyclesQtdManager(new Array(cycles - 1).fill(true));
   setCompletedCycles(completedCycles + 1);
  }

  if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
  if (resting) configureWork();
 }, [
  working,
  resting,
  mainTime,
  cyclesQtdManager,
  numberOfPomodoros,
  completedCycles,
  configureRest,
  setCyclesQtdManager,
  configureWork,
  cycles,
 ]);

 return (
  <div className="pomodoro">
   <h2>You are: Working</h2>
   <Timer mainTime={mainTime} />

   <div className="controls">
    <Button title="Work" onClick={() => configureWork()} />
    <Button title="Rest" onClick={() => configureRest(false)} />
    <Button
     title={timeCounting ? "Pause" : "Play"}
     onClick={() => setTimeCounting(!timeCounting)}
    />
   </div>

   <div className="details">
    <p>Completed cycles: {completedCycles}</p>
    <p>Hours worked: {secondsToTime(fullWorkingTime)}</p>
    <p>Completed pomodoros: {numberOfPomodoros}</p>
   </div>
  </div>
 );
}
