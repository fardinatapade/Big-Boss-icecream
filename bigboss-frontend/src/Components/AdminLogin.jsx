import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
  FaIceCream,
} from "react-icons/fa";
import { API_URL } from "../config";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const toastRef = useRef(null);

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);

    const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.current);

    toast.show();
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("admin", JSON.stringify(data));

        showToast("Login Successful! Welcome Admin 🍦", "success");

        setTimeout(() => {
          navigate("/home");
        }, 1200);
      } else {
        showToast(data.message || "Invalid Email or Password", "danger");
      }
    } catch (error) {
      console.error(error);

      showToast("Unable to connect to server", "danger");
    }
  };

  return (
    <>
      <div
        className="vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden p-3"
        style={{
          background: "linear-gradient(135deg,#FFF8F2,#FFFDF9)",
          fontFamily: "Jost, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "260px",
            height: "260px",
            background: "#F6643E15",
            borderRadius: "50%",
            top: "-90px",
            left: "-90px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "240px",
            height: "240px",
            background: "#CA2D2A10",
            borderRadius: "50%",
            bottom: "-90px",
            right: "-90px",
          }}
        />

        <div
          className="card border-0 rounded-2 shadow-lg overflow-hidden"
          style={{
            maxWidth: "430px",
            width: "100%",
            background: "#fff",
            border: "1px solid #f5e5df",
            zIndex: 2,
          }}
        >
          <div className="text-center p-4 pb-3">
            <div
              className="mx-auto d-flex align-items-center justify-content-center rounded-circle shadow"
              style={{
                width: "90px",
                height: "90px",
                background: "linear-gradient(135deg,#CA2D2A,#F6643E)",
                color: "#fff",
                fontSize: "38px",
              }}
            >
              <FaIceCream />
            </div>

            <h2
              className="fw-bold mt-3 mb-1"
              style={{
                color: "#CA2D2A",
              }}
            >
              BIG-BOSS
            </h2>

            <p className="text-muted mb-0">Ice Cream Management System</p>
          </div>

          <div className="card-body px-4 pb-4">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>

                <div className="input-group custom-input-group">
                  <span className="input-group-text rounded-start-2 bg-white border-end-0 icon-box">
                    <FaEnvelope color="#CA2D2A" />
                  </span>

                  <input
                    type="email"
                    className="form-control border-start-0 rounded-end-2 py-3"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>

                <div className="input-group custom-input-group">
                  <span className="input-group-text rounded-start-2 bg-white border-end-0 icon-box">
                    <FaLock color="#CA2D2A" />
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-start-0 border-end-0 py-3"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="input-group-text bg-white border-start-0 rounded-end-2 icon-box"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100 py-3 rounded-2 text-white fw-semibold shadow-sm login-btn"
                style={{
                  background: "linear-gradient(135deg,#CA2D2A,#F6643E)",
                }}
              >
                <FaSignInAlt className="me-2" />
                Login
              </button>
            </form>
          </div>

          <div
            className="text-center py-3"
            style={{
              background: "#FFF8F5",
              borderTop: "1px solid #f5e5df",
            }}
          >
            <small className="text-muted">© 2026 Big-Boss Ice Cream</small>
          </div>
        </div>

        <div
          className="toast-container position-fixed"
          style={{
            zIndex: 9999,
            top: "15px",
            right: "15px",
          }}
        >
          <div
            ref={toastRef}
            className="toast border-0 shadow rounded-2"
            role="alert"
          >
            <div className="toast-header">
              <FaIceCream className="me-2" color="#F6643E" />

              <strong className="me-auto">Big-Boss Ice Cream</strong>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
              />
            </div>

            <div
              className="toast-body fw-semibold"
              style={{
                background: toastType === "success" ? "#E8FFF0" : "#FFF1F1",
                color: toastType === "success" ? "#198754" : "#DC3545",
              }}
            >
              {toastMessage}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        html,
        body,
        #root {
          height: 100%;
          overflow: hidden;
        }

        .card {
          transition: all .3s ease;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .custom-input-group {
          transition: .3s;
        }

        .custom-input-group:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(202,45,42,.08);
        }

        .icon-box {
          transition: .3s;
        }

        .custom-input-group:hover .icon-box {
          background: #FFF3EF !important;
        }

        .form-control:focus {
          box-shadow: none;
          border-color: #F6643E;
        }

        .login-btn {
          transition: .3s ease;
        }

        .login-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 576px) {

          .toast-container {
            left: 12px !important;
            right: 12px !important;
            top: 12px !important;
            width: auto !important;
          }

          .toast {
            width: 100% !important;
          }

          .card {
            max-width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdminLogin;
