import React, { useState } from "react";
import './styling/AnalysisEntry.css';

export default function AnalysisEntry() {
  const [projectId, setProjectId] = useState("");
  const [analysisType, setAnalysisType] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [analysisDate, setAnalysisDate] = useState("");
  const [userId, setUserId] = useState("");

  const validateAnalysisDate = () => {
    if (!analysisDate) return true; // allow if empty
    const analysis = new Date(analysisDate);
    return !isNaN(analysis.getTime());
  };

  const validateUserExistence = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}`);
      if (!response.ok) {
        alert("User not found.");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking user existence:", error);
      alert("Failed to validate user.");
      return false;
    }
  };

  const handleSubmit = async () => {
    const trimmedProjectId = projectId.trim();
    const trimmedAnalysisType = analysisType.trim();
    const trimmedAnalysisResult = analysisResult.trim();
    const trimmedUserId = userId.trim();

    if (!trimmedProjectId || !trimmedUserId) {
      alert("Please fill out Project ID and User ID.");
      return;
    }

    if (analysisDate && !validateAnalysisDate()) {
      alert("Please enter a valid analysis date.");
      return;
    }

    const userExists = await validateUserExistence(trimmedUserId);
    if (!userExists) return;

    try {
      const analysisData = {
        projectId: trimmedProjectId,
        userId: trimmedUserId,
        ...(trimmedAnalysisType && { analysisType: trimmedAnalysisType }),
        ...(trimmedAnalysisResult && { analysisResult: trimmedAnalysisResult }),
        ...(analysisDate && { analysisDate }),
      };

      const response = await fetch("http://localhost:5000/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysisData),
      });

      if (response.ok) {
        alert("Analysis submitted successfully!");
        setProjectId("");
        setAnalysisType("");
        setAnalysisResult("");
        setAnalysisDate("");
        setUserId("");
      } else {
        alert("Failed to submit analysis.");
      }
    } catch (error) {
      console.error("Error submitting analysis:", error);
      alert("An error occurred while submitting the analysis.");
    }
  };

  return (
    <div className="page-container">
      <h1 className="hero-title">Analysis Entry</h1>
      <div className="space-y-4">
        <div className="form-group">
          <label>Project Name <span style={{ color: 'red' }}>*</span></label>
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Project Name"
          />
        </div>
        <div className="form-group">
          <label>Username <span style={{ color: 'red' }}>*</span></label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Username"
          />
        </div>
        <div className="form-group">
          <label>Analysis Result (optional)</label>
          <textarea
            value={analysisResult}
            onChange={(e) => setAnalysisResult(e.target.value)}
            className="input-field"
            placeholder="Enter Analysis Result"
          />
        </div>
        <div className="form-group">
          <label>Analysis Date (optional)</label>
          <input
            type="date"
            value={analysisDate}
            onChange={(e) => setAnalysisDate(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            Submit Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
