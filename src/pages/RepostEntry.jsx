import React, { useState } from 'react';
import './styling/PostEntry.css';

const RepostEntry = () => {
  const [originalPostId, setOriginalPostId] = useState('');
  const [repostNote, setRepostNote] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRepostSubmit = (e) => {
    e.preventDefault();

    if (!originalPostId) {
      setErrorMessage('Original Post ID is required.');
      setSuccessMessage('');
      return;
    }

    // TODO: Replace with actual API call to your backend
    console.log('Submitting repost:', {
      originalPostId,
      repostNote,
    });

    // Simulate success for now
    setSuccessMessage('Repost successfully entered.');
    setErrorMessage('');
    setOriginalPostId('');
    setRepostNote('');
  };

  return (
    <div className="page-container">
      <h1 className="hero-title">Repost Entry</h1>
      <form className="query-form" onSubmit={handleRepostSubmit}>
        <div className="form-group">
          <label htmlFor="originalPostId">Original Post ID *</label>
          <input
            id="originalPostId"
            type="text"
            name="originalPostId"
            placeholder="Enter the ID of the original post"
            value={originalPostId}
            onChange={(e) => setOriginalPostId(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="repostNote">Repost Note</label>
          <textarea
            id="repostNote"
            name="repostNote"
            placeholder="Optional notes about this repost"
            value={repostNote}
            onChange={(e) => setRepostNote(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn-primary">
            Submit Repost
          </button>
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default RepostEntry;  {/* Default export added here */}
