import React, {useState} from "react";
import "./Captains.css";
import DslLogo from "../assets/images/logo.png";
import StartScCharacter from "../assets/images/start-screen-character.png";
import CompanyLogo from "../assets/images/chamdia group.png";
import { gsap } from "gsap";

export default function Captains() {

  const [amount, setAmount] = useState(300000);

  // console.log(localStorage.getItem("userName"));

  function addAmount(bid){
      setAmount(amount + bid);
  }

  function openBidding(){
    const t2 = gsap.timeline()
    
    t2.to(".bidding-modal", {
        transform: "translateX(0px)",
        duration: 0.5
    })
  }

  return (
    <div className="captainScMainContainer">
      <div className="captainScDslLogo">
        <img src={DslLogo} alt="dsl-logo" />
      </div>

      <div className="captainScSubContainer">
        <div className="captainScTextAndBtn">
          <div className="captainScText">
            <p>HASAN CHAMDIA</p>
          </div>

          <div className="captainScBtn">
            <button onClick={openBidding}>MINIMUM BID</button>
          </div>
        </div>

        <div className="captainScCharacter">
          <img src={StartScCharacter} alt="character" />
        </div>
      </div>

      <div className="captainsScCompanyLogo">
        <div className="captainsScPosition">
          <h1>1</h1>
          <img src={CompanyLogo} alt="company logo" />
        </div>

        <div className="captainsScPosition">
          <h1>2</h1>
          <img src={CompanyLogo} alt="company logo" />
        </div>

        <div className="captainsScPosition">
          <h1>3</h1>
          <img src={CompanyLogo} alt="company logo" />
        </div>
      </div>

      <div className="captainScCurrentUser">
        <h1>8</h1>
        <img src={CompanyLogo} alt="company logo" />
      </div>

      <div className="ownerTimer">
        <p>00:30</p>
      </div>

      <div className="bidding-modal">
        <div className="bid-input">
          <input type="text" value={amount} disabled></input>
          <button onClick={()=>addAmount(10000)}>+ 10,000</button>
        </div>
        <div className="bid-direct">
          <div>
            <button onClick={()=>addAmount(50000)}>+ 50,000</button>
            <button onClick={()=>addAmount(100000)}>+ 100,000</button>
          </div>
          <div>
            <button onClick={()=>addAmount(200000)}>+ 200,000</button>
            <button onClick={()=>addAmount(300000)}>+ 300,000</button>
          </div>
          <div>
            <button onClick={()=>addAmount(400000)}>+ 400,000</button>
            <button onClick={()=>addAmount(500000)}>+ 500,000</button>
          </div>
          <div>
            <button onClick={()=>addAmount(600000)}>+ 600,000</button>
            <button onClick={()=>addAmount(700000)}>+ 700,000</button>
          </div>
        </div>
      </div>
    </div>
  );
}
