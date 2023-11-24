import React, {useEffect} from "react";
import './welldone.css';
import logo from '../assets/logo.png';
import welldonemascot from '../assets/welldone mascot.png'
import { gsap } from "gsap";
import Captains from "./Captains";

export default function Welldone(){

    useEffect(() => {
        const timer = setTimeout(() => {
          // animation for page change
    
          const t1 = gsap.timeline()
    
          t1.to(".welldone", {
              display: "none"
          }).to(".captains", {
              display: "flex"
          })
    
          // animation for page change
        }, 5000);
        return () => clearTimeout(timer);
      }, []);

    return(
        <div>
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

            <div className="captains" style={{display: "none"}}>
                <Captains></Captains>
            </div>
        </div>
    );
}