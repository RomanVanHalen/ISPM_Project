import React, { useEffect, useState, useRef } from "react";
import "../adminStyles/accountSettings.css";

const AccountSettings = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [preview, setPreview] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch logged-in user info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        // Use profilePic or fallback
        let pic = data.profilePic || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
        if (!pic.startsWith("http")) pic = `http://localhost:5000${pic}`;

        setPreview(`${pic}?t=${Date.now()}`);

        setUserData({
          name: data.name || "",
          email: data.email || "",
          password: "",
        });

        // Update localStorage so Navbar reads latest data
        const updatedUser = { ...data, profilePic: pic };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setPreview("");
      }
    };
    fetchProfile();
  }, [token]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture file selection
  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        setMessage("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setProfilePictureFile(file);
      setMessage("");
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);

      if (userData.password) formData.append("password", userData.password);
      if (profilePictureFile instanceof File) formData.append("profilePicture", profilePictureFile);

      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // Determine the updated profile pic URL
        let updatedPic = data.user?.profilePicture || preview;
        if (!updatedPic.startsWith("http") && updatedPic) updatedPic = `http://localhost:5000${updatedPic}`;

        // Update state
        setPreview(`${updatedPic}?t=${Date.now()}`);
        setUserData((prev) => ({ ...prev, name: data.user.name, email: data.user.email, password: "" }));
        setProfilePictureFile(null);
        setMessage("Profile updated successfully!");

        // Update localStorage so Navbar and other components reflect changes immediately
        const updatedUser = { ...data.user, profilePic: updatedPic };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Optional: Dispatch a custom event so Navbar can listen to it
        window.dispatchEvent(new Event("userProfileUpdated"));
      } else {
        setMessage(data.message || `Server error: ${res.status}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="account-settings-container">
      <h2>Account Settings</h2>

      <form className="account-form" onSubmit={handleSubmit}>
        <div className="profile-pic-section">
          <div
            className={`profile-preview-container ${!preview ? "no-image" : ""}`}
            onClick={handleProfilePictureClick}
          >
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="profile-preview"
                onError={(e) => {
                  e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                }}
              />
            ) : (
              <div className="profile-placeholder">
                <span>No Profile Picture</span>
                <span>Click to add one</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="profile-pic-buttons">
            <button type="button" className="profile-upload-btn" onClick={handleProfilePictureClick} disabled={isSubmitting}>
              {preview ? "Change Picture" : "Add Picture"}
            </button>
          </div>
        </div>

        <div className="form-fields-container">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={userData.name} onChange={handleChange} required disabled={isSubmitting} />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={userData.email} onChange={handleChange} required disabled={isSubmitting} />
          </div>

          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {message && <p className={`form-message ${message.includes("success") ? "success" : "error"}`}>{message}</p>}
    </div>
  );
};

export default AccountSettings;
