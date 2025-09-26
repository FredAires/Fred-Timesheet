import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Review() {
  const [timesheet, setTimesheet] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Passed from TimesheetForm
  const { period } = location.state || {};
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email || !period) return;

    setLoading(true);

    fetch(
      `http://localhost:3001/timesheet?email=${encodeURIComponent(
        email
      )}&period=${encodeURIComponent(period)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTimesheet(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching timesheet:", err);
        setLoading(false);
      });
  }, [email, period]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading timesheet...</p>
      </div>
    );
  }

  if (!timesheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No timesheet found for this period.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      <div className="h-1/3 flex items-center justify-center">
        <img src="/logo.png" alt="Company Logo" className="h-40 mx-auto" />
      </div>
      <div className="mt-16 max-w-md w-full bg-white p-6 rounded-lg shadow-2xl">
        <h1
          className="text-2xl font-bold mb-4 text-center"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Review Timesheet
        </h1>

        <p>
          <strong>Email:</strong> {timesheet.email}
        </p>
        <p>
          <strong>Client:</strong> {timesheet.client}
        </p>
        <p>
          <strong>State:</strong> {timesheet.state}
        </p>
        <p>
          <strong>Period (Sheet):</strong> {timesheet.period}
        </p>
        <p>
          <strong>Week 1 Hours:</strong> {timesheet.w1}
        </p>
        <p>
          <strong>Week 2 Hours:</strong> {timesheet.w2}
        </p>
        <p>
          <strong>Notes:</strong> {timesheet.notes}
        </p>
        <p>
          <strong>Total Hours:</strong> {timesheet.total}
        </p>

        <button
  onClick={() =>
    navigate("/confirmation", {
      state: {
        period: timesheet.period,
        w1: timesheet.w1,
        w2: timesheet.w2,
        total: timesheet.total,
      },
    })
  }
  className="w-full bg-green-600 text-white p-2 rounded mt-4 hover:bg-green-700"
>
  Confirm
</button>

      </div>
    </div>
  );
}

export default Review;
