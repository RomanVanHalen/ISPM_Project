import React, { useEffect, useState } from "react";

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome back, {user.name || user.username}! 👨‍💻</h1>

      {user.profilePic && (
        <img
          src={user.profilePic}
          alt={`${user.name || user.username}'s profile`}
          style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", marginBottom: 20 }}
        />
      )}

      <section>
        <h2>Your Tasks</h2>
        <ul>
          <li>✔ Complete security training module 1</li>
          <li>✔ Submit weekly report</li>
          <li>✔ Update profile settings</li>
        </ul>
      </section>

      <section>
        <h2>Progress Tracker</h2>
        <p>Your progress will be displayed here soon!</p>
        {/* You can add a progress bar or charts later */}
      </section>
    </div>
  );
};

export default EmployeeDashboard;
