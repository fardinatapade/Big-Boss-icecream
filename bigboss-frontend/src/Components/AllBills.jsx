import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaIceCream,
  FaUsers,
  FaTruck,
  FaFileInvoiceDollar,
  FaEye,
  FaRupeeSign,
  FaSave,
  FaTimes,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { API_URL } from "../config";
import Spinner from "./Spinner";

const AllBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  const [editingBillId, setEditingBillId] = useState(null);
  const [editPaidAmount, setEditPaidAmount] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const toastRef = useRef(null);

  // Load all bills from database
  const fetchBills = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/bills`);
      if (response.ok) {
        const data = await response.json();
        setBills(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading bills:", error);
      showToast("Failed to load bills from server", "danger");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    if (window.bootstrap && toastRef.current) {
      const toast = window.bootstrap.Toast.getOrCreateInstance(
        toastRef.current
      );
      toast.show();
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const searchLower = searchTerm.toLowerCase();
      const matchName = bill.partyName?.toLowerCase().includes(searchLower);
      const matchInvoice = bill.invoiceNo?.toLowerCase().includes(searchLower);
      return matchName || matchInvoice;
    });
  }, [bills, searchTerm]);

  const totalsSummary = useMemo(() => {
    return filteredBills.reduce(
      (acc, bill) => {
        acc.grandTotal += Number(bill.grandTotal || 0);
        acc.paidAmount += Number(bill.paidAmount || 0);
        acc.remainingAmount += Number(bill.remainingAmount || 0);
        return acc;
      },
      { grandTotal: 0, paidAmount: 0, remainingAmount: 0 }
    );
  }, [filteredBills]);

  const startEditAmount = (e, bill) => {
    e.stopPropagation();
    setEditingBillId(bill._id || bill.id);
    setEditPaidAmount(bill.paidAmount);
  };

  const cancelEditAmount = (e) => {
    e.stopPropagation();
    setEditingBillId(null);
    setEditPaidAmount("");
  };

  const handleSavePaidAmount = async (e, bill) => {
    e.stopPropagation();
    const targetId = bill._id || bill.id;
    const nextPaid = parseFloat(editPaidAmount);

    if (isNaN(nextPaid) || nextPaid < 0) {
      showToast("Please enter a valid amount", "danger");
      return;
    }

    const calculatedTotal = Number(bill.grandTotal || 0);
    if (nextPaid > calculatedTotal) {
      showToast("Paid amount cannot be more than total bill amount", "danger");
      return;
    }

    try {
      setSubmitting(true);
      const nextRemaining = calculatedTotal - nextPaid;

      const response = await fetch(`${API_URL}/bills/${targetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...bill,
          paidAmount: nextPaid,
          remainingAmount: nextRemaining,
        }),
      });

      if (response.ok) {
        setEditingBillId(null);
        await fetchBills();
        showToast("Payment collections updated successfully", "success");
        if (
          selectedBill &&
          (selectedBill._id === targetId || selectedBill.id === targetId)
        ) {
          setSelectedBill((prev) => ({
            ...prev,
            paidAmount: nextPaid,
            remainingAmount: nextRemaining,
          }));
        }
      } else {
        showToast("Failed to update layout metrics on server", "danger");
      }
    } catch (error) {
      console.error("Update Error:", error);
      showToast("Server connectivity breakdown error", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBill = async (e, billId) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to delete this bill? This cannot be undone."
      )
    )
      return;

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/bills/${billId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBills();
        showToast("Bill deleted successfully", "success");
        if (
          selectedBill &&
          (selectedBill._id === billId || selectedBill.id === billId)
        ) {
          setSelectedBill(null);
        }
      } else {
        showToast("Failed to delete bill from server", "danger");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      showToast("Server dropped connection during delete operation", "danger");
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
        <div className="row g-3">
          <div className="col-12">
            <div
              className="card rounded-2 shadow-sm p-3 p-sm-4"
              style={{ background: "#fff", border: "1px solid #e2e8f0" }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-2 d-flex align-items-center justify-content-center text-white"
                  style={{
                    width: "42px",
                    height: "42px",
                    background: "linear-gradient(135deg,#CA2D2A,#F6643E)",
                    fontSize: "18px",
                  }}
                >
                  <FaFileInvoiceDollar />
                </div>
                <div>
                  <h5
                    className="fw-bold m-0"
                    style={{ color: "#1e293b", letterSpacing: "-0.5px" }}
                  >
                    All Bills{" "}
                  </h5>
                  <p className="text-muted small m-0 fw-medium">
                    BIG-BOSS ICE CREAM
                  </p>
                </div>
              </div>

              <div className="input-group custom-input-group mb-3">
                <span className="input-group-text rounded-start-2 bg-white border-end-0 icon-box">
                  <FaSearch color="#CA2D2A" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 rounded-end-2 py-2 fw-medium text-dark shadow-none"
                  placeholder="Type party name or bill reference code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="row g-2 text-center text-nowrap">
                <div className="col-4">
                  <div className="p-2 rounded-1 border border-secondary-subtle bg-light-subtle">
                    <div className="text-muted small fw-bold">Total Sales</div>
                    <div className="fw-extrabold text-dark small-mobile-title">
                      ₹{totalsSummary.grandTotal}
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-1 border border-success-subtle bg-success-subtle bg-opacity-25">
                    <div className="text-success small fw-bold">Total Paid</div>
                    <div className="fw-extrabold text-success small-mobile-title">
                      ₹{totalsSummary.paidAmount}
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-1 border border-danger-subtle bg-danger-subtle bg-opacity-25">
                    <div className="text-danger small fw-bold">Total Due</div>
                    <div className="fw-extrabold text-danger small-mobile-title">
                      ₹{totalsSummary.remainingAmount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex align-items-center gap-2 mt-1 mb-2">
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
                Filtered Statements ({filteredBills.length})
              </h5>
            </div>

            <div className="row g-3">
              {filteredBills.length === 0 ? (
                <div className="col-12">
                  <div
                    className="card border-0 rounded-2 p-5 text-center text-muted fw-semibold shadow-sm"
                    style={{ background: "#fff", border: "1px solid #edf2f7" }}
                  >
                    No billing statements match your search keywords parameter
                    filters.
                  </div>
                </div>
              ) : (
                filteredBills.map((bill) => {
                  const billId = bill._id || bill.id;
                  const isEditing = editingBillId === billId;

                  return (
                    <div
                      className="col-12 col-sm-6 col-md-4 col-xl-3"
                      key={billId}
                    >
                      <div
                        className="card rounded-2 h-100 matrix-card shadow-sm"
                        style={{
                          background: "#fff",
                          border: "1px solid #cbd5e1",
                          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        <div className="card-body p-3 p-sm-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
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
                            <FaFileInvoiceDollar />
                          </div>

                          <div
                            className="position-relative"
                            style={{ zIndex: 2 }}
                          >
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span
                                className="badge px-2.5 py-1.5 rounded-2 font-monospace shadow-sm bg-danger"
                                style={{ fontSize: "11px" }}
                              >
                                {bill.invoiceNo}
                              </span>
                              <div className="text-muted small fw-bold d-flex align-items-center gap-1">
                                <FaCalendarAlt size={11} />{" "}
                                {formatDate(bill.generatedOn)}
                              </div>
                            </div>

                            <h6
                              className="fw-black text-dark mb-1 text-truncate"
                              style={{ fontSize: "17px" }}
                            >
                              {bill.partyName}
                            </h6>
                            <div className="text-muted small fw-bold mb-2 d-flex align-items-center gap-1">
                              <FaPhoneAlt size={10} /> {bill.mobile || "—"}
                            </div>

                            <div
                              className="p-3 rounded-2 bg-light mb-3"
                              style={{ fontSize: "12.5px" }}
                            >
                              <div className="d-flex align-items-center justify-content-between text-dark mb-2">
                                <span className="fw-medium text-muted">
                                  Bill Total Amount:
                                </span>
                                <strong className="text-dark">
                                  ₹{bill.grandTotal}
                                </strong>
                              </div>

                              <div className="d-flex align-items-center justify-content-between text-success mb-2">
                                <span className="fw-medium text-muted">
                                  Paid Balance:
                                </span>
                                {isEditing ? (
                                  <div
                                    className="input-group input-group-sm custom-input-group border-secondary"
                                    style={{ width: "95px" }}
                                  >
                                    <span className="input-group-text bg-white border-end-0 px-1 font-monospace small">
                                      ₹
                                    </span>
                                    <input
                                      type="number"
                                      className="form-control border-start-0 px-1 py-1 fw-bold text-success text-center shadow-none small"
                                      value={editPaidAmount}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) =>
                                        setEditPaidAmount(e.target.value)
                                      }
                                    />
                                  </div>
                                ) : (
                                  <span className="fw-bold bg-success-subtle px-1.5 rounded-1 p-1 border border-success border-opacity-10">
                                    ₹{bill.paidAmount}
                                  </span>
                                )}
                              </div>

                              <div className="d-flex align-items-center justify-content-between text-danger mt-1 p-2 border-top border-secondary-subtle border-dashed">
                                <span className="fw-medium text-muted">
                                  Remaining Balance:
                                </span>
                                <span className="fw-extrabold bg-danger-subtle px-1.5 rounde-2 p-1 border border-danger border-opacity-10">
                                  ₹{bill.remainingAmount}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="d-flex justify-content-end gap-2 pt-2 border-top position-relative"
                            style={{ zIndex: 2, borderColor: "#edf2f7" }}
                          >
                            {isEditing ? (
                              <>
                                <button
                                  className="btn btn-sm btn-success rounded-2 px-3 flex-grow-1 card-action-btn bg-success border-0 text-white"
                                  onClick={(e) => handleSavePaidAmount(e, bill)}
                                >
                                  <FaSave className="me-1" /> Save
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary rounded-2 px-2 card-action-btn bg-secondary border-0 text-white"
                                  onClick={cancelEditAmount}
                                >
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-sm rounded-2 text-primary px-2.5 card-action-btn edit-btn flex-grow-1"
                                  onClick={(e) => startEditAmount(e, bill)}
                                >
                                  <FaEdit className="me-1" /> Pay Update
                                </button>
                                <button
                                  className="btn btn-sm rounded-2 text-dark px-2 card-action-btn delete-btn"
                                  onClick={() => setSelectedBill(bill)}
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="btn btn-sm rounded-2 text-danger px-2 card-action-btn delete-btn"
                                  onClick={(e) => handleDeleteBill(e, billId)}
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {selectedBill && (
          <div
            className="modal-backdrop-custom d-flex align-items-end align-items-sm-center justify-content-center p-0 p-sm-3 animate-fade-in"
            onClick={() => setSelectedBill(null)}
          >
            <div
              className="modal-content-custom rounded-top-4 rounded-sm-4 shadow-lg p-3 p-md-4 w-100 animate-slide-up"
              style={{ backgroundColor: "#ffffff", maxWidth: "600px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
                <div>
                  <h5 className="fw-bold text-dark m-0">Bill Record</h5>
                  <span className="badge rounded-1 fw-semibold p-2 text-bg-danger font-monospace mt-1">
                    {selectedBill.invoiceNo}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setSelectedBill(null)}
                ></button>
              </div>

              <div
                className="modal-scrollable-area"
                style={{ maxHeight: "65vh", overflowY: "auto" }}
              >
                <div
                  className="p-2 bg-light rounded-2 mb-3"
                  style={{ fontSize: "13px" }}
                >
                  <div className="row g-2 text-dark">
                    <div className="col-12 col-sm-6">
                      <strong>Party Name:</strong> {selectedBill.partyName}
                    </div>
                    <div className="col-12 col-sm-6">
                      <strong>Mobile Number:</strong>{" "}
                      {selectedBill.mobile || "—"}
                    </div>

                    <div className="col-12 col-sm-6">
                      <strong>Event Date:</strong>{" "}
                      {formatDate(selectedBill.eventDate)}
                    </div>
                    <div className="col-12 col-sm-6">
                      <strong>Venue Site:</strong> {selectedBill.venue || "—"}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold text-danger small text-uppercase mb-1.5">
                    <FaIceCream size={13} className="me-1" /> 1. Ice cream
                    Section
                  </h6>
                  <div className="table-responsive rounded-2 border">
                    <table className="table table-sm table-striped table-hover m-0 text-center small text-nowrap">
                      <thead className="table-dark">
                        <tr>
                          <th className="text-start ps-2">Flavor</th>
                          <th>Size</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBill.items?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-start ps-2 fw-bold">
                              {item.flavor}
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border small-badge">
                                {item.size}
                              </span>
                            </td>
                            <td>{item.quantity}</td>
                            <td>₹{item.rate}</td>
                            <td className="fw-extrabold text-danger">
                              ₹{item.total || item.quantity * item.rate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedBill.assignedStaff?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold text-secondary small text-uppercase mb-1.5">
                      <FaUsers size={13} className="me-1" /> 2. Staff Section
                    </h6>
                    <div className="table-responsive rounded-2 border">
                      <table className="table table-sm table-striped m-0 text-center small text-nowrap">
                        <thead className="table-secondary">
                          <tr>
                            <th className="text-start ps-2">Staff Name</th>
                            <th className="text-end pe-2">Staff Charges</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBill.assignedStaff.map((staff, index) => (
                            <tr key={index}>
                              <td className="text-start ps-2 fw-bold">
                                {staff.name}
                              </td>
                              <td className="text-end pe-2">₹{staff.charge}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-light rounded-2 border border-secondary-subtle border-dashed">
                  <h6 className="fw-bold text-uppercase text-secondary small mb-2">
                    3. Statement Receipt
                  </h6>
                  <div className="d-flex flex-column gap-2 small text-dark">
                    <div className="d-flex justify-content-between">
                      <span>Ice Cream Total Cost:</span>
                      <strong>₹{selectedBill.iceCreamTotal}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Staff Total Charges:</span>
                      <strong>₹{selectedBill.totalStaffCharges}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Transport Fees (Gadi Bhada):</span>
                      <strong>₹{selectedBill.transportCharges}</strong>
                    </div>
                    <hr className="my-1 border-secondary" />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total Bill:</span>
                      <span>₹{selectedBill.grandTotal}</span>
                    </div>
                    <div className="d-flex justify-content-between text-success fw-bold">
                      <span>Amount Paid:</span>
                      <span>₹{selectedBill.paidAmount}</span>
                    </div>
                    <div
                      className="d-flex justify-content-between text-danger fw-black pt-1"
                      style={{ fontSize: "14px" }}
                    >
                      <span>Pending Amount :</span>
                      <span>₹{selectedBill.remainingAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 mt-3 border-top text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-1 px-4 shadow-none fw-bold"
                  onClick={() => setSelectedBill(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="toast-container position-fixed"
        style={{ zIndex: 9999, top: "15px", right: "15px" }}
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
              Big-Boss Ledger Terminal
            </strong>
            <button
              type="button"
              className="btn-close shadow-none"
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
        .custom-input-group { border-radius: 8px !important; transition: all 0.2s ease-in-out; }
        .custom-input-group input, .custom-input-group span { border-color: #cbd5e1 !important; }
        .custom-input-group:focus-within { box-shadow: 0 0 0 3px rgba(246, 100, 62, 0.15); }
        .custom-input-group:focus-within input, .custom-input-group:focus-within span { border-color: #F6643E !important; }
        .matrix-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important; }
        .matrix-card:hover { transform: translateY(-3px); box-shadow: 0 12px 20px -4px rgba(15, 23, 42, 0.1) !important; border-color: #CA2D2A !important; }
        .card-action-btn { display: inline-flex; align-items: center; justify-content: center; height: 34px; font-weight: 700; border: 1px solid transparent; }
        .edit-btn { background: #f1f5f9; color: #334155; }
        .edit-btn:hover { background: rgba(202, 45, 42, 0.08); color: #CA2D2A; transform: translateY(-1px); }
        .delete-btn { background: #f1f5f9; color: #64748b; }
        .delete-btn:hover { background: #fee2e2; color: #ef4444; transform: translateY(-1px); }
        .card-action-btn:active { transform: translateY(0); }
        .modal-backdrop-custom { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(15, 23, 42, 0.6); z-index: 1050; }
        .border-dashed { border-style: dashed !important; }
        .small-badge { font-size: 10px !important; padding: 2px 5px !important; }
        @media (max-width: 575.98px) {
          .modal-content-custom { margin-bottom: 0; border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important; }
          .small-mobile-title { font-size: 14px !important; }
          .toast-container { left: 12px !important; right: 12px !important; top: 12px !important; width: auto !important; }
          .toast { width: 100% !important; }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease forwards; }
        .animate-slide-up { animation: slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </>
  );
};

export default AllBills;
