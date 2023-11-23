import React from "react";
import './welldone.css';
import logo from '../assets/logo.png';
import welldonemascot from '../assets/welldone mascot.png'

export default function Welldone(){
    return(
        <div className="welldone">
            <div className="welldone-logo">
                <img src={logo} alt="DSL09 Logo"></img>
            </div>

            <div className="welldone-body">
                <div className="welldone-text">
                    <h1>Welldone</h1>
                </div>
                <div className="welldone-mascot">
                    <img src={welldonemascot} alt="Mascot"></img>
                </div>
            </div>
        </div>
    );
}