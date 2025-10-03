import "../styles/page.css";
import React from "react";
import { FaCar, FaShieldAlt, FaRocket, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import img1 from "../assets/iii.jpg";
import img2 from "../assets/i.jpg";
import img3 from "../assets/m.jpg";
import img4 from "../assets/ii.jpg";
import img5 from "../assets/mm.jpg";
import img6 from "../assets/mmm.jpg";
import img7 from "../assets/n.jpg";
import img8 from "../assets/disable.jpg";

const Home = () => {
  const sections = [
    { img: img1, title: "Mobile-Friendly Interface", text: "The EasyPark mobile experience is seamless and responsive, allowing users to manage reservations and access parking on the go." },
    { img: img2, title: "Precision Mapping", text: "Each parking spot is uniquely identified and structured in the backend, ready for future enhancements like real-time visibility and guided navigation." },
    { img: img3, title: "Built to Scale", text: "Whether it's a single mall or a citywide grid, EasyPark is prepared to grow with more users and zones in the future." },
    { img: img4, title: "Minimalist Design", text: "We’ve focused on a clean, user-friendly layout to make interaction quick and frustration-free." },
    { img: img5, title: "Secure Reservations", text: "No double-booking, no overlap. The system runs logic checks before every booking to keep things smooth." },
    { img: img6, title: "For All Drivers", text: "Whether it’s your first car or your fifth, EasyPark aims to support all use cases as we continue development." },
    { img: img7, title: "Access Management", text: "Plans include integration with gates or license plate scanners. Core backend logic already considers it." },
    { img: img8, title: "Accessible Parking Support", text: "Special-needs drivers? We’ve built-in accessible spot support citywide." }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{ backgroundColor: "#082742", color: "white", padding: "4rem 2rem", textAlign: "center" }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Smart <span style={{ color: "#FFD700" }}>Parking</span></h1>
          <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>Skip the stress. Reserve, arrive, and park — smarter.</p>
          <Link to="/search">
            <button style={{ marginTop: "2rem", padding: "1rem 2rem", fontSize: "1rem", backgroundColor: "#FFD700", color: "#082742", border: "none", borderRadius: "10px", cursor: "pointer" }}>
              🔍 Find a Spot
            </button>
          </Link>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section style={{ padding: "4rem 2rem", backgroundColor: "#f4faff" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
          {sections.map((s, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: idx % 2 === 0 ? "row" : "row-reverse", alignItems: "center", gap: "2rem", backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", padding: "1rem" }}>
              <img src={s.img} alt={s.title} style={{ width: "250px", height: "250px", objectFit: "cover", borderRadius: "12px" }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#082742", fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.title}</h3>
                <p style={{ color: "#333", fontSize: "1.1rem", lineHeight: "1.6" }}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features Section */}
      <section style={{ padding: "4rem 2rem", backgroundColor: "#e6efff" }}>
        <h2 style={{ textAlign: "center", color: "#082742", fontSize: "2rem", marginBottom: "2rem" }}>Key Features</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
          {[{
            icon: <FaCar size={32} color="#082742" />, title: "Real-Time Availability", desc: "Check open zones and timing to avoid wasted trips."
          }, {
            icon: <FaShieldAlt size={32} color="#082742" />, title: "Secure Payments", desc: "Stripe checkout keeps your payments smooth and safe."
          }, {
            icon: <FaRocket size={32} color="#082742" />, title: "Fast Booking", desc: "Start to finish in under a minute."
          }].map((feature, idx) => (
            <div key={idx} style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", textAlign: "center", width: "300px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.3s ease" }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ marginBottom: "1rem" }}>{feature.icon}</div>
              <h3 style={{ fontSize: "1.2rem", color: "#082742", marginBottom: "0.5rem" }}>{feature.title}</h3>
              <p style={{ fontSize: "1rem", color: "#444" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#082742", color: "white", padding: "2.5rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div style={{ minWidth: "200px", marginBottom: "1rem" }}>
            <h4>EasyPark</h4>
            <p>Smart Parking, Smarter Istanbul</p>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#ccc" }}>© {new Date().getFullYear()} EasyPark. All rights reserved.</p>
          </div>
          <div style={{ minWidth: "200px", marginBottom: "1rem" }}>
            <h4>Contact</h4>
            <p><FaEnvelope /> support@easypark.com</p>
            <p><FaPhoneAlt /> +90 531 599 8724</p>
            <p><FaMapMarkerAlt /> Üsküdar, Istanbul</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
