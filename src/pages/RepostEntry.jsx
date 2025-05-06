import React, { useState, useEffect } from "react";
import './styling/PostEntry.css';

export default function RepostEntry() {
  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState([]);
  const [existingPosts, setExistingPosts] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlatform, setSearchPlatform] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // State for the repost form
  const [repost, setRepost] = useState({
    username: "",
    repostDatetime: "",
    platform: ""
  });
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchSocialMediaPlatforms();
    fetchExistingPosts();
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

  const fetchExistingPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts');
      if (!response.ok) throw new Error('Failed to fetch existing posts');
      const data = await response.json();
      // Filter out posts that are already reposts
      const originalPosts = data.filter(post => !post.is_repost);
      setExistingPosts(originalPosts);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };
  
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    performSearch(term, searchPlatform);
  };
  
  const handlePlatformSearch = (e) => {
    const platform = e.target.value;
    setSearchPlatform(platform);
    performSearch(searchTerm, platform);
  };
  
  const performSearch = (term, platform) => {
    if (term.length < 2 && !platform) {
      setSearchResults([]);
      return;
    }
    
    // Filter existing posts based on search term and platform
    let results = existingPosts;
    
    if (term.length >= 2) {
      results = results.filter(post => 
        post.content.toLowerCase().includes(term) || 
        post.username.toLowerCase().includes(term)
      );
    }
    
    if (platform) {
      results = results.filter(post => post.media_name === platform);
    }
    
    setSearchResults(results.slice(0, 10)); // Limit to 10 results for performance
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    
    // Pre-fill the platform since it must match
    setRepost(prevRepost => ({
      ...prevRepost,
      platform: post.media_name,
      // Set a default repost datetime (current time)
      repostDatetime: new Date().toISOString().slice(0, 16)
    }));
    
    // Scroll to the repost form
    setTimeout(() => {
      document.getElementById('repost-form').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const validateRepostTime = () => {
    if (!selectedPost || !repost.repostDatetime) return false;
    
    const originalTime = new Date(selectedPost.post_time);
    const repostTime = new Date(repost.repostDatetime);
    
    return repostTime > originalTime;
  };
  
  const verifyUserPlatform = async (username, platform) => {
    try {
      // Check if the user exists on the specified platform
      const response = await fetch(`http://localhost:3000/api/users?platform=${encodeURIComponent(platform)}`);
      const users = await response.json();
      
      const userOnPlatform = users.some(user => 
        user.username === username && user.media_name === platform
      );
      
      if (!userOnPlatform) {
        setMessage({ 
          text: `User "${username}" does not exist on ${platform}. Please enter a valid username for this platform.`, 
          type: 'error' 
        });
        return false;
      }
      
      // Check if user is trying to repost their own post
      if (username === selectedPost.username) {
        setMessage({
          text: `You cannot repost your own post. Please use a different username.`,
          type: 'error'
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error verifying user platform:", error);
      setMessage({ text: "Failed to verify user on platform.", type: 'error' });
      return false;
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRepost(prevRepost => ({
      ...prevRepost,
      [name]: value
    }));
    
    // Clear previous error messages when user makes changes
    if (message.type === 'error') {
      setMessage({ text: '', type: '' });
    }
  };
  
  const handleSubmit = async () => {
    // Validate inputs
    if (!selectedPost) {
      setMessage({ text: "Please select a post to repost.", type: 'error' });
      return;
    }
    
    if (!repost.username.trim()) {
      setMessage({ text: "Please enter your username.", type: 'error' });
      return;
    }
    
    if (!repost.repostDatetime) {
      setMessage({ text: "Please enter a repost datetime.", type: 'error' });
      return;
    }
    
    // Validate repost time is after original post time
    if (!validateRepostTime()) {
      setMessage({ text: "Repost time must be after the original post time.", type: 'error' });
      return;
    }
    
    // Verify user exists on the platform
    const isValidUser = await verifyUserPlatform(repost.username.trim(), selectedPost.media_name);
    if (!isValidUser) return;
    
    try {
      // Prepare post data for creating a new post that's marked as a repost
      const postBody = {
        // Core post data
        username: repost.username.trim(),
        media_name: selectedPost.media_name,
        content: selectedPost.content,
        post_time: repost.repostDatetime,
        
        // Mark as repost
        is_repost: true,
        
        // Original post information
        original_username: selectedPost.username,
        original_id: selectedPost.post_id,
        repost_time: repost.repostDatetime,
        
        // Copy location data from original post
        city: selectedPost.city || null,
        state_name: selectedPost.state_name || null,
        country: selectedPost.country || null,
        
        // Copy metadata from original post
        likes: 0, // New reposts start with 0 likes
        dislikes: 0, // New reposts start with 0 dislikes
        multimedia: selectedPost.multimedia || null,
        project_name: selectedPost.project_name || null,
        field_name: selectedPost.field_name || null
      };
      
      console.log("Sending repost data:", postBody);

      // Create the post with repost information included
      const postResponse = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });

      if (postResponse.ok) {
        setMessage({ text: "Repost created successfully!", type: 'success' });
        
        // Reset form
        setRepost({
          username: "",
          repostDatetime: "",
          platform: ""
        });
        setSelectedPost(null);
        setSearchTerm("");
        setSearchPlatform("");
        setSearchResults([]);
        
        // Refresh the posts list
        fetchExistingPosts();
        
        // Clear success message after a delay
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      } else {
        const errorData = await postResponse.json();
        setMessage({ text: errorData.error || "Failed to create repost.", type: 'error' });
      }
    } catch (error) {
      console.error("Error creating repost:", error);
      setMessage({ text: "An error occurred while creating the repost.", type: 'error' });
    }
  };

  // Format date for display in search results
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return dateString;
    }
  };

  // Truncate long content for display in search results
  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className="page-container">
      <h1 className="hero-title" style={{ color: 'black' }}>Repost Content</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="repost-search-section">
        <h2>Find a post to repost</h2>
        <div className="search-filters">
          <div className="form-group">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="input-field"
              placeholder="Search for posts by content or username"
            />
          </div>
          
          <div className="form-group">
            <select
              value={searchPlatform}
              onChange={handlePlatformSearch}
              className="input-field"
            >
              <option value="">Filter by platform (optional)</option>
              {socialMediaPlatforms.map(platform => (
                <option key={platform.media_name} value={platform.media_name}>
                  {platform.media_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Select a post to repost:</h3>
            <ul className="post-list">
            {searchResults.length > 0 && (
              <div className="results-container">
                <h2 className="section-title">Search Results</h2>
                {searchResults.map((result) => (
                  <div className="post-card" key={result.post_id}>
                    <hr className="post-divider" />

                    <p className="post-text">{truncateContent(result.content)}</p>

                    <p className="post-info">
                      {result.media_name} | {result.username} | {formatDate(result.post_time)}
                    </p>

                    {result.project_name && (
                      <div className="project-section">
                        <p className="project-header">Project: <strong>{result.project_name}</strong></p>
                      </div>
                    )}

                    {result.city && (
                      <div className="location">
                        <p>📍 {result.city}{result.state_name ? `, ${result.state_name}` : ''}{result.country ? `, ${result.country}` : ''}</p>
                      </div>
                    )}

                    <button 
                      className="btn-secondary"
                      onClick={() => handleSelectPost(result)}
                    >
                      Repost This
                    </button>
                  </div>
                ))}
              </div>
            )}
            </ul>
          </div>
        )}
        
        {(searchTerm.length >= 2 || searchPlatform) && searchResults.length === 0 && (
          <div className="no-results">No posts found matching your search.</div>
        )}
      </div>
      
      {selectedPost && (
        <div id="repost-form" className="repost-form-section">
          <h2>Create Repost</h2>
          
          {selectedPost && (
            <div className="post-card selected-post">
              <h2 className="section-title">Original Post</h2>
              <hr className="post-divider" />

              <div className="detail-row">
                <span className="detail-label">Username:</span>
                <span className="detail-value">{selectedPost.username}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Platform:</span>
                <span className="detail-value">{selectedPost.media_name}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Posted On:</span>
                <span className="detail-value">{formatDate(selectedPost.post_time)}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Content:</span>
                <div className="detail-value content-box">{selectedPost.content}</div>
              </div>

              {selectedPost.multimedia && (
                <div className="detail-row">
                  <span className="detail-label">Media:</span>
                  <span className="detail-value">{selectedPost.multimedia}</span>
                </div>
              )}

              {selectedPost.project_name && (
                <div className="detail-row">
                  <span className="detail-label">Project:</span>
                  <span className="detail-value">{selectedPost.project_name}</span>
                </div>
              )}

              {selectedPost.field_name && (
                <div className="detail-row">
                  <span className="detail-label">Field:</span>
                  <span className="detail-value">{selectedPost.field_name}</span>
                </div>
              )}

              {selectedPost.city && (
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">
                    📍 {selectedPost.city}
                    {selectedPost.state_name ? `, ${selectedPost.state_name}` : ''}
                    {selectedPost.country ? `, ${selectedPost.country}` : ''}
                  </span>
                </div>
              )}
            </div>
          )}

          
          <div className="repost-details">
            <h3>Repost Details</h3>
            
            <div className="form-group">
              <label>Your Username<span className="required-asterisk">*</span></label>
              <input
                name="username"
                value={repost.username}
                onChange={handleChange}
                required
                maxLength={40}
                className="input-field"
                placeholder="Enter your username"
              />
              <small className="form-hint">Must be a valid username on {selectedPost.media_name}</small>
            </div>
            
            <div className="form-group">
              <label>Repost Time<span className="required-asterisk">*</span></label>
              <input
                type="datetime-local"
                name="repostDatetime"
                value={repost.repostDatetime}
                onChange={handleChange}
                required
                className="input-field"
                min={selectedPost.post_time ? new Date(selectedPost.post_time).toISOString().slice(0, 16) : ""}
              />
              <small className="form-hint">Must be after the original post time</small>
            </div>
            
            <div className="form-group">
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                Create Repost
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}