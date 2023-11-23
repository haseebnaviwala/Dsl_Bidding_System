import "./App.css";
import CameraScreen from "./components/CameraScreen";
import Captains from "./components/Captains";
import StartScreen from "./components/StartScreen";
import TimerScreen from "./components/TimerScreen";
import './App.css';
// import Welldone from './components/welldone';
import Login from './components/login';
// import Admin from './components/admin';
// import Positions from './components/positions';

function App() {
  return (
    <div className="App">
      {/* <TimerScreen /> */}
      {/* <StartScreen /> */}
      {/* <CameraScreen /> */}
      {/* <Captains /> */}
      {/* <Welldone></Welldone> */}
      <Login></Login>
    </div>
  );
}

export default App;
