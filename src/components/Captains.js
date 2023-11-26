import React, { useEffect, useRef, useState } from "react";
import "./Captains.css";
import DslLogo from "../assets/images/logo.png";
import StartScCharacter from "../assets/images/start-screen-character.png";
import CompanyLogo from "../assets/images/chamdia group.png";
import { gsap } from "gsap";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { CAPTAINS_TIMER_IN_SECS, TIMER_STATES } from "./Contants";

export default function Captains() {
  const [amount, setAmount] = useState(300000);
  const [captainData, setCaptainData] = useState([]);
  const [index, setIndex] = useState(0);

  // console.log(localStorage.getItem("userName"));

  function addAmount(bid) {
    setAmount(amount + bid);
  }

  function openBidding() {
    const t2 = gsap.timeline();

    t2.to(".bidding-modal", {
      transform: "translateX(0px)",
      duration: 0.5,
    });
  }

  function getLogo() {
    // const docRef = doc(db, "Owners","Chase");
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    //   // docSnap.data() will be undefined in this case
    //   console.log("No such document!");
    // }
    const ownersCollection = collection(db, "Owners");
    const queryRef = query(ownersCollection);
    onSnapshot(queryRef, (snapshot) => {
      snapshot.docs.forEach((document) => {
        console.log(document.data());
      });
    });
  }

  function getCaptains() {
    // const docRef = doc(db, "Owners","Chase");
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    // docSnap.data() will be undefined in this case
    //   console.log("No such document!");
    // }
    const captainsCollection = collection(db, "captains");
    const captainsData = [];
    const queryRef = query(captainsCollection);
    onSnapshot(queryRef, (snapshot) => {
      snapshot.docs.forEach((document) => {
        console.log(document.data().username);
        captainsData.push(document.data());
      });
      setCaptainData(captainsData);
    });
    // console.log(captainsData);
  }

  async function getCurrentOwnerLogo() {
    // const docRef = doc(db, "Owners","Chase");
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    // docSnap.data() will be undefined in this case
    //   console.log("No such document!");
    // }
  }

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

      toggleTimer(timerData.start_stop);
      resetClock(timerData.reset);
    });
  }

  const handleOwnerTimer = async (payload) => {
    console.log("handle update");
    const timerRef = doc(db, "timer", "timer_2");

    // Set the "capital" field of the city 'DC'
    await updateDoc(timerRef, payload);
  };

  useEffect(() => {
    // getLogo();
    getCaptains();
    getTimerData();
    return () => {
      stopTimer();
    };
    // console.log(captainsData);
  }, []);

  const getNextCaptain = async () => {
    if (index <= captainData.length) {
      setIndex(index + 1);
      await handleOwnerTimer(TIMER_STATES.RESET);
    }
  };

  useEffect(() => {
    (async () => {
      if (timer === 0) {
        await getNextCaptain();
      }
    })();
  }, [timer]);

  return (
    <div className="captainScMainContainer">
      <div className="captainScDslLogo">
        <img src={DslLogo} alt="dsl-logo" />
      </div>

      <div className="captainScSubContainer">
        <div className="captainScTextAndBtn">
          <div className="captainScText">
            {/* {captainData.map((items) => {
              console.log(items);
              return <p>{items.username}</p>;
            })} */}
            {captainData[index]?.username}
          </div>

          <div className="captainScBtn">
            <button onClick={openBidding}>MINIMUM BID</button>
          </div>
        </div>

        <div className="captainScCharacter">
          {/* {captainData.map((items) => {
            console.log(items);
            return <img src={items.url} alt="captain image" />;

            // console.log(items)
          })} */}
          <img src={captainData[index]?.url} />
        </div>
      </div>

      <div className="captainsScCompanyLogo">
        <div className="captainsScPosition">
          <h1>1</h1>
          <img src={CompanyLogo} alt="company logo" />
        </div>

        <div className="captainsScPosition">
          <h1>2</h1>
          <img src={CompanyLogo} alt="company logo" />
        </div>

        <div className="captainsScPosition">
          <h1>3</h1>
          <img src={CompanyLogo} alt="company logo" />
        </div>
      </div>

      <div className="captainScCurrentUser">
        <h1>8</h1>
        <img src={CompanyLogo} alt="company logo" />
      </div>

      <div className="ownerTimer">
        <p>{timerFormat(timer)}</p>
      </div>

      <div className="bidding-modal">
        <div className="bid-input">
          <input type="text" value={amount} disabled></input>
          <button onClick={() => addAmount(10000)}>+ 10,000</button>
        </div>
        <div className="bid-direct">
          <div>
            <button onClick={() => addAmount(50000)}>+ 50,000</button>
            <button onClick={() => addAmount(100000)}>+ 100,000</button>
          </div>
          <div>
            <button onClick={() => addAmount(200000)}>+ 200,000</button>
            <button onClick={() => addAmount(300000)}>+ 300,000</button>
          </div>
          <div>
            <button onClick={() => addAmount(400000)}>+ 400,000</button>
            <button onClick={() => addAmount(500000)}>+ 500,000</button>
          </div>
          <div>
            <button onClick={() => addAmount(600000)}>+ 600,000</button>
            <button onClick={() => addAmount(700000)}>+ 700,000</button>
          </div>
        </div>
      </div>
    </div>
  );
}
