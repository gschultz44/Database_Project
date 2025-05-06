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
      setMessage({ 
        text: "Unable to load social media platforms. Please refresh the page or try again later.", 
        type: 'error' 
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setMessage({ 
        text: "Unable to load project list. Please refresh the page or try again later.", 
        type: 'error' 
      });
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
      setMessage({ 
        text: `Unable to load fields for project "${projectName}". Please select a different project or try again later.`, 
        type: 'error' 
      });
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

  const validateUserExistence = async (username) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users`);
      const users = await response.json();
      const userExists = users.some(user => user.username === username);
      if (!userExists) {
        setMessage({ 
          text: `Username "${username}" does not exist in our system. Please check spelling or create this user first.`, 
          type: 'error' 
        });
        return false;
      }
      console.log("User authenticated. Creating post...");
      return true;
    } catch (error) {
      console.error("Error checking user existence:", error);
      setMessage({ 
        text: "Unable to validate username. The server may be unavailable. Please try again later.", 
        type: 'error' 
      });
      return false;
    }
  };
  
  const handleSubmit = async () => {
    const {
      platform, username, postDatetime, isRepost, repostUsername,
      repostDatetime, city, stateName, country, otherCountry,
      likes, dislikes, multimedia, projectName, fieldName, postContent
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
      projectName: projectName.trim(),
      fieldName: fieldName.trim(),
      postContent: postContent.trim()
    };

    // Validation checks with improved error messages
    if (!trimmedPostData.platform) {
      setMessage({ text: "Please select a social media platform from the dropdown menu.", type: 'error' });
      return;
    }
    
    if (!trimmedPostData.username) {
      setMessage({ text: "Username field cannot be empty. Please enter the account username.", type: 'error' });
      return;
    }
    
    if (!trimmedPostData.postDatetime) {
      setMessage({ text: "Post date and time is required. Please select when this post was created.", type: 'error' });
      return;
    }
    
    if (!trimmedPostData.postContent) {
      setMessage({ text: "Post content cannot be empty. Please enter what was shared in this post.", type: 'error' });
      return;
    }

    if (trimmedPostData.username.length > 40) {
      setMessage({ text: "Username is too long. Please use a maximum of 40 characters.", type: 'error' });
      return;
    }
    
    if (isRepost && trimmedPostData.repostUsername.length > 40) {
      setMessage({ text: "Original poster's username is too long. Please use a maximum of 40 characters.", type: 'error' });
      return;
    }

    if (!validateDatetime()) {
      setMessage({ text: "The post date/time format is invalid. Please use the date picker or enter in YYYY-MM-DD HH:MM:SS format.", type: 'error' });
      return;
    }
    
    if (!validateRepostDatetime()) {
      setMessage({ text: "The repost date/time format is invalid. Please use the date picker or enter in YYYY-MM-DD HH:MM:SS format.", type: 'error' });
      return;
    }

    if (trimmedPostData.likes && (isNaN(trimmedPostData.likes) || trimmedPostData.likes < 0)) {
      setMessage({ text: "Likes must be a positive number (or zero). Please correct this value.", type: 'error' });
      return;
    }
    
    if (trimmedPostData.dislikes && (isNaN(trimmedPostData.dislikes) || trimmedPostData.dislikes < 0)) {
      setMessage({ text: "Dislikes must be a positive number (or zero). Please correct this value.", type: 'error' });
      return;
    }

    if (trimmedPostData.city && !trimmedPostData.stateName) {
      setMessage({ text: "You've entered a city but no state. Please select a state from the dropdown menu.", type: 'error' });
      return;
    }

    if (trimmedPostData.country === "Other" && !trimmedPostData.otherCountry) {
      setMessage({ text: "You selected 'Other' for country but didn't specify which one. Please enter the country name.", type: 'error' });
      return;
    }

    try {
      // Check if user exists before submitting
      const userValid = await validateUserExistence(trimmedPostData.username);
      if (!userValid) return;
      
      // Prepare post data to exactly match what the API expects
      const postBody = {
        username: trimmedPostData.username,
        media_name: trimmedPostData.platform,
        content: trimmedPostData.postContent,
        post_time: trimmedPostData.postDatetime,
        is_repost: trimmedPostData.isRepost,
        
        // Send location fields separately (not as a JSON object)
        city: trimmedPostData.city || null,
        state_name: trimmedPostData.stateName || null, // Note: Using state_name, not state
        country: trimmedPostData.country === "Other" ? trimmedPostData.otherCountry : trimmedPostData.country || null,
        
        likes: trimmedPostData.likes ? parseInt(trimmedPostData.likes) : null,
        dislikes: trimmedPostData.dislikes ? parseInt(trimmedPostData.dislikes) : null,
        multimedia: trimmedPostData.multimedia || null,
        
        // Match the snake_case naming in the API and database
        project_name: trimmedPostData.projectName || null,
        field_name: trimmedPostData.fieldName || null
      };
      
      console.log("Sending post data:", postBody); // For debugging

      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });

      if (response.ok) {
        setMessage({ text: "Post submitted successfully! Your entry has been added to the database.", type: 'success' });
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
          projectName: "",
          fieldName: "",
          postContent: ""
        });
        
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 5000);
      } else {
        const errorData = await response.json();
        if (errorData.error && errorData.error.includes("duplicate")) {
          setMessage({ text: "This post already exists in our database. Please check if you're submitting a duplicate.", type: 'error' });
        } else if (errorData.error && errorData.error.includes("foreign key")) {
          setMessage({ text: "Database relationship error. One of your selections (user, platform, project, or field) doesn't exist in our system.", type: 'error' });
        } else {
          setMessage({ text: errorData.error || "There was a problem saving your post. Please check your entries and try again.", type: 'error' });
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      setMessage({ 
        text: "Network or server error. Please check your internet connection and try again in a few moments.", 
        type: 'error' 
      });
    }
  };

  const handleRepost = (originalUsername) => {
    setPost(prevPost => ({ 
      ...prevPost, 
      isRepost: true,
      repostUsername: originalUsername 
    }));
    setMessage({ text: "Repost mode activated. Please fill in details about the original post.", type: 'info' });
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
    } else {
      setPost(prevPost => ({
        ...prevPost,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Format current datetime with seconds for default value
  const getCurrentDateTimeWithSeconds = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="page-container">
      <h1 className="hero-title" style={{ color: 'black' }}>Add a Post</h1>
      <div className="space-y-4">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isRepost"
              checked={post.isRepost}
              onChange={handleChange}
            />
            &nbsp;Is this a repost?
          </label>
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
          {/* <small className="form-hint">Username must exist in the system and be 40 characters or less</small> */}
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
          {/* <small className="form-hint">Format: YYYY-MM-DD HH:MM:SS</small> */}
        </div>

        {post.isRepost && (
          <>
            <div className="form-group">
              <label>Original Poster's Username</label>
              <input
                name="repostUsername"
                value={post.repostUsername}
                onChange={handleChange}
                maxLength={40}
                className="input-field"
                placeholder="Username of the original poster"
              />
              <small className="form-hint">Enter who originally created this content</small>
            </div>

            <div className="form-group">
              <label>Original Post Datetime</label>
              <input
                type="datetime-local"
                name="repostDatetime"
                value={post.repostDatetime}
                onChange={handleChange}
                className="input-field"
                step="1"
              />
              <small className="form-hint">When was the original post created?</small>
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
          {/* <small className="form-hint">If specifying city, state is also required</small> */}
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
            min="0"
          />
          {/* <small className="form-hint">Must be a positive number</small> */}
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
            min="0"
          />
          {/* <small className="form-hint">Must be a positive number</small> */}
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
          {/* <small className="form-hint">Does this post contain images, videos, or audio?</small> */}
        </div>

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