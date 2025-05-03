import React, { useState, useEffect } from "react";
import './styling/ProjectEntry.css';

export default function FieldEntry() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [fields, setFields] = useState([{ value: "" }]);
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

  const handleAddField = () => {
    setFields([...fields, { value: "" }]);
  };

  const handleRemoveField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleFieldChange = (index, event) => {
    const newFields = [...fields];
    newFields[index].value = event.target.value;
    setFields(newFields);
  };

  const handleProjectChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const trimmedProjectName = projectName.trim();
    
    // Check if project is selected
    if (!trimmedProjectName) {
      setMessage({ text: "Please select a project.", type: 'error' });
      setLoading(false);
      return;
    }

    // Filter out empty fields
    const validFields = fields.filter(field => field.value.trim() !== "");
    
    if (validFields.length === 0) {
      setMessage({ text: "Please add at least one field.", type: 'error' });
      setLoading(false);
      return;
    }

    try {
      let successCount = 0;
      
      // Submit each field individually
      for (const field of validFields) {
        const fieldData = {
          project_name: trimmedProjectName,
          field_name: field.value.trim()
        };

        const response = await fetch("http://localhost:3000/api/fields", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fieldData),
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorData = await response.json();
          console.error(`Failed to add field "${field.value}":`, errorData.error);
        }
      }
      
      if (successCount > 0) {
        const message = successCount === 1 
          ? "Field submitted successfully!" 
          : `${successCount} fields submitted successfully!`;
          
        setMessage({ text: message, type: 'success' });
        setProjectName("");
        setFields([{ value: "" }]);
        
        // Refresh the projects list
        fetchProjects();
        
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      } else {
        throw new Error('Failed to add any fields');
      }
    } catch (error) {
      console.error("Error submitting fields:", error);
      setMessage({ text: error.message || "An error occurred while submitting the fields.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="hero-title" style={{ color: 'black' }}>Add Fields to a Project</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="form-group">
          <label>Select a Project<span className="required-asterisk">*</span></label>
          <select
            name="project_name"
            value={projectName}
            onChange={handleProjectChange}
            required
            className="input-field"
          >
            <option value="">Select a project</option>
            {projects.map(project => (
              <option key={project.project_name} value={project.project_name}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fields<span className="required-asterisk">*</span></label>
          
          {fields.map((field, index) => (
            <div key={index} className="field-row">
              <input
                value={field.value}
                onChange={(e) => handleFieldChange(index, e)}
                required
                className="input-field"
                placeholder="Enter Field Name"
              />
              
              {fields.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveField(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={handleAddField}
            className="btn-secondary mt-2"
          >
            + Add Another Field
          </button>
        </div>
        
        <div className="form-group">
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Fields'}
          </button>
        </div>
      </div>
      
      <div className="table-section">
        <h2>Existing Project Fields</h2>
        
        {projects.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Field Name</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.project_name}</td>
                  <td>{project.field_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No projects found. Add your first field above.</p>
        )}
      </div>

    </div>
  );
}