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
        // console.log(document.data())
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
    if (currentIndex && currentIndex >= 0) {
      setIndex(currentIndex);
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
      // return setTimerEnd(doc.data().timer_end);
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

  // const getMainTimer = async () => {
  //     onSnapshot(doc(db, "timer", "timer"), (doc) => {
  //         console.log(doc.data());
  //         return setTimerEnd(doc.data().timer_end);
  //     });
  // }

  useEffect(() => {
    getCaptains();
    getEndProgram();
    // (async () => {
    //   if (listenForTimer2() === true) {
    //     await listenForTimer2();
    //     // await getMainTimer();
    //   }
    // })();
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
          {/* <div className="first">
                    <h1>1</h1>
                    <img src={ownerlogo} alt="first"></img>
                </div>
                <div className="first">
                    <h1>2</h1>
                    <img src={ownerlogo} alt="second"></img>
                </div> */}
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
          {/* <div className="second">
                    <h1>3</h1>
                    <img src={ownerlogo} alt="third"></img>
                </div>
                <div className="second">
                    <h1>4</h1>
                    <img src={ownerlogo} alt="fourth"></img>
                </div>
                <div className="second">
                    <h1>5</h1>
                    <img src={ownerlogo} alt="fifth"></img>
                </div>
                <div className="second">
                    <h1>6</h1>
                    <img src={ownerlogo} alt="sixth"></img>
                </div> */}
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
          {/* <div className="second">
                    <h1>7</h1>
                    <img src={ownerlogo} alt="seventh"></img>
                </div>
                <div className="second">
                    <h1>8</h1>
                    <img src={ownerlogo} alt="eigth"></img>
                </div>
                <div className="second">
                    <h1>9</h1>
                    <img src={ownerlogo} alt="nine"></img>
                </div>
                <div className="second">
                    <h1>10</h1>
                    <img src={ownerlogo} alt="ten"></img>
                </div> */}
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
          {/* <div className="second">
                    <h1>11</h1>
                    <img src={ownerlogo} alt="eleven"></img>
                </div>
                <div className="second">
                    <h1>12</h1>
                    <img src={ownerlogo} alt="twelwe"></img>
                </div>
                <div className="second">
                    <h1>13</h1>
                    <img src={ownerlogo} alt="thirtheen"></img>
                </div>
                <div className="second">
                    <h1>14</h1>
                    <img src={ownerlogo} alt="fourteen"></img>
                </div> */}
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
