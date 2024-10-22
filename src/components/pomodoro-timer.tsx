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
     className="bg-gray-700 hover:bg-gray-800 text-white text-lg font-bold py-2 px-6 rounded transition duration-300 ease-in-out"
    />
   </div>

   <div className="justify-center text-2xl font-bold py-6">
    <p className="text-center">
     Completed cycles: <p className="font-normal">{completedCycles}</p>{" "}
    </p>
    <p className="text-center py-4">
     Hours worked:{" "}
     <p className="font-normal">{secondsToTime(fullWorkingTime)}</p>{" "}
    </p>
    <p className="text-center">
     Completed pomodoros: <p className="font-normal">{numberOfPomodoros}</p>{" "}
    </p>
   </div>
  </div>
 );
}
