import React, { useEffect, useState } from "react";
import './admin.css';
import logo from '../assets/logo.png';
import adminmascot from '../assets/login mascot.png'
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

    const getTimerEnd = async () => {
        onSnapshot(doc(db, "timer", "timer_2"), (doc) => {
            console.log(doc.data());
            setTimerEnd(doc.data().timer_end);
        });
    }

    const getMainTimer = async () => {
        onSnapshot(doc(db, "timer", "timer"), (doc) => {
            console.log(doc.data());
            return setTimerEnd(doc.data().timer_end);
        });
    }

    const getTopThreeBidders = async () => {
        const q = query(
            collection(db, "bidAmount"),
            where("captainName", "==", captainData[index].username),
            orderBy("bidAmount", "desc"),
            limit(3)
        );

        onSnapshot(q, (query) => {
            const topThreeBidders = query.docs.map((document) => {
                console.log(document.data())
                return document.data();
            });
            setTopThreeBidders(topThreeBidders);
        });
    };

    const getNextCaptain = async () => {
        if (index <= captainData.length) {
            setIndex(index + 1);

            const changetimervalue = doc(db, "timer", "timer_2");
            const changetimervalue2 = doc(db, "timer", "timer");

            await updateDoc(changetimervalue, {
                timer_end: false
            });

            await updateDoc(changetimervalue2, {
                timer_end: false
            });
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
        (async () => {
            if (getTimerEnd() === true || getMainTimer() === true) {
                await getTimerEnd();
                await getMainTimer();
            }
        })();
    }, []);

    useEffect(() => {
        console.log(captainData)
        if (captainData.length) {
            getTopThreeBidders();
            //   console.log(topThreeBidders)
        }
        console.log(topThreeBidders)
    }, [captainData, index]);

    return (
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
                    return <div className="admin-first">
                        <h1>{index + 1}</h1>
                        <img src={item.ownerLogo} alt="first"></img>
                    </div>
                })}
                <div className="admin-captain">
                    <img src={captainData[index]?.url} alt="Captain"></img>
                </div>
            </div>
        </div>
    );
}