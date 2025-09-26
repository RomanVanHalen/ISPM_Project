import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance"; // Axios instance with JWT
import Navbar from "../../../components/Navbar";
import Footer2 from "../../../components/Footer2";
import "../adminStyles/AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewRole(user.role);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      const res = await api.put(`/admin/users/${editingUser._id}`, {
        role: newRole,
      });
      setUsers(users.map((u) => (u._id === editingUser._id ? res.data.user || res.data : u)));
      setEditingUser(null);
      setNewRole("");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update user.");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setNewRole("");
  };

  return (
    <>
      <Navbar />

      <div className="admin-users-container">
        <h2 className="section-title">Users List</h2>
        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <div className="loading-container">
            <p className="loading-text">Loading users...</p>
          </div>
        ) : (
          <div className="sa02-table">
            <div className="sa02-table-head">
              <h3>User Management</h3>
              <div>Total Users: {users.length}</div>
            </div>

            <div className="sa02-table-scroll">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user._id} className={editingUser?._id === user._id ? "sa02-row-alert" : ""}>
                      <td>{idx + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {editingUser?._id === user._id ? (
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            style={{
                              padding: "4px 8px",
                              border: "1px solid #598268",
                              borderRadius: "4px",
                              backgroundColor: "#f8fcf9",
                              color: "#333"
                            }}
                          >
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                          </select>
                        ) : (
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              backgroundColor: user.role === "admin" ? "#22c55e" : "#3b82f6",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}
                          >
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td>
                        {editingUser?._id === user._id ? (
                          <>
                            <button
                              className="save-btn"
                              onClick={handleSave}
                              style={{
                                padding: "6px 12px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor: "#22c55e",
                                color: "white",
                                cursor: "pointer",
                                marginRight: "8px",
                                fontSize: "12px",
                                fontWeight: "600"
                              }}
                            >
                              Save
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={handleCancel}
                              style={{
                                padding: "6px 12px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor: "#9e9e9e",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "600"
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(user)}
                              style={{
                                padding: "6px 12px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor: "#22c55e",
                                color: "white",
                                cursor: "pointer",
                                marginRight: "8px",
                                fontSize: "12px",
                                fontWeight: "600"
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(user._id)}
                              style={{
                                padding: "6px 12px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor: "#ef5350",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "600"
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer2 />
    </>
  );
}

export default AdminUsers;
