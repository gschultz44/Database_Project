import React, { useState } from "react";
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
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [postDatetime, setPostDatetime] = useState("");
  const [isRepost, setIsRepost] = useState(false);
  const [repostUsername, setRepostUsername] = useState("");
  const [repostDatetime, setRepostDatetime] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");
  const [otherCountry, setOtherCountry] = useState("");
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");
  const [multimedia, setMultimedia] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateDatetime = (datetime) => {
    if (!datetime) return false;
    const date = new Date(datetime);
    return !isNaN(date.getTime());
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const trimmedPlatform = platform.trim();
    const trimmedUsername = username.trim();
    const trimmedRepostUsername = repostUsername.trim();
    const trimmedCity = city.trim();
    const trimmedStateName = stateName.trim();
    const trimmedCountry = country.trim();
    const trimmedOtherCountry = otherCountry.trim();
    const trimmedLikes = likes.trim();
    const trimmedDislikes = dislikes.trim();
    const trimmedProjectName = projectName.trim();

    if (!trimmedPlatform || !trimmedUsername || !postDatetime) {
      alert("Please fill out required fields: Platform, Username, Post DateTime.");
      setIsSubmitting(false);
      return;
    }

    if (trimmedUsername.length > 40 || (isRepost && trimmedRepostUsername.length > 40)) {
      alert("Username must be at most 40 characters.");
      setIsSubmitting(false);
      return;
    }

    if (!validateDatetime(postDatetime) || (isRepost && !validateDatetime(repostDatetime))) {
      alert("Please enter valid datetime values.");
      setIsSubmitting(false);
      return;
    }

    if ((trimmedLikes && (isNaN(trimmedLikes) || trimmedLikes < 0)) ||
        (trimmedDislikes && (isNaN(trimmedDislikes) || trimmedDislikes < 0))) {
      alert("Likes and Dislikes must be non-negative numbers.");
      setIsSubmitting(false);
      return;
    }

    if (trimmedCity && !trimmedStateName) {
      alert("If you enter a city, you must also select a state.");
      setIsSubmitting(false);
      return;
    }

    // Validation for country
    if (!trimmedCountry && trimmedCountry !== "Other") {
      alert("Please select a country.");
      setIsSubmitting(false);
      return;
    }

    if (trimmedCountry === "Other" && !trimmedOtherCountry) {
      alert("Please enter a valid country name.");
      setIsSubmitting(false);
      return;
    }

    const postData = {
      platform: trimmedPlatform,
      username: trimmedUsername,
      postDatetime,
      repostUsername: isRepost ? trimmedRepostUsername || null : null,
      repostDatetime: isRepost ? repostDatetime || null : null,
      location: {
        city: trimmedCity || null,
        state: trimmedStateName || null,
        country: trimmedCountry === "Other" ? trimmedOtherCountry : trimmedCountry || null
      },
      likes: trimmedLikes ? parseInt(trimmedLikes) : null,
      dislikes: trimmedDislikes ? parseInt(trimmedDislikes) : null,
      multimedia,
      projectName: trimmedProjectName || null
    };

    try {
      const response = await fetch("http://localhost:5000/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert("Post submitted successfully!");
        // Reset fields
        setPlatform("");
        setUsername("");
        setPostDatetime("");
        setIsRepost(false);
        setRepostUsername("");
        setRepostDatetime("");
        setCity("");
        setStateName("");
        setCountry("");
        setOtherCountry("");
        setLikes("");
        setDislikes("");
        setMultimedia("");
        setProjectName("");
      } else {
        alert("Failed to submit post.");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An error occurred while submitting the post.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="page-container">
      <h1 className="hero-title">Post Entry</h1>
      <div className="space-y-4">

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isRepost}
              onChange={(e) => setIsRepost(e.target.checked)}
            />
            &nbsp;Is this a repost?
          </label>
        </div>

        <div className="form-group">
          <label>Platform<span className="required-asterisk">*</span></label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Select a platform</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YouTube</option>
            <option value="Reddit">Reddit</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Username<span className="required-asterisk">*</span></label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            maxLength={40}
            className="input-field"
            placeholder="User's Username"
          />
        </div>

        <div className="form-group">
          <label>Post Datetime<span className="required-asterisk">*</span></label>
          <input
            type="datetime-local"
            value={postDatetime}
            onChange={(e) => setPostDatetime(e.target.value)}
            required
            className="input-field"
          />
        </div>

        {isRepost && (
          <>
            <div className="form-group">
              <label>Repost Username</label>
              <input
                value={repostUsername}
                onChange={(e) => setRepostUsername(e.target.value)}
                maxLength={40}
                className="input-field"
                placeholder="Username who reposted"
              />
            </div>

            <div className="form-group">
              <label>Repost Datetime</label>
              <input
                type="datetime-local"
                value={repostDatetime}
                onChange={(e) => setRepostDatetime(e.target.value)}
                className="input-field"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input-field"
            placeholder="City (optional)"
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <select
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className="input-field"
          >
            <option value="">Select a state</option>
            {stateOptions.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
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

        {country === "Other" && (
          <div className="form-group">
            <label>Other Country Name<span className="required-asterisk">*</span></label>
            <input
              value={otherCountry}
              onChange={(e) => setOtherCountry(e.target.value)}
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
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className="input-field"
            placeholder="Number of Likes (optional)"
          />
        </div>

        <div className="form-group">
          <label>Dislikes</label>
          <input
            type="number"
            value={dislikes}
            onChange={(e) => setDislikes(e.target.value)}
            className="input-field"
            placeholder="Number of Dislikes (optional)"
          />
        </div>

        <div className="form-group">
          <label>Multimedia</label>
          <select
            value={multimedia}
            onChange={(e) => setMultimedia(e.target.value)}
            className="input-field"
          >
            <option value="">Select Yes or No</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Project Name</label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="input-field"
            placeholder="Project Name (optional)"
          />
        </div>

        <div className="form-group">
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Post"}
          </button>
        </div>

      </div>
    </div>
  );
}
