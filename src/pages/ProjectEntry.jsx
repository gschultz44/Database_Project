import React, { useState } from "react";
import './styling/ProjectEntry.css';

export default function ProjectEntry() {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  const validateStartDate = () => {
    if (!startDate) return false;
    const start = new Date(startDate);
    return !isNaN(start.getTime());
  };

  const validateEndDate = () => {
    if (!endDate) return false;
    const end = new Date(endDate);
    return !isNaN(end.getTime());
  };

  const handleSubmit = async () => {
    const trimmedProjectName = projectName.trim();
    const trimmedProjectDescription = projectDescription.trim();
    const trimmedStatus = status.trim();

    if (!trimmedProjectName || !trimmedProjectDescription || !startDate || !endDate || !trimmedStatus) {
      alert("Please fill out all required fields.");
      return;
    }

    if (!validateStartDate() || !validateEndDate()) {
      alert("Please enter valid dates.");
      return;
    }

    try {
      const projectData = {
        projectName: trimmedProjectName,
        projectDescription: trimmedProjectDescription,
        startDate,
        endDate,
        status: trimmedStatus,
      };

      const response = await fetch("http://localhost:5000/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        alert("Project submitted successfully!");
        setProjectName("");
        setProjectDescription("");
        setStartDate("");
        setEndDate("");
        setStatus("");
      } else {
        alert("Failed to submit project.");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("An error occurred while submitting the project.");
    }
  };

  return (
    <div className="page-container">
      <h1 className="hero-title">Project Entry</h1>
      <div className="space-y-4">
        <div className="form-group">
          <label>Project Name</label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Project Name"
          />
        </div>
        <div className="form-group">
          <label>Project Description</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Project Description"
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Status"
          />
        </div>
        <div className="form-group">
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            Submit Project
          </button>
        </div>
      </div>
    </div>
  );
}
