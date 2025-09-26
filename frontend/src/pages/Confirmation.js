import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data passed from Review.js
  const { period, w1, w2, total } = location.state || {};

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="h-1/3 flex items-center justify-center">
        <img src="/logo.png" alt="Company Logo" className="h-40 mx-auto" />
      </div>

      <div className="mt-16 max-w-md w-full bg-white p-6 rounded-lg shadow-2xl text-center">
        <h1
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Submission Confirmed
        </h1>

        <p className="mb-2">
          ✅ Your timesheet for period <strong>{period || "Unknown"}</strong> has
          been updated.
        </p>

        <div className="text-left mt-4">
          <p>
            <strong>Week 1 Hours:</strong> {w1 ?? "—"}
          </p>
          <p>
            <strong>Week 2 Hours:</strong> {w2 ?? "—"}
          </p>
          <p className="mt-2">
            <strong>Total Hours:</strong> {total ?? "0"}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 text-white p-2 rounded mt-6 hover:bg-blue-700"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
