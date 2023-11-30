import React, { useEffect, useState } from "react";
import "./captainWinner.css";
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

export default function CaptainWinner() {
  const [allBidders, setAllBidders] = useState([]);
  const [captainData, setCaptainData] = useState([]);
  const [index, setIndex] = useState(0);
  const [timerEnd, setTimerEnd] = useState(false);
  // const [captainImage, setCaptainImage] = useState();
  const [winnerCaptains, setWinnerCaptains] = useState([]);
  const [winnerCaptainIndex, setWinnerCaptainIndex] = useState(0);

  const getWinningCaptain = async () => {
    const q = query(
      collection(db, "winningCaptains")
      // where("ownerName", "==", localStorage.getItem("userName")),
      // where("captainName", "==", captainData[index].username)
    );
    const value = await getDocs(q);

    const data = value.docs.map((document) => {
      const winnerCaptain = document.data();
      const foundCaptain = captainData.find(
        (v) => winnerCaptain.captainName == v.username
      );
      return { ...winnerCaptain, captainImage: foundCaptain.url };
    });

    setWinnerCaptains(data);
  };

  const getCaptains = async () => {
    const captainsCollection = collection(db, "captains");
    const captainsData = [];
    const queryRef = query(captainsCollection);
    onSnapshot(queryRef, (snapshot) => {
      snapshot.docs.forEach((document) => {
        captainsData.push(document.data());
      });
      setCaptainData(captainsData);
    });
  };

  const getNextCaptain = async () => {
    if (index <= captainData.length) {
      if (index < 13) {
        setIndex(index + 1);
      }
      if (index === 13) {
        const indexValue = 0;
        setIndex(indexValue);
        // console.log(index);
      }

      const changetimervalue = doc(db, "timer", "timer_2");
      // const changetimervalue2 = doc(db, "timer", "timer");

      await updateDoc(changetimervalue, {
        timer_end: false,
      });
    }
  };

  const getTimerEnd = async () => {
    onSnapshot(doc(db, "timer", "timer_2"), (doc) => {
      console.log(doc.data());
      listenForIndexUpdate(doc.data());
      return setTimerEnd(doc.data().timer_end);
    });
  };

  // const getEndProgram = async () => {
  //   onSnapshot(doc(db, "endProgram", "end"), (doc) => {
  //     console.log(doc.data());

  //     if (doc.data().end === true) {
  //       const t1 = gsap.timeline();

  //       t1.to(".position", {
  //         display: "none",
  //       }).to(".thankyou", {
  //         display: "flex",
  //       });
  //     }
  //   });
  // };

  const resetIndexOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    await updateDoc(timerRef, { winnerCaptainIndex: 0 });
  };

  const listenForIndexUpdate = async (value) => {
    const currentIndex = value?.winnerCaptainIndex;
    if (currentIndex && currentIndex >= 0) {
      if (currentIndex === 14) {
        resetIndexOnDatabase();
      } else {
        setWinnerCaptainIndex(currentIndex);
      }
    } else {
      setWinnerCaptainIndex(0);
      await resetIndexOnDatabase();
    }
  };

  useEffect(() => {
    (async () => {
      if (timerEnd === true) {
        await getNextCaptain();
      }
    })();
  }, [timerEnd]);

  useEffect(() => {
    getCaptains();
    //   getEndProgram();
    (async () => {
      if (getTimerEnd() === true) {
        await getTimerEnd();
      }
    })();
  }, []);

  useEffect(() => {
    if (captainData.length) {
      // getAllBidders();
      //  await getCaptains();
      getWinningCaptain();
    }
  }, [captainData]);

  return (
    <div className="captainWinner">
      <div className="captainWinner-logo">
        <img src={logo} alt="DSL09 Logo"></img>
      </div>

      <div className="captainWinner-body">
        <div className="captainWinner-text">
          <h1>{winnerCaptains[winnerCaptainIndex]?.captainName}</h1>
        </div>
      </div>

      <div className="captainWinner-result">
        <div className="captainWinner-first">
          <img src={winnerCaptains[winnerCaptainIndex]?.ownerLogo}></img>
        </div>
        <div className="captainWinner-captain">
          <img
            src={winnerCaptains[winnerCaptainIndex]?.captainImage}
            alt="Captain"
          ></img>
        </div>
      </div>
    </div>
  );
}
