import React from 'react';
import './PostForm.css';

const PostForm = ({
  projectId,
  platform,
  postContent,
  postDate,
  userId,
  location,
  likes,
  dislikes,
  multimedia,
  repostId,
  onChange,
  onSubmit,
  errors = {},
  isLoading = false
}) => {
  
  // Handle form input changes
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };
  
  return (
    <div className="post-form-container">
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="userId">Username:*</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={userId}
            onChange={handleChange}
            maxLength={40}
            className={errors.userId ? 'error-input' : ''}
            required
          />
          {errors.userId && <span className="error-text">{errors.userId}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="platform">Social Media Platform:*</label>
          <input
            type="text"
            id="platform"
            name="platform"
            value={platform}
            onChange={handleChange}
            className={errors.platform ? 'error-input' : ''}
            required
          />
          {errors.platform && <span className="error-text">{errors.platform}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="multimedia">Media Type:*</label>
          <select
            id="multimedia"
            name="multimedia"
            value={multimedia}
            onChange={handleChange}
            className={errors.multimedia ? 'error-input' : ''}
            required
          >
            <option value="">-- Select Media Type --</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="other">Other</option>
          </select>
          {errors.multimedia && <span className="error-text">{errors.multimedia}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="postContent">Post Content:*</label>
          <textarea
            id="postContent"
            name="postContent"
            value={postContent}
            onChange={handleChange}
            rows={5}
            className={errors.postContent ? 'error-input' : ''}
            required
          />
          {errors.postContent && <span className="error-text">{errors.postContent}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="postDate">Post Date/Time:</label>
          <input
            type="datetime-local"
            id="postDate"
            name="postDate"
            value={postDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={handleChange}
            placeholder="City, State, Country"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="likes">Likes:</label>
            <input
              type="number"
              id="likes"
              name="likes"
              value={likes}
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="form-group half-width">
            <label htmlFor="dislikes">Dislikes:</label>
            <input
              type="number"
              id="dislikes"
              name="dislikes"
              value={dislikes}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="projectId">Project ID:</label>
          <input
            type="text"
            id="projectId"
            name="projectId"
            value={projectId}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="repostId">Repost ID:</label>
          <input
            type="text"
            id="repostId"
            name="repostId"
            value={repostId}
            onChange={handleChange}
            placeholder="Enter original post ID if this is a repost"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="primary-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;