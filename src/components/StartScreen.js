import React from "react";
import "./StartScreen.css";
import DslLogo from "../assets/images/logo.png";
import StartScCharacter from "../assets/images/start-screen-character.png";
import { NavLink } from "react-router-dom";

export default function StartScreen() {

  return (
    <div>

      <div className="startScMainContainer">
        <div className="startScDslLogo">
          <img src={DslLogo} alt="dsl logo" />
        </div>

        <div className="startScSubContainer">
          <div className="startScBoxAndBtn">
            <div className="startScTextBox">
              <p className="simpleText">ARE YOU GUYS READY FOR</p>
              <p className="boldText">DSL IX</p>
            </div>
            <div className="startScBtn">
              <button><NavLink to={"/camerascreen"}>LETS'S GO</NavLink></button>
            </div>
          </div>
          <div className="startScCharacter">
            <img src={StartScCharacter} alt="character" />
          </div>
        </div>
      </div>

    </div>
  );
}
