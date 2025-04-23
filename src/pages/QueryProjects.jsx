// QueryProjects.jsx
import React, { useState } from 'react';

const QueryProjects = () => {
  const [experimentName, setExperimentName] = useState('');
  const [results, setResults] = useState([]);

  const handleQuery = () => {
    // Simulated data - replace with actual logic
    const mockResults = [
      {
        id: 1,
        name: 'Project Alpha',
        associatedPosts: 5,
        analysisCompletion: '80%'
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
        <button onClick={handleQuery}>Search</button>
      </div>

      <div className="results-section">
        <h3>Results</h3>
        {results.map((exp) => (
          <div key={exp.id} className="result-card">
            <p><strong>Name:</strong> {exp.name}</p>
            <p><strong>Associated Posts:</strong> {exp.associatedPosts}</p>
            <p><strong>Analysis Completion:</strong> {exp.analysisCompletion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryProjects;