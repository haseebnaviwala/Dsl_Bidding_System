import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  Firestore,
  doc,
  setDoc,
} from "firebase/firestore";
// import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { TIMER_STATES } from "./Contants";

export default function AdminControls(props) {
  const [timer, setTimer] = useState(180);
  const [timerRunning, setTimerRunning] = useState(false);
  const [initTimer, setInitTimer] = useState(180);
  const remainingTime = useRef();

  const handleUpdate = async (payload) => {
    console.log("handle update");
    const timerRef = doc(db, "timer", "timer");

    // Set the "capital" field of the city 'DC'
    await updateDoc(timerRef, payload);
  };

  const handleCaptainTimer = async (payload) => {
    console.log("handle update");
    const timerRef = doc(db, "timer", "timer_2");

    // Set the "capital" field of the city 'DC'
    await updateDoc(timerRef, payload);
  };

  const startTimer = () => {
    handleUpdate(TIMER_STATES.START);
    handleCaptainTimer(TIMER_STATES.START);
    // handleUpdate(TIMER_STATES.START);
  };

  const stopTimer = () => {
    handleUpdate(TIMER_STATES.STOP);
  };

  const resetTimer = () => {
    handleUpdate(TIMER_STATES.RESET);
    handleCaptainTimer(TIMER_STATES.RESET);
  };

  const increaseCaptain = async () => {
    await setDoc(doc(db, "captainIncrease", "increase"), {
      increase: true,
    });
  };

  const endProgram = async () => {
    await setDoc(doc(db, "endProgram", "end"), {
      end: true,
    });
  }

  // const increaseWinnerCaptain = async () => {
  //   await setDoc(doc(db, "winnerIncrease", "increase"), {
  //     increase: true,
  //   });
  // };

  return (
    <div>
      <h3>Timer Control</h3>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
      <button onClick={increaseCaptain}>Increase</button>
      {/* <button onClick={increaseWinnerCaptain}>Increase Winner Captain</button> */}
      <button onClick={endProgram}>End Program</button>
    </div>
  );
}
