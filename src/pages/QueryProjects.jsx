// QueryProjects.jsx
import React, { useState } from 'react';

const QueryProjects = () => {
  const [experimentName, setExperimentName] = useState('');
  const [multimediaType, setMultimediaType] = useState(''); // Added multimedia type
  const [results, setResults] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const validateDates = () => {
    console.log("Validating dates:", { startDate, endDate });
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      console.log("Date objects:", { 
        start: start.toISOString(), 
        end: end.toISOString(),
        comparison: end < start 
      });
      
      if (end < start) {
        alert("End date cannot be before start date");
        return false;
      }
    } else {
      console.log("Skipping validation - one or both dates missing");
    }
    return true;
  };


  const handleQuery = () => {

    if (!validateDates()) {
      return;
    }

    // Simulated data - replace with actual logic
    const mockResults = [
      {
        id: 1,
        name: 'Project Alpha',
        associatedPosts: 5,
        analysisCompletion: '80%',
        multimediaTypes: ['image', 'video'] // Example data showing multimedia types used in project
      },
    ];
    setResults(mockResults);
  };

  return (
    <div className="query-projects-container">
      <h2>Query Projects/Experiments</h2>
      <div className="query-form">
        <label>
          Experiment Name:
          <input type="text" value={experimentName} onChange={(e) => setExperimentName(e.target.value)} />
        </label>
        <label>
          Multimedia Type:
          <select 
            value={multimediaType} 
            onChange={(e) => setMultimediaType(e.target.value)}
            className="input-field"
          >
            <option value="">All Multimedia Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
            Start Date:
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </label>
          <label>
            End Date:
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
        </label>
        <button onClick={handleQuery}>Search</button>
      </div>

      <div className="results-section">
        <h3>Results</h3>
        {results.map((exp) => (
          <div key={exp.id} className="result-card">
            <p><strong>Name:</strong> {exp.name}</p>
            <p><strong>Associated Posts:</strong> {exp.associatedPosts}</p>
            <p><strong>Analysis Completion:</strong> {exp.analysisCompletion}</p>
            {exp.multimediaTypes && (
              <p>
                <strong>Multimedia Types:</strong> {exp.multimediaTypes.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryProjects;