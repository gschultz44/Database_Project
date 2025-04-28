import React, { useState } from "react";
import './styling/PostEntry.css';

export default function PostEntry() {
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [postDatetime, setPostDatetime] = useState("");
  const [repostUsername, setRepostUsername] = useState("");
  const [repostDatetime, setRepostDatetime] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");
  const [multimedia, setMultimedia] = useState("");  // Yes/No dropdown
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePostDatetime = () => {
    if (!postDatetime) return false;
    const date = new Date(postDatetime);
    return !isNaN(date.getTime());
  };

  const validateRepostDatetime = () => {
    if (repostDatetime) {
      const date = new Date(repostDatetime);
      return !isNaN(date.getTime());
    }
    return true; // OK if empty
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
    const trimmedLikes = likes.trim();
    const trimmedDislikes = dislikes.trim();

    if (!trimmedPlatform || !trimmedUsername || !postDatetime) {
      alert("Please fill out required fields: Platform, Username, Post DateTime.");
      setIsSubmitting(false);
      return;
    }

    if (trimmedUsername.length > 40 || trimmedRepostUsername.length > 40) {
      alert("Username must be at most 40 characters.");
      setIsSubmitting(false);
      return;
    }

    if (!validatePostDatetime() || !validateRepostDatetime()) {
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

    const postData = {
      platform: trimmedPlatform,
      username: trimmedUsername,
      postDatetime,
      repostUsername: trimmedRepostUsername || null,
      repostDatetime: repostDatetime || null,
      location: {
        city: trimmedCity || null,
        state: trimmedStateName || null,
        country: trimmedCountry || null
      },
      likes: trimmedLikes ? parseInt(trimmedLikes) : null,
      dislikes: trimmedDislikes ? parseInt(trimmedDislikes) : null,
      multimedia: multimedia  // Pass the multimedia value (yes/no)
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
        setRepostUsername("");
        setRepostDatetime("");
        setCity("");
        setStateName("");
        setCountry("");
        setLikes("");
        setDislikes("");
        setMultimedia("");  // Reset multimedia
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

        <div className="form-group">
          <label>Repost Username</label>
          <input
            value={repostUsername}
            onChange={(e) => setRepostUsername(e.target.value)}
            maxLength={40}
            className="input-field"
            placeholder="Username who reposted (if any)"
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
          <input
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className="input-field"
            placeholder="State (optional)"
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input-field"
            placeholder="Country (optional)"
          />
        </div>

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
