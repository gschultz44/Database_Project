import React, { useState, useEffect } from "react";
import './styling/PostEntry.css';

const countryOptions = [
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "Japan",
  "Other"
];

const stateOptions = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export default function PostEntry() {
  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectDates, setProjectDates] = useState({});
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchSocialMediaPlatforms();
    fetchProjects();
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

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      
      // Create a map of project names to their date ranges
      const datesMap = {};
      data.forEach(project => {
        datesMap[project.project_name] = {
          start_date: project.start_date,
          end_date: project.end_date
        };
      });
      
      setProjects(data);
      setProjectDates(datesMap);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const fetchFieldsByProject = async (projectName) => {
    if (!projectName) {
      setFilteredFields([]);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/fields?project_name=${encodeURIComponent(projectName)}`);
      if (!response.ok) throw new Error('Failed to fetch fields for project');
      const data = await response.json();
      setFilteredFields(data);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
      setFilteredFields([]);
    }
  };

  const [post, setPost] = useState({
    platform: "",
    username: "",
    postDatetime: "",
    isRepost: false,
    repostUsername: "",
    repostDatetime: "",
    city: "",
    stateName: "",
    country: "",
    otherCountry: "",
    likes: "",
    dislikes: "",
    multimedia: "",
    multimediaLink: "",
    projectName: "",
    fieldName: "",
    postContent: ""
  });

  const validateDatetime = () => {
    if (!post.postDatetime) return false;
    const date = new Date(post.postDatetime);
    return !isNaN(date.getTime());
  };

  const validateRepostDatetime = () => {
    if (!post.isRepost || !post.repostDatetime) return true;
    const date = new Date(post.repostDatetime);
    return !isNaN(date.getTime());
  };

  const validateProjectDates = () => {
    // If no project is selected, no need to validate project dates
    if (!post.projectName) return true;
    
    const postDate = new Date(post.postDatetime);
    const projectInfo = projectDates[post.projectName];
    
    if (!projectInfo) {
      return false; // Project info not found
    }
    
    // Convert project dates to Date objects
    const startDate = new Date(projectInfo.start_date);
    // If end_date is null, consider it as ongoing (no upper limit)
    const endDate = projectInfo.end_date ? new Date(projectInfo.end_date) : null;
    
    // Check if post date is within project date range
    if (postDate < startDate) {
      setMessage({ 
        text: `Post date must be after project start date (${startDate.toLocaleDateString()})`, 
        type: 'error' 
      });
      return false;
    }
    
    if (endDate && postDate > endDate) {
      setMessage({ 
        text: `Post date must be before project end date (${endDate.toLocaleDateString()})`, 
        type: 'error' 
      });
      return false;
    }
    
    return true;
  };

  const validateUserExistence = async (username) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users`);
      const users = await response.json();
      const userExists = users.some(user => user.username === username);
      if (!userExists) {
        alert("User not found.");
        return false;
      }
      console.log("User authenticated. Creating post...");
      return true;
    } catch (error) {
      console.error("Error checking user existence:", error);
      alert("Failed to validate user.");
      return false;
    }
  };
  
  const handleSubmit = async () => {
    const {
      platform, username, postDatetime, isRepost, repostUsername,
      repostDatetime, city, stateName, country, otherCountry,
      likes, dislikes, multimedia, multimediaLink, projectName, fieldName, postContent
    } = post;

    const trimmedPostData = {
      platform: platform.trim(),
      username: username.trim(),
      postDatetime: postDatetime.trim(),
      isRepost: isRepost,
      repostUsername: repostUsername.trim(),
      repostDatetime: repostDatetime,
      city: city.trim(),
      stateName: stateName.trim(),
      country: country.trim(),
      otherCountry: otherCountry.trim(),
      likes: likes.trim(),
      dislikes: dislikes.trim(),
      multimedia: multimedia.trim(),
      multimediaLink: multimediaLink.trim(),
      projectName: projectName.trim(),
      fieldName: fieldName.trim(),
      postContent: postContent.trim()
    };

    // Basic validation
    if (!trimmedPostData.platform || !trimmedPostData.username || !trimmedPostData.postDatetime || !trimmedPostData.postContent) {
      setMessage({ text: "Please fill out required fields: Platform, Username, Post DateTime, and Post Content.", type: 'error' });
      return;
    }

    if (trimmedPostData.username.length > 40 || (isRepost && trimmedPostData.repostUsername.length > 40)) {
      setMessage({ text: "Username must be at most 40 characters.", type: 'error' });
      return;
    }

    if (!validateDatetime() || !validateRepostDatetime()) {
      setMessage({ text: "Please enter valid datetime values.", type: 'error' });
      return;
    }

    // Validate project dates if a project is selected
    if (trimmedPostData.projectName && !validateProjectDates()) {
      return; // Error message already set in validateProjectDates
    }

    if ((trimmedPostData.likes && (isNaN(trimmedPostData.likes) || trimmedPostData.likes < 0)) ||
        (trimmedPostData.dislikes && (isNaN(trimmedPostData.dislikes) || trimmedPostData.dislikes < 0))) {
      setMessage({ text: "Likes and Dislikes must be non-negative numbers.", type: 'error' });
      return;
    }

    if (trimmedPostData.city && !trimmedPostData.stateName) {
      setMessage({ text: "If you enter a city, you must also select a state.", type: 'error' });
      return;
    }

    if (trimmedPostData.country === "Other" && !trimmedPostData.otherCountry) {
      setMessage({ text: "Please enter a valid country name.", type: 'error' });
      return;
    }

    try {
      // Match the exact structure that the API expects based on the API endpoint code
      const postBody = {
        username: trimmedPostData.username,
        media_name: trimmedPostData.platform,
        content: trimmedPostData.postContent,
        post_time: trimmedPostData.postDatetime,
        city: trimmedPostData.city || null,
        state_name: trimmedPostData.stateName || null,
        country: trimmedPostData.country === "Other" ? trimmedPostData.otherCountry : trimmedPostData.country || null,
        likes: trimmedPostData.likes ? parseInt(trimmedPostData.likes) : null,
        dislikes: trimmedPostData.dislikes ? parseInt(trimmedPostData.dislikes) : null,
        multimedia: trimmedPostData.multimedia === "yes" 
          ? trimmedPostData.multimediaLink || "yes"
          : null,
        project_name: trimmedPostData.projectName || null,
        field_name: trimmedPostData.fieldName || null,
        is_repost: trimmedPostData.isRepost || false
      };
      
      console.log("Sending post data:", postBody); // For debugging

      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });

      if (response.ok) {
        setMessage({ text: "Post submitted successfully!", type: 'success' });
        setPost({
          platform: "",
          username: "",
          postDatetime: "",
          isRepost: false,
          repostUsername: "",
          repostDatetime: "",
          city: "",
          stateName: "",
          country: "",
          otherCountry: "",
          likes: "",
          dislikes: "",
          multimedia: "",
          multimediaLink: "",
          projectName: "",
          fieldName: "",
          postContent: ""
        });
        
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage({ text: errorData.error || "Failed to submit post.", type: 'error' });
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      setMessage({ text: "An error occurred while submitting the post.", type: 'error' });
    }
  };

  const handleRepost = (originalUsername) => {
    setPost(prevPost => ({ 
      ...prevPost, 
      isRepost: true,
      repostUsername: originalUsername 
    }));
    alert("Reposting original post...");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "projectName") {
      // When project changes, clear field selection and fetch new fields
      setPost(prevPost => ({
        ...prevPost,
        [name]: value,
        fieldName: ""
      }));
      
      // Fetch fields for the selected project
      fetchFieldsByProject(value);
      
      // Check post date against project dates immediately for better UX
      if (value && post.postDatetime) {
        setTimeout(() => validateProjectDates(), 0);
      }
    } else if (name === "postDatetime" && post.projectName) {
      // When post date changes and a project is selected, verify against project dates
      setPost(prevPost => ({
        ...prevPost,
        [name]: value
      }));
      
      // Use setTimeout to ensure state is updated before validation
      setTimeout(() => validateProjectDates(), 0);
    } else {
      setPost(prevPost => ({
        ...prevPost,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  return (
    <div className="page-container">
      <h1 className="hero-title" style={{ color: 'black' }}>Add a Post</h1>
      <div className="space-y-4">
        <div className="form-group">
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-group">
          <label>Username<span className="required-asterisk">*</span></label>
          <input
            name="username"
            value={post.username}
            onChange={handleChange}
            required
            maxLength={40}
            className="input-field"
            placeholder="Account Username"
          />
        </div>

        <div className="form-group">
          <label>Platform<span className="required-asterisk">*</span></label>
          <select
            name="platform"
            value={post.platform}
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
          <label>Post Content<span className="required-asterisk">*</span></label>
          <textarea
            name="postContent"
            value={post.postContent}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter post content"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Post Datetime<span className="required-asterisk">*</span></label>
          <input
            type="datetime-local"
            name="postDatetime"
            value={post.postDatetime}
            onChange={handleChange}
            required
            className="input-field"
            step="1"
          />
          {post.projectName && (
            <small className="form-hint">
              Post date must be within project's date range.
            </small>
          )}
        </div>

        {post.isRepost && (
          <>
            <div className="form-group">
              <label>Repost Username</label>
              <input
                name="repostUsername"
                value={post.repostUsername}
                onChange={handleChange}
                maxLength={40}
                className="input-field"
                placeholder="Username who reposted"
              />
            </div>

            <div className="form-group">
              <label>Repost Datetime</label>
              <input
                type="datetime-local"
                name="repostDatetime"
                value={post.repostDatetime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>City</label>
          <input
            name="city"
            value={post.city}
            onChange={handleChange}
            className="input-field"
            placeholder="City (optional)"
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <select
            name="stateName"
            value={post.stateName}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select a state</option>
            {stateOptions.map((stateOption) => (
              <option key={stateOption} value={stateOption}>
                {stateOption}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Country</label>
          <select
            name="country"
            value={post.country}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select a country</option>
            {countryOptions.map((countryOption) => (
              <option key={countryOption} value={countryOption}>
                {countryOption}
              </option>
            ))}
          </select>
        </div>

        {post.country === "Other" && (
          <div className="form-group">
            <label>Other Country Name<span className="required-asterisk">*</span></label>
            <input
              name="otherCountry"
              value={post.otherCountry}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter country name"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Likes</label>
          <input
            type="number"
            name="likes"
            value={post.likes}
            onChange={handleChange}
            className="input-field"
            placeholder="Number of Likes (optional)"
          />
        </div>

        <div className="form-group">
          <label>Dislikes</label>
          <input
            type="number"
            name="dislikes"
            value={post.dislikes}
            onChange={handleChange}
            className="input-field"
            placeholder="Number of Dislikes (optional)"
          />
        </div>

        <div className="form-group">
          <label>Multimedia</label>
          <select
            name="multimedia"
            value={post.multimedia}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select Yes or No</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {post.multimedia === "yes" && (
          <div className="form-group">
            <label>Multimedia Link<span className="required-asterisk">*</span></label>
            <input
              name="multimediaLink"
              value={post.multimediaLink}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter multimedia link"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Project</label>
          <select
            name="projectName"
            value={post.projectName}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select a project</option>
            {projects.map(project => (
              <option key={project.project_name} value={project.project_name}>
                {project.project_name} 
                {project.start_date && ` (${new Date(project.start_date).toLocaleDateString()} - ${project.end_date ? new Date(project.end_date).toLocaleDateString() : 'ongoing'})`}
              </option>
            ))}
          </select>
        </div>

        {post.projectName && (
          <div className="form-group">
            <label>Field</label>
            <select
              name="fieldName"
              value={post.fieldName}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select a field</option>
              {filteredFields.map(field => (
                <option key={field.field_name} value={field.field_name}>
                  {field.field_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            Submit Post
          </button>
        </div>
      </div>
    </div>
  );
}