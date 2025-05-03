import React, { useState, useEffect } from "react";
import './styling/PostEntry.css'; // Reusing your existing CSS

export default function QueryProjects() {
  const [projects, setProjects] = useState([]);
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [posts, setPosts] = useState([]);
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
      
      // First, we need to get all posts
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
      // When project changes, clear field selection and fetch new fields
      setQueryParams(prev => ({
        ...prev,
        [name]: value,
        fieldName: ""
      }));
      
      // Fetch fields for the selected project
      fetchFieldsByProject(value);
    } else {
      setQueryParams(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

      {posts.length > 0 && (
        <div className="results-container">
          {posts.map((post, index) => (
            <div className="post-card" key={index}>
              <p className="post-text">{post.content}</p>
              <p className="post-info">
                {post.media_name} | {post.username} | {new Date(post.post_time).toLocaleString()}
                {post.multimedia && ` | Multimedia: ${post.multimedia}`}
              </p>
              {post.project_name && (
                <div className="project-section">
                  <p className="project-header">Project: {post.project_name}</p>
                  {post.field_name && <p>Field: {post.field_name}</p>}
                </div>
              )}
              {post.likes || post.dislikes ? (
                <div className="engagement">
                  {post.likes > 0 && <span>Likes: {post.likes}</span>}
                  {post.dislikes > 0 && <span> Dislikes: {post.dislikes}</span>}
                </div>
              ) : null}
              {post.city && (
                <div className="location">
                  <p>📍 {post.city}{post.state_name ? `, ${post.state_name}` : ''}{post.country ? `, ${post.country}` : ''}</p>
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