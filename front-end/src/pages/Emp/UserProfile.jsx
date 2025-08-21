import React, { useState } from "react";
import "./UserProfile.css";

export default function UserProfile({ onClose }) {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [profilePic, setProfilePic] = useState(null);

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully ✅");
    // Here you can later connect this with backend API to save changes
  };

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
            src={profilePic || "https://via.placeholder.com/120"}
            alt="Profile"
            className="anya-profile-pic"
          />
          <label className="anya-upload-btn">
            Upload Picture
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        </div>

        {/* Name */}
        <div className="anya-form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="anya-form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
