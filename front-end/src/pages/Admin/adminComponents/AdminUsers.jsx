import { useEffect, useState } from "react";
import axios from "axios";
import "../adminStyles/AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // store user being edited
  const [newRole, setNewRole] = useState(""); // new role selected

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewRole(user.role); // prefill current role
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      const res = await axios.put(`/api/admin/users/${editingUser._id}`, {
        role: newRole,
      });
      setUsers(users.map((u) => (u._id === editingUser._id ? res.data : u)));
      setEditingUser(null);
      setNewRole("");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user.");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setNewRole("");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <h2 className="section-title">Users List</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th> {/* new column for buttons */}
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user._id}>
              <td>{idx + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {editingUser?._id === user._id ? (
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUser?._id === user._id ? (
                  <>
                    <button className="save-btn" onClick={handleSave}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user._id)}>
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
  );
}

export default AdminUsers;
