import React, { useEffect, useRef, useState } from "react";
import "./TimerScreen.css";
import DslLogo from "../assets/images/logo.png";
import TimerCharacter from "../assets/images/timer-character.png";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { TIMER_VALUE_IN_SECS } from "./Contants";

export default function TimerScreen() {
  const [timer, setTimer] = useState(TIMER_VALUE_IN_SECS);
  const remainingTime = useRef();

  const timerFormat = (time) => {
    let minutes = Math.floor((time / 60) % 60);
    let seconds = Math.floor(time % 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  };

  const startTimer = () => {
    clearInterval(remainingTime.current);
    remainingTime.current = setInterval(() => {
      setTimer((prev) => {
        if (prev !== 0) {
          return prev - 1;
        }
        return 0;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(remainingTime.current);
  };

  const onClickTimerStart = () => {
    startTimer();
  };

  const onClickTimerStop = () => {
    stopTimer();
  };

  const toggleTimer = (timerRunning) => {
    const value = timerRunning;
    if (value) {
      onClickTimerStart();
    } else {
      onClickTimerStop();
    }
  };

  const resetClock = (isReset) => {
    if (isReset) {
      stopTimer();
      setTimer(TIMER_VALUE_IN_SECS);
    }
  };

  function getTimerData() {
    const timerCollection = collection(db, "timer");
    const queryRef = query(timerCollection);
    onSnapshot(queryRef, (snapshot) => {
      const docValues = snapshot.docs[0];
      const timerData = docValues.data();
      toggleTimer(timerData.start_stop);
      console.log({ docValues, timerData });
      resetClock(timerData.reset);
    });
  }

  useEffect(() => {
    getTimerData();
    return () => {
      stopTimer();
    };
  }, []);

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

          <div className="timerWatchMain" onClick={toggleTimer}>
            <div className="timerWatch">
              <div className="timerClock">{timerFormat(timer)}</div>
            </div>
          </div>
        </div>

        <div className="timerVerticleLine"></div>
      </div>
      
    </>
  );
}
