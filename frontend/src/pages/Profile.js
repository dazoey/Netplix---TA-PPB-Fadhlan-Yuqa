import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [email, setEmail] = useState("Marcostar21302@GMAIL.COM");
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(email);

  const handleSave = () => {
    setEmail(newEmail);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">Account</h2>
      </div>

      <div className="profile-details">
        <div className="profile-left">
          <div className="profile-avatar">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" // Placeholder avatar, replace with user image
              alt="Profile Avatar"
              className="avatar-img"
            />
          </div>
          <div className="profile-info">
            <p className="username">Fadhlan yuqa Tahta dika</p>{" "}
            {/* Placeholder username */}
            <div className="email-container">
              {isEditing ? (
                <div className="edit-email-section">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="email-input"
                  />
                  <button onClick={handleSave} className="save-btn">
                    Save
                  </button>
                </div>
              ) : (
                <div className="view-email-section">
                  <p className="email">{email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="plan-section">
            <h3 className="plan-title">Plan Details</h3>
            <p className="plan-type">Standard</p> {/* Placeholder for plan */}
            <p className="plan-end">Next billing date: 21th march 2026</p>{" "}
            {/* Placeholder billing date */}
          </div>
          <div className="member-since">
            <h3 className="member-title">Member Since</h3>
            <p className="membership-date">January 2023</p>{" "}
            {/* Placeholder membership date */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
