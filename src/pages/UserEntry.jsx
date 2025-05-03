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
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };
  
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
    setNewUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateAge = () => {
    const num = parseInt(newUser.age);
    return !newUser.age || (!isNaN(num) && num >= 0 && num <= 150);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      // Validate required fields
      if (!newUser.username.trim()) {
        throw new Error('Username is required');
      }

      // Social Media site must be choosen
      if (!newUser.media_name.trim()) {
        throw new Error('Social Media is required');
      }

      // Age validation
      if (!validateAge()) {
        throw new Error('Please enter a valid age (0-150) if provided');
      }

      // Validate "Other" country selections
      if (newUser.birth_country === "Other" && !newUser.other_birth_country) {
        throw new Error('Please specify your Country of Birth');
      }

      if (newUser.residence_country === "Other" && !newUser.other_residence_country) {
        throw new Error('Please specify your Country of Residence');
      }
      
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
        throw new Error(errorData.error || 'Failed to add user');
      }
      
      setMessage({ text: 'User added successfully!', type: 'success' });
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
      }, 3000);
      
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
        <div className="form-group">
          <label htmlFor="username">Username<span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUser.username}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter Username"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="media_name">Social Media Platform<span className="required-asterisk">*</span></label>
          <select
            id="media_name"
            name="media_name"
            value={newUser.media_name}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Select a platform</option>
            {socialMediaPlatforms.map(platform => (
              <option key={platform.media_name} value={platform.media_name}>
                {platform.media_name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="first_name">First Name<span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={newUser.first_name}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="Enter First Name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="last_name">Last Name<span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={newUser.last_name}
            onChange={handleChange}
            className="input-field"
            required
            placeholder="Enter Last Name"
          />
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
            <div className="form-group">
              <label htmlFor="other_birth_country">Specify Country of Birth<span className="required-asterisk">*</span></label>
              <input
                type="text"
                id="other_birth_country"
                name="other_birth_country"
                value={newUser.other_birth_country}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter Country"
              />
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
            <div className="form-group">
              <label htmlFor="other_residence_country">Specify Country of Residence<span className="required-asterisk">*</span></label>
              <input
                type="text"
                id="other_residence_country"
                name="other_residence_country"
                value={newUser.other_residence_country}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter Country"
              />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={newUser.age}
            onChange={handleChange}
            min="0"
            max="150"
            className="input-field"
            placeholder="Enter Age"
          />
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
        
        {users.length > 0 ? (
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
        ) : (
          <p>No users found. Add your first user above.</p>
        )}
      </div>
    </div>
  );
}
