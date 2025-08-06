import { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  Users,
  UserCheck,
  Calendar,
  Mail,
  Shield,
  Edit,
  X,
  Save,
} from "lucide-react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Open edit modal
  const handleUpdate = async (id) => {
    const user = users.find((u) => u._id === id);
    if (user) {
      setEditingUser(user);
      setEditFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
      setShowEditModal(true);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save updated user
  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const { data } = await axios.put(
        `/api/admin/users/${editingUser._id}`,
        editFormData
      );

      // Update the users list with the updated user from backend
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? data : user
        )
      );

      // Close modal and reset form
      setShowEditModal(false);
      setEditingUser(null);
      setEditFormData({ name: "", email: "", role: "" });

      console.log("User updated successfully");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user. Please try again.");
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({ name: "", email: "", role: "" });
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "role-admin";
      case "moderator":
        return "role-moderator";
      default:
        return "role-user";
    }
  };

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Shield className="role-icon" />;
      case "moderator":
        return <UserCheck className="role-icon" />;
      default:
        return <Users className="role-icon" />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">
              <Users className="header-icon-svg" />
            </div>
            <div>
              <h1 className="dashboard-title">Admin Dashboard</h1>
              <p className="dashboard-subtitle">
                Manage your users and system settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{users.length}</p>
              </div>
              <div className="stat-icon-container stat-icon-primary">
                <Users className="stat-icon" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Admins</p>
                <p className="stat-value">
                  {users.filter((u) => u.role.toLowerCase() === "admin").length}
                </p>
              </div>
              <div className="stat-icon-container stat-icon-admin">
                <Shield className="stat-icon" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Regular Users</p>
                <p className="stat-value">
                  {users.filter((u) => u.role.toLowerCase() === "user").length}
                </p>
              </div>
              <div className="stat-icon-container stat-icon-user">
                <UserCheck className="stat-icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">
              <Users className="table-title-icon" />
              <span>User Management</span>
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-state-icon" />
              <p className="empty-state-title">No users found</p>
              <p className="empty-state-subtitle">
                Users will appear here once they're added to the system
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr className="table-head-row">
                    <th className="table-head-cell">User ID</th>
                    <th className="table-head-cell">Name</th>
                    <th className="table-head-cell">Email</th>
                    <th className="table-head-cell">Role</th>
                    <th className="table-head-cell">Created</th>
                    <th className="table-head-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {users.map((user) => (
                    <tr key={user._id} className="table-row">
                      <td className="table-cell">
                        <span className="user-id">
                          {user._id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="user-info">
                          <div className="user-avatar">
                            <span className="user-initials">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="user-name">{user.name}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="user-email">
                          <Mail className="email-icon" />
                          <span className="email-text">{user.email}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span
                          className={`role-badge ${getRoleColor(user.role)}`}
                        >
                          {getRoleIcon(user.role)}
                          <span>{user.role}</span>
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="created-date">
                          <Calendar className="date-icon" />
                          <span className="date-text">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="action-buttons">
                          <button
                            onClick={() => handleUpdate(user._id)}
                            className="update-button"
                          >
                            <Edit className="update-icon" />
                            <span className="update-text">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="delete-button"
                          >
                            <Trash2 className="delete-icon" />
                            <span className="delete-text">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Edit User</h3>
              <button
                onClick={handleCloseModal}
                className="modal-close-button"
              >
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter user name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter user email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select a role</option>
                  <option value="User">User</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleCloseModal} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleSaveUser} className="save-button">
                <Save className="save-icon" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
