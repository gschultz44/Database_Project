import React, { useState, useEffect } from "react";
import './styling/PostEntry.css'; 

export default function QueryProjects() {
  const [projects, setProjects] = useState([]);
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [posts, setPosts] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [fieldDistribution, setFieldDistribution] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  const [queryParams, setQueryParams] = useState({
    projectName: "",
    fieldName: ""
  });

  // Fetch projects and fields when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
      setLoading(false);
      setMessage({ text: 'Projects loaded successfully', type: 'success' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      setLoading(false);
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const fetchFieldsByProject = async (projectName) => {
    if (!projectName) {
      setFilteredFields([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/fields?project_name=${encodeURIComponent(projectName)}`);
      if (!response.ok) throw new Error('Failed to fetch fields for project');
      const data = await response.json();
      setFilteredFields(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage({ text: error.message, type: 'error' });
      setFilteredFields([]);
    }
  };

  const fetchAnalysisByProject = async (projectName) => {
    if (!projectName) {
      setAnalysisResults([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/analysis`);
      if (!response.ok) throw new Error('Failed to fetch analysis results');
      const data = await response.json();
      
      // Filter analysis results by project name
      const projectAnalysis = data.filter(analysis => 
        analysis.project_name === projectName
      );
      
      setAnalysisResults(projectAnalysis);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage({ text: `Error fetching analysis: ${error.message}`, type: 'error' });
      setAnalysisResults([]);
    }
  };

  const fetchPosts = async () => {
    const { projectName, fieldName } = queryParams;
    
    if (!projectName) {
      setMessage({ text: "Please select a project.", type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      setPosts([]);
      setMessage({ text: '', type: '' });
      
      // First, fetch analysis results for the selected project
      await fetchAnalysisByProject(projectName);
      
      // Then, fetch posts
      const response = await fetch(`http://localhost:3000/api/query/posts`);
      
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const allPosts = await response.json();
      
      // Filter posts client-side based on project_name and field_name
      const filteredPosts = allPosts.filter(post => {
        if (post.project_name !== projectName) {
          return false; // Exclude if project doesn't match
        }
        
        if (fieldName && post.field_name !== fieldName) {
          return false; // Exclude if field name is specified and doesn't match
        }
        
        return true; // Include if it passes all filters
      });
      
      setPosts(filteredPosts);
      
      // Calculate field distribution for all project posts (regardless of field filter)
      if (filteredPosts.length > 0) {
        const projectPosts = allPosts.filter(post => post.project_name === projectName);
        calculateFieldDistribution(projectPosts);
      } else {
        setFieldDistribution({});
      }
      
      if (filteredPosts.length === 0) {
        setMessage({ text: "No posts found for the selected criteria.", type: 'info' });
      } else {
        setMessage({ text: `Found ${filteredPosts.length} posts for ${projectName}${fieldName ? ` in field ${fieldName}` : ''}`, type: 'success' });
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "projectName") {
      setQueryParams(prev => ({
        ...prev,
        [name]: value,
        fieldName: ""
      }));
  
      // Clear analysis results, field distribution, and posts
      setAnalysisResults([]);
      setFieldDistribution({});
      setPosts([]);

      fetchFieldsByProject(value);
    } else {
      setQueryParams(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };  
  
  const calculateFieldDistribution = (projectPosts) => {
    const fieldCounts = {};
    const totalPosts = projectPosts.length;
    
    projectPosts.forEach(post => {
      const fieldName = post.field_name || "Unassigned";
      if (!fieldCounts[fieldName]) {
        fieldCounts[fieldName] = 0;
      }
      fieldCounts[fieldName]++;
    });
    
    const distribution = {};
    Object.keys(fieldCounts).forEach(fieldName => {
      const count = fieldCounts[fieldName];
      const percentage = ((count / totalPosts) * 100).toFixed(1);
      distribution[fieldName] = {
        count,
        percentage: parseFloat(percentage)
      };
    });
    
    setFieldDistribution(distribution);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="page-container">
      <h1 className="hero-title" style={{ color: 'black' }}>Query Projects</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="form-group">
          <label>Project</label>
          <select
            name="projectName"
            value={queryParams.projectName}
            onChange={handleChange}
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

        {queryParams.projectName && (
          <div className="form-group">
            <label>Field (Optional)</label>
            <select
              name="fieldName"
              value={queryParams.fieldName}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">All Fields</option>
              {filteredFields.map(field => (
                <option key={field.field_name} value={field.field_name}>
                  {field.field_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <button
            onClick={fetchPosts}
            disabled={loading || !queryParams.projectName}
            className="btn-primary"
          >
            {loading ? 'Searching...' : 'Search Posts'}
          </button>
        </div>
      </div>

      {/* Analysis Results Section */}
      {analysisResults.length > 0 && (
        <div className="analysis-container">
          <h2 className="section-title">Analysis Results for {queryParams.projectName}</h2>
          <hr className="post-divider" />
          <div className="analysis-grid">
            {analysisResults.map((analysis, index) => (
              <div className="analysis-card" key={index}>
                <h3 className="analysis-subtitle">{analysis.analysis_title}</h3>
                <div className="analysis-content">
                  <p>{analysis.analysis_data}</p>
                </div>
                <p className="analysis-date">Analysis Date: {formatDate(analysis.analysis_date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

     {/* Field Distribution Section */}
      {Object.keys(fieldDistribution).length > 0 && (
        <div className="analysis-container">
          <h3 className="section-subtitle">Field Distribution for {queryParams.projectName}</h3>
          <div className="field-distribution">
            {Object.keys(fieldDistribution).map((fieldName, index) => {
              const { count, percentage } = fieldDistribution[fieldName];
              return (
                <div className="distribution-item" key={index}>
                  <div className="distribution-label">
                    <span className="field-name">{fieldName}: </span>
                    <span className="field-count">{count} posts </span>
                    <span className="percentage">({percentage}%)</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts Section */}
      {posts.length > 0 && (
        <div className="results-container">
          <h2 className="section-title">Posts</h2>
          {posts.map((post, index) => (
            <div className="post-card" key={index}>
              <hr className="post-divider" />

              <p className="post-text">{post.content}</p>

              <p className="post-info">
                {post.media_name && <span>{post.media_name}</span>}
                {post.username && <span> | {post.username}</span>}
                {post.post_time && <span> | {new Date(post.post_time).toLocaleString()}</span>}
                {post.multimedia && <span> | Multimedia: {post.multimedia}</span>}
                {post.is_repost === 1 && <span> | Repost: yes</span>}
              </p>

              {post.project_name && (
                <div className="project-section">
                  <p className="project-header">Project: <strong>{post.project_name}</strong></p>
                  {post.field_name && <p>Field: {post.field_name}</p>}
                </div>
              )}

              {(post.likes > 0 || post.dislikes > 0) && (
                <div className="engagement">
                  {post.likes > 0 && <span>Likes: {post.likes}</span>}
                  {post.dislikes > 0 && <span> Dislikes: {post.dislikes}</span>}
                </div>
              )}

              {(post.city || post.state_name || post.country) && (
                <div className="location">
                  <p>
                    📍 {post.city || ''}
                    {post.state_name ? `, ${post.state_name}` : ''}
                    {post.country ? `, ${post.country}` : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {posts.length === 0 && !loading && !message.text && (
        <p className="no-results">Enter search criteria and click Search to find posts.</p>
      )}
    </div>
  );
}