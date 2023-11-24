import "./App.css";
import { Route, Routes } from "react-router-dom";
import TimerScreen from "./components/TimerScreen";
import Login from './components/login';
import Admin from './components/admin';
import Positions from './components/positions';
import Welldone from "./components/welldone";
import CameraScreen from "./components/CameraScreen"

function App() {
  return (
    <div className="App">
      <Routes>

        <Route
          exact
          path="/"
          element={
            <div>
              <Positions></Positions>
            </div>
          }
        ></Route>

        <Route
          path="/welldone"
          element={
            <div>
              <Welldone></Welldone>
            </div>
          }
        ></Route>

        <Route
          path="/camerascreen"
          element={
            <div>
              <CameraScreen></CameraScreen>
            </div>
          }
        ></Route>

        <Route
          path="/owner"
          element={
            <div>
              <Login></Login>
            </div>
          }
        ></Route>

        <Route
          path="/admin"
          element={
            <div>
              <Admin></Admin>
            </div>
          }
        ></Route>

        <Route
          path="/timer"
          element={
            <div>
              <TimerScreen></TimerScreen>
            </div>
          }
        ></Route>

      </Routes>
    </div>
  );
}

export default App;
