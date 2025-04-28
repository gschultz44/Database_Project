import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './styling/ProjectSearch.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  // Search filters
  const [filters, setFilters] = useState({
    query: '',
    startDate: '',
    endDate: '',
    sentiment: '',
    category: '',
    sortBy: 'date',
    sortOrder: 'desc',
    projectName: '',
    username: ''
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          title: "Project Milestone Reached",
          date: "2025-04-15",
          sentiment: "positive",
          sentimentScore: 0.87,
          category: "progress",
          content: "The team has successfully completed the first phase of development.",
          engagement: 125,
          projectName: 'project one',
          username: 'user123'
        },
        {
          id: 2,
          title: "Technical Issue Reported",
          date: "2025-04-12",
          sentiment: "negative",
          sentimentScore: 0.21,
          category: "bugs",
          content: "Users reporting problems with the checkout flow after latest update.",
          engagement: 78,
          projectName: 'Final Project',
          username: 'usrnm'
        },
        {
          id: 3,
          title: "Weekly Team Meeting",
          date: "2025-04-10",
          sentiment: "neutral",
          sentimentScore: 0.52,
          category: "meetings",
          content: "Standard progress update and planning for next sprint.",
          engagement: 45,
          projectName: 'Databases',
          username: 'FirstName'
        },
        {
          id: 4,
          title: "New Feature Launch",
          date: "2025-04-05",
          sentiment: "positive",
          sentimentScore: 0.94,
          category: "features",
          content: "The search functionality has been enhanced with advanced filtering.",
          engagement: 210,
          projectName: 'Proj2',
          username: 'LastName'
        },
        {
          id: 5,
          title: "Budget Review",
          date: "2025-04-03",
          sentiment: "neutral",
          sentimentScore: 0.49,
          category: "planning",
          content: "Financial planning meeting to allocate resources for Q3.",
          engagement: 62,
          projectName: 'Project3',
          username: 'User2'
        }
      ];
      setSearchResults(mockData);
      setFilteredResults(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setIsLoading(true);
    
    // Filter logic
    let results = searchResults;
    
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
      );
    }
    
    // Date filters
    if (filters.startDate) {
      results = results.filter(item => new Date(item.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      results = results.filter(item => new Date(item.date) <= new Date(filters.endDate));
    }
    
    // Sentiment filter
    if (filters.sentiment) {
      results = results.filter(item => item.sentiment === filters.sentiment);
    }
    
    // Category filter
    if (filters.category) {
      results = results.filter(item => item.category === filters.category);
    }

    // Project name filter
    if(filters.projectName) {
      results = results.filter(item => item.projectName === filters.projectName);
    }

    // Username filter
    if(filters.username) {
      results = results.filter(item => item.username === filters.username);
    }
    
    // Sorting
    results.sort((a, b) => {
      if (filters.sortBy === 'date') {
        return filters.sortOrder === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (filters.sortBy === 'engagement') {
        return filters.sortOrder === 'asc'
          ? a.engagement - b.engagement
          : b.engagement - a.engagement;
      } else if (filters.sortBy === 'sentiment') {
        return filters.sortOrder === 'asc'
          ? a.sentimentScore - b.sentimentScore
          : b.sentimentScore - a.sentimentScore;
      }
      return 0;
    });
    
    // Update state
    setFilteredResults(results);
    setNoResults(results.length === 0);
    setIsLoading(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      query: '',
      startDate: '',
      endDate: '',
      sentiment: '',
      category: '',
      sortBy: 'date',
      sortOrder: 'desc',
      projectName: '',
      username: ''
    });
    setFilteredResults(searchResults);
    setNoResults(false);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Project Data</h1>
        <p>Find and analyze project content across your workspace</p>
      </div>

      <div className="search-container">
        <div className="search-filters">
          <h2>Filters</h2>
          
          <div className="filter-group">
            <label htmlFor="query">Search Query</label>
            <input
              type="text"
              id="query"
              name="query"
              value={filters.query}
              onChange={handleFilterChange}
              placeholder="Search by keyword"
              className="full-width"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="projectName">Project Name</label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={filters.projectName}
              onChange={handleFilterChange}
              placeholder="Search by project name"
              className="full-width"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={filters.username}
              onChange={handleFilterChange}
              placeholder="Search by username"
              className="full-width"
            />
          </div>
          
          <div className="filter-group date-filter">
            <label>Date Range</label>
            <div className="date-inputs">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                placeholder="From"
              />
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                placeholder="To"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sentiment">Sentiment</label>
            <select 
              id="sentiment" 
              name="sentiment" 
              value={filters.sentiment}
              onChange={handleFilterChange}
              className="full-width"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              name="category" 
              value={filters.category}
              onChange={handleFilterChange}
              className="full-width"
            >
              <option value="">All Categories</option>
              <option value="progress">Progress</option>
              <option value="bugs">Bugs</option>
              <option value="meetings">Meetings</option>
              <option value="features">Features</option>
              <option value="planning">Planning</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortBy">Sort By</label>
            <div className="sort-controls">
              <select 
                id="sortBy" 
                name="sortBy" 
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="date">Date</option>
                <option value="engagement">Engagement</option>
                <option value="sentiment">Sentiment</option>
              </select>
              <select 
                id="sortOrder" 
                name="sortOrder" 
                value={filters.sortOrder}
                onChange={handleFilterChange}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          
          <div className="filter-buttons">
            <button onClick={applyFilters} className="primary-button">Apply Filters</button>
            <button onClick={clearFilters} className="secondary-button">Clear Filters</button>
          </div>
          
          <div className="export-section">
            <CSVLink 
              data={filteredResults} 
              filename="search_results.csv"
              className="export-button"
            >
              Export Results
            </CSVLink>
          </div>
        </div>

        <div className="search-results">
          <div className="results-header">
            <h2>Results ({filteredResults.length})</h2>
          </div>
          
          {isLoading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading results...</p>
            </div>
          ) : noResults ? (
            <div className="no-results">
              <p>No results found matching your criteria.</p>
              <button onClick={clearFilters} className="secondary-button">Clear Filters</button>
            </div>
          ) : (
            <div className="results-list">
              {filteredResults.map(item => (
                <div key={item.id} className={`result-card ${item.sentiment}`}>
                  <div className="result-header">
                    <h3>{item.title}</h3>
                    <span className={`sentiment-badge ${item.sentiment}`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <div className="result-meta">
                    <span className="date">{item.date}</span>
                    <span className="category">{item.category}</span>
                    <span className="engagement">
                      Engagement: {item.engagement}
                    </span>
                  </div>
                  <p className="result-content">{item.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;