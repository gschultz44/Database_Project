import React, { useState } from "react";
import './styling/UserEntry.css';

export default function UserEntry() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [countryOfBirth, setCountryOfBirth] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [otherCountryOfBirth, setOtherCountryOfBirth] = useState("");
  const [otherCountryOfResidence, setOtherCountryOfResidence] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAge = () => {
    const num = parseInt(age);
    return !isNaN(num) && num >= 0 && num <= 150;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      alert("Username is required.");
      setIsSubmitting(false);
      return;
    }

    if (age && !validateAge()) {
      alert("Please enter a valid age (0-150) if provided.");
      setIsSubmitting(false);
      return;
    }

    // If "Other" is selected for country, ensure the respective "Other Country" field is filled out
    if (countryOfBirth === "Other" && !otherCountryOfBirth) {
      alert("Please specify your Country of Birth.");
      setIsSubmitting(false);
      return;
    }

    if (countryOfResidence === "Other" && !otherCountryOfResidence) {
      alert("Please specify your Country of Residence.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userData = {
        firstName: trimmedFirstName || null,
        lastName: trimmedLastName || null,
        username: trimmedUsername,
        countryOfBirth: countryOfBirth === "Other" ? otherCountryOfBirth : countryOfBirth || null,
        countryOfResidence: countryOfResidence === "Other" ? otherCountryOfResidence : countryOfResidence || null,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        isVerified: isVerified ? isVerified === "Yes" : null,
      };

      const response = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("User submitted successfully!");
        setFirstName("");
        setLastName("");
        setUsername("");
        setCountryOfBirth("");
        setCountryOfResidence("");
        setOtherCountryOfBirth("");
        setOtherCountryOfResidence("");
        setAge("");
        setGender("");
        setIsVerified("");
      } else {
        alert("Failed to submit user.");
      }
    } catch (error) {
      console.error("Error submitting user:", error);
      alert("An error occurred while submitting the user.");
    }

    setIsSubmitting(false);
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

  return (
    <div className="page-container">
      <h1 className="hero-title">User Entry</h1>
      <div className="space-y-4">
        <div className="form-group">
          <label>Username<span className="required-asterisk">*</span></label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Username"
          />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field"
            placeholder="Enter First Name"
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input-field"
            placeholder="Enter Last Name"
          />
        </div>
        <div className="form-group">
          <label>Country of Birth</label>
          <select
            value={countryOfBirth}
            onChange={(e) => setCountryOfBirth(e.target.value)}
            className="input-field"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {countryOfBirth === "Other" && (
            <div className="form-group">
              <label>Specify Country of Birth<span className="required-asterisk">*</span></label>
              <input
                value={otherCountryOfBirth}
                onChange={(e) => setOtherCountryOfBirth(e.target.value)}
                required
                className="input-field"
                placeholder="Enter Country"
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Country of Residence</label>
          <select
            value={countryOfResidence}
            onChange={(e) => setCountryOfResidence(e.target.value)}
            className="input-field"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {countryOfResidence === "Other" && (
            <div className="form-group">
              <label>Specify Country of Residence<span className="required-asterisk">*</span></label>
              <input
                value={otherCountryOfResidence}
                onChange={(e) => setOtherCountryOfResidence(e.target.value)}
                required
                className="input-field"
                placeholder="Enter Country"
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            min="0"
            max="150"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input-field"
            placeholder="Enter Age"
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-field"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Verified User?</label>
          <select
            value={isVerified}
            onChange={(e) => setIsVerified(e.target.value)}
            className="input-field"
          >
            <option value="">Select Verification Status</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-group">
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit User"}
          </button>
        </div>
      </div>
    </div>
  );
}
