import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import { useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './styling/ProjectAnalytics.css';

const ProjectAnalytics = () => {
  const useMockData = true; // Toggle to false when using backend

  const location = useLocation();
  const incomingFilters = location.state.filters || {};
  
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [exportData, setExportData] = useState([]);

  const [filters, setFilters] = useState({
    startDate: incomingFilters.startDate || '',
    endDate: incomingFilters.endDate || '',
    sentiment: incomingFilters.sentiment || '',
    keyword: incomingFilters.query || '',
    projectName: incomingFilters.projectName || '',
    username: incomingFilters.username || '',
  });

  useEffect(() => {
    if (useMockData) {
      const mockPosts = [
        {
          date: '2025-04-01',
          sentiment: 'positive',
          sentimentScore: 0.9,
          engagement: 120,
          content: 'Great progress on our project!',
          projectName: 'project one',
          username: 'user123',
        },
        {
          date: '2025-04-03',
          sentiment: 'neutral',
          sentimentScore: 0.5,
          engagement: 75,
          content: 'Team meeting today went as expected.',
          projectName: 'Final Project',
          username: 'usrnm',
        },
        {
          date: '2025-04-05',
          sentiment: 'negative',
          sentimentScore: 0.2,
          engagement: 40,
          content: 'Faced some blockers during integration.',
          projectName: 'Databases',
          username: 'FirstName',
        },
        {
          date: '2025-04-10',
          sentiment: 'positive',
          sentimentScore: 0.8,
          engagement: 110,
          content: 'Successfully deployed the latest build!',
          projectName: 'Proj2',
          username: 'LastName',
        },
      ];
      setAllData(mockPosts);
      setFilteredData(mockPosts);
      prepareExportData(mockPosts);
    } else {
      // TODO: Replace with real fetch when backend is ready
      // fetch('/api/posts')
      //   .then(res => res.json())
      //   .then(data => {
      //     setAllData(data);
      //     setFilteredData(data);
      //     prepareExportData(data);
      //   });
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let data = allData;

    if (filters.startDate) {
      data = data.filter((post) => new Date(post.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      data = data.filter((post) => new Date(post.date) <= new Date(filters.endDate));
    }
    if (filters.sentiment) {
      data = data.filter((post) => post.sentiment === filters.sentiment);
    }
    if (filters.keyword) {
      data = data.filter((post) =>
        post.content.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }
    if (filters.projectName) {
      data = data.filter((post) =>
        post.projectName.toLowerCase().includes(filters.projectName.toLowerCase())
      );
    }
    if (filters.username) {
      data = data.filter((post) =>
        post.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    setFilteredData(data);
    prepareExportData(data);
  };

  const prepareExportData = (data) => {
    const exportFormattedData = data.map((post) => ({
      date: post.date,
      sentiment: post.sentiment,
      engagement: post.engagement,
      content: post.content,
    }));
    setExportData(exportFormattedData);
  };

  const sentimentData = {
    labels: filteredData.map((post) => post.date),
    datasets: [
      {
        label: 'Sentiment Score',
        data: filteredData.map((post) => post.sentimentScore),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="analytics-page">
      <h1>Project Analytics</h1>

      <div className="filters">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <select name="sentiment" value={filters.sentiment} onChange={handleFilterChange}>
          <option value="">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
        <input
          type="text"
          name="keyword"
          value={filters.keyword}
          onChange={handleFilterChange}
          placeholder="Search by Keyword"
        />
        <input
          type="text"
          name="projectName"
          value={filters.projectName}
          onChange={handleFilterChange}
          placeholder="Search by Project Name"
        />
        <input
          type="text"
          name="username"
          value={filters.username}
          onChange={handleFilterChange}
          placeholder="Search by Username"
        />
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      <div className="chart">
        <h2>Sentiment Score Over Time</h2>
        <Line data={sentimentData} />
      </div>

      <div className="post-table">
        <h2>Post Analytics</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Sentiment</th>
              <th>Engagement</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((post, index) => (
              <tr key={index}>
                <td>{post.date}</td>
                <td>{post.sentiment}</td>
                <td>{post.engagement}</td>
                <td>{post.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="export-button">
        <CSVLink data={exportData} filename="project_analytics.csv">
          <button>Export Data</button>
        </CSVLink>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
