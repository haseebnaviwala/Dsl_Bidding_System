import React, { useEffect, useState } from "react";
import './positions.css';
import logo from '../assets/logo.png';
import ownerlogo from '../assets/chamdia group.png'
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
            setIndex(index + 1);

            const changetimervalue = doc(db, "timer", "timer_2");

            await updateDoc(changetimervalue, {
                timer_end: false
            });
        }
    };

    const getTimerEnd = async () => {
        onSnapshot(doc(db, "timer", "timer_2"), (doc) => {
            console.log(doc.data());
            setTimerEnd(doc.data().timer_end);
        });
    }

    useEffect(() => {
        (async () => {
            if (timerEnd === true) {
                await getNextCaptain();
            }
        })();
    }, [timerEnd]);

    useEffect(() => {
        getCaptains();
        getTimerEnd();
    }, []);

    useEffect(() => {
        if (captainData.length) {
            getAllBidders();
        }
    }, [captainData, index]);

    return (
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
                        )
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
                        )
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
                        )
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
                        )
                    }
                })}
            </div>
        </div>
    );
}