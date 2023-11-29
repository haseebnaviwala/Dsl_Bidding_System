import React, { useEffect, useState } from "react";
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

export default function Admin() {
  const [captainData, setCaptainData] = useState([]);
  const [index, setIndex] = useState(0);
  const [topThreeBidders, setTopThreeBidders] = useState([]);
  const [timerEnd, setTimerEnd] = useState(false);

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

  const updateIndexOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    const value = await getDoc(timerRef);
    if (value?.data()?.currentIndex >= 0) {
      const indexValue = value.data().currentIndex;
      await updateDoc(timerRef, { currentIndex: indexValue + 1 });
    }
  };

  const resetIndexOnDatabase = async () => {
    const timerRef = doc(db, "timer", "timer_2");
    await updateDoc(timerRef, { currentIndex: 0 });
  };

  const listenForIndexUpdate = async (value) => {
    const currentIndex = value?.currentIndex;
    if (currentIndex && currentIndex >= 0) {
      setIndex(currentIndex);
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

  // const getMainTimer = async () => {
  //     onSnapshot(doc(db, "timer", "timer"), (doc) => {
  //         console.log(doc.data());
  //         return setTimerEnd(doc.data().timer_end);
  //     });
  // }

  const getTopThreeBidders = async () => {
    const q = query(
      collection(db, "bidAmount"),
      where("captainName", "==", captainData[index].username),
      orderBy("bidAmount", "desc"),
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

  useEffect(() => {
    getCaptains();
    getEndProgram();
    (async () => {
      // if (getTimerEnd() === true) {
      //   await getTimerEnd();
      //   // await getMainTimer();
      // }
      getTimerEnd();
    })();
  }, []);

  useEffect(() => {
    console.log(captainData);
    if (captainData.length) {
      getTopThreeBidders();
      //   console.log(topThreeBidders)
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

        <div className="admin-result">
          {/* <div className="admin-first">
                    <h1>{index + 1}</h1>
                    <img src={topThreeBidders[0].ownerLogo} alt="first"></img>
                </div>
                <div className="admin-second">
                    <h1>2</h1>
                    <img src={ownerlogo} alt="second"></img>
                </div>
                <div className="admin-third">
                    <h1>3</h1>
                    <img src={ownerlogo} alt="second"></img>
                </div> */}
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
