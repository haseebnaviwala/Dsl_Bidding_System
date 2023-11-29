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
        getAllBidders();
      }
    }, [captainData, index]);

  return (
    <div className="captainWinner">
      <div className="captainWinner-logo">
        <img src={logo} alt="DSL09 Logo"></img>
      </div>

      <div className="captainWinner-body">
        <div className="captainWinner-text">
          <h1>{captainData[index]?.username}</h1>
        </div>
      </div>

      <div className="captainWinner-result">
        <div className="captainWinner-first">
          <img src={allBidders[0]?.ownerLogo}></img>
        </div>
        <div className="captainWinner-captain">
          <img src={captainData[index]?.url} alt="Captain"></img>
        </div>
      </div>
    </div>
  );
}
