import React from "react";
import "./TimerScreen.css";
import DslLogo from "../assets/images/logo.png";
import TimerCharacter from "../assets/images/timer-character.png";

export default function TimerScreen() {
  return (
    <>
      <div className="timerMainContainer">
        <div className="timerDslLogo">
          <img src={DslLogo} alt="dsl logo" />
        </div>

        <div className="timerCharacterWatch">
          <div className="timerCharacter">
            <img src={TimerCharacter} alt="character" />
          </div>

          <div className="timerWatchMain">
            <div className="timerWatch">
              <div className="timerClock">3:00</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
