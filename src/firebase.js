import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAONvFskZKoFQtSfv0ETQsywidt8AfXO08",
    authDomain: "dsl-bidding-system.firebaseapp.com",
    projectId: "dsl-bidding-system",
    storageBucket: "dsl-bidding-system.appspot.com",
    messagingSenderId: "783731630179",
    appId: "1:783731630179:web:0c6f627fc461884611d856",
    measurementId: "G-7FS432D6YL"
};

const app = initializeApp(firebaseConfig);
var db = getFirestore(app);

export {db}