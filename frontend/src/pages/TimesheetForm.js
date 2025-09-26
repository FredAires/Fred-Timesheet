import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TimesheetForm() {
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [week1Hours, setWeek1Hours] = useState("");
  const [week2Hours, setWeek2Hours] = useState("");
  const [client, setClient] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");

  const navigate = useNavigate();

  // Load available sheets (periods) from backend
  useEffect(() => {
    fetch("http://localhost:3001/periods")
      .then((res) => res.json())
      .then((data) => {
        console.log("Periods response:", data); // 👀 check here
        setPeriods(data);
      })
      .catch((err) => console.error("Error loading periods", err));
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPeriod || !client || !state) {
      alert("Please fill in all fields and select a period");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("No email found — please log in first");
      navigate("/");
      return;
    }

    try {
      // Submit Week 1
      if (week1Hours) {
        await fetch("http://localhost:3001/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            client,
            state,
            period: selectedPeriod, // sheet name!
            week: "W1",
            hours: Number(week1Hours),
            notes,
          }),
        });
      }

      // Submit Week 2
      if (week2Hours) {
        await fetch("http://localhost:3001/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            client,
            state,
            period: selectedPeriod, // sheet name!
            week: "W2",
            hours: Number(week2Hours),
            notes,
          }),
        });
      }

      // Navigate to review
      navigate("/review", {
        state: {
          period: selectedPeriod,
          client,
          state,
          week1Hours,
          week2Hours,
          notes,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Error submitting timesheet");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      <div className="h-1/3 flex items-center justify-center">
        <img src="/logo.png" alt="Company Logo" className="h-40 mx-auto" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-16 max-w-md w-full bg-white p-6 rounded-lg shadow-2xl"
      >
        <h1
          className="text-2xl font-bold mb-4 text-center"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Timesheet Submission
        </h1>

        {/* Period dropdown from sheet names */}
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Period</option>
          {periods.map((p, idx) => (
            <option key={idx} value={p}>
              {p}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Week 1 Hours"
          value={week1Hours}
          onChange={(e) => setWeek1Hours(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Week 2 Hours"
          value={week2Hours}
          onChange={(e) => setWeek2Hours(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Review Before Submit
        </button>
      </form>
    </div>
  );
}

export default TimesheetForm;
