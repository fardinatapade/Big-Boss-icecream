import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaFileInvoiceDollar,
  FaTruck,
  FaUsers,
  FaDownload,
} from "react-icons/fa";
import { API_URL } from "../config";
import Spinner from "./Spinner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CreateBill = () => {
  const [invoiceNo, setInvoiceNo] = useState("BB-2026-001");
  const [generatedOn, setGeneratedOn] = useState("");
  const [venue, setVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [partyName, setPartyName] = useState("");
  const [mobile, setMobile] = useState("");
  const [transportCharges, setTransportCharges] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);

  const [cateringOptions, setCateringOptions] = useState([]);
  const [flavorOptions, setFlavorOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCateringId, setSelectedCateringId] = useState("");

  const [items, setItems] = useState([]);
  const [assignedStaff, setAssignedStaff] = useState([]);

  const [selectedFlavorIndex, setSelectedFlavorIndex] = useState("");
  const [newFlavor, setNewFlavor] = useState("");
  const [newSize, setNewSize] = useState("4L");
  const [newQuantity, setNewQuantity] = useState("");
  const [newRate, setNewRate] = useState("");

  const [selectedStaffIndex, setSelectedStaffIndex] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffCharge, setNewStaffCharge] = useState("");

  const invoiceRef = useRef(null);

  const setDefaultDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${year}-${month}-${day}`;
    setGeneratedOn(formattedToday);
    setEventDate(formattedToday);
  };

  const calculateNextInvoiceNumber = (billsList) => {
    const currentYear = new Date().getFullYear();
    const prefix = `BB-${currentYear}-`;

    if (!Array.isArray(billsList) || billsList.length === 0) {
      setInvoiceNo(`${prefix}001`);
      return;
    }

    const serialNumbers = billsList
      .map((bill) => String(bill?.invoiceNo || ""))
      .filter((no) => no.startsWith(prefix))
      .map((no) => parseInt(no.replace(prefix, ""), 10))
      .filter((num) => !isNaN(num));

    if (serialNumbers.length === 0) {
      setInvoiceNo(`${prefix}001`);
      return;
    }

    const highestSerial = Math.max(...serialNumbers);
    const nextSerial = highestSerial + 1;
    const paddedSerial = String(nextSerial).padStart(3, "0");
    setInvoiceNo(`${prefix}${paddedSerial}`);
  };

  const initializeBillingData = useCallback(async () => {
    try {
      const [cateringRes, ratesRes, staffRes, billsRes] = await Promise.all([
        fetch(`${API_URL}/catering`).catch(() => null),
        fetch(`${API_URL}/rates`).catch(() => null),
        fetch(`${API_URL}/staff`).catch(() => null),
        fetch(`${API_URL}/bills`).catch(() => null),
      ]);

      if (cateringRes && cateringRes.ok) {
        const cateringData = await cateringRes.json();
        setCateringOptions(Array.isArray(cateringData) ? cateringData : []);
      }
      if (ratesRes && ratesRes.ok) {
        const ratesData = await ratesRes.json();
        setFlavorOptions(Array.isArray(ratesData) ? ratesData : []);
      }
      if (staffRes && staffRes.ok) {
        const staffData = await staffRes.json();
        setStaffOptions(Array.isArray(staffData) ? staffData : []);
      }
      if (billsRes && billsRes.ok) {
        const existingBills = await billsRes.json();
        calculateNextInvoiceNumber(existingBills);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setDefaultDates();
    initializeBillingData();
  }, [initializeBillingData]);

  const handleCateringChange = (e) => {
    const val = e.target.value;
    setSelectedCateringId(val);
    const targetMatch = cateringOptions.find(
      (item) => String(item.id || item._id) === String(val)
    );
    if (targetMatch) {
      setPartyName(targetMatch.catering || targetMatch.name || "");
      setMobile(targetMatch.contact || targetMatch.mobile || "");
    } else {
      setPartyName("");
      setMobile("");
    }
  };

  const handleFlavorChange = (e) => {
    const idx = e.target.value;
    setSelectedFlavorIndex(idx);
    if (idx !== "") {
      const selected = flavorOptions[idx];
      setNewFlavor(selected?.flavor || "");
      setNewRate(selected?.rate || "");
    } else {
      setNewFlavor("");
      setNewRate("");
    }
  };

  const handleStaffChange = (e) => {
    const idx = e.target.value;
    setSelectedStaffIndex(idx);
    if (idx !== "") {
      const selected = staffOptions[idx];
      setNewStaffName(selected?.name || "");
      setNewStaffCharge(selected?.charge || "");
    } else {
      setNewStaffName("");
      setNewStaffCharge("");
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newFlavor.trim() || !newQuantity || !newRate) return;

    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        flavor: newFlavor.trim(),
        size: newSize,
        quantity: parseInt(newQuantity, 10),
        rate: parseFloat(newRate),
      },
    ]);

    setNewFlavor("");
    setSelectedFlavorIndex("");
    setNewQuantity("");
    setNewRate("");
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffCharge) return;

    setAssignedStaff((prevStaff) => [
      ...prevStaff,
      {
        id: Date.now(),
        name: newStaffName.trim(),
        charge: parseFloat(newStaffCharge),
      },
    ]);

    setNewStaffName("");
    setSelectedStaffIndex("");
    setNewStaffCharge("");
  };

  const handleDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleDeleteStaff = (id) => {
    setAssignedStaff((prevStaff) =>
      prevStaff.filter((staff) => staff.id !== id)
    );
  };

  const iceCreamTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  }, [items]);

  const totalStaffCharges = useMemo(() => {
    return assignedStaff.reduce((sum, s) => sum + s.charge, 0);
  }, [assignedStaff]);

  const grandTotal = useMemo(() => {
    return (
      iceCreamTotal + totalStaffCharges + parseFloat(transportCharges || 0)
    );
  }, [iceCreamTotal, totalStaffCharges, transportCharges]);

  const remainingAmount = useMemo(() => {
    return grandTotal - parseFloat(paidAmount || 0);
  }, [grandTotal, paidAmount]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSaveAndDownload = async () => {
    if (!partyName.trim()) {
      alert("Please enter Customer Name.");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one Ice Cream flavor.");
      return;
    }

    setIsGenerating(true);

    try {
      const billData = {
        invoiceNo,
        generatedOn,
        venue: venue.trim(),
        eventDate,
        partyName: partyName.trim(),
        mobile: mobile.trim(),
        items: items.map((item) => ({
          flavor: item.flavor,
          size: item.size,
          quantity: item.quantity,
          rate: item.rate,
          total: item.quantity * item.rate,
        })),
        assignedStaff: assignedStaff.map((staff) => ({
          name: staff.name,
          charge: staff.charge,
        })),
        iceCreamTotal,
        totalStaffCharges,
        transportCharges: Number(transportCharges),
        grandTotal,
        paidAmount: Number(paidAmount),
        remainingAmount,
        totalAmount: grandTotal,
      };

      const response = await fetch(`${API_URL}/bills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(billData),
      });

      let databaseSavedStatus = true;
      if (!response || !response.ok) {
        databaseSavedStatus = false;
        console.warn(
          "Database save pipeline returned an error, processing client local download fallback."
        );
      }

      const element = invoiceRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      pdf.save(`Invoice-${invoiceNo}.pdf`);

      if (databaseSavedStatus) {
        alert("Bill Saved to Server & PDF Downloaded!");
      } else {
        alert(
          "PDF Invoice Downloaded Successfully! (Server data offline, please check backend connection)"
        );
      }

      setPartyName("");
      setMobile("");
      setVenue("");
      setSelectedCateringId("");
      setItems([]);
      setAssignedStaff([]);
      setPaidAmount(0);
      setTransportCharges(0);

      initializeBillingData();
    } catch (error) {
      console.error(error);
      alert(
        "Error handled: Processing direct local fallback invoice download."
      );

      try {
        const element = invoiceRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
        pdf.save(`Invoice-${invoiceNo}-Local.pdf`);
        alert("Invoice Printed and Saved locally!");
      } catch (pdfError) {
        alert(
          "PDF printing failed. Please check application layouts or refresh."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800&family=Yantramanav:wght@500;700;900&display=swap"
        rel="stylesheet"
      />

      <div>
        <div className="p-3 p-md-4 mb-4 ">
          <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center text-white p-3 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #CA2D2A 0%, #F6643E 100%)",
              }}
            >
              <FaFileInvoiceDollar size={24} />
            </div>
            <div>
              <h4
                className="fw-bold m-0 text-dark"
                style={{ letterSpacing: "-0.5px" }}
              >
                Create Bill
              </h4>
              <p className="text-muted small m-0 fw-medium">
                BIG-BOSS ICE CREAM
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold text-uppercase tracking-wider text-secondary small mb-3">
              Step 1: Basic Information
            </h6>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label text-muted small fw-medium mb-1">
                  Bill Number
                </label>
                <input
                  type="text"
                  className="form-control rounded-3 py-2 fw-bold text-danger bg-light border-0"
                  value={invoiceNo}
                  disabled
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label text-muted small fw-medium mb-1">
                  Billing Date
                </label>
                <input
                  type="date"
                  className="form-control rounded-3 py-2 border-light-subtle bg-light"
                  value={generatedOn}
                  onChange={(e) => setGeneratedOn(e.target.value)}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label text-muted small fw-medium mb-1">
                  Event Date
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-light-subtle border-end-0 rounded-start-3">
                    <FaCalendarAlt color="#64748b" size={14} />
                  </span>
                  <input
                    type="date"
                    className="form-control rounded-end-3 py-2 border-light-subtle bg-light border-start-0"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label text-muted small fw-medium mb-1">
                  Event Place (Venue)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-light-subtle border-end-0 rounded-start-3">
                    <FaMapMarkerAlt color="#64748b" size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-control rounded-end-3 py-2 border-light-subtle bg-light border-start-0"
                    placeholder="Where is the event?"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  />
                </div>
              </div>

              
              <div className="col-12">
                <label className="form-label text-muted small fw-medium mb-1">
                  Select Catering Name (If saved in list)
                </label>
                <select
                  className="form-select rounded-3 py-2 text-dark bg-light border-light-subtle"
                  value={selectedCateringId}
                  onChange={handleCateringChange}
                >
                  <option value="">-- Click to choose from list --</option>
                  {cateringOptions.map((item) => (
                    <option
                      key={item.id || item._id}
                      value={item.id || item._id}
                    >
                      {item.catering || item.name} (
                      {item.owner || "No Owner Name"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-muted small fw-medium mb-1">
                  Party Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-light-subtle border-end-0 rounded-start-3">
                    <FaUser color="#64748b" size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-control rounded-end-3 py-2 border-light-subtle bg-light border-start-0"
                    placeholder="Type customer full name"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label text-muted small fw-medium mb-1">
                  Mobile Number
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-light-subtle border-end-0 rounded-start-3">
                    <FaPhoneAlt color="#64748b" size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-control rounded-end-3 py-2 border-light-subtle bg-light border-start-0"
                    placeholder="Type 10 digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          
          <div className="row g-4 mb-4">
            
            <div className="col-12 col-xl-7">
              <div className="p-3 rounded-4 bg-light border border-light-subtle h-100">
                <h6 className="fw-bold text-danger mb-3">
                  Step 2: Add Ice Cream Items
                </h6>

                <div className="mb-3">
                  <select
                    className="form-select rounded-3 py-2 text-dark border-light-subtle bg-white"
                    value={selectedFlavorIndex}
                    onChange={handleFlavorChange}
                  >
                    <option value="">
                      -- Choose Ice Cream Flavor from List --
                    </option>
                    {flavorOptions.map((item, index) => (
                      <option key={item.id || item._id} value={index}>
                        {item.flavor} (₹{item.rate})
                      </option>
                    ))}
                  </select>
                </div>

                <form
                  onSubmit={handleAddItem}
                  className="row g-2 align-items-end"
                >
                  <div className="col-12 col-sm-4">
                    <label className="form-label text-muted small mb-1">
                      Or Type Custom Flavor
                    </label>
                    <input
                      type="text"
                      className="form-control py-2 rounded-3 border-light-subtle bg-white"
                      placeholder="Custom flavor name"
                      value={newFlavor}
                      onChange={(e) => setNewFlavor(e.target.value)}
                    />
                  </div>
                  <div className="col-4 col-sm-3">
                    <label className="form-label text-muted small mb-1">
                      Box / Pack Size
                    </label>
                    <select
                      className="form-select py-2 rounded-3 border-light-subtle bg-white fw-bold"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                    >
                      <option value="4L">4L Box</option>
                      <option value="1L">1L Pack</option>
                      <option value="Scoop">Scoop Base</option>
                    </select>
                  </div>
                  <div className="col-4 col-sm-2">
                    <label className="form-label text-muted small mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="form-control py-2 rounded-3 border-light-subtle bg-white text-center fw-bold"
                      placeholder="How many?"
                      min="1"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                    />
                  </div>
                  <div className="col-4 col-sm-2">
                    <label className="form-label text-muted small mb-1">
                      Rate (Price)
                    </label>
                    <input
                      type="number"
                      className="form-control py-2 rounded-3 border-light-subtle bg-white text-center fw-bold"
                      placeholder="₹ Price"
                      min="0"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-sm-1">
                    <button
                      type="submit"
                      className="btn btn-danger py-2 w-100 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ height: "42px" }}
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                </form>

               
                <div
                  className="table-responsive mt-3 rounded-3 bg-white"
                  style={{ maxHeight: "200px", border: "1px solid #e2e8f0" }}
                >
                  <table className="table table-hover table-sm align-middle m-0 text-center text-nowrap small">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-start ps-3 py-2">Added Flavor</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>Price Unit</th>
                        <th>Total</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-4 text-muted text-center"
                          >
                            No ice cream added to bill yet.
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
                          <tr key={item.id}>
                            <td className="text-start ps-3 fw-bold text-dark">
                              {item.flavor}
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border px-2 py-1">
                                {item.size}
                              </span>
                            </td>
                            <td className="fw-semibold">{item.quantity}</td>
                            <td>₹{item.rate}</td>
                            <td className="fw-bold text-danger">
                              ₹{item.quantity * item.rate}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm text-danger p-0 border-0"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <FaTrash size={12} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

         
            <div className="col-12 col-xl-5">
              <div className="p-3 rounded-4 bg-light border border-light-subtle h-100">
                <h6 className="fw-bold text-secondary mb-3">
                  Step 3: Add Staff (Workers)
                </h6>

                <div className="mb-3">
                  <select
                    className="form-select rounded-3 py-2 text-dark border-light-subtle bg-white"
                    value={selectedStaffIndex}
                    onChange={handleStaffChange}
                  >
                    <option value="">-- Choose Staff from List --</option>
                    {staffOptions.map((item, index) => (
                      <option key={item.id || item._id} value={index}>
                        {item.name} (₹{item.charge})
                      </option>
                    ))}
                  </select>
                </div>

                <form
                  onSubmit={handleAddStaff}
                  className="row g-2 align-items-end"
                >
                  <div className="col-7">
                    <label className="form-label text-muted small mb-1">
                      Or Type Staff Name
                    </label>
                    <input
                      type="text"
                      className="form-control py-2 rounded-3 border-light-subtle bg-white"
                      placeholder="Worker full name"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                    />
                  </div>
                  <div className="col-3">
                    <label className="form-label text-muted small mb-1">
                      Wage / Cost
                    </label>
                    <input
                      type="number"
                      className="form-control py-2 rounded-3 border-light-subtle bg-white text-center fw-bold"
                      placeholder="₹ Amount"
                      min="0"
                      value={newStaffCharge}
                      onChange={(e) => setNewStaffCharge(e.target.value)}
                    />
                  </div>
                  <div className="col-2">
                    <button
                      type="submit"
                      className="btn btn-secondary py-2 w-100 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ height: "42px" }}
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                </form>

               
                <div
                  className="table-responsive mt-3 rounded-3 bg-white"
                  style={{ maxHeight: "200px", border: "1px solid #e2e8f0" }}
                >
                  <table className="table table-hover table-sm align-middle m-0 text-center text-nowrap small">
                    <thead className="table-secondary">
                      <tr>
                        <th className="text-start ps-3 py-2">Worker Name</th>
                        <th>Charge</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedStaff.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-4 text-muted text-center"
                          >
                            No staff added to bill yet.
                          </td>
                        </tr>
                      ) : (
                        assignedStaff.map((staff) => (
                          <tr key={staff.id}>
                            <td className="text-start ps-3 fw-bold text-dark">
                              {staff.name}
                            </td>
                            <td className="fw-bold text-dark">
                              ₹{staff.charge}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm text-danger p-0 border-0"
                                onClick={() => handleDeleteStaff(staff.id)}
                              >
                                <FaTrash size={12} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          
          <div
            className="p-3 rounded-4 border mb-4"
            style={{ backgroundColor: "#fafbfc" }}
          >
            <h6 className="fw-bold text-uppercase tracking-wider text-secondary small mb-3">
              Step 4: Charges & Payments
            </h6>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label text-muted small mb-1 fw-semibold">
                  Staff Members Total
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-0 shadow-sm rounded-start-3">
                    <FaUsers color="#475569" />
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-white fw-bold text-dark border-0 shadow-sm rounded-end-3"
                    value={`₹${totalStaffCharges}`}
                    disabled
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label text-muted small mb-1 fw-semibold">
                  Gadi Bhada / Transport (₹)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-0 shadow-sm rounded-start-3">
                    <FaTruck color="#475569" />
                  </span>
                  <input
                    type="number"
                    className="form-control form-control-lg fw-bold text-dark border-0 shadow-sm rounded-end-3"
                    min="0"
                    value={transportCharges}
                    onChange={(e) =>
                      setTransportCharges(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label text-muted small mb-1 fw-semibold">
                  Advance Received (₹)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-0 shadow-sm rounded-start-3 text-success fw-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    className="form-control form-control-lg fw-bold text-success border-0 shadow-sm rounded-end-3"
                    min="0"
                    value={paidAmount}
                    onChange={(e) =>
                      setPaidAmount(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label text-muted small mb-1 fw-semibold">
                  Remaining Due Balance
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-0 shadow-sm rounded-start-3 text-danger fw-bold">
                    ₹
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-white fw-extrabold text-danger border-0 shadow-sm rounded-end-3"
                    value={`${remainingAmount}`}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

       
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                onClick={handleSaveAndDownload}
                disabled={isGenerating}
                className="btn text-white fw-bold w-100 py-3 shadow transaction-execution-btn rounded-3"
                style={{
                  background:
                    "linear-gradient(135deg, #CA2D2A 0%, #F6643E 100%)",
                  border: "none",
                  fontSize: "18px",
                  letterSpacing: "0.3px",
                  transition: "all 0.2s ease",
                }}
              >
                <FaDownload className="me-2" size={16} />
                {isGenerating
                  ? "Please wait!"
                  : "Save Bill"}
              </button>
            </div>
          </div>
        </div>

        
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            zIndex: -9999,
            pointerEvents: "none",
          }}
        >
          <div
            ref={invoiceRef}
            style={{
              width: "794px",
              height: "1123px",
              backgroundColor: "#ffffff",
              fontFamily: "'Jost', sans-serif",
              boxSizing: "border-box",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              padding: "45px 50px",
              position: "relative",
            }}
          >
          
            <div
              style={{
                position: "absolute",
                top: "52%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-30deg)",
                fontSize: "76px",
                fontWeight: 900,
                color: "#CA2D2A",
                opacity: 0.035,
                whiteSpace: "nowrap",
                zIndex: 0,
                letterSpacing: "4px",
              }}
            >
              BIG-BOSS ICE CREAM
            </div>

          
            <div
              style={{
                borderBottom: "2px dashed #CA2D2A",
                paddingBottom: "18px",
                marginBottom: "22px",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <h1
                    style={{
                      color: "#CA2D2A",
                      fontSize: "38px",
                      fontWeight: 800,
                      letterSpacing: "0.2px",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    BIG-BOSS ICE CREAM
                  </h1>
                  <p
                    style={{
                      color: "#334155",
                      fontSize: "14px",
                      fontWeight: 700,
                      margin: "6px 0 0 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Premium Event Ice Cream Catering Services
                  </p>
                  <p
                    style={{
                      color: "#475569",
                      fontSize: "12px",
                      margin: "4px 0 0 0",
                      fontWeight: 500,
                    }}
                  >
                    Kolhapur, Maharashtra &nbsp;|&nbsp; Mobile: 9881876173
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, #CA2D2A 0%, #F6643E 100%)",
                      color: "#ffffff",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      display: "inline-block",
                      marginBottom: "6px",
                    }}
                  >
                    INVOICE
                  </span>
                  <div
                    style={{
                      color: "#0F172A",
                      fontSize: "16px",
                      fontWeight: 800,
                    }}
                  >
                    No. {invoiceNo}
                  </div>
                  <div
                    style={{
                      color: "#475569",
                      fontSize: "12px",
                      fontWeight: 600,
                      marginTop: "2px",
                    }}
                  >
                    Date: {formatDate(generatedOn)}
                  </div>
                </div>
              </div>
            </div>

          
            <div
              style={{
                backgroundColor: "#FCFDFD",
                borderRadius: "6px",
                border: "1px solid #E2E8F0",
                padding: "14px 18px",
                marginBottom: "20px",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  color: "#CA2D2A",
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: "10px",
                  borderBottom: "1px solid #E2E8F0",
                  paddingBottom: "4px",
                }}
              >
                Party Details
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  rowGap: "8px",
                  columnGap: "40px",
                }}
              >
                <div style={{ display: "flex", fontSize: "12.5px" }}>
                  <span
                    style={{
                      color: "#64748B",
                      width: "110px",
                      fontWeight: 600,
                    }}
                  >
                    Party Name:
                  </span>
                  <strong style={{ color: "#0F172A" }}>
                    {partyName || "—"}
                  </strong>
                </div>
                <div style={{ display: "flex", fontSize: "12.5px" }}>
                  <span
                    style={{
                      color: "#64748B",
                      width: "110px",
                      fontWeight: 600,
                    }}
                  >
                     Bill  Date:
                  </span>
                  <strong style={{ color: "#0F172A" }}>
                    {formatDate(eventDate)}
                  </strong>
                </div>
                <div style={{ display: "flex", fontSize: "12.5px" }}>
                  <span
                    style={{
                      color: "#64748B",
                      width: "110px",
                      fontWeight: 600,
                    }}
                  >
                    Mobile Number:
                  </span>
                  <strong style={{ color: "#0F172A" }}>{mobile || "—"}</strong>
                </div>
                <div style={{ display: "flex", fontSize: "12.5px" }}>
                  <span
                    style={{
                      color: "#64748B",
                      width: "110px",
                      fontWeight: 600,
                    }}
                  >
                    Event Venue Site:
                  </span>
                  <strong style={{ color: "#0F172A" }}>{venue || "—"}</strong>
                </div>
              </div>
            </div>

        
            <div
              style={{
                background: "#ffffff",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                overflow: "hidden",
                marginBottom: "20px",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  background: "#0F172A",
                  color: "#ffffff",
                  padding: "8px 14px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                }}
              >
                1. Ice Cream Section
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: "#F3F4F6",
                      borderBottom: "1.5px solid #D1D5DB",
                    }}
                  >
                    <th
                      style={{
                        padding: "8px 14px",
                        textAlign: "left",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: "11px",
                        textTransform: "uppercase",
                      }}
                    >
                      Flavor Specification
                    </th>
                    <th
                      style={{
                        padding: "8px 14px",
                        textAlign: "center",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        width: "90px",
                      }}
                    >
                      Size
                    </th>
                    <th
                      style={{
                        padding: "8px 14px",
                        textAlign: "center",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        width: "80px",
                      }}
                    >
                      Quantity
                    </th>
                    <th
                      style={{
                        padding: "8px 14px",
                        textAlign: "center",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        width: "100px",
                      }}
                    >
                      Rate Unit
                    </th>
                    <th
                      style={{
                        padding: "8px 14px",
                        textAlign: "right",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        width: "120px",
                      }}
                    >
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          color: "#9CA3AF",
                          fontSize: "12px",
                        }}
                      >
                        No ice cream configurations assigned to manifest canvas
                        grid.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr
                        key={item.id}
                        style={{
                          background: idx % 2 === 0 ? "#ffffff" : "#FBFBFB",
                          borderBottom: "1px solid #E5E7EB",
                        }}
                      >
                        <td
                          style={{
                            padding: "9px 14px",
                            color: "#111827",
                            fontWeight: 700,
                            fontSize: "12px",
                          }}
                        >
                          {item.flavor}
                        </td>
                        <td
                          style={{ padding: "9px 14px", textAlign: "center" }}
                        >
                          <span
                            style={{
                              background: "#E5E7EB",
                              color: "#1F2937",
                              borderRadius: "3px",
                              padding: "2px 6px",
                              fontSize: "10px",
                              fontWeight: 700,
                            }}
                          >
                            {item.size}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            textAlign: "center",
                            color: "#374151",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          {item.quantity}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            textAlign: "center",
                            color: "#374151",
                            fontSize: "12px",
                          }}
                        >
                          ₹{item.rate}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            textAlign: "right",
                            color: "#111827",
                            fontWeight: 700,
                            fontSize: "12.5px",
                          }}
                        >
                          ₹{item.quantity * item.rate}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            
            <div
              style={{
                background: "#ffffff",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                overflow: "hidden",
                marginBottom: "20px",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  background: "#4B5563",
                  color: "#ffffff",
                  padding: "8px 14px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                }}
              >
                2. Staff Section
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: "#F3F4F6",
                      borderBottom: "1.5px solid #D1D5DB",
                    }}
                  >
                    <th
                      style={{
                        padding: "8px 14px",
                        textAlign: "left",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: "11px",
                        textTransform: "uppercase",
                      }}
                    >
                      Staff Name
                    </th>
                    <th
                      style={{
                        padding: "8px 14px",
                        textAlign: "right",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        width: "150px",
                      }}
                    >
                      Staff Charges
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assignedStaff.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          padding: "14px",
                          textAlign: "center",
                          color: "#9CA3AF",
                          fontSize: "12px",
                        }}
                      >
                        No logistics manpower personnel assigned to terminal
                        profile.
                      </td>
                    </tr>
                  ) : (
                    assignedStaff.map((staff, idx) => (
                      <tr
                        key={staff.id}
                        style={{
                          background: idx % 2 === 0 ? "#ffffff" : "#FBFBFB",
                          borderBottom: "1px solid #E5E7EB",
                        }}
                      >
                        <td
                          style={{
                            padding: "8px 14px",
                            color: "#111827",
                            fontWeight: 600,
                            fontSize: "12px",
                          }}
                        >
                          {staff.name}
                        </td>
                        <td
                          style={{
                            padding: "8px 14px",
                            textAlign: "right",
                            color: "#374151",
                            fontWeight: 700,
                            fontSize: "12px",
                          }}
                        >
                          ₹{staff.charge}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

         
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "30px",
                marginTop: "auto",
                paddingBottom: "15px",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    borderLeft: "3px solid #CA2D2A",
                    paddingLeft: "12px",
                    color: "#4B5563",
                    fontSize: "11px",
                    lineHeight: 1.5,
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  Note: Please review item parameters and batch distributions
                  carefully before transaction settlement. The totals outlined
                  are binding financial values.
                </div>
              </div>

              <div
                style={{
                  width: "310px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#374151",
                  }}
                >
                  <span>Ice Cream Products Net:</span>
                  <span style={{ fontWeight: 700, color: "#111827" }}>
                    ₹{iceCreamTotal}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#374151",
                  }}
                >
                  <span>Personnel Staff Payroll Net:</span>
                  <span style={{ fontWeight: 700, color: "#111827" }}>
                    ₹{totalStaffCharges}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#374151",
                  }}
                >
                  <span>Transport Logistics Fee:</span>
                  <span style={{ fontWeight: 700, color: "#111827" }}>
                    ₹{transportCharges}
                  </span>
                </div>

                <div
                  style={{ borderTop: "1px solid #E5E7EB", my: "2px" }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#374151",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Total Amount:</span>
                  <span style={{ fontWeight: 700, color: "#111827" }}>
                    ₹{grandTotal}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#059669",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Paid Amount:</span>
                  <span style={{ fontWeight: 700 }}>₹{paidAmount}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#DC2626",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>Remaining Amount:</span>
                  <span style={{ fontWeight: 800 }}>₹{remainingAmount}</span>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #CA2D2A 0%, #F6643E 100%)",
                    borderRadius: "5px",
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      letterSpacing: "0.2px",
                    }}
                  >
                    GRAND TOTAL NET:
                  </span>
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "22px",
                      fontWeight: 900,
                    }}
                  >
                    ₹{grandTotal}
                  </span>
                </div>
              </div>
            </div>

           
            <div
              style={{
                borderTop: "2px dashed #D1D5DB",
                paddingTop: "14px",
                textAlign: "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontFamily: "'Yantramanav', sans-serif",
                  color: "#CA2D2A",
                  fontSize: "19px",
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginBottom: "8px",
                  letterSpacing: "0.2px",
                }}
              >
                हर खुशी को बनाएं और भी खास, हर महफिल की बढ़ाएं शान,
                <br />
                बिग-बॉस आइसक्रीम है आपके साथ!
              </div>
              <div
                style={{
                  color: "#111827",
                  fontWeight: 800,
                  fontSize: "14px",
                  letterSpacing: "0.5px",
                }}
              >
                FIROJ ATAPADE
              </div>

              <div
                style={{
                  color: "#9CA3AF",
                  fontSize: "10px",
                  fontWeight: 700,
                  marginTop: "6px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Thank You For Choosing Premium Services of Big-Boss Ice Cream
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .main-bill-wrapper { font-family: "Jost", sans-serif; }
        .form-control, .form-select { border-color: #e2e8f0; font-size: 14px; padding: 10px 12px; transition: all 0.2s ease; }
        .form-control:focus, .form-select:focus { background-color: #ffffff !important; border-color: #CA2D2A !important; box-shadow: 0 0 0 4px rgba(202, 45, 42, 0.1) !important; }
        .workflow-panel-main { border: 1px solid #e9ecef; }
        .transaction-execution-btn:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 6px 15px rgba(202, 45, 42, 0.2) !important; cursor: pointer; }
        .transaction-execution-btn:active { transform: translateY(0); }
      `}</style>
    </>
  );
};

export default CreateBill;
