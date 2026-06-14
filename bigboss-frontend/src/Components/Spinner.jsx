import React from "react";
import { Flex, Spin } from "antd";

const Spinner = () => {
  const iceCreamIcon = (
    <div className="icecream-container">
      <div className="glow-ring"></div>

      <div className="sparkle sp-1">✦</div>
      <div className="sparkle sp-2">✦</div>
      <div className="sparkle sp-3">✦</div>

      <div className="icecream-loader">
        <div className="scoop-tower">
          {/* Top Scoop: Strawberry Pink with Soft 3D Lighting */}
          <div className="scoop top-scoop">
            <div className="cherry-stem"></div>
            <div className="cherry-berry"></div>
            <div className="inner-shine"></div>
          </div>

          {/* Middle Scoop: Creamy Vanilla */}
          <div className="scoop mid-scoop">
            <div className="inner-shine"></div>
            <div className="syrup-drip"></div>
          </div>

          {/* Bottom Scoop: Brand Signature Red-Orange Gradient */}
          <div className="scoop base-scoop">
            <div className="inner-shine"></div>
            <div className="live-drip drip-left"></div>
            <div className="live-drip drip-right"></div>
          </div>
        </div>

        {/* Textured Golden Waffle Cone */}
        <div className="waffle-cone">
          <div className="waffle-texture"></div>
        </div>

        {/* Dynamic Ground Shadow */}
        <div className="ground-shadow"></div>
      </div>
    </div>
  );

  return (
    <Flex
      align="center"
      justify="center"
      vertical
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 100,
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "12px",
      }}
    >
      <div className="loader-wrapper">
        {/* Premium Cinematic Spinning Radar Rings */}
        <div className="orbital-ring ring-1"></div>
        <div className="orbital-ring ring-2"></div>
        <div className="orbital-ring ring-3"></div>

        <Spin indicator={iceCreamIcon} />
      </div>

      <style>{`
        .loader-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 260px;
          height: 260px;
        }

        /* Upgraded Luxury Orbital System */
        .orbital-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
          animation: spin-orbit infinite linear;
        }

        .ring-1 {
          width: 170px;
          height: 170px;
          border-top-color: rgba(246, 100, 62, 0.4);
          border-right-color: rgba(246, 100, 62, 0.1);
          animation-duration: 3s;
        }

        .ring-2 {
          width: 200px;
          height: 200px;
          border-bottom-color: rgba(202, 45, 42, 0.3);
          border-left-color: rgba(202, 45, 42, 0.05);
          animation-duration: 4s;
          animation-direction: reverse;
        }

        .ring-3 {
          width: 230px;
          height: 230px;
          border-top-color: rgba(246, 100, 62, 0.2);
          border-left-color: rgba(202, 45, 42, 0.2);
          animation-duration: 6s;
        }

        /* Ice Cream Graphics and Layout Context */
        .icecream-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 180px;
          height: 220px;
          transform: scale(1.05);
        }

        .glow-ring {
          position: absolute;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(246, 100, 62, 0.25) 0%, transparent 75%);
          border-radius: 50%;
          animation: radial-pulse 2s ease-in-out infinite alternate;
        }

        .sparkle {
          position: absolute;
          color: #F6643E;
          font-size: 18px;
          opacity: 0;
          filter: drop-shadow(0 2px 4px rgba(246, 100, 62, 0.2));
          pointer-events: none;
        }

        .sp-1 { top: 15px; left: 15px; animation: flash-float 2s infinite ease-in-out; }
        .sp-2 { top: 40px; right: 10px; animation: flash-float 2.4s infinite ease-in-out 0.4s; }
        .sp-3 { bottom: 70px; left: 5px; animation: flash-float 2.8s infinite ease-in-out 0.8s; }

        .icecream-loader {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: gourmet-float 2.2s ease-in-out infinite;
        }

        .scoop-tower {
          display: flex;
          flex-direction: column;
          align-items: center;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.06));
        }

        /* 3D Curved Ice Cream Scoop Styling */
        .scoop {
          position: relative;
          border-radius: 50%;
          box-shadow:
            inset -8px -10px 0px rgba(0, 0, 0, 0.06),
            inset 6px 6px 12px rgba(255, 255, 255, 0.3);
        }

        .inner-shine {
          position: absolute;
          top: 15%;
          left: 15%;
          width: 20%;
          height: 20%;
          background: rgba(255, 255, 255, 0.45);
          border-radius: 50%;
          filter: blur(0.5px);
        }

        .top-scoop {
          width: 58px;
          height: 58px;
          background: linear-gradient(135deg, #FFA4B2, #E64C65);
          margin-bottom: -24px;
          z-index: 6;
        }

        /* Premium Glazed Cherry Component */
        .cherry-berry {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #FF2E55, #9F1239);
          border-radius: 50%;
          box-shadow: 
            inset -3px -3px 6px rgba(0,0,0,0.3),
            0 4px 10px rgba(159, 12, 57, 0.35);
          animation: cherry-bounce 2.2s ease-in-out infinite;
        }

        .cherry-stem {
          position: absolute;
          top: -23px;
          left: 55%;
          width: 14px;
          height: 14px;
          border-left: 2px solid #880e2f;
          border-radius: 80% 0 0 0;
          transform: rotate(10deg);
        }

        .mid-scoop {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #FFFFFF, #E6ECF4);
          margin-bottom: -28px;
          z-index: 5;
        }

        .syrup-drip {
          position: absolute;
          bottom: -5px;
          left: 26px;
          width: 14px;
          height: 12px;
          background: #E64C65;
          border-radius: 0 0 8px 8px;
          box-shadow: inset -2px -2px 3px rgba(0,0,0,0.1);
        }

        .base-scoop {
          width: 86px;
          height: 86px;
          background: linear-gradient(135deg, #F6643E, #CA2D2A);
          z-index: 4;
        }

        /* Fluid Real-Time Melting Drips */
        .live-drip {
          position: absolute;
          background: #CA2D2A;
          border-radius: 0 0 12px 12px;
          width: 11px;
          box-shadow: inset -2px -3px 3px rgba(0, 0, 0, 0.15);
        }

        .drip-left {
          bottom: -10px;
          left: 22px;
          animation: organic-drip 2.6s infinite ease-in-out;
        }

        .drip-right {
          bottom: -7px;
          right: 24px;
          animation: organic-drip 2.2s infinite ease-in-out 0.6s;
        }

        /* Proportional Artisanal Waffle Cone */
        .waffle-cone {
          position: relative;
          width: 0;
          height: 0;
          margin-top: -15px;
          border-left: 36px solid transparent;
          border-right: 36px solid transparent;
          border-top: 82px solid #E59B52;
          filter: drop-shadow(0 10px 15px rgba(199, 118, 46, 0.15));
          z-index: 2;
        }

        .waffle-texture {
          position: absolute;
          top: -82px;
          left: -36px;
          width: 72px;
          height: 82px;
          background:
            linear-gradient(45deg, transparent 42%, #C5732A 45%, #C5732A 55%, transparent 58%),
            linear-gradient(-45deg, transparent 42%, #C5732A 45%, #C5732A 55%, transparent 58%);
          background-size: 13px 13px;
          clip-path: polygon(50% 100%, 0 0, 100% 0);
          opacity: 0.45;
        }

        /* Soft Variable Blur Shadow */
        .ground-shadow {
          width: 64px;
          height: 7px;
          background: rgba(15, 23, 42, 0.08);
          border-radius: 50%;
          margin-top: 18px;
          filter: blur(0.5px);
          animation: shadow-elastic 2.2s ease-in-out infinite;
        }

        /* Adaptive Media Scale Interfaces */
        @media (max-width: 768px) {
          .loader-wrapper { transform: scale(0.85); }
        }
        
        @media (max-width: 480px) {
          .loader-wrapper { transform: scale(0.75); }
        }

        /* Keyframe Animations Engine */
        @keyframes spin-orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes gourmet-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }

        @keyframes shadow-elastic {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(0.7); opacity: 0.3; }
        }

        @keyframes organic-drip {
          0%, 100% { height: 8px; border-radius: 0 0 12px 12px; }
          45% { height: 26px; border-radius: 0 0 6px 6px; }
          60% { height: 5px; border-radius: 0 0 12px 12px; }
        }

        @keyframes flash-float {
          0% { opacity: 0; transform: translateY(8px) scale(0.6); }
          50% { opacity: 1; transform: translateY(-4px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-16px) scale(0.6); }
        }

        @keyframes radial-pulse {
          0% { transform: scale(0.92); opacity: 0.6; }
          100% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes cherry-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-3px); }
        }
      `}</style>
    </Flex>
  );
};

export default Spinner;
