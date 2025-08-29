// src/components/reporting/ExportButtons.jsx
import React from "react";
import "../Styles/ExportButtons.css";

export default function ExportButtons({ exportCSV, exportPDF }) {
  return (
    <div className="sa02-actions">
      <button className="sa02-btn" onClick={exportCSV} title="Export visible data to CSV">Export CSV</button>
      <button className="sa02-btn sa02-btn-primary" onClick={exportPDF} title="Export report to PDF">Export PDF</button>
    </div>
  );
}
