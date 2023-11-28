import React from "react";
import "./CameraScreen.css";
import DslLogo from "../assets/images/logo.png";
// import CameraImage from "../assets/images/camera-image.png";
import Camera from "./Camera";
import { FaCamera } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function CameraScreen() {

  return (
    <div>
      <div className="cameraScMainContainer">
        <div className="cameraScDslLogo">
          <img src={DslLogo} alt="Dsl Logo"/>
        </div>

        <div className="cameraScSubContainer">
          <div className="cameraCircle">
            {/* <img src={CameraImage} /> */}
            <Camera />
          </div>
        </div>

        <div className="cameraButton">
          <NavLink to="/welldone" style={{color: "black"}}><FaCamera style={{width: "30px", height: "30px"}}></FaCamera></NavLink>
        </div>
      </div>
    </div>
  );
}
