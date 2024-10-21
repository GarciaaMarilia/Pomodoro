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

 const [completedCycles, setcompletedCycles] = useState<number>(0);
 const [fullWorkingTime, setFullWorkingTime] = useState(0);
 const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

 useInterval(
  () => {
   setMainTime(mainTime - 1);
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
  if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
 }, []);

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
