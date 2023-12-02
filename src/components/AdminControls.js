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
  getDoc,
} from "firebase/firestore";
// import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { TIMER_STATES } from "./Contants";

export default function AdminControls(props) {
  // const [timer, setTimer] = useState(180);
  // const [timerRunning, setTimerRunning] = useState(false);
  // const [initTimer, setInitTimer] = useState(180);
  // const remainingTime = useRef();
  const [index, setIndex] = useState();
  const [winnerCaptainIndex, setWinnerCaptainIndex] = useState();

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
    // handleUpdate(TIMER_STATES.START);
    handleCaptainTimer(TIMER_STATES.START);
    // handleUpdate(TIMER_STATES.START);
  };

  const stopTimer = () => {
    // handleUpdate(TIMER_STATES.STOP);
    handleCaptainTimer(TIMER_STATES.STOP);
  };

  const resetTimer = () => {
    // handleUpdate(TIMER_STATES.RESET);
    handleCaptainTimer(TIMER_STATES.RESET);
  };

  const endProgram = async () => {
    await setDoc(doc(db, "endProgram", "end"), {
      end: true,
    });
  };

  const resetIndexOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    await updateDoc(timerRef, { currentIndex: 0 });
    resetTimer();

    const indexRef = doc(db, "nextIndex", "increaseIndex");
    await updateDoc(indexRef, { currentIndex: 0 });
  };

  const shouldWeUpdateIndex = (currentLocalIndex, databaseIndex) => {
    const updatedIndex = databaseIndex + 1;
    if (Math.abs(updatedIndex - currentLocalIndex) > 1) {
      return false;
    }
    return true;
  };

  const updateIndexOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    const value = await getDoc(timerRef);
    if (value?.data()?.currentIndex >= 0) {
      const databaseIndex = value.data().currentIndex;
      if (shouldWeUpdateIndex(index, databaseIndex)) {
        await updateDoc(timerRef, { currentIndex: databaseIndex + 1 });
      }
    }
    resetTimer();

    const indexRef = doc(db, "nextIndex", "increaseIndex");
    const docu = await getDoc(indexRef);
    if (docu?.data()?.currentIndex >= 0) {
      const databaseIndex = docu.data().currentIndex;
      if (shouldWeUpdateIndex(index, databaseIndex)) {
        await updateDoc(indexRef, { currentIndex: databaseIndex + 1 });
      }
    }
  };

  const shouldWeUpdateIndexOfWinnerCaptain = (
    currentLocalIndex,
    databaseIndex
  ) => {
    const updatedIndex = databaseIndex + 1;
    if (Math.abs(updatedIndex - currentLocalIndex) > 1) {
      return false;
    }
    return true;
  };

  const updateIndexOfWinnerCaptainOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    const value = await getDoc(timerRef);
    if (value?.data()?.winnerCaptainIndex >= 0) {
      const databaseIndex = value.data().winnerCaptainIndex;
      if (
        shouldWeUpdateIndexOfWinnerCaptain(winnerCaptainIndex, databaseIndex)
      ) {
        await updateDoc(timerRef, { winnerCaptainIndex: databaseIndex + 1 });
      }
    }
  };

  const resetIndexOfWinnerCaptainOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    await updateDoc(timerRef, { winnerCaptainIndex: 0 });
  };

  const listenForIndexUpdateOfWinnerCaptain = async (value) => {
    const currentIndex = value?.winnerCaptainIndex;
    if (currentIndex && currentIndex >= 0) {
      if (currentIndex === 14) {
        resetIndexOfWinnerCaptainOnDatabase();
      } else {
        setWinnerCaptainIndex(currentIndex);
      }
    } else {
      setWinnerCaptainIndex(0);
      await resetIndexOfWinnerCaptainOnDatabase();
    }
  };

  function getTimerData() {
    const timerCollection = collection(db, "timer");
    const queryRef = query(timerCollection);
    onSnapshot(queryRef, (snapshot) => {
      const timerData = snapshot.docs
        .find(({ id }) => {
          return id === "timer_2";
        })
        ?.data();
      listenForIndexUpdateOfWinnerCaptain(timerData);
    });
  }

  useEffect(() => {
    getTimerData();
  }, []);

  return (
    <div>
      <h3>Timer Control</h3>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={stopTimer}>Stop Timer</button>
      <button onClick={resetTimer}>Reset Timer</button>
      <button onClick={updateIndexOnDatabase}>Next captain</button>
      <button onClick={resetIndexOnDatabase}>Reset captain</button>

      <button onClick={updateIndexOfWinnerCaptainOnDatabase}>
        Next Winner Captain
      </button>
      <button onClick={resetIndexOfWinnerCaptainOnDatabase}>
        Reset Winner Captain
      </button>
      <button onClick={endProgram}>End Program</button>
    </div>
  );
}
