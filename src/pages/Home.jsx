import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselComponent from '../components/common/CarouselComponent';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';


const features = [
  {
    title: 'Wide Selection',
    detail: 'We offer thousands of products across a wide range of categories, handpicked for quality and value.'
  },
  {
    title: 'Secure Payments',
    detail: 'All transactions are encrypted and processed via trusted payment gateways to keep your info safe.'
  },
  {
    title: 'Fast Delivery',
    detail: 'We ship out most items the same day! Enjoy fast and reliable delivery with tracking options.'
  }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>
      Welcome {user?.name || user?.username?.split('@')[0] || "Guest"}
      </h2>

      <CarouselComponent />

      <section style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2 style={{ fontWeight: "600", marginBottom: "2rem" }}>
          Why Shop With Us?
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {features.map((feat, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "1.5rem",
                minWidth: "260px",
                maxWidth: "300px",
                backgroundColor: "#fff",
                boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
              }}
            >
              <button
                style={{
                  backgroundColor:
                    activeIndex === index ? "#007bff" : "#f8f9fa",
                  border: "2px solid #007bff",
                  color: activeIndex === index ? "#fff" : "#007bff",
                  fontWeight: "600",
                  fontSize: "1rem",
                  padding: "0.5rem 1.2rem",
                  borderRadius: "6px",
                  marginBottom: "1rem",
                  cursor: "pointer",
                  width: "100%",
                }}
                onClick={() => setActiveIndex(index)}
              >
                {feat.title}
              </button>
              {activeIndex === index && (
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#333",
                    marginTop: "0.5rem",
                  }}
                >
                  {feat.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h3>Ready to Start Shopping?</h3>
        <button
          onClick={() => navigate("/register")}
          style={{
            marginTop: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "0.7rem 1.5rem",
            fontSize: "1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          Create an Account
        </button>
      </div>
    </div>
  );
};

export default Home;


