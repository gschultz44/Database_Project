import React, { useState } from 'react';
import './QueryFilter.css';

const QueryFilter = ({ onSearch, isLoading }) => {
  const [filters, setFilters] = useState({
    projectName: '',
    username: '',
    socialMediaPlatform: '',
    mediaType: '',
    startDate: '',
    endDate: '',
    firstName: '',
    lastName: ''
  });
  
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Clear date error if changing either date field
    if ((name === 'startDate' || name === 'endDate') && errors.dateRange) {
      setErrors(prev => ({
        ...prev,
        dateRange: null
      }));
    }
  };

  // Validate filters before search
  const validateFilters = () => {
    const newErrors = {};

    // Check date range (if both are provided)
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      
      if (end < start) {
        newErrors.dateRange = 'End date cannot be before start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateFilters()) {
      // Remove empty filters and sanitize inputs before searching
      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value.trim() !== '') {
          // Simple sanitization to prevent SQL injection
          acc[key] = value.trim().replace(/['";]/g, '');
        }
        return acc;
      }, {});
      
      onSearch(activeFilters);
    }
  };

  // Reset all filters
  const handleReset = () => {
    setFilters({
      projectName: '',
      username: '',
      socialMediaPlatform: '',
      mediaType: '',
      startDate: '',
      endDate: '',
      firstName: '',
      lastName: ''
    });
    setErrors({});
  };

  return (
    <div className="query-filter-container">
      <h2>Search Posts</h2>
      <form onSubmit={handleSubmit} className="query-filter-form">
        <div className="filter-section">
          <h3>Basic Filters</h3>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="projectName">Project Name:</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={filters.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={filters.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={filters.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={filters.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Content Filters</h3>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="socialMediaPlatform">Social Media Platform:</label>
              <input
                type="text"
                id="socialMediaPlatform"
                name="socialMediaPlatform"
                value={filters.socialMediaPlatform}
                onChange={handleChange}
                placeholder="e.g., Facebook, Twitter"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="mediaType">Media Type:</label>
              <select
                id="mediaType"
                name="mediaType"
                value={filters.mediaType}
                onChange={handleChange}
              >
                <option value="">All Types</option>
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Date Range</h3>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
          {errors.dateRange && (
            <div className="error-text date-error">{errors.dateRange}</div>
          )}
        </div>
        
        <div className="filter-actions">
          <button 
            type="button" 
            className="secondary-button" 
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset Filters
          </button>
          <button 
            type="submit" 
            className="primary-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search Posts'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueryFilter;