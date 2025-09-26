import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import TimesheetForm from "./pages/TimesheetForm";
import Review from "./pages/Review";
import Confirmation from "./pages/Confirmation";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login first */}
        <Route path="/" element={<Login />} />

        {/* Timesheet form */}
        <Route path="/timesheet" element={<TimesheetForm />} />

        {/* Review submission */}
        <Route path="/review" element={<Review />} />

        {/* Final confirmation */}
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
