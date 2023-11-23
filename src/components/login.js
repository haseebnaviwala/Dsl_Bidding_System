import React, {useState} from "react";
import './login.css';
import logo from '../assets/logo.png';
import loginmascot from '../assets/login mascot.png'
import ball from '../assets/signin_ball.png'
import { db } from '../firebase'
import { doc, getDoc } from "firebase/firestore";

export default function Login(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function login(){

        if(username === "" && password === ""){
            alert("Enter credentials to continue!!");
        }

        else{
            getDoc(doc(db, "Owners", username)).then((docu) => {
                if(docu.exists()){
                    if(docu.data().password === password){
                        // Page Change
                        alert("Done");
                        // Page Change
                    }
                    else{
                        alert("Password Not Matched");
                    }
                }
                else{
                    alert("Owner Not Available");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }

    }

    return(
        <div className="login">
            <div className="login-logo">
                <img src={logo} alt="DSL09 Logo"></img>
            </div>

            <div className="login-body">
                <div className="login-mascot">
                    <img src={loginmascot} alt="Mascot"></img>
                </div>
                <div className="login-form">
                    <div className="form">
                        <div className="form-head">
                            <h1>WELCOME TO DSL lX</h1>
                        </div>
                        <div className="form-body">
                            <form>
                                <label>Username:</label>
                                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text"></input>
                                <br></br>
                                <label>Password:</label>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password"></input>
                            </form>
                        </div>
                        <div className="form-button">
                            <p onClick={login}>Sign in-&gt;</p>
                            <img src={ball} alt="ball" onClick={login}></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}