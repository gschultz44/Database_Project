import React, { useState } from "react";
import './styling/UserEntry.css';

export default function UserEntry() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryOfBirth, setCountryOfBirth] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
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

    if (!trimmedFirstName || !trimmedLastName || !countryOfBirth || !countryOfResidence || !gender || !isVerified || !age) {
      alert("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }

    if (!validateAge()) {
      alert("Please enter a valid age.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userData = {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        countryOfBirth,
        countryOfResidence,
        age: parseInt(age),
        gender,
        isVerified: isVerified === "Yes" ? true : false,
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
        setCountryOfBirth("");
        setCountryOfResidence("");
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
          <label>First Name<span className="required-asterisk">*</span></label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter First Name"
          />
        </div>
        <div className="form-group">
          <label>Last Name<span className="required-asterisk">*</span></label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Last Name"
          />
        </div>
        <div className="form-group">
          <label>Country of Birth<span className="required-asterisk">*</span></label>
          <select
            value={countryOfBirth}
            onChange={(e) => setCountryOfBirth(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Country of Residence<span className="required-asterisk">*</span></label>
          <select
            value={countryOfResidence}
            onChange={(e) => setCountryOfResidence(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Age<span className="required-asterisk">*</span></label>
          <input
            type="number"
            min="0"
            max="150"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="input-field"
            placeholder="Enter Age"
          />
        </div>
        <div className="form-group">
          <label>Gender<span className="required-asterisk">*</span></label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Verified User?<span className="required-asterisk">*</span></label>
          <select
            value={isVerified}
            onChange={(e) => setIsVerified(e.target.value)}
            required
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
