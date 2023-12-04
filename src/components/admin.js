import React, { useEffect, useRef, useState } from "react";
import "./admin.css";
import logo from "../assets/logo.png";
import adminmascot from "../assets/login mascot.png";
import ownerlogo from "../assets/chamdia group.png";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { gsap } from "gsap";
import Thankyou from "./Thankyou";
import { CAPTAINS_TIMER_IN_SECS } from "./Contants";

export default function Admin() {
  const [captainData, setCaptainData] = useState([]);
  const [index, setIndex] = useState();
  const [topThreeBidders, setTopThreeBidders] = useState([]);
  const [timerEnd, setTimerEnd] = useState(false);

  function getCaptains() {
    const captainsCollection = collection(db, "captains");
    const captainsData = [];
    const queryRef = query(captainsCollection, orderBy("id", "asc"));
    onSnapshot(queryRef, (snapshot) => {
      snapshot.docs.forEach((document) => {
        captainsData.push(document.data());
      });
      setCaptainData(captainsData);
    });
  }

  const resetIndexOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    await updateDoc(timerRef, { currentIndex: 0 });
  };

  const listenForIndexUpdate = async (value) => {
    const currentIndex = value?.currentIndex;
    // if (currentIndex && currentIndex >= 0) {
    //   setIndex(currentIndex);
    // } else {
    //   setIndex(0);
    //   await resetIndexOnDatabase();
    // }
    if (currentIndex && currentIndex >= 0) {
      if (currentIndex === 15) {
        resetIndexOnDatabase();
      } else {
        setIndex(currentIndex);
      }
    } else {
      setIndex(0);
      await resetIndexOnDatabase();
    }
  };

  const getTimerEnd = async () => {
    onSnapshot(doc(db, "timer", "timer_2"), (doc) => {
      console.log(doc.data());
      setTimerEnd(doc.data().timer_end);
      listenForIndexUpdate(doc.data());
    });
  };

  const getEndProgram = async () => {
    onSnapshot(doc(db, "endProgram", "end"), (doc) => {
      console.log(doc.data());

      if (doc.data().end === true) {
        const t1 = gsap.timeline();

        t1.to(".admin", {
          display: "none",
        }).to(".thankyou", {
          display: "flex",
        });
      }
    });
  };

  const getTopThreeBidders = async () => {
    const q = query(
      collection(db, "bidAmount"),
      where("captainName", "==", captainData[index].username),
      orderBy("bidAmount", "desc"),
      orderBy("lastUpdated"),
      limit(3)
    );

    onSnapshot(q, (query) => {
      const topThreeBidders = query.docs.map((document) => {
        console.log(document.data());
        return document.data();
      });
      setTopThreeBidders(topThreeBidders);
    });
  };

  const [timer, setTimer] = useState(CAPTAINS_TIMER_IN_SECS);
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
      setTimer(CAPTAINS_TIMER_IN_SECS);
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
      listenForIndexUpdate(timerData);
      toggleTimer(timerData.start_stop);
      resetClock(timerData.reset);
    });
  }

  useEffect(() => {
    getCaptains();
    getEndProgram();
    getTimerData();
    (async () => {
      getTimerEnd();
    })();
  }, []);

  useEffect(() => {
    console.log(captainData);
    if (captainData.length) {
      getTopThreeBidders();
    }
    console.log(topThreeBidders);
  }, [captainData, index]);

  return (
    <>
      <div className="admin">
        <div className="admin-logo">
          <img src={logo} alt="DSL09 Logo"></img>
        </div>

        <div className="admin-body">
          <div className="admin-text">
            <h1>{captainData[index]?.username}</h1>
          </div>
        </div>

        <div className="ownerTimer">
          <p>{timerFormat(timer)}</p>
        </div>

        <div className="admin-result">
          {topThreeBidders.map((item, index) => {
            return (
              <div className="admin-first">
                <h1>{index + 1}</h1>
                <img src={item.ownerLogo} alt="first"></img>
              </div>
            );
          })}
          <div className="admin-captain">
            <img src={captainData[index]?.url} alt="Captain"></img>
          </div>
        </div>
      </div>

      <div className="thankyou" style={{ display: "none" }}>
        <Thankyou></Thankyou>
      </div>
    </>
  );
}
