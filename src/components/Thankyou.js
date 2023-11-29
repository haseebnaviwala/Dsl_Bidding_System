import React from "react";
import './Thankyou.css';
import logo from '../assets/logo.png';
import welldonemascot from '../assets/welldone mascot.png'

export default function Thankyou(){

    return(
        <div>
            <div className="thankyou">
                <div className="thankyou-logo">
                    <img src={logo} alt="DSL09 Logo"></img>
                </div>

                <div className="thankyou-body">
                    <div className="thankyou-text">
                        <h1>ThankYou</h1>
                    </div>
                    <div className="thankyou-mascot">
                        <img src={welldonemascot} alt="Mascot"></img>
                    </div>
                </div>
            </div>
        </div>
    );
}