import React from 'react';
import './PostResults.css';

const PostResults = ({ posts = [], loading, error }) => {
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
    } catch (e) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  if (loading) {
    return (
      <div className="post-results-loading">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-results-error">
        <h3>Error Loading Posts</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="post-results-empty">
        <h3>No Posts Found</h3>
        <p>Try adjusting your search filters or add new posts.</p>
      </div>
    );
  }

  return (
    <div className="post-results-container">
      <div className="post-results-header">
        <h2>Search Results</h2>
        <div className="post-count">{posts.length} posts found</div>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-user-info">
                <span className="username">{post.username}</span>
                <span className="platform-badge">{post.socialMedia}</span>
                {post.verified && <span className="verified-badge" title="Verified User">✓</span>}
              </div>
              <div className="post-date">{formatDate(post.postDate)}</div>
            </div>
            
            <div className="post-content">
              <p>{post.postText}</p>
              
              <div className="post-meta">
                {post.location && (
                  <div className="post-location">
                    <i className="location-icon">📍</i> {post.location}
                  </div>
                )}
                
                {post.mediaType && post.mediaType !== 'text' && (
                  <div className="post-media-type">
                    <span className={`media-badge ${post.mediaType}`}>
                      {post.mediaType}
                    </span>
                  </div>
                )}
                
                {(post.likes !== undefined || post.dislikes !== undefined) && (
                  <div className="post-reactions">
                    {post.likes !== undefined && (
                      <span className="likes">
                        <i className="like-icon">👍</i> {post.likes}
                      </span>
                    )}
                    {post.dislikes !== undefined && (
                      <span className="dislikes">
                        <i className="dislike-icon">👎</i> {post.dislikes}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {post.experiments && post.experiments.length > 0 && (
              <div className="post-experiments">
                <h4>Associated Projects</h4>
                <ul className="experiment-list">
                  {post.experiments.map((exp) => (
                    <li key={exp.id || exp.name} className="experiment-item">
                      <div className="experiment-header">
                        <span className="experiment-name">{exp.name}</span>
                        <span className="experiment-institute">{exp.institute}</span>
                      </div>
                      
                      {exp.results && Object.keys(exp.results).length > 0 && (
                        <div className="experiment-results">
                          <h5>Analysis Results</h5>
                          <ul className="result-list">
                            {Object.entries(exp.results).map(([field, value]) => (
                              <li key={field} className="result-item">
                                <span className="result-field">{field}:</span>
                                <span className="result-value">{value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostResults;