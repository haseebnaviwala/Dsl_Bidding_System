import React from "react";
import "./CameraScreen.css";
import DslLogo from "../assets/images/logo.png";
import CameraImage from "../assets/images/camera-image.png";
import Camera from "./Camera";

export default function CameraScreen() {
  return (
    <div className="cameraScMainContainer">
      <div className="cameraScDslLogo">
        <img src={DslLogo} />
      </div>

      <div className="cameraScSubContainer">
        <div className="cameraCircle">
          {/* <img src={CameraImage} /> */}
          <Camera />
        </div>
      </div>
    </div>
  );
}
