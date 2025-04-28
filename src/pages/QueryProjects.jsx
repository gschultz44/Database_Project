import React, { useState } from 'react';
import './styling/QueryProjects.css';

const QueryProjects = () => {
  const [experimentName, setExperimentName] = useState('');
  const [posts, setPosts] = useState([]);
  const [fieldStats, setFieldStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async () => {
    if (!experimentName.trim()) {
      alert('Please enter an Experiment Name.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call - replace with your actual backend fetch
      const mockPosts = [
        {
          id: 1,
          content: "Post 1 about cats",
          analysisResults: {
            sentiment: "Positive",
            topic: "Pets"
          }
        },
        {
          id: 2,
          content: "Post 2 about dogs",
          analysisResults: {
            sentiment: "Negative"
          }
        },
        {
          id: 3,
          content: "Post 3 about birds",
          analysisResults: {} // No analysis entered
        }
      ];

      setPosts(mockPosts);

      // Calculate field stats
      const totalPosts = mockPosts.length;
      const fieldCount = {};

      mockPosts.forEach(post => {
        Object.keys(post.analysisResults || {}).forEach(field => {
          fieldCount[field] = (fieldCount[field] || 0) + 1;
        });
      });

      const fieldPercentages = {};
      for (const field in fieldCount) {
        fieldPercentages[field] = ((fieldCount[field] / totalPosts) * 100).toFixed(1);
      }

      setFieldStats(fieldPercentages);
    } catch (error) {
      console.error('Error querying experiment:', error);
      alert('An error occurred while querying.');
    }

    setIsLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="hero-title">Query Experiment</h1>
      <form className="query-form" onSubmit={(e) => { e.preventDefault(); handleQuery(); }}>
        <div className="form-group">
          <label htmlFor="experimentName">Experiment Name *</label>
          <input
            id="experimentName"
            type="text"
            name="experimentName"
            placeholder="Enter Experiment Name"
            value={experimentName}
            onChange={(e) => setExperimentName(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      <div className="results-section">
        <h3>Associated Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="result-card">
              <p><strong>Post Content:</strong> {post.content}</p>
              {post.analysisResults && Object.keys(post.analysisResults).length > 0 ? (
                <div className="analysis-results">
                  <h4>Analysis Results:</h4>
                  <ul>
                    {Object.entries(post.analysisResults).map(([field, value]) => (
                      <li key={field}><strong>{field}:</strong> {value}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p><em>No analysis results entered for this post.</em></p>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">No posts found for this experiment.</p>
        )}
      </div>

      {Object.keys(fieldStats).length > 0 && (
        <div className="field-stats">
          <h3>Field Completion Statistics</h3>
          <ul>
            {Object.entries(fieldStats).map(([field, percentage]) => (
              <li key={field}><strong>{field}:</strong> {percentage}% of posts have this field filled.</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QueryProjects;
