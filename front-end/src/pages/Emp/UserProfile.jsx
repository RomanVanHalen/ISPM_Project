import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

export default function UserProfile({ onClose, onProfileUpdate }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [previewPic, setPreviewPic] = useState(null);
  const [file, setFile] = useState(null); // <-- keep raw file here
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiBase = "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
        setPreviewPic(res.data.profilePic || null);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleImageUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      // Show a temporary preview
      const objectUrl = URL.createObjectURL(f);
      setPreviewPic(objectUrl);
    }
  };

  const handleDeletePicture = async () => {
    if (!window.confirm("Remove profile picture?")) return;

    try {
      const res = await axios.put(
        `${apiBase}/api/users/profile`,
        { username, email, removeProfilePicture: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFile(null);
      setPreviewPic(null);
      onProfileUpdate?.({
        username: res.data.username,
        role: res.data.role,
        avatar: res.data.profilePic,
      });
      alert("✅ Profile picture removed");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete profile picture");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (file) {
        // Use FormData when uploading a file
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        if (password) formData.append("password", password);
        formData.append("profilePicture", file);

        res = await axios.put(`${apiBase}/api/users/profile`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // No file -> simple JSON PUT
        res = await axios.put(
          `${apiBase}/api/users/profile`,
          { username, email, password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("✅ Profile updated");
      setPassword("");
      onProfileUpdate?.({
        username: res.data.username,
        role: res.data.role,
        avatar: res.data.profilePic,
      });

      // If server returned a final image URL, lock it in preview
      setPreviewPic(res.data.profilePic || null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="anya-user-profile-page">
      <div className="anya-profile-header">
        <h2>Edit Profile</h2>
        <button className="anya-back-btn" onClick={onClose}>⬅ Back</button>
      </div>

      <form className="anya-profile-form" onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="anya-profile-pic-section">
          <img
            src={previewPic || "https://via.placeholder.com/120"}
            alt="Profile"
            className="anya-profile-pic"
          />
          <div style={{ display: "flex", gap: "8px", marginTop: "0.5rem" }}>
            <label className="anya-upload-btn">
              Upload Picture
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
            {previewPic && (
              <button type="button" className="anya-upload-btn" onClick={handleDeletePicture}>
                Delete Picture
              </button>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="anya-form-group">
          <label>Username:</label>
          <input type="text" value={username}
                 onChange={(e) => setUsername(e.target.value)} required />
        </div>

        {/* Email */}
        <div className="anya-form-group">
          <label>Email:</label>
          <input type="email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {/* Password */}
        <div className="anya-form-group">
          <label>New Password:</label>
          <input type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Enter new password" />
        </div>

        <button type="submit" className="anya-save-btn">Save Changes</button>
      </form>
    </div>
  );
}
