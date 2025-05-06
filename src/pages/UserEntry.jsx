import React, { useState, useEffect } from "react";
import './styling/UserEntry.css';

export default function UserEntry() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    media_name: '',
    first_name: '',
    last_name: '',
    birth_country: '',
    residence_country: '',
    other_birth_country: '',
    other_residence_country: '',
    age: '',
    gender: '',
    is_verified: false
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Fetch users and social media platforms when component mounts
  useEffect(() => {
    fetchUsers();
    fetchSocialMediaPlatforms();
  }, []);
  
  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) throw new Error('Unable to connect to the user database. Please try again later.');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setMessage({ 
        text: error.message || 'Network error while loading users. Please check your connection.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSocialMediaPlatforms = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/socialmedia');
      if (!response.ok) throw new Error('Unable to load social media platforms. Please try again later.');
      const data = await response.json();
      setSocialMediaPlatforms(data);
    } catch (error) {
      setMessage({ 
        text: error.message || 'Network error while loading platforms. Please check your connection.', 
        type: 'error' 
      });
    }
  };

  const countries = [
    "United States",
    "Canada",
    "Mexico",
    "United Kingdom",
    "Germany",
    "France",
    "India",
    "China",
    "Japan",
    "Australia",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear validation error when field is being edited
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    setNewUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateAge = () => {
    const num = parseInt(newUser.age);
    return !newUser.age || (!isNaN(num) && num >= 0 && num <= 150);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Username validation
    if (!newUser.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (newUser.username.length > 50) {
      errors.username = 'Username cannot exceed 50 characters';
      isValid = false;
    }

    // Social Media Platform validation
    if (!newUser.media_name.trim()) {
      errors.media_name = 'Please select a social media platform';
      isValid = false;
    }

    // First Name validation
    if (!newUser.first_name.trim()) {
      errors.first_name = 'First name is required';
      isValid = false;
    }

    // Last Name validation
    if (!newUser.last_name.trim()) {
      errors.last_name = 'Last name is required';
      isValid = false;
    }

    // Age validation
    if (newUser.age && !validateAge()) {
      errors.age = 'Age must be between 0 and 150';
      isValid = false;
    }

    // Birth Country validation
    if (newUser.birth_country === "Other" && !newUser.other_birth_country.trim()) {
      errors.other_birth_country = 'Please specify your birth country';
      isValid = false;
    }

    // Residence Country validation
    if (newUser.residence_country === "Other" && !newUser.other_residence_country.trim()) {
      errors.other_residence_country = 'Please specify your residence country';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (loading) return;
    
    // Clear previous messages
    setMessage({ text: '', type: '' });
    
    // Validate form
    if (!validateForm()) {
      setMessage({ 
        text: 'Please correct the error(s) before submitting.', 
        type: 'error' 
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare user data for submission
      const userToSubmit = {
        username: newUser.username.trim(),
        media_name: newUser.media_name || null,
        first_name: newUser.first_name.trim() || null,
        last_name: newUser.last_name.trim() || null,
        birth_country: newUser.birth_country === "Other" ? 
                      newUser.other_birth_country : 
                      newUser.birth_country || null,
        residence_country: newUser.residence_country === "Other" ? 
                         newUser.other_residence_country : 
                         newUser.residence_country || null,
        age: newUser.age ? parseInt(newUser.age) : null,
        gender: newUser.gender || null,
        is_verified: newUser.is_verified
      };
      
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToSubmit),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error cases from the server
        if (errorData.code === 'DUPLICATE_USER') {
          throw new Error(`Username "${newUser.username}" already exists on ${newUser.media_name}. Please choose another username.`);
        } else if (errorData.code === 'INVALID_PLATFORM') {
          throw new Error(`The selected social media platform is no longer available. Please refresh and try again.`);
        } else {
          throw new Error(errorData.error || 'Unable to create user account. Please try again later.');
        }
      }
      
      setMessage({ 
        text: `Success! User "${newUser.username}" has been added to the system.`, 
        type: 'success' 
      });
      
      setNewUser({
        username: '',
        media_name: '',
        first_name: '',
        last_name: '',
        birth_country: '',
        residence_country: '',
        other_birth_country: '',
        other_residence_country: '',
        age: '',
        gender: '',
        is_verified: false
      });
      
      // Refresh the users list
      fetchUsers();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
      
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="hero-title" style={{ color: 'black' }}>Add User Account</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-4">
        <div className={`form-group ${fieldErrors.username ? 'has-error' : ''}`}>
          <label htmlFor="username">Username<span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUser.username}
            onChange={handleChange}
            required
            className={`input-field ${fieldErrors.username ? 'error-input' : ''}`}
            placeholder="Enter Username"
          />
          {fieldErrors.username && <div className="error-text">{fieldErrors.username}</div>}
        </div>
        
        <div className={`form-group ${fieldErrors.media_name ? 'has-error' : ''}`}>
          <label htmlFor="media_name">Social Media Platform<span className="required-asterisk">*</span></label>
          <select
            id="media_name"
            name="media_name"
            value={newUser.media_name}
            onChange={handleChange}
            required
            className={`input-field ${fieldErrors.media_name ? 'error-input' : ''}`}
          >
            <option value="">Select a platform</option>
            {socialMediaPlatforms.map(platform => (
              <option key={platform.media_name} value={platform.media_name}>
                {platform.media_name}
              </option>
            ))}
          </select>
          {fieldErrors.media_name && <div className="error-text">{fieldErrors.media_name}</div>}
        </div>
        
        <div className={`form-group ${fieldErrors.first_name ? 'has-error' : ''}`}>
          <label htmlFor="first_name">First Name<span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={newUser.first_name}
            onChange={handleChange}
            className={`input-field ${fieldErrors.first_name ? 'error-input' : ''}`}
            required
            placeholder="Enter First Name"
          />
          {fieldErrors.first_name && <div className="error-text">{fieldErrors.first_name}</div>}
        </div>
        
        <div className={`form-group ${fieldErrors.last_name ? 'has-error' : ''}`}>
          <label htmlFor="last_name">Last Name<span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={newUser.last_name}
            onChange={handleChange}
            className={`input-field ${fieldErrors.last_name ? 'error-input' : ''}`}
            required
            placeholder="Enter Last Name"
          />
          {fieldErrors.last_name && <div className="error-text">{fieldErrors.last_name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="birth_country">Country of Birth</label>
          <select
            id="birth_country"
            name="birth_country"
            value={newUser.birth_country}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {newUser.birth_country === "Other" && (
            <div className={`form-group ${fieldErrors.other_birth_country ? 'has-error' : ''}`}>
              <label htmlFor="other_birth_country">Specify Country of Birth<span className="required-asterisk">*</span></label>
              <input
                type="text"
                id="other_birth_country"
                name="other_birth_country"
                value={newUser.other_birth_country}
                onChange={handleChange}
                required
                className={`input-field ${fieldErrors.other_birth_country ? 'error-input' : ''}`}
                placeholder="Enter Country"
              />
              {fieldErrors.other_birth_country && <div className="error-text">{fieldErrors.other_birth_country}</div>}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="residence_country">Country of Residence</label>
          <select
            id="residence_country"
            name="residence_country"
            value={newUser.residence_country}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {newUser.residence_country === "Other" && (
            <div className={`form-group ${fieldErrors.other_residence_country ? 'has-error' : ''}`}>
              <label htmlFor="other_residence_country">Specify Country of Residence<span className="required-asterisk">*</span></label>
              <input
                type="text"
                id="other_residence_country"
                name="other_residence_country"
                value={newUser.other_residence_country}
                onChange={handleChange}
                required
                className={`input-field ${fieldErrors.other_residence_country ? 'error-input' : ''}`}
                placeholder="Enter Country"
              />
              {fieldErrors.other_residence_country && <div className="error-text">{fieldErrors.other_residence_country}</div>}
            </div>
          )}
        </div>
        
        <div className={`form-group ${fieldErrors.age ? 'has-error' : ''}`}>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={newUser.age}
            onChange={handleChange}
            min="0"
            max="150"
            className={`input-field ${fieldErrors.age ? 'error-input' : ''}`}
            placeholder="Enter Age"
          />
          {fieldErrors.age && <div className="error-text">{fieldErrors.age}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={newUser.gender}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="is_verified"
              checked={newUser.is_verified}
              onChange={handleChange}
            />
            Verified Account
          </label>
        </div>
        
        <div className="form-group">
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit User'}
          </button>
        </div>
      </div>
      
      <div className="table-section">
        <h2>Existing Users</h2>
        
        {loading && <div className="loading-indicator">Loading users...</div>}
        
        {!loading && users.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Platform</th>
                <th>Name</th>
                <th>Birth Country</th>
                <th>Residence Country</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.media_name || '-'}</td>
                  <td>{`${user.first_name || ''} ${user.last_name || ''}`}</td>
                  <td>{user.birth_country || '-'}</td>
                  <td>{user.residence_country || '-'}</td>
                  <td>{user.age || '-'}</td>
                  <td>{user.gender || '-'}</td>
                  <td>{user.is_verified ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : !loading ? (
          <p className="empty-state">No users found. Add your first user above.</p>
        ) : null}
      </div>
    </div>
  );
}