import React from "react";
import { Row, Col, Card } from "antd";
import {
  FaHome,
  FaFileInvoiceDollar,
  FaIceCream,
  FaUsers,
  FaTruck,
  FaHistory,
} from "react-icons/fa";

const Homepage = ({ setSelectedKey }) => {
  const cardsData = [
    {
      key: "1",
      label: "Home Page",
      icon: <FaHome />,
      gradient: "linear-gradient(135deg, #6366f1, #4338ca)",
    },
    {
      key: "2",
      label: "Create Bill",
      icon: <FaFileInvoiceDollar />,
      gradient: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      key: "3",
      label: "Icecream Rates",
      icon: <FaIceCream />,
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      key: "4",
      label: "Staff Charges",
      icon: <FaUsers />,
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    },
    {
      key: "5",
      label: "Catering Info",
      icon: <FaTruck />,
      gradient: "linear-gradient(135deg, #f43f5e, #e11d48)",
    },
    {
      key: "6",
      label: "All Bills",
      icon: <FaHistory />,
      gradient: "linear-gradient(135deg, #64748b, #475569)",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "16px",
        perspective: "1500px",
      }}
    >
      <Row
        gutter={[24, 24]}
        style={{
          width: "100%",
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {cardsData.map((card) => (
          <Col
            xs={12}
            sm={12}
            md={8}
            lg={8}
            key={card.key}
            className="p-sm-2 p-1"
          >
            <Card
              bordered={false}
              className="premium-dashboard-card"
              onClick={() => setSelectedKey?.(card.key)}
              style={{
                borderRadius: "12px",
                cursor: "pointer",
                background: "#ffffff",
                boxShadow:
                  "0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 8px 16px -6px rgba(15, 23, 42, 0.04)",
                transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                transformStyle: "preserve-3d",
                height: "100%",
                border: "1px solid rgba(226, 232, 240, 0.7)",
                overflow: "hidden",
                position: "relative",
              }}
              bodyStyle={{
                padding: "40px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <div
                className="gradient-border-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "2px solid transparent",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, transparent 60%, rgba(202, 45, 42, 0.15)) border-box`,
                  WebkitMask:
                    "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "18px",
                  background: card.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "#ffffff",
                  marginBottom: "20px",
                  boxShadow: "0 8px 20px -4px rgba(15, 23, 42, 0.15)",
                  transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                  transform: "translateZ(40px)",
                }}
                className="icon-sphere"
              >
                {card.icon}
              </div>

              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#1e293b",
                  letterSpacing: "-0.3px",
                  textAlign: "center",
                  transform: "translateZ(25px)",
                  transition: "all 0.3s ease",
                  lineHeight: "1.3",
                }}
                className="label-text"
              >
                {card.label}
              </span>

              <div
                className="card-bg-blob"
                style={{
                  position: "absolute",
                  width: "100px",
                  height: "100px",
                  background: card.gradient,
                  filter: "blur(40px)",
                  opacity: 0.03,
                  borderRadius: "50%",
                  bottom: "-25px",
                  right: "-25px",
                  transition: "all 0.4s ease",
                  pointerEvents: "none",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <style>{`
        .premium-dashboard-card:hover {
          transform: translateY(-8px) rotateX(6deg) rotateY(-3deg) !important;
          box-shadow: 0 25px 40px -10px rgba(15, 23, 42, 0.08), 0 16px 24px -10px rgba(15, 23, 42, 0.04) !important;
          border-color: rgba(202, 45, 42, 0.25) !important;
        }

        .adjustfont{
          font-size: 5rem;
        }
        
        .premium-dashboard-card:hover .gradient-border-overlay {
          opacity: 1 !important;
        }
        
        .premium-dashboard-card:hover .icon-sphere {
          transform: translateZ(60px) scale(1.08) rotate(4deg) !important;
          box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.25) !important;
        }
        
        .premium-dashboard-card:hover .label-text {
          color: #CA2D2A !important;
          transform: translateZ(40px) !important;
        }

        .premium-dashboard-card:hover .card-bg-blob {
          opacity: 0.12 !important;
          transform: scale(1.4) !important;
        }

        .premium-dashboard-card:active {
          transform: translateY(-3px) scale(0.98) !important;
        }

        @media (max-width: 767px) {
          .premium-dashboard-card .ant-card-body {
            padding: 32px 12px !important;
          }
          .icon-sphere {
            width: 56px !important;
            height: 56px !important;
            fontSize: 22px !important;
            marginBottom: 16px !important;
            borderRadius: 14px !important;
          }
          .label-text {
            fontSize: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .premium-dashboard-card .ant-card-body {
            padding: 24px 8px !important;
          }
          .icon-sphere {
            width: 48px !important;
            height: 48px !important;
            fontSize: 18px !important;
            marginBottom: 12px !important;
            borderRadius: 12px !important;
          }
         .label-text {
  font-size: 14px !important;
}

@media (min-width: 768px) {
  .label-text {
    font-size: 18px !important;
  }
}

@media (min-width: 992px) {
  .label-text {
    font-size: 24px !important;
  }
}
      `}</style>
    </div>
  );
};

export default Homepage;
