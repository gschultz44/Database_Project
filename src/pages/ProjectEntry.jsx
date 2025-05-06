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
      setMessage({ 
        text: "Unable to load existing projects. Please refresh the page or try again later.", 
        type: 'error' 
      });
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

  const validateDates = () => {
    if (!validateStartDate()) {
      setMessage({ text: "Please enter a valid start date.", type: 'error' });
      return false;
    }
    
    if (!validateEndDate()) {
      setMessage({ text: "Please enter a valid end date.", type: 'error' });
      return false;
    }
    
    if (new Date(endDate) < new Date(startDate)) {
      setMessage({ 
        text: "End date cannot be before start date. Please adjust your project timeline.", 
        type: 'error' 
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const trimmedProjectName = projectName.trim();
    const trimmedProjectDescription = projectDescription.trim();
    const trimmedProjectManagerFirst = projectManagerFirst.trim();
    const trimmedProjectManagerLast = projectManagerLast.trim();
    const trimmedInstitute = institute.trim();

    // Check required fields with specific messages for each field
    if (!trimmedProjectName) {
      setMessage({ text: "Project name is required. Please enter a name for this project.", type: 'error' });
      setLoading(false);
      return;
    }
    
    if (!trimmedProjectManagerFirst) {
      setMessage({ text: "Project manager's first name is required.", type: 'error' });
      setLoading(false);
      return;
    }
    
    if (!trimmedProjectManagerLast) {
      setMessage({ text: "Project manager's last name is required.", type: 'error' });
      setLoading(false);
      return;
    }
    
    if (!trimmedInstitute) {
      setMessage({ text: "Institute name is required. Please enter the affiliated institution.", type: 'error' });
      setLoading(false);
      return;
    }
    
    if (!startDate) {
      setMessage({ text: "Start date is required. Please select when this project begins.", type: 'error' });
      setLoading(false);
      return;
    }
    
    if (!endDate) {
      setMessage({ text: "End date is required. Please select when this project concludes.", type: 'error' });
      setLoading(false);
      return;
    }

    // Validate date relationship
    if (!validateDates()) {
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
        setMessage({ 
          text: `Project "${trimmedProjectName}" has been successfully added to the database!`, 
          type: 'success' 
        });
        
        // Clear form fields
        setProjectName("");
        setProjectDescription("");
        setProjectManagerFirst("");
        setProjectManagerLast("");
        setInstitute("");
        setStartDate("");
        setEndDate("");

        // Refresh project list
        fetchProjects();

        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 5000);
      } else {
        const errorData = await response.json();
        
        // Handle specific error scenarios
        if (errorData.error && errorData.error.includes("duplicate")) {
          throw new Error(`A project named "${trimmedProjectName}" already exists. Please use a different name.`);
        } else if (errorData.error && errorData.error.includes("foreign key")) {
          throw new Error("Database relationship error. Please check that all referenced data exists.");
        } else {
          throw new Error(errorData.error || 'Failed to add project');
        }
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      setMessage({ 
        text: error.message || "An unexpected error occurred while submitting the project. Please try again.", 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Get current date in YYYY-MM-DD format for min attribute
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
          <label htmlFor="project_name">
            Project Name <span className="required-asterisk">*</span>
          </label>
          <input
            id="project_name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Project Name"
            maxLength={100}
          />
          {/* <small className="form-hint">Enter a unique name that clearly identifies this project</small> */}
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
          {/* <small className="form-hint">Brief overview of the project's goals and scope</small> */}
        </div>

        <div className="form-group">
          <label htmlFor="project_manager_first">
            Project Manager First Name <span className="required-asterisk">*</span>
          </label>
          <input
            id="project_manager_first"
            value={projectManagerFirst}
            onChange={(e) => setProjectManagerFirst(e.target.value)}
            required
            className="input-field"
            placeholder="Enter First Name"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="project_manager_last">
            Project Manager Last Name <span className="required-asterisk">*</span>
          </label>
          <input
            id="project_manager_last"
            value={projectManagerLast}
            onChange={(e) => setProjectManagerLast(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Last Name"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="institute">
            Institute <span className="required-asterisk">*</span>
          </label>
          <input
            id="institute"
            value={institute}
            onChange={(e) => setInstitute(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Institute"
            maxLength={100}
          />
          {/* <small className="form-hint">Name of the affiliated institution or organization</small> */}
        </div>

        <div className="form-group">
          <label htmlFor="start_date">
            Start Date <span className="required-asterisk">*</span>
          </label>
          <input
            id="start_date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="input-field"
          />
          {/* <small className="form-hint">When does the project begin?</small> */}
        </div>

        <div className="form-group">
          <label htmlFor="end_date">
            End Date <span className="required-asterisk">*</span>
          </label>
          <input
            id="end_date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="input-field"
            min={startDate || getCurrentDate()}
          />
          {/* <small className="form-hint">When is the project scheduled to conclude?</small> */}
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
          <div className="table-container">
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
          </div>
        ) : (
          <p className="no-data-message">No projects found. Add your first project above.</p>
        )}
      </div>
    </div>
  );
}