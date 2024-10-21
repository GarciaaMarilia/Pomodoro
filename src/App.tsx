import "./App.css";
import { PomodoroTimer } from "./components/pomodoro-timer";

function App(): JSX.Element {
 return (
  <PomodoroTimer
   pomodoroTime={1500} // 25min
   shortRestTime={300} // 5min - For each pomodoro one shortRestTime
   longRestTime={900} // 15min
   cycles={4} // For each end of cycle one longRestTime
  />
 );
}

export default App;
