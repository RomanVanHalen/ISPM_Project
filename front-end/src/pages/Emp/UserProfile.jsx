import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

export default function UserProfile({ onClose }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null); // store File object
  const [previewPic, setPreviewPic] = useState(null); // for preview
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // JWT token

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
        setPreviewPic(res.data.profilePic || null); // backend image URL
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Handle profile picture selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file); // actual file to send
      setPreviewPic(URL.createObjectURL(file)); // preview
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (password) formData.append("password", password); // only if entered
    if (profilePic) formData.append("profilePic", profilePic); // actual file

    try {
      await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully ✅");
      setPassword(""); // clear password
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Try again.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="anya-user-profile-page">
      <div className="anya-profile-header">
        <h2>Edit Profile</h2>
        <button className="anya-back-btn" onClick={onClose}>
          ⬅ Back
        </button>
      </div>

      <form className="anya-profile-form" onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="anya-profile-pic-section">
          <img
            src={previewPic || "https://via.placeholder.com/120"}
            alt="Profile"
            className="anya-profile-pic"
          />
          <label className="anya-upload-btn">
            Upload Picture
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        </div>

        {/* Username */}
        <div className="anya-form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="anya-form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="anya-form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        {/* Save Button */}
        <button type="submit" className="anya-save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}

