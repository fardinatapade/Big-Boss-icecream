import React, { useState, useRef, useEffect } from "react";
import {
  FaIceCream,
  FaPlusCircle,
  FaRupeeSign,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { API_URL } from "../config";
import Spinner from "./Spinner";

const IcecreamRates = () => {
  const [flavor, setFlavor] = useState("");
  const [rate, setRate] = useState("");
  const [ratesList, setRatesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editFlavor, setEditFlavor] = useState("");
  const [editRate, setEditRate] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const toastRef = useRef(null);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await fetch(`${API_URL}/rates`);

      if (!response.ok) {
        throw new Error(`Server dropped with status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setRatesList(data);
      } else {
        console.error("Received unexpected non-array format:", data);
        setRatesList([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      showToast("Failed to load rates from server", "danger");
      setRatesList([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.current);
    toast.show();
  };

  const handleAddRate = async (e) => {
    e.preventDefault();

    if (!flavor.trim() || !rate.toString().trim()) {
      showToast("Please fill in all fields", "danger");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/rates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          flavor: flavor.trim(),
          rate: parseFloat(rate),
        }),
      });

      if (response.ok) {
        setFlavor("");
        setRate("");
        await fetchRates();
        showToast("Flavor rate added successfully", "success");
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.message || "Failed to save rate", "danger");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      showToast("Server connection error", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/rates/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRates();
        showToast("Flavor deleted successfully", "success");
      } else {
        showToast("Delete failed on server", "danger");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      showToast("Delete failed", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditFlavor(item.flavor);
    setEditRate(item.rate);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFlavor("");
    setEditRate("");
  };

  const handleSaveEdit = async (id) => {
    if (!editFlavor.trim() || !editRate.toString().trim()) {
      showToast("Fields cannot be empty", "danger");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/rates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          flavor: editFlavor.trim(),
          rate: parseFloat(editRate),
        }),
      });

      if (response.ok) {
        setEditingId(null);
        await fetchRates();
        showToast("Flavor updated successfully", "success");
      } else {
        showToast("Update rejected by server", "danger");
      }
    } catch (error) {
      console.error("Update Error:", error);
      showToast("Update failed", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div
        className="w-100 p-1"
        style={{
          background: "transparent",
          fontFamily: "Jost, sans-serif",
          opacity: submitting ? 0.7 : 1,
          pointerEvents: submitting ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        <div className="row g-4">
          <div className="col-12">
            <div
              className="card rounded-2 shadow-sm p-4"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-4">
                <div
                  className="rounded-2 d-flex align-items-center justify-content-center text-white"
                  style={{
                    width: "42px",
                    height: "42px",
                    background: "linear-gradient(135deg,#CA2D2A,#F6643E)",
                    fontSize: "18px",
                  }}
                >
                  <FaIceCream />
                </div>
                <h5
                  className="fw-bold m-0"
                  style={{ color: "#1e293b", letterSpacing: "-0.5px" }}
                >
                  Add New Rate
                </h5>
              </div>

              <form onSubmit={handleAddRate}>
                <div className="row g-3 align-items-end">
                  <div className="col-12 col-md-5">
                    <label className="form-label fw-bold text-secondary small mb-2">
                      Ice Cream Flavor
                    </label>
                    <div className="input-group custom-input-group">
                      <span className="input-group-text rounded-start-2 bg-white border-end-0 icon-box">
                        <FaIceCream color="#CA2D2A" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 rounded-end-2 py-2 fw-medium text-dark"
                        placeholder="Enter Icecream Flavor"
                        value={flavor}
                        onChange={(e) => setFlavor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-bold text-secondary small mb-2">
                      Rate (Per Box - 4L)
                    </label>
                    <div className="input-group custom-input-group">
                      <span className="input-group-text rounded-start-2 bg-white border-end-0 icon-box">
                        <FaRupeeSign color="#CA2D2A" />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control border-start-0 rounded-end-2 py-2 fw-medium text-dark"
                        placeholder="Enter price"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn w-100 py-2.5 rounded-2 text-white fw-bold shadow-sm action-btn"
                      style={{
                        background: "linear-gradient(135deg,#CA2D2A,#F6643E)",
                        letterSpacing: "0.2px",
                      }}
                    >
                      <FaPlusCircle className="me-2" />
                      {submitting ? "Saving..." : "Add Rate"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex align-items-center gap-2 mt-2 mb-4">
              <div
                style={{
                  width: "4px",
                  height: "18px",
                  background: "#CA2D2A",
                  borderRadius: "2px",
                }}
              />
              <h5
                className="fw-bold m-0"
                style={{ color: "#1e293b", letterSpacing: "-0.5px" }}
              >
                Added Flavors
              </h5>
            </div>

            <div className="grid-box">
              <div className="row g-3">
                {ratesList.map((item) => {
                  const isEditing = editingId === item.id;

                  return (
                    <div
                      className="col-12 col-sm-6 col-md-4 col-xl-3"
                      key={item.id}
                    >
                      <div
                        className="card rounded-2 h-100 matrix-card"
                        style={{
                          background: "#fff",
                          border: "1px solid #cbd5e1",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        <div className="card-body p-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
                          <div
                            className="position-relative"
                            style={{ zIndex: 2 }}
                          >
                            {isEditing ? (
                              <div className="mb-3">
                                <label className="form-label small fw-bold text-muted mb-1">
                                  Flavor Name
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm py-2 px-2 rounded-2 fw-medium border-secondary"
                                  value={editFlavor}
                                  onChange={(e) =>
                                    setEditFlavor(e.target.value)
                                  }
                                />
                              </div>
                            ) : (
                              <h6
                                className="fw-bold text-dark mb-3 text-truncate-2"
                                style={{
                                  minHeight: "44px",
                                  lineHeight: "1.4",
                                  fontSize: "16px",
                                }}
                              >
                                {item.flavor}
                              </h6>
                            )}

                            {isEditing ? (
                              <div className="mb-3">
                                <label className="form-label small fw-bold text-muted mb-1">
                                  Rate base
                                </label>
                                <div className="input-group input-group-sm custom-input-group">
                                  <span className="input-group-text bg-white border-end-0 rounded-start-2 border-secondary">
                                    ₹
                                  </span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="form-control border-start-0 py-2 rounded-end-2 fw-semibold border-secondary"
                                    value={editRate}
                                    onChange={(e) =>
                                      setEditRate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="mb-4">
                                <span
                                  className="badge px-3 py-2 rounded-2 fw-black shadow-sm"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #FFF3EF, #FFEbe3)",
                                    color: "#CA2D2A",
                                    fontSize: "14px",
                                    border: "1px solid rgba(230, 45, 42, 0.15)",
                                  }}
                                >
                                  ₹{item.rate}
                                </span>
                              </div>
                            )}
                          </div>

                          <div
                            className="d-flex justify-content-end gap-2 pt-3 border-top position-relative"
                            style={{ zIndex: 2, borderColor: "#edf2f7" }}
                          >
                            {isEditing ? (
                              <>
                                <button
                                  className="btn btn-sm btn-success rounded-2 px-3 flex-grow-1 card-action-btn bg-success border-0 text-white"
                                  onClick={() => handleSaveEdit(item.id)}
                                >
                                  <FaSave className="me-1" /> Save
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary rounded-2 px-2 card-action-btn bg-secondary border-0 text-white"
                                  onClick={cancelEdit}
                                >
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-sm rounded-2 text-primary px-3 flex-grow-1 card-action-btn edit-btn"
                                  onClick={() => startEdit(item)}
                                >
                                  <FaEdit className="me-1" /> Edit
                                </button>
                                <button
                                  className="btn btn-sm rounded-2 text-danger px-2 card-action-btn delete-btn"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </div>

                          <div
                            className="card-watermark"
                            style={{
                              position: "absolute",
                              right: "-10px",
                              top: "-10px",
                              fontSize: "70px",
                              color: "rgba(246, 100, 62, 0.04)",
                              pointerEvents: "none",
                              zIndex: 1,
                            }}
                          >
                            <FaIceCream />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {ratesList.length === 0 && (
                  <div className="col-12">
                    <div
                      className="card border-0 rounded-2 p-5 text-center text-muted fw-semibold shadow-sm"
                      style={{
                        background: "#fff",
                        border: "1px solid #edf2f7",
                      }}
                    >
                      No rates configurations registered yet. Add some flavors!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
          <div
            className="toast-header border-bottom-0"
            style={{ background: "#fff" }}
          >
            <FaIceCream className="me-2" color="#F6643E" />
            <strong className="me-auto text-dark fw-bold">
              Big-Boss Admin Desk
            </strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
            />
          </div>
          <div
            className="toast-body fw-bold rounded-bottom-2"
            style={{
              background: toastType === "success" ? "#E8FFF0" : "#FFF1F1",
              color: toastType === "success" ? "#198754" : "#DC3545",
              padding: "12px 16px",
            }}
          >
            {toastMessage}
          </div>
        </div>
      </div>

      <style>{`
        .custom-input-group {
          border-radius: 8px !important;
          transition: all 0.2s ease-in-out;
        }
        .custom-input-group input {
          border-color: #cbd5e1 !important;
        }
        .custom-input-group span {
          border-color: #cbd5e1 !important;
        }
        .custom-input-group:focus-within {
          box-shadow: 0 0 0 3px rgba(246, 100, 62, 0.15);
        }
        .custom-input-group:focus-within input,
        .custom-input-group:focus-within span {
          border-color: #F6643E !important;
        }
        .form-control:focus {
          box-shadow: none;
        }
        .action-btn {
          transition: all 0.25s ease;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(202, 45, 42, 0.25) !important;
          opacity: 0.95;
        }
        .matrix-card {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02) !important;
        }
        .matrix-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(15, 23, 42, 0.12), 0 8px 16px -6px rgba(15, 23, 42, 0.08) !important;
          border-color: #CA2D2A !important;
        }
        .card-action-btn {
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 34px;
          font-weight: 700;
          border: 1px solid transparent;
        }
        .edit-btn {
          background: #f1f5f9;
          color: #334155;
        }
        .edit-btn:hover {
          background: rgba(202, 45, 42, 0.08);
          color: #CA2D2A;
          transform: translateY(-1px);
        }
        .delete-btn {
          background: #f1f5f9;
          color: #64748b;
        }
        .delete-btn:hover {
          background: #fee2e2;
          color: #ef4444;
          transform: translateY(-1px);
        }
        .card-action-btn:active {
          transform: translateY(0);
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
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
        }
      `}</style>
    </>
  );
};

export default IcecreamRates;
