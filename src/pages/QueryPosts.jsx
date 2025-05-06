import React, { useState, useEffect } from "react";
import './styling/QueryPosts.css';

export default function QueryPosts() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState([]);
  
  const [post, setPost] = useState({
    media_name: "",
    username: "",
    first_name: "",
    last_name: "",
    content: "",
    date_from: "",
    date_to: "",
  });

  useEffect(() => {
    fetchSocialMediaPlatforms();
  }, []);

  const fetchSocialMediaPlatforms = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/socialmedia');
      if (!response.ok) throw new Error('Failed to fetch social media platforms');
      const data = await response.json();
      setSocialMediaPlatforms(data);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const validateDates = () => {
    if (post.date_from && post.date_to) {
      const startDate = new Date(post.date_from);
      const endDate = new Date(post.date_to);
      if (endDate < startDate) {
        setMessage({ text: "End date cannot be before start date", type: 'error' });
        return false;
      }
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost(prevPost => ({
      ...prevPost,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (post.date_from && !post.date_to) {
      setMessage({ text: "Please provide an end date when using a start date.", type: 'error' });
      return;
    }
    
    if (post.date_to && !post.date_from) {
      setMessage({ text: "Please provide a start date when using an end date.", type: 'error' });
      return;
    }
    
    if (!validateDates()) return;

    if (!post.media_name && !post.username && !post.first_name && !post.last_name && !post.content && !post.date_from && !post.date_to) {
      setMessage({ text: "Please provide at least one search parameter.", type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const params = new URLSearchParams();
      if (post.username) params.append('username', post.username);
      if (post.first_name) params.append('first_name', post.first_name);
      if (post.last_name) params.append('last_name', post.last_name);
      if (post.media_name) params.append('media_name', post.media_name);
      if (post.date_from) params.append('date_from', post.date_from);
      if (post.date_to) params.append('date_to', post.date_to);
      if (post.content) params.append('content', post.content);

      const response = await fetch(`http://localhost:3000/api/query/posts?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data);

      if (data.length === 0) {
        setMessage({ text: "No results found.", type: 'info' });
      } else {
        setMessage({ text: `Found ${data.length} posts matching your criteria.`, type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error('Error querying posts:', error);
      setMessage({ text: "An error occurred while querying posts.", type: 'error' });
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="hero-title" style={{ color: 'black' }}>Query Social Media Posts</h1>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="space-y-4">
        <div className="form-group">
          <label>Social Media</label>
          <select
            name="media_name"
            value={post.media_name}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select a social media platform</option>
            {socialMediaPlatforms.map(platform => (
              <option key={platform.media_name} value={platform.media_name}>
                {platform.media_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            value={post.username}
            onChange={handleChange}
            className="input-field"
            placeholder="Search by username"
          />
        </div>

        <div className="form-group">
          <label>First Name</label>
          <input
            name="first_name"
            value={post.first_name}
            onChange={handleChange}
            className="input-field"
            placeholder="Search by first name"
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            name="last_name"
            value={post.last_name}
            onChange={handleChange}
            className="input-field"
            placeholder="Search by last name"
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <input
            name="content"
            value={post.content}
            onChange={handleChange}
            className="input-field"
            placeholder="Search by keywords in post content"
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="date_from"
            value={post.date_from}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="date_to"
            value={post.date_to}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Querying...' : 'Search Posts'}
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
