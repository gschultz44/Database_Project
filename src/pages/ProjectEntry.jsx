import React, { useState, useEffect } from "react";
import './styling/ProjectEntry.css';

export default function ProjectEntry() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectManagerFirst, setProjectManagerFirst] = useState("");
  const [projectManagerLast, setProjectManagerLast] = useState("");
  const [institute, setInstitute] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

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
    setLoading(true);
    const trimmedProjectName = projectName.trim();
    const trimmedProjectDescription = projectDescription.trim();
    const trimmedProjectManagerFirst = projectManagerFirst.trim();
    const trimmedProjectManagerLast = projectManagerLast.trim();
    const trimmedInstitute = institute.trim();

    if (!trimmedProjectName || !trimmedProjectManagerFirst || !trimmedProjectManagerLast || !trimmedInstitute || !startDate || !endDate) {
      setMessage({ text: "Please fill out all required fields.", type: 'error' });
      setLoading(false);
      return;
    }

    if (validateStartDate() && validateEndDate() && new Date(endDate) < new Date(startDate)) {
      setMessage({ text: "Please enter valid dates.", type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const projectData = {
        project_name: trimmedProjectName,
        project_description: trimmedProjectDescription,
        project_manager_first: trimmedProjectManagerFirst,
        project_manager_last: trimmedProjectManagerLast,
        institute: trimmedInstitute,
        start_date: startDate,
        end_date: endDate
      };

      const response = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        setMessage({ text: "Project submitted successfully!", type: 'success' });
        setProjectName("");
        setProjectDescription("");
        setProjectManagerFirst("");
        setProjectManagerLast("");
        setInstitute("");
        setStartDate("");
        setEndDate("");
        
        // Refresh the projects list
        fetchProjects();
        
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add project');
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      setMessage({ text: error.message || "An error occurred while submitting the project.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="hero-title" style={{ color: 'black' }}>Add a Project</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="project_name">Project Name *</label>
          <input
            id="project_name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Project Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="project_description">Project Description</label>
          <textarea
            id="project_description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="input-field"
            placeholder="Enter project description (Optional)"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="project_manager_first">Project Manager First Name *</label>
          <input
            id="project_manager_first"
            value={projectManagerFirst}
            onChange={(e) => setProjectManagerFirst(e.target.value)}
            required
            className="input-field"
            placeholder="Enter First Name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="project_manager_last">Project Manager Last Name *</label>
          <input
            id="project_manager_last"
            value={projectManagerLast}
            onChange={(e) => setProjectManagerLast(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Last Name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="institute">Institute *</label>
          <input
            id="institute"
            value={institute}
            onChange={(e) => setInstitute(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Institute"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="start_date">Start Date *</label>
          <input
            id="start_date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="input-field"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="end_date">End Date *</label>
          <input
            id="end_date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
            {loading ? 'Submitting...' : 'Submit Project'}
          </button>
        </div>
      </div>
      
      <div className="table-section">
        <h2>Existing Projects</h2>
        
        {projects.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project Manager</th>
                <th>Institute</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.project_name}</td>
                  <td>{`${project.project_manager_first} ${project.project_manager_last}`}</td>
                  <td>{project.institute}</td>
                  <td>{new Date(project.start_date).toLocaleDateString()}</td>
                  <td>{new Date(project.end_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No projects found. Add your first project above.</p>
        )}
      </div>
    </div>
  );
}