import { useCallback, useEffect, useState } from "react";
import { useInterval } from "../hooks/use-interval";

import { Timer } from "./timer";
import { Button } from "./button";
import { secondsToTime } from "../utils/seconds-to-time";

import checkIcon from "../assets/checked.png";
import clockIcon from "../assets/clock.png";
import appleIcon from "../assets/apple.png";

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

 useEffect(() => {
  if (working) {
   document.body.className = "working";
  } else if (resting) {
   document.body.className = "resting";
  } else {
   document.body.className = "default";
  }

  return () => {
   document.body.className = "default";
  };
 }, [working, resting]);

 return (
  <div className="text-white border border-white p-12 rounded-lg">
   <h2 className="text-6xl font-bold">
    You are: {working ? "Working" : "Resting"}
   </h2>
   <Timer mainTime={mainTime} />

   <div className="flex justify-around py-2">
    <Button
     title="Work"
     onClick={() => configureWork()}
     className="bg-cyan-800 hover:bg-cyan-900 text-white text-lg font-bold py-2 px-6 rounded transition duration-300 ease-in-out"
    />
    <Button
     title="Rest"
     onClick={() => configureRest(false)}
     className="bg-orange-400 hover:bg-orange-500 text-white text-lg  font-bold py-2 px-6 rounded transition duration-300 ease-in-out"
    />
    <Button
     title={timeCounting ? "Pause" : "Play"}
     onClick={() => setTimeCounting(!timeCounting)}
     className={
      !working && !resting
       ? "hidden"
       : "bg-gray-700 hover:bg-gray-800 text-white text-lg font-bold py-2 px-6 rounded transition duration-300 ease-in-out"
     }
    />
   </div>

   <div className="justify-center text-2xl font-bold py-6">
    <p className="text-center flex items-center justify-center">
     <img src={checkIcon} alt="Clock Icon" className="w-6 h-6 mr-2" />
     Completed Cycles:{" "}
     <p className="font-normal text-xl px-2">{completedCycles}</p>
    </p>
    <p className="text-center py-4 flex items-center justify-center">
     <img src={clockIcon} alt="Clock Icon" className="w-6 h-6 mr-2" />
     Hours Worked:{" "}
     <p className="font-normal text-xl px-2">
      {secondsToTime(fullWorkingTime)}
     </p>{" "}
    </p>
    <p className="text-center flex items-center justify-center">
     <img src={appleIcon} alt="Clock Icon" className="w-6 h-6 mr-2" />
     Completed Pomodoros:{" "}
     <p className="font-normal text-xl px-2">{numberOfPomodoros}</p>{" "}
    </p>
   </div>
  </div>
 );
}
