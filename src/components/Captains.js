import React, { useEffect, useRef, useState } from "react";
import "./Captains.css";
import DslLogo from "../assets/images/logo.png";
import { gsap } from "gsap";
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
import { CAPTAINS_TIMER_IN_SECS, TIMER_STATES } from "./Contants";
import Thankyou from "./Thankyou";
import CaptainWinner from "./captainWinner";

export default function Captains() {
  const [amount, setAmount] = useState(300000);
  const [captainData, setCaptainData] = useState([]);
  const [index, setIndex] = useState(0);
  const [ownerLogo, setOwnerLogo] = useState("");
  const [topThreeBidders, setTopThreeBidders] = useState([]);
  const [allBidders, setAllBidders] = useState([]);
  const [increase, setIncrease] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const winnerTimer = useRef();

  function addAmount(bid) {
    const sum = amount + bid;
    setAmount(sum);
    handleOwnerTimer(TIMER_STATES.RESET);
    handleOwnerTimer(TIMER_STATES.START);
    addOrUpdateBid(sum);
  }

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
  };

  const resetIndexOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    await updateDoc(timerRef, { currentIndex: 0 });
  };

  const listenForIndexUpdate = async (value) => {
    const currentIndex = value?.currentIndex;
    if (currentIndex && currentIndex >= 0) {
      if (currentIndex === 13) {
        resetIndexOnDatabase();
      } else {
        setIndex(currentIndex);
      }
    } else {
      setIndex(0);
      await resetIndexOnDatabase();
    }
  };

  function openBidding() {
    const initBid = amount;
    const t2 = gsap.timeline();

    t2.to(".bidding-modal", {
      transform: "translateX(0px)",
      duration: 0.5,
    });
    addOrUpdateBid(initBid);
  }

  function getCaptains() {
    const captainsCollection = collection(db, "captains");
    const captainsData = [];
    const queryRef = query(captainsCollection);
    onSnapshot(queryRef, (snapshot) => {
      snapshot.docs.forEach((document) => {
        captainsData.push(document.data());
      });
      setCaptainData(captainsData);
    });
  }

  function getCurrentOwnerLogo() {
    getDoc(doc(db, "Owners", localStorage.getItem("userName")))
      .then((docu) => {
        if (docu.exists()) {
          setOwnerLogo(docu.data().url);
        } else {
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
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
      listenForIndexUpdate(timerData);
      toggleTimer(timerData.start_stop);
      resetClock(timerData.reset);
    });
  }

  const getIncreaseCaptain = async () => {
    onSnapshot(doc(db, "captainIncrease", "increase"), (doc) => {
      // console.log(doc.data());
      return setIncrease(doc.data().increase);
    });
  };

  const handleOwnerTimer = async (payload) => {
    const timerRef = doc(db, "timer", "timer_2");

    await updateDoc(timerRef, payload);
  };

  const getCaptainBidForUser = async () => {
    const captainName = captainData[index].username;
    const userName = localStorage.getItem("userName");
    const q = query(
      collection(db, "bidAmount"),
      where("ownerName", "==", localStorage.getItem("userName")),
      where("captainName", "==", captainData[index].username)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs?.length) {
      const docId = querySnapshot.docs[0].id;
      return {
        id: docId,
        ...querySnapshot.docs[0].data(),
      };
    }
    return null;
  };

  const getTopThreeBidders = async () => {
    const q = query(
      collection(db, "bidAmount"),
      where("captainName", "==", captainData[index].username),
      orderBy("bidAmount", "desc"),
      limit(3)
    );

    onSnapshot(q, (query) => {
      const topThreeBidders = query.docs.map((document) => {
        return document.data();
      });
      setTopThreeBidders(topThreeBidders);
    });
  };

  const getAllBidders = async () => {
    const q = query(
      collection(db, "bidAmount"),
      where("captainName", "==", captainData[index].username),
      orderBy("bidAmount", "desc")
    );

    onSnapshot(q, (query) => {
      const all14Bidders = query.docs.map((document) => {
        return document.data();
      });
      setAllBidders(all14Bidders);
    });
  };

  const addOrUpdateBid = async (amount) => {
    const existingBid = await getCaptainBidForUser();
    if (existingBid) {
      await updateDoc(doc(db, "bidAmount", existingBid.id), {
        bidAmount: amount,
      });
    } else {
      await addDoc(collection(db, "bidAmount"), {
        captainName: captainData[index].username,
        bidAmount: amount,
        ownerName: localStorage.getItem("userName"),
        ownerLogo: ownerLogo,
      });
    }
  };

  const getNextCaptain = async () => {
    // setShowWinner(increase);
    // getWinnerCaptain();
    if (index <= captainData.length) {
      if (index < 13) {
        // setIndex(index + 1);
        await updateIndexOnDatabase();
      }

      await handleOwnerTimer(TIMER_STATES.RESET);
      setAmount(300000);

      const end_timer = doc(db, "timer", "timer_2");
      const changetimervalue2 = doc(db, "timer", "timer");
      const changeIncrease = doc(db, "captainIncrease", "increase");

      await updateDoc(end_timer, {
        timer_end: true,
      });

      await updateDoc(changetimervalue2, {
        timer_end: false,
      });

      await updateDoc(changeIncrease, {
        increase: false,
      });

      const t3 = gsap.timeline();

      t3.to(".bidding-modal", {
        transform: "translateX(-1000px)",
        duration: 0.5,
      });
    }

    handleOwnerTimer(TIMER_STATES.RESET);
  };

  const getEndProgram = async () => {
    onSnapshot(doc(db, "endProgram", "end"), (doc) => {
      // console.log(doc.data());

      if (doc.data().end === true) {
        const t1 = gsap.timeline();

        t1.to(".captainScMainContainer", {
          display: "none",
        }).to(".thankyou", {
          display: "flex",
        });
      }
    });
  };

  // const getWinnerCaptain = async () => {

  //   if (showWinner === true) {
  //     console.log("true running");
  //     const t1 = gsap.timeline();
  //     t1.to(".captainScMainContainer", {
  //       display: "none",
  //     }).to(".showWinner", {
  //       display: "flex",
  //     });
  //   }

  //   else{
  //     console.log("else running");
  //     const t1 = gsap.timeline();
  //     t1.to(".captainScMainContainer", {
  //       display: "block",
  //     }).to(".showWinner", {
  //       display: "none",
  //     });
  //   }
  // };

  useEffect(() => {
    getCaptains();
    getTimerData();
    // getIncreaseCaptain();
    getEndProgram();
    getCurrentOwnerLogo();

    return () => {
      stopTimer();
    };
  }, []);

  // useEffect(() => {
  //   getWinnerCaptain();
  //   winnerTimer.current = setInterval(() => {
  //     console.log(showWinner);
  //     setShowWinner(false);
  //   }, 3000);
  //   return () => clearInterval(winnerTimer.current);
  // }, [increase]);

  useEffect(() => {
    (async () => {
      if (timer === 0) {
        await getNextCaptain();
      }
    })();
  }, [timer]);

  useEffect(() => {
    if (captainData.length) {
      getTopThreeBidders();
      getAllBidders();
    }
  }, [captainData, index]);

  useEffect(() => {
    (async () => {
      // if (increase === true) {
      //   await getNextCaptain();
      // }
    })();
  }, [increase]);

  return (
    <>
      <div className="captainScMainContainer">
        <div className="captainScDslLogo">
          <img src={DslLogo} alt="dsl-logo" />
        </div>

        <div className="captainScSubContainer">
          <div className="captainScTextAndBtn">
            <div className="captainScText">{captainData[index]?.username}</div>

            <div className="captainScBtn">
              <button onClick={openBidding}>MINIMUM BID</button>
            </div>
          </div>

          <div className="captainScCharacter">
            <img src={captainData[index]?.url} />
          </div>
        </div>

        <div className="captainsScCompanyLogo">
          {topThreeBidders.map((item, index) => {
            return (
              <div className="captainsScPosition">
                <h1>{index + 1}</h1>
                <img src={item.ownerLogo} alt="company logo" />
              </div>
            );
          })}
        </div>

        <div className="captainScCurrentUser">
          {allBidders.map((item, index) => {
            if (item.ownerName == localStorage.getItem("userName")) {
              return <h1>{index + 1}</h1>;
            }
          })}
          <img src={ownerLogo} alt="company logo" />
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

      <div className="thankyou" style={{ display: "none" }}>
        <Thankyou></Thankyou>
      </div>

      <div className="showWinner" style={{ display: "none" }}>
        <CaptainWinner></CaptainWinner>
      </div>
    </>
  );
}
