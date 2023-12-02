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
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { CAPTAINS_TIMER_IN_SECS, TIMER_STATES } from "./Contants";
import Thankyou from "./Thankyou";
import CaptainWinner from "./captainWinner";

export default function Captains() {
  const [amount, setAmount] = useState(0);
  const [captainData, setCaptainData] = useState([]);
  const [index, setIndex] = useState(0);
  const [ownerLogo, setOwnerLogo] = useState("");
  const [topThreeBidders, setTopThreeBidders] = useState([]);
  const [allBidders, setAllBidders] = useState([]);
  const [increase, setIncrease] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [captainSold, setCaptainSold] = useState([]);
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

    const indexRef = doc(db, "nextIndex", "increaseIndex");
    const docu = await getDoc(indexRef);
    if (docu?.data()?.currentIndex >= 0) {
      const databaseIndex = docu.data().currentIndex;
      if (shouldWeUpdateIndex(index, databaseIndex)) {
        await updateDoc(indexRef, { currentIndex: databaseIndex + 1 });
      }
    }
  };

  const resetIndexOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    await updateDoc(timerRef, { currentIndex: 0 });

    const indexRef = doc(db, "nextIndex", "increaseIndex");
    await updateDoc(indexRef, { currentIndex: 0 });
  };

  const listenForIndexUpdate = async (value) => {
    const currentIndex = value?.currentIndex;
    if (currentIndex && currentIndex >= 0) {
      if (currentIndex === 14) {
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
    // const initBid = amount;
    const t2 = gsap.timeline();

    t2.to(".bidding-modal", {
      transform: "translateX(0px)",
      duration: 0.5,
    });
    addAmount(3);
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

  const getIncreaseCaptain = async (value) => {
    onSnapshot(doc(db, "nextIndex", "increaseIndex"), (doc) => {
      const t3 = gsap.timeline();

      t3.to(".bidding-modal", {
        transform: "translateX(-1000px)",
        duration: 0.5,
      });
      setAmount(0);
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
      orderBy("lastUpdated"),
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
        lastUpdated: serverTimestamp()
      });
    } else {
      await addDoc(collection(db, "bidAmount"), {
        captainName: captainData[index].username,
        bidAmount: amount.toFixed(1),
        ownerName: localStorage.getItem("userName"),
        ownerLogo: ownerLogo,
      });
    }
    await setWinningCaptain(amount);
  };

  const getNextCaptain = async () => {
    logoutOwner();
    if (index <= captainData.length) {
      if (index < 13) {
        await updateIndexOnDatabase();
      }

      await handleOwnerTimer(TIMER_STATES.RESET);
      // setAmount(3);

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

      // const t3 = gsap.timeline();

      // t3.to(".bidding-modal", {
      //   transform: "translateX(-1000px)",
      //   duration: 0.5,
      // });
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

  const getWinningCaptain = async () => {
    // const q = query(
    //   collection(db, "bidAmount"),
    //   where("captainName", "==", captainData[index].username),
    //   orderBy("bidAmount", "desc"),
    //   limit(1)
    // );

    // onSnapshot(q, (query) => {
    //   const topBidder = query.docs.map((document) => {
    //     // setWinningCaptain(document.data.id);
    //     return document.data();
    //   });
    //   setCaptainSold(topBidder);
    // });
    const captainName = captainData[index].username;
    const userName = localStorage.getItem("userName");
    const q = query(
      collection(db, "winningCaptains"),
      where("ownerName", "==", localStorage.getItem("userName")),
      where("captainName", "==", captainData[index].username),
      limit(1)
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

  const setWinningCaptain = async (amount) => {
    const existingBid = await getWinningCaptain();
    if (existingBid) {
      await updateDoc(doc(db, "winningCaptains", existingBid.id), {
        bidAmount: amount,
      });
    } else {
      await addDoc(collection(db, "winningCaptains"), {
        captainName: captainData[index].username,
        bidAmount: amount,
        ownerName: localStorage.getItem("userName"),
        ownerLogo: ownerLogo,
      });
    }
  };

  const logoutOwner = async () => {
    if (topThreeBidders.length === 0) {
      console.log("empty");
    } else {
      if (topThreeBidders[0].ownerName === localStorage.getItem("userName")) {
        const t1 = gsap.timeline();

        t1.to(".captainScMainContainer", {
          display: "none",
        }).to(".thankyou", {
          display: "flex",
        });
      }
    }
  };

  useEffect(() => {
    getCaptains();
    getTimerData();
    getEndProgram();
    getCurrentOwnerLogo();
    getIncreaseCaptain();

    return () => {
      stopTimer();
    };
  }, []);
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

  // useEffect(() => {
  //   (async () => {
  //     // if (increase === true) {
  //     //   await getNextCaptain();
  //     // }
  //   })();
  // }, [increase]);

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
            <input
              type="text"
              value={amount.toFixed(1) + " lac"}
              disabled
            ></input>
            <button onClick={() => addAmount(0.1)}>+ 10 Thousand</button>
          </div>
          <div className="bid-direct">
            <div>
              <button onClick={() => addAmount(0.5)}>+ 50 Thousand</button>
              <button onClick={() => addAmount(1)}>+ 1 lac</button>
            </div>
            <div>
              <button onClick={() => addAmount(2)}>+ 2 lac</button>
              <button onClick={() => addAmount(3)}>+ 3 lac</button>
            </div>
            <div>
              <button onClick={() => addAmount(4)}>+ 4 lac</button>
              <button onClick={() => addAmount(5)}>+ 5 lac</button>
            </div>
            <div>
              <button onClick={() => addAmount(6)}>+ 6 lac</button>
              <button onClick={() => addAmount(7)}>+ 7 lac</button>
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
