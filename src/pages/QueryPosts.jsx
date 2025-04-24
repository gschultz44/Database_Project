import React, { useEffect, useState } from 'react';
import './styling/QueryPosts.css';

const QueryPosts = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    media: '',
    username: '',
    first_name: '',
    last_name: '',
    start_date: '',
    end_date: '',
    multimediaType: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateDates = () => {
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate < startDate) {
        alert("End date cannot be before start date");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates()) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/query-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error querying posts:', error);
    }
    setLoading(false);
  };

  return (
    <div className="query-posts-container">
      <h1 className="page-title">Query Social Media Posts</h1>
      <form className="query-form" onSubmit={handleSubmit}>
        <input name="media" placeholder="Social Media (e.g., Facebook)" onChange={handleChange} value={formData.media} />
        {/* added drop down */}
        <select 
            name="multimediaType" 
            onChange={handleChange} 
            value={formData.multimediaType}
            className="input-field"
          >
            <option value="">All Multimedia Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="other">Other</option>
        </select>
        <input name="username" placeholder="Username" onChange={handleChange} value={formData.username} />
        <input name="username" placeholder="Username" onChange={handleChange} value={formData.username} />
        <input name="first_name" placeholder="First Name" onChange={handleChange} value={formData.first_name} />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} value={formData.last_name} />
        <input type="date" name="start_date" onChange={handleChange} value={formData.start_date} />
        <input type="date" name="end_date" onChange={handleChange} value={formData.end_date} />
        <button type="submit" disabled={loading}>{loading ? 'Querying...' : 'Search Posts'}</button>
      </form>
      <div className="results-container">
        {posts.length > 0 && posts.map((post, index) => (
          <div className="post-card" key={index}>
            <p className="post-text">{post.text}</p>
            <p className="post-info">{post.media} | {post.username} | {new Date(post.time_posted).toLocaleString()}
            {post.multimediaType && ` | Type: ${post.multimediaType}`}
            </p>
            {post.projects && post.projects.length > 0 && (
              <div className="project-section">
                <p className="project-header">Projects Analyzed:</p>
                <ul>
                  {post.projects.map((proj, i) => (
                    <li key={i}>
                      <strong>{proj.name}</strong>
                      <ul>
                        {proj.analysis.map((field, j) => (
                          <li key={j}>{field.name}: {field.value}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && !loading && <p className="no-results">No results found.</p>}
      </div>
    </div>
  );
};

export default QueryPosts;
