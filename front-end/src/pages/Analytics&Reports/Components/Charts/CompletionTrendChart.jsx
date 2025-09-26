// Charts/ModuleAccessChart.js
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../../Styles/Charts.css";

export default function ModuleAccessChart({ data }) {
  
  console.log("📊 ModuleAccessChart received data:", data);

  if (!data || data.length === 0) {
    return (
      <div className="sa02-chart-card">
        <h3>Users Accessed by Course</h3>
        <div className="chart-no-data">
          <p>No access data available</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            (Received {data ? 'empty' : 'no'} data)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sa02-chart-card">
      <h3>Users Accessed by Course</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="course" />
          <YAxis />
          <Tooltip formatter={(value) => [value, "Users Accessed"]} />
          <Bar dataKey="usersAccessed" fill="#4caf50" name="Users Accessed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
