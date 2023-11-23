import React from "react";
import "./Captains.css";
import DslLogo from "../assets/images/logo.png";
import StartScCharacter from "../assets/images/start-screen-character.png";
import CompanyLogo from "../assets/images/chamdia group.png";

export default function Captains() {
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
            <button>MINIMUM BID</button>
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
    </div>
  );
}
