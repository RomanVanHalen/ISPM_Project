import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import api from "../../../api/axiosInstance";
import "../adminStyles/AdminCharts.css";

const COLORS = ["#22c55e", "#16a34a"];

const AdminCharts = () => {
  const [userData, setUserData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  // Fetch line chart data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/user-stats");
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user stats:", err.response?.data || err.message);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch pie chart data
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/admin/role-stats");
        setRoleData(res.data);
      } catch (err) {
        console.error("Error fetching role stats:", err.response?.data || err.message);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="adminChartsWrapper">
      {/* Line Chart */}
      <div className="chartContainer">
        <h3>Registered Users Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e0f2f1" strokeDasharray="5 5" />
            <XAxis dataKey="date" tick={{ fill: "#4caf50" }} />
            <YAxis tick={{ fill: "#4caf50" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#lineGradient)"
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="chartContainer">
        <h3>Employees vs Admins</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={roleData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150} // bigger radius
              label
            >
              {roleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminCharts;
