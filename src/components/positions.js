import React, { useEffect, useState } from "react";
import "./positions.css";
import logo from "../assets/logo.png";
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

export default function Positions() {
  const [allBidders, setAllBidders] = useState([]);
  const [captainData, setCaptainData] = useState([]);
  const [index, setIndex] = useState(0);
  const [timerEnd, setTimerEnd] = useState(false);

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

  const listenForTimer2 = async () => {
    onSnapshot(doc(db, "timer", "timer_2"), (doc) => {
      console.log(doc.data());
      listenForIndexUpdate(doc.data());
    });
  };

  const getEndProgram = async () => {
    onSnapshot(doc(db, "endProgram", "end"), (doc) => {
      console.log(doc.data());

      if (doc.data().end === true) {
        const t1 = gsap.timeline();

        t1.to(".position", {
          display: "none",
        }).to(".thankyou", {
          display: "flex",
        });
      }
    });
  };

  useEffect(() => {
    getCaptains();
    getEndProgram();
    listenForTimer2();
  }, []);

  useEffect(() => {
    if (captainData.length) {
      getAllBidders();
    }
  }, [captainData, index]);

  return (
    <>
      <div className="position">
        <div className="position-logo">
          <img src={logo} alt="DSL09 Logo"></img>
        </div>

        <div className="position-first">
          {allBidders.map((item, index) => {
            if (index < 2) {
              return (
                <div className="first">
                  <h1>{index + 1}</h1>
                  <img src={item.ownerLogo} alt="first"></img>
                </div>
              );
            }
          })}
        </div>

        <div className="position-second">
          {allBidders.map((item, index) => {
            if (index > 1 && index < 6) {
              return (
                <div className="second">
                  <h1>{index + 1}</h1>
                  <img src={item.ownerLogo} alt="first"></img>
                </div>
              );
            }
          })}
        </div>

        <div className="position-second">
          {allBidders.map((item, index) => {
            if (index > 5 && index < 10) {
              return (
                <div className="second">
                  <h1>{index + 1}</h1>
                  <img src={item.ownerLogo} alt="first"></img>
                </div>
              );
            }
          })}
        </div>

        <div className="position-second">
          {allBidders.map((item, index) => {
            if (index > 9 && index < 14) {
              return (
                <div className="second">
                  <h1>{index + 1}</h1>
                  <img src={item.ownerLogo} alt="first"></img>
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className="thankyou" style={{ display: "none" }}>
        <Thankyou></Thankyou>
      </div>
    </>
  );
}
