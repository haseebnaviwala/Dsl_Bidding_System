import React, { useEffect, useRef, useState } from "react";
import "./Captains.css";
import DslLogo from "../assets/images/logo.png";
// import CompanyLogo from "../assets/images/chamdia group.png";
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

export default function Captains() {
  const [amount, setAmount] = useState(300000);
  const [captainData, setCaptainData] = useState([]);
  const [index, setIndex] = useState(0);
  const [ownerLogo, setOwnerLogo] = useState("");
  const [topThreeBidders, setTopThreeBidders] = useState([]);
  const [allBidders, setAllBidders] = useState([]);
  // const [captainBooked, setCaptainBooked] = useState([]);
  const [increase, setIncrease] = useState(false);
  const [remainingCaptains, setRemainingCaptains] = useState([]);
  const [remainingCaptainsIndex, setRemainingCaptainsIndex] = useState(0);

  function addAmount(bid) {
    const sum = amount + bid;
    setAmount(sum);
    handleOwnerTimer(TIMER_STATES.RESET);
    handleOwnerTimer(TIMER_STATES.START);
    addOrUpdateBid(sum);
  }

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
          // console.log(docu.data().url);
          setOwnerLogo(docu.data().url);
        } else {
          // alert("Owner Not Available");
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

      toggleTimer(timerData.start_stop);
      resetClock(timerData.reset);
    });
  }

  const getIncreaseCaptain = async () => {
    onSnapshot(doc(db, "captainIncrease", "increase"), (doc) => {
      console.log(doc.data());
      return setIncrease(doc.data().increase);
    });
  };

  // const getMainTimer = async () => {
  //   onSnapshot(doc(db, "timer", "timer"), (doc) => {
  //     console.log(doc.data());
  //     // getNextCaptain();
  //     return setTimerEnd(doc.data().timer_end);
  //   });
  // };

  // const getTimerEnd = async () => {
  //   onSnapshot(doc(db, "timer", "timer_2"), (doc) => {
  //     console.log(doc.data());
  //     return setTimerEnd(doc.data().timer_end);
  //   });
  // };

  const handleOwnerTimer = async (payload) => {
    const timerRef = doc(db, "timer", "timer_2");

    await updateDoc(timerRef, payload);
  };

  const getCaptainBidForUser = async () => {
    const captainName = captainData[index].username;
    const userName = localStorage.getItem("userName");
    // console.log({ captainName, userName });
    const q = query(
      collection(db, "bidAmount"),
      where("ownerName", "==", localStorage.getItem("userName")),
      where("captainName", "==", captainData[index].username)
    );

    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot);
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
    // console.log(captainData[index].username)
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
        // console.log(document.data())
        return document.data();
      });
      setAllBidders(all14Bidders);
    });
  };

  // const getCaptainBooked = async () => {
  //   const q = query(
  //     collection(db, "bidAmount"),
  //     where("captainName", "==", captainData[index].username),
  //     orderBy("bidAmount", "desc")
  //   );

  //   onSnapshot(q, (query) => {
  //     const all14Bidders = query.docs.map((document) => {
  //       // console.log(document.data())
  //       return document.data();
  //     });
  //     setCaptainBooked(all14Bidders);
  //   });
  // };

  const addOrUpdateBid = async (amount) => {
    // console.log(amount);
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
    if (index <= captainData.length) {
      if (index < 13) {
        setIndex(index + 1);
      }
      if (index === 13) {
        const indexValue = 0;
        setIndex(indexValue);
        console.log(index);
      }
      await handleOwnerTimer(TIMER_STATES.RESET);
      setAmount(300000);
      // isCaptainBooked();

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

  // const isCaptainBooked = async () => {
  //   // var captains = [];
  //   if (index.length == 13) {
  //     for (let i = 0; i < captainData.length; i++) {
  //       console.log(captainData);
  //       if (
  //         captainData[i].username !==
  //         (allBidders[i].captainName == undefined)
  //       ) {
  //         // captains.push(captainData[i].username)
  //         // captainData.push(captainData[i]);
  //         console.log(captainData[i]);
  //         setCaptainData((current) => [...current, captainData[i]]);
  //       }
  //     }
  //   }

  //   console.log(captainData);
  //   // setRemainingCaptains(captains);
  // };

  // const checkCaptain = async () => {
  //   if (captainBooked.length === 0) {
  //     setRemainingCaptain(index);
  //   }
  // };

  useEffect(() => {
    getCaptains();
    getTimerData();
    getIncreaseCaptain();
    // isCaptainBooked();

    // (async () => {
    //   if (getMainTimer() === true) {
    //     await getMainTimer();
    //   }
    // })();

    // getMainTimer();
    getCurrentOwnerLogo();
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
    // console.log(captainData)
    if (captainData.length) {
      getTopThreeBidders();
      getAllBidders();
      // isCaptainBooked();
    }
    // console.log(allBidders);
  }, [captainData, index]);

  useEffect(() => {
    (async () => {
      if (increase === true) {
        await getNextCaptain();
      }
    })();
  }, [increase]);

  return (
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
  );
}
