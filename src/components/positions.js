import React from "react";
import './positions.css';
import logo from '../assets/logo.png';
import ownerlogo from '../assets/chamdia group.png'

export default function Positions(){
    return(
        <div className="position">
            <div className="position-logo">
                <img src={logo} alt="DSL09 Logo"></img>
            </div>

            <div className="position-first">
                <div className="first">
                    <h1>1</h1>
                    <img src={ownerlogo} alt="first"></img>
                </div>
                <div className="first">
                    <h1>2</h1>
                    <img src={ownerlogo} alt="second"></img>
                </div>
            </div>

            <div className="position-second">
                <div className="second">
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
                </div>
            </div>

            <div className="position-second">
                <div className="second">
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
                </div>
            </div>

            <div className="position-second">
                <div className="second">
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
                </div>
            </div>
        </div>
    );
}