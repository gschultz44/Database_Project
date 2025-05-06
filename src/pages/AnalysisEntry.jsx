import React, { useState } from "react";
import './styling/AnalysisEntry.css';

export default function AnalysisEntry() {
  const [projectName, setProjectName] = useState("");
  const [analysisType, setAnalysisType] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [analysisDate, setAnalysisDate] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Clear messages when user starts typing
  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validateAnalysisDate = () => {
    if (!analysisDate) return false;
    const analysis = new Date(analysisDate);
    const today = new Date();
    
    if (isNaN(analysis.getTime())) {
      setErrorMessage("The analysis date format is invalid. Please use the date picker.");
      return false;
    }
    
    if (analysis > today) {
      setErrorMessage("Analysis date cannot be in the future. Please select a current or past date.");
      return false;
    }
    
    return true;
  };

  const validateUserExistence = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${username}`);
      if (response.status === 404) {
        setErrorMessage(`User "${username}" not found in the system. Please verify the username or contact your administrator.`);
        return false;
      } else if (!response.ok) {
        setErrorMessage(`Server error (${response.status}) while validating user. Please try again later.`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking user existence:", error);
      setErrorMessage("Network error: Unable to connect to the user validation service. Please check your connection and try again.");
      return false;
    }
  };

  const validateForm = () => {
    const trimmedProjectName = projectName.trim();
    const trimmedAnalysisType = analysisType.trim();
    const trimmedAnalysisResult = analysisResult.trim();
    const trimmedUsername = username.trim();

    if (!trimmedProjectName) {
      setErrorMessage("Project name is required.");
      return false;
    }
    
    if (!trimmedAnalysisType) {
      setErrorMessage("Analysis type is required.");
      return false;
    }
    
    if (!trimmedAnalysisResult) {
      setErrorMessage("Analysis result is required.");
      return false;
    }
    
    if (!analysisDate) {
      setErrorMessage("Analysis date is required.");
      return false;
    }
    
    if (!trimmedUsername) {
      setErrorMessage("Username is required.");
      return false;
    }

    return validateAnalysisDate();
  };

  const handleSubmit = async () => {
    // Clear any previous messages
    clearMessages();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    const trimmedProjectName = projectName.trim();
    const trimmedAnalysisType = analysisType.trim();
    const trimmedAnalysisResult = analysisResult.trim();
    const trimmedUsername = username.trim();

    const userExists = await validateUserExistence(trimmedUsername);
    if (!userExists) return;

    try {
      const analysisData = {
        projectName: trimmedProjectName,
        analysisType: trimmedAnalysisType,
        analysisResult: trimmedAnalysisResult,
        analysisDate,
        username: trimmedUsername,
      };

      const response = await fetch("http://localhost:5000/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysisData),
      });

      if (response.ok) {
        setSuccessMessage("Analysis submitted successfully!");
        // Reset form
        setProjectName("");
        setAnalysisType("");
        setAnalysisResult("");
        setAnalysisDate("");
        setUsername("");
      } else if (response.status === 409) {
        setErrorMessage("This analysis already exists. Please check the project name and date.");
      } else if (response.status === 413) {
        setErrorMessage("Analysis result is too large. Please keep it under 1000 characters.");
      } else if (response.status >= 400 && response.status < 500) {
        setErrorMessage(`Request error (${response.status}): Invalid data submitted. Please check your entries.`);
      } else {
        setErrorMessage(`Server error (${response.status}): Unable to save analysis. Please try again later.`);
      }
    } catch (error) {
      console.error("Error submitting analysis:", error);
      setErrorMessage("Network error: Unable to submit analysis. Please check your connection and try again.");
    }
  };

  return (
    <div className="page-container">
      <h1 className="hero-title">Analysis Entry</h1>
      
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")} className="close-btn"></button>
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
          <button onClick={() => setSuccessMessage("")} className="close-btn"></button>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="projectName">Project Name <span className="required-asterisk">*</span></label>
          <input
            id="projectName"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
              clearMessages();
            }}
            required
            className="input-field"
            placeholder="Enter Project Name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="analysisType">Analysis Type <span className="required-asterisk">*</span></label>
          <input
            id="analysisType"
            value={analysisType}
            onChange={(e) => {
              setAnalysisType(e.target.value);
              clearMessages();
            }}
            required
            className="input-field"
            placeholder="Enter Analysis Type"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="analysisResult">Analysis Result <span className="required-asterisk">*</span></label>
          <textarea
            id="analysisResult"
            value={analysisResult}
            onChange={(e) => {
              setAnalysisResult(e.target.value);
              clearMessages();
            }}
            required
            className="input-field"
            placeholder="Enter Analysis Result"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="analysisDate">Analysis Date <span className="required-asterisk">*</span></label>
          <input
            id="analysisDate"
            type="date"
            value={analysisDate}
            onChange={(e) => {
              setAnalysisDate(e.target.value);
              clearMessages();
            }}
            required
            className="input-field"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Username <span className="required-asterisk">*</span></label>
          <input
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearMessages();
            }}
            required
            className="input-field"
            placeholder="Enter Username"
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