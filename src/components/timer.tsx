import { secondsToTime } from "../utils/seconds-to-time";

interface TimerProps {
 mainTime: number;
}

export function Timer({ mainTime }: TimerProps): JSX.Element {
 return <div className="flex justify-center text-2xl py-4">{secondsToTime(mainTime)}</div>;
}
