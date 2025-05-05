import React, { useState, useEffect } from "react";
import './styling/AnalysisEntry.css';

export default function AnalysisEntry() {
  const [analyses, setAnalyses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [analysisTitle, setAnalysisTitle] = useState("");
  const [analysisData, setAnalysisData] = useState("");
  const [analysisDate, setAnalysisDate] = useState("");
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalyses();
    fetchProjects();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/analysis');
      if (!response.ok) throw new Error('Failed to fetch analyses');
      const data = await response.json();
      setAnalyses(data);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };
  
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const validateAnalysisDate = () => {
    if (!analysisDate) return false;
    const analysis = new Date(analysisDate);
    return !isNaN(analysis.getTime());
  };

  const handleSubmit = async () => {
    setLoading(true);
    const trimmedProjectName = projectName.trim();
    const trimmedAnalysisTitle = analysisTitle.trim();
    const trimmedAnalysisData = analysisData.trim();

    if (!trimmedProjectName || !trimmedAnalysisTitle || !trimmedAnalysisData || !analysisDate) {
      setMessage({ text: "Please fill out all required fields.", type: 'error' });
      setLoading(false);
      return;
    }

    if (!validateAnalysisDate()) {
      setMessage({ text: "Please enter a valid analysis date.", type: 'error' });
      setLoading(false);
      return;
    }

    try {
      // Match the exact structure expected by the API
      const analysisRequestData = {
        project_name: trimmedProjectName,
        analysis_title: trimmedAnalysisTitle,
        analysis_data: trimmedAnalysisData,
        analysis_date: analysisDate
      };

      const response = await fetch("http://localhost:3000/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysisRequestData),
      });

      if (response.ok) {
        setMessage({ text: "Analysis submitted successfully!", type: 'success' });
        setProjectName("");
        setAnalysisTitle("");
        setAnalysisData("");
        setAnalysisDate("");
        
        // Refresh the analyses list
        fetchAnalyses();
        
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add analysis');
      }
    } catch (error) {
      console.error("Error submitting analysis:", error);
      setMessage({ text: error.message || "An error occurred while submitting the analysis.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="hero-title" style={{ color: 'black' }}>Analysis Entry</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="project_name">Project Name *</label>
          <select
            id="project_name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Select a Project</option>
            {projects.map((project, index) => (
              <option key={index} value={project.project_name}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="analysis_title">Analysis Title *</label>
          <input
            id="analysis_title"
            value={analysisTitle}
            onChange={(e) => setAnalysisTitle(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Analysis Title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="analysis_data">Analysis Result *</label>
          <textarea
            id="analysis_data"
            value={analysisData}
            onChange={(e) => setAnalysisData(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Analysis Result"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="analysis_date">Analysis Date *</label>
          <input
            id="analysis_date"
            type="date"
            value={analysisDate}
            onChange={(e) => setAnalysisDate(e.target.value)}
            required
            className="input-field"
          />
        </div>
        
        <div className="form-group">
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Analysis'}
          </button>
        </div>
      </div>
      
      <div className="table-section">
        <h2>Existing Analyses</h2>
        
        {analyses.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Analysis Title</th>
                <th>Analysis Date</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((analysis, index) => (
                <tr key={index}>
                  <td>{analysis.project_name}</td>
                  <td>{analysis.analysis_title}</td>
                  <td>{new Date(analysis.analysis_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No analyses found. Add your first analysis above.</p>
        )}
      </div>
    </div>
  );
}
