const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ExcelJS = require("exceljs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Path to your Excel file
const FILE_PATH = path.join(__dirname, "Payroll_Copy.xlsx");
console.log("Resolved FILE_PATH:", FILE_PATH);


// Helper: load workbook
async function loadWorkbook() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(FILE_PATH);
  return workbook;
}

app.get("/periods", async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(FILE_PATH);

    const sheetNames = workbook.worksheets.map(ws => ws.name);

    console.log("Sheet names found:", sheetNames); // 👀 log in backend too
    res.json(sheetNames); // ✅ always array
  } catch (err) {
    console.error("Error getting periods:", err);
    res.status(500).json({ error: err.message });
  }
});



// ✅ Submit hours to correct sheet
app.post("/submit", async (req, res) => {
  try {
    const { email, client, state, period, week, hours, notes } = req.body;

    if (!email || !period) {
      return res.status(400).json({ error: "Email and period are required" });
    }

    const workbook = await loadWorkbook();
    const sheet = workbook.getWorksheet(period);

    if (!sheet) {
      return res.status(404).json({ error: `Sheet ${period} not found` });
    }

    // Assume headers are in row 1:
    // Email | W1 | W2 | State | Client | Period | Notes | Total
    const headerMap = {
      email: 1,
      w1: 2,
      w2: 3,
      state: 4,
      client: 5,
      period: 6,
      notes: 7,
      total: 8,
    };

    // Look for existing row
    let row = sheet.findRow(
      sheet._rows.findIndex(r => r && r.getCell(headerMap.email).value === email)
    );

    // If row doesn't exist → add new row
    if (!row) {
      row = sheet.addRow([
        email,
        week === "W1" ? hours : "",
        week === "W2" ? hours : "",
        state || "",
        client || "",
        period,
        notes || "",
        hours || 0,
      ]);
    } else {
      // Update existing row
      if (week === "W1") row.getCell(headerMap.w1).value = hours;
      if (week === "W2") row.getCell(headerMap.w2).value = hours;
      if (state) row.getCell(headerMap.state).value = state;
      if (client) row.getCell(headerMap.client).value = client;
      if (notes) row.getCell(headerMap.notes).value = notes;

      // Recalculate total
      const w1 = Number(row.getCell(headerMap.w1).value) || 0;
      const w2 = Number(row.getCell(headerMap.w2).value) || 0;
      row.getCell(headerMap.total).value = w1 + w2;
    }

    await workbook.xlsx.writeFile(FILE_PATH);

    res.json({ success: true });
  } catch (err) {
    console.error("Error submitting hours:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get timesheet data for review
app.get("/timesheet", async (req, res) => {
  try {
    const { email, period } = req.query;

    if (!email || !period) {
      return res.status(400).json({ error: "email and period required" });
    }

    const workbook = await loadWorkbook();
    const sheet = workbook.getWorksheet(period);

    if (!sheet) {
      return res.status(404).json({ error: `Sheet ${period} not found` });
    }

    const headerMap = {
      email: 1,
      w1: 2,
      w2: 3,
      state: 4,
      client: 5,
      period: 6,
      notes: 7,
      total: 8,
    };

    let foundRow;
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      if (row.getCell(headerMap.email).value === email) {
        foundRow = row;
      }
    });

    if (!foundRow) {
      return res.json(null);
    }

    res.json({
      email: foundRow.getCell(headerMap.email).value,
      w1: foundRow.getCell(headerMap.w1).value || "",
      w2: foundRow.getCell(headerMap.w2).value || "",
      state: foundRow.getCell(headerMap.state).value || "",
      client: foundRow.getCell(headerMap.client).value || "",
      period: foundRow.getCell(headerMap.period).value || period,
      notes: foundRow.getCell(headerMap.notes).value || "",
      total: foundRow.getCell(headerMap.total).value || 0,
    });
  } catch (err) {
    console.error("Error fetching timesheet:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
