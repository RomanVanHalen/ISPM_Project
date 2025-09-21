import React, { useState, useEffect, useRef } from "react";
import "./EmployeeDashboard.css";

const EmpSettings = () => {
  const [empData, setEmpData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch logged-in employee info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const pic = data.profilePic
          ? `${data.profilePic}?t=${Date.now()}`
          : "https://i.pravatar.cc/150?img=8";

        setEmpData({
          name: data.name || "",
          email: data.email || "",
          password: "",
          profilePic: pic,
        });
        setPreview(pic);

        localStorage.setItem("empProfilePic", pic);
      } catch (err) {
        console.error("Failed to fetch employee profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic" && files.length > 0) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      setEmpData((prev) => ({ ...prev, profilePic: file }));
    } else {
      setEmpData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", empData.name);
      formData.append("email", empData.email);
      if (empData.password) formData.append("password", empData.password);
      if (empData.profilePic instanceof File) {
        formData.append("profilePic", empData.profilePic);
      }

      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const updatedPic = data.user.profilePic
          ? `${data.user.profilePic}?t=${Date.now()}`
          : "https://i.pravatar.cc/150?img=8";

        setPreview(updatedPic);
        setEmpData((prev) => ({ ...prev, profilePic: updatedPic }));
        setMessage("Profile updated successfully!");

        localStorage.setItem("empProfilePic", updatedPic);
        window.dispatchEvent(new Event("storage"));
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="account-settings-container">
      <h2>Employee Settings</h2>

      <form className="account-form" onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="profile-pic-section">
          <img
            src={preview}
            alt="Profile Preview"
            className="profile-preview"
            onClick={handleProfilePictureClick}
            style={{ cursor: "pointer" }}
          />
          <input
            ref={fileInputRef}
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="profile-upload-btn"
            onClick={handleProfilePictureClick}
          >
            Click to change profile picture
          </button>
        </div>

        {/* Other fields */}
        <div className="form-fields-container">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={empData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={empData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              name="password"
              value={empData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button type="submit" className="submit-button">
            Save Changes
          </button>
        </div>
      </form>

      {message && (
        <p
          className={`form-message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default EmpSettings;
