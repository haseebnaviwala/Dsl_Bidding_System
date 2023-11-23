import React from "react";
import './admin.css';
import logo from '../assets/logo.png';
import adminmascot from '../assets/login mascot.png'
import ownerlogo from '../assets/chamdia group.png'

export default function Admin(){
    return(
        <div className="admin">
            <div className="admin-logo">
                <img src={logo} alt="DSL09 Logo"></img>
            </div>

            <div className="admin-body">
                <div className="admin-text">
                    <h1>Hasan Chamdia</h1>
                </div>
            </div>

            <div className="admin-result">
                <div className="admin-first">
                    <h1>1</h1>
                    <img src={ownerlogo} alt="first"></img>
                </div>
                <div className="admin-second">
                    <h1>2</h1>
                    <img src={ownerlogo} alt="second"></img>
                </div>
                <div className="admin-third">
                    <h1>3</h1>
                    <img src={ownerlogo} alt="second"></img>
                </div>
                <div className="admin-captain">
                    <img src={adminmascot} alt="Mascot"></img>
                </div>
            </div>
        </div>
    );
}