import React, { useState } from "react";
import './styling/ProjectEntry.css';

export default function ProjectEntry() {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectManagerFirstName, setProjectManagerFirstName] = useState("");
  const [projectManagerLastName, setProjectManagerLastName] = useState("");
  const [instituteName, setInstituteName] = useState("");
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

  const isEndDateAfterStartDate = () => {
    if (!validateStartDate() || !validateEndDate()) return false;
    return new Date(endDate) >= new Date(startDate);
  };

  const formatDate = (dateStr) => {
    // Converts "2025-04-28" (default HTML date input format) → "2025/04/28"
    return dateStr.replace(/-/g, "/");
  };

  const handleSubmit = async () => {
    const trimmedProjectName = projectName.trim();
    const trimmedProjectDescription = projectDescription.trim();
    const trimmedManagerFirst = projectManagerFirstName.trim();
    const trimmedManagerLast = projectManagerLastName.trim();
    const trimmedInstitute = instituteName.trim();

    if (!trimmedProjectName || !trimmedManagerFirst || !trimmedManagerLast || !trimmedInstitute || !startDate || !endDate || !status) {
      alert("Please fill out all required fields.");
      return;
    }

    if (!validateStartDate() || !validateEndDate()) {
      alert("Please enter valid dates.");
      return;
    }

    if (!isEndDateAfterStartDate()) {
      alert("End date must be the same as or after start date.");
      return;
    }

    try {
      const projectData = {
        projectName: trimmedProjectName,
        projectDescription: trimmedProjectDescription,
        projectManagerFirstName: trimmedManagerFirst,
        projectManagerLastName: trimmedManagerLast,
        instituteName: trimmedInstitute,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        status,
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
        setProjectManagerFirstName("");
        setProjectManagerLastName("");
        setInstituteName("");
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
          <label>Project Name<span className="required-asterisk">*</span></label>
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
            className="input-field"
            placeholder="Enter Project Description (optional)"
          />
        </div>
        <div className="form-group">
          <label>Project Manager First Name<span className="required-asterisk">*</span></label>
          <input
            value={projectManagerFirstName}
            onChange={(e) => setProjectManagerFirstName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Project Manager First Name"
          />
        </div>
        <div className="form-group">
          <label>Project Manager Last Name<span className="required-asterisk">*</span></label>
          <input
            value={projectManagerLastName}
            onChange={(e) => setProjectManagerLastName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Project Manager Last Name"
          />
        </div>
        <div className="form-group">
          <label>Institute Name<span className="required-asterisk">*</span></label>
          <input
            value={instituteName}
            onChange={(e) => setInstituteName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Institute Name"
          />
        </div>
        <div className="form-group">
          <label>Start Date<span className="required-asterisk">*</span></label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>End Date<span className="required-asterisk">*</span></label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="input-field"
          />
        </div>
        {/* <div className="form-group">
          <label>Status<span className="required-asterisk">*</span></label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div> */}
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
