
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("users/profile/")
      .then((res) => setUser(res.data))
      .catch(() => console.error("Profile fetch error"));
  }, []);

  if (!user) {
    return (
      <div className="profile-wrapper">
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  const age = user.date_of_birth
    ? Math.floor((new Date() - new Date(user.date_of_birth)) / 31557600000)
    : null;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-avatar">
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=0e375f&color=fff&size=140`}
            alt="User avatar"
          />
        </div>

        <div className="profile-info">
          <h2 className="profile-username">{user.username}</h2>
          <ul className="profile-details">
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Phone:</strong> {user.phone_number || "N/A"}</li>
            <li><strong>Plate Number:</strong> {user.plate_number || "N/A"}</li>
            <li><strong>Date of Birth:</strong> {user.date_of_birth || "N/A"} {age && `(${age} yrs)`}</li>
            <li><strong>Joined:</strong> {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}</li>
          </ul>
          {user.is_special && <span className="user-tag">🌟 Special User</span>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
