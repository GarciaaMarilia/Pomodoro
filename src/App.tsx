import { PomodoroTimer } from "./components/pomodoro-timer";

function App(): JSX.Element {
 return (
  <div className="w-screen h-screen items-center flex justify-center">
   <PomodoroTimer
    pomodoroTime={1500} // 25min
    shortRestTime={300} // 5min - For each pomodoro one shortRestTime
    longRestTime={900} // 15min
    cycles={4} // For each end of cycle one longRestTime
   />
  </div>
 );
}

export default App;
