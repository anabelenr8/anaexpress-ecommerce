import React, { useState, useEffect,  } from "react";
import axios from "axios";
import { useApp } from '../context/AppContext';


const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { dataVersion, refreshData } = useApp(); // access refresh system

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://localhost:7234/api/UserProfile/details",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile(); // reloads when dataVersion changes
  }, [dataVersion]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const updatedData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
      };

      await axios.put(
        "https://localhost:7234/api/UserProfile/update",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshData();

      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile!");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Your Profile</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label>Default Delivery Address:</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter your address"
            required
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  marginTop: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "1rem",
};

const buttonStyle = {
  backgroundColor: "#c49b74",
  color: "#fff",
  padding: "0.75rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
};

export default ProfilePage;
