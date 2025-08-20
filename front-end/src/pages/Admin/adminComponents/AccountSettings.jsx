import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/Navbar";
import "../adminStyles/accountSettings.css"; 

const AccountSettings = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null); // Add this ref for the file input
  const token = localStorage.getItem("token");

  // Fetch logged-in user info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUserData({
          name: data.name || "",
          email: data.email || "",
          password: "",
          profilePicture: data.profilePicture || "",
        });
        setPreview(data.profilePicture || "https://i.pravatar.cc/150?img=3");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files.length > 0) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      setUserData((prev) => ({ ...prev, profilePicture: file }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle profile picture click
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    if (userData.password) formData.append("password", userData.password);
    if (userData.profilePicture instanceof File) {
      formData.append("profilePicture", userData.profilePicture);
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="account-settings-container">
        <h2>Account Settings</h2>

        <form className="account-form" onSubmit={handleSubmit}>
          {/* Profile picture - Left Side */}
          <div className="profile-pic-section">
            <img 
              src={preview} 
              alt="Profile Preview" 
              className="profile-preview"
              onClick={handleProfilePictureClick}
              style={{ cursor: 'pointer' }}
            />
            <input
              ref={fileInputRef}
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            <button 
              type="button" 
              className="profile-upload-btn"
              onClick={handleProfilePictureClick}
            >
              Click to change profile picture
            </button>
          </div>

          {/* Form Fields - Right Side */}
          <div className="form-fields-container">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <button type="submit" className="submit-button">Save Changes</button>
          </div>
        </form>

        {message && (
          <p className={`form-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default AccountSettings;