import React, { useState } from "react";
import './styling/UserEntry.css';

export default function UserEntry() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [joinDate, setJoinDate] = useState("");

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(userEmail);
  };

  const validateJoinDate = () => {
    if (!joinDate) return false;
    const date = new Date(joinDate);
    return !isNaN(date.getTime());
  };

  const handleSubmit = async () => {
    const trimmedUserName = userName.trim();
    const trimmedUserEmail = userEmail.trim();
    const trimmedUserRole = userRole.trim();

    if (!trimmedUserName || !trimmedUserEmail || !trimmedUserRole || !joinDate) {
      alert("Please fill out all required fields.");
      return;
    }

    if (!validateEmail()) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validateJoinDate()) {
      alert("Please enter a valid join date.");
      return;
    }

    try {
      const userData = {
        userName: trimmedUserName,
        userEmail: trimmedUserEmail,
        userRole: trimmedUserRole,
        joinDate,
      };

      const response = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("User submitted successfully!");
        setUserName("");
        setUserEmail("");
        setUserRole("");
        setJoinDate("");
      } else {
        alert("Failed to submit user.");
      }
    } catch (error) {
      console.error("Error submitting user:", error);
      alert("An error occurred while submitting the user.");
    }
  };

  return (
    <div className="page-container">
      <h1 className="hero-title">User Entry</h1>
      <div className="space-y-4">
        <div className="form-group">
          <label>User Name</label>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter User Name"
          />
        </div>
        <div className="form-group">
          <label>User Email</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            className="input-field"
            placeholder="Enter User Email"
          />
        </div>
        <div className="form-group">
          <label>User Role</label>
          <input
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            required
            className="input-field"
            placeholder="Enter User Role"
          />
        </div>
        <div className="form-group">
          <label>Join Date</label>
          <input
            type="date"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            Submit User
          </button>
        </div>
      </div>
    </div>
  );
}
