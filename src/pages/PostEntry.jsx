import React, { useState } from "react";
import './styling/PostEntry.css';

export default function PostEntry() {
  const [projectId, setProjectId] = useState("");
  const [platform, setPlatform] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postDate, setPostDate] = useState("");
  const [userId, setUserId] = useState("");
  const [location, setLocation] = useState(""); // Location metadata
  const [likes, setLikes] = useState(""); // Likes metadata
  const [dislikes, setDislikes] = useState(""); // Dislikes metadata
  const [multimedia, setMultimedia] = useState(""); // Multimedia URL metadata
  const [multimediaType, setMultimediaType] = useState(""); // New state for multimedia type
  const [repostId, setRepostId] = useState(""); // Repost functionality

  const validatePostDate = () => {
    if (!postDate) return false;
    const post = new Date(postDate);
    return !isNaN(post.getTime());
  };

  const validateUserExistence = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}`);
      if (!response.ok) {
        alert("User not found.");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking user existence:", error);
      alert("Failed to validate user.");
      return false;
    }
  };

  const handleSubmit = async () => {
    const trimmedProjectId = projectId.trim();
    const trimmedPlatform = platform.trim();
    const trimmedPostContent = postContent.trim();
    const trimmedUserId = userId.trim();
    const trimmedLocation = location.trim();
    const trimmedLikes = likes.trim();
    const trimmedDislikes = dislikes.trim();
    const trimmedMultimedia = multimedia.trim();
    const trimmedRepostId = repostId.trim();

    if (
      !trimmedProjectId ||
      !trimmedPlatform ||
      !trimmedPostContent ||
      !postDate ||
      !trimmedUserId ||
      !trimmedLocation ||
      !trimmedLikes ||
      !trimmedDislikes ||
      !trimmedMultimedia ||
      !multimediaType // Added validation for multimedia type
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    if (!validatePostDate()) {
      alert("Please enter a valid post date.");
      return;
    }

      // Validate multimedia URL based on selected type
    if (trimmedMultimedia) {
      let isValidUrl = true;
      
      try {
        new URL(trimmedMultimedia);
      } catch (_) {
        isValidUrl = false;
      }
      
      if (!isValidUrl) {
        alert("Please enter a valid URL for multimedia content.");
        return;
      }
      
      // Additional type-specific validation
      if (multimediaType === "image") {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const hasValidExtension = imageExtensions.some(ext => 
          trimmedMultimedia.toLowerCase().endsWith(ext)
        );
        
        if (!hasValidExtension) {
          alert("Please provide a valid image URL (jpg, jpeg, png, gif, or webp).");
          return;
        }
      } else if (multimediaType === "video") {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
        const hasValidExtension = videoExtensions.some(ext => 
          trimmedMultimedia.toLowerCase().endsWith(ext)
        );
        
        if (!hasValidExtension) {
          alert("Please provide a valid video URL (mp4, webm, mov, or avi).");
          return;
        }
      }
    }


    const userExists = await validateUserExistence(trimmedUserId);
    if (!userExists) return;

    try {
      const checkResponse = await fetch("http://localhost:5000/api/check-duplicate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: trimmedProjectId,
          platform: trimmedPlatform,
          postContent: trimmedPostContent,
          postDate,
          userId: trimmedUserId,
        }),
      });

      const checkData = await checkResponse.json();
      if (checkData.exists) {
        alert("A post with the same content already exists for this user and project on this date.");
        return;
      }
    } catch (error) {
      console.error("Error checking for duplicate post:", error);
      alert("Failed to check for duplicate post.");
      return;
    }

    const postData = {
      projectId: trimmedProjectId,
      platform: trimmedPlatform,
      postContent: trimmedPostContent,
      postDate,
      userId: trimmedUserId,
      location: trimmedLocation,
      likes: parseInt(trimmedLikes),
      dislikes: parseInt(trimmedDislikes),
      multimedia: trimmedMultimedia,
      multimediaType, // Added multimedia type to post data
      repostId: trimmedRepostId ? trimmedRepostId : null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert("Post submitted successfully!");
        setProjectId("");
        setPlatform("");
        setPostContent("");
        setPostDate("");
        setUserId("");
        setLocation("");
        setLikes("");
        setDislikes("");
        setMultimedia("");
        setMultimediaType(""); // Reset multimedia type
        setRepostId(""); // Reset repost ID after submission
      } else {
        alert("Failed to submit post.");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An error occurred while submitting the post.");
    }
  };

  const handleRepost = (originalPostId) => {
    setRepostId(originalPostId); // Set the repostId to the original post ID
    alert("Reposting original post...");
  };

  return (
    <div className="page-container">
      <h1 className="hero-title">Post Entry</h1>
      <div className="space-y-4">
        <div className="form-group">
          <label>Project ID</label>
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Project ID"
          />
        </div>
        <div className="form-group">
          <label>Platform</label>
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
            className="input-field"
            placeholder="e.g., Twitter"
          />
        </div>
        <div className="form-group">
          <label>Post Content</label>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            required
            className="input-field"
            placeholder="Enter the post content"
          />
        </div>
        <div className="form-group">
          <label>Post Date</label>
          <input
            type="date"
            value={postDate}
            onChange={(e) => setPostDate(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>User ID</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="input-field"
            placeholder="Enter User ID"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Location"
          />
        </div>
        <div className="form-group">
          <label>Likes</label>
          <input
            type="number"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            required
            className="input-field"
            placeholder="Number of Likes"
          />
        </div>
        <div className="form-group">
          <label>Dislikes</label>
          <input
            type="number"
            value={dislikes}
            onChange={(e) => setDislikes(e.target.value)}
            required
            className="input-field"
            placeholder="Number of Dislikes"
          />
        </div>
        <div className="form-group">
          <label>Multimedia Type</label>
          <select
            value={multimediaType}
            onChange={(e) => setMultimediaType(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Select multimedia type</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Multimedia URL</label>
          <input
            value={multimedia}
            onChange={(e) => setMultimedia(e.target.value)}
            required
            className="input-field"
            placeholder="Multimedia URL (e.g., image/video)"
          />
        </div>

        <div className="form-group">
          <button
            onClick={() => handleRepost("originalPostId1234")}
            className="btn-secondary"
          >
            Repost
          </button>
        </div>

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
