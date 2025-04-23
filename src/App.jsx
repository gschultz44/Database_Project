import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import ProjectEntry from './pages/ProjectEntry';
import PostEntry from './pages/PostEntry';
import UserEntry from './pages/UserEntry';
import AnalysisEntry from './pages/AnalysisEntry';
import QueryPosts from './pages/QueryPosts';
import QueryProjects from './pages/QueryProjects';
import ProjectAnalytics from './pages/ProjectAnalytics';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [dataEntryMenuOpen, setDataEntryMenuOpen] = useState(false);
  const [queryMenuOpen, setQueryMenuOpen] = useState(false);

  const toggleMenu = (menu) => {
    if (menu === 'dataEntry') {
      setDataEntryMenuOpen((prev) => !prev);
      setQueryMenuOpen(false);
    } else if (menu === 'query') {
      setQueryMenuOpen((prev) => !prev);
      setDataEntryMenuOpen(false);
    }
  };

  const navigateTo = (page) => {
    setActivePage(page);
    setDataEntryMenuOpen(false);
    setQueryMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dataEntryMenuOpen && !event.target.closest('#dataEntryMenu')) {
        setDataEntryMenuOpen(false);
      }
      if (queryMenuOpen && !event.target.closest('#queryMenu')) {
        setQueryMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dataEntryMenuOpen, queryMenuOpen]);

  const renderPageContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <div className="page-container home-page">
            <div className="hero-section">
              <h1 className="hero-title">Media Trackr</h1>
              <p className="hero-description">Collect, organize, and analyze social media data</p>
            </div>

            <div className="features-section">
              <div className="feature-cards">
                <div className="feature-card" onClick={() => toggleMenu('dataEntry')}>
                  <div className="feature-icon">📝</div>
                  <h3 className="feature-title">Data Entry</h3>
                  <p>Create projects, record posts, and enter analysis results</p>
                  {dataEntryMenuOpen && (
                    <div id="dataEntryMenu" className="submenu">
                      <button onClick={() => navigateTo('projectEntry')} className="submenu-item">Projects</button>
                      <button onClick={() => navigateTo('postEntry')} className="submenu-item">Social Media Posts</button>
                      <button onClick={() => navigateTo('userEntry')} className="submenu-item">User Information</button>
                      <button onClick={() => navigateTo('analysisEntry')} className="submenu-item">Analysis Results</button>
                    </div>
                  )}
                </div>
                <div className="feature-card" onClick={() => toggleMenu('query')}>
                  <div className="feature-icon">🔍</div>
                  <h3 className="feature-title">Advanced Queries</h3>
                  <p>Search posts by platform, time period, or user information</p>
                  {queryMenuOpen && (
                    <div id="queryMenu" className="submenu">
                      <button onClick={() => navigateTo('postQuery')} className="submenu-item">Query Posts</button>
                      <button onClick={() => navigateTo('projectQuery')} className="submenu-item">Query Projects</button>
                    </div>
                  )}
                </div>
                {/* Project Analytics card */}
                <div className="feature-card" onClick={() => navigateTo('projectAnalytics')}>
                  <div className="feature-icon">📊</div>
                  <h3 className="feature-title">Project Analytics</h3>
                  <p>View statistics and completion metrics for your projects</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'projectEntry':
        return <ProjectEntry />;
      case 'postEntry':
        return <PostEntry />;
      case 'userEntry':
        return <UserEntry />;
      case 'analysisEntry':
        return <AnalysisEntry />;
      case 'postQuery':
        return <QueryPosts />;
      case 'projectQuery':
        return <QueryProjects />;
      case 'projectAnalytics': 
        return <ProjectAnalytics />;
      default:
        return (
          <div className="page-container error-page">
            <h1>404</h1>
            <p>The page you're looking for could not be found.</p>
            <button className="primary-button" onClick={() => navigateTo('home')}>
              Return to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activePage={activePage}
        navigateTo={navigateTo}
        toggleDropdown={toggleMenu}
        dataEntryMenuOpen={dataEntryMenuOpen}
        queryMenuOpen={queryMenuOpen}
      />
      <main className="main-content">
        {renderPageContent()}
      </main>
    </div>
  );
}

export default App;
