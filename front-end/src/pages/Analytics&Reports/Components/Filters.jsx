// src/components/reporting/Filters.jsx
import React from "react";
import "../Styles/Filters.css";

export default function Filters({ dateFrom, setDateFrom, dateTo, setDateTo, course, setCourse, reportType, setReportType, courses }) {
  return (
    <section className="sa02-filters">
      <div className="sa02-filter">
        <label>Date from</label>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      </div>
      <div className="sa02-filter">
        <label>Date to</label>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>
      <div className="sa02-filter">
        <label>Course</label>
        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="All">All Courses</option>
          {courses.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="sa02-filter">
        <label>Report preset</label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="management">Management summary</option>
          <option value="audit">Audit detail</option>
        </select>
      </div>
    </section>
  );
}
