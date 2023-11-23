import React from "react";
import Webcam from "react-webcam";

export default function Camera() {
  return (
    <div>
      <Webcam audio={false} width={120 + "%"} mirrored={true} />
    </div>
  );
}
