import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./Components/AdminLogin";
import DashBoard from "./Components/DashBoard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<AdminLogin />} />

        {/* Dashboard */}
        <Route path="/home" element={<DashBoard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
