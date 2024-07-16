
import React from "react";
import '../css/Badges.css';

const Badges = ({ badges }) => {
  return (
    <div className="badges-container">
      <h2>Badges</h2>
      <ul className="badges-list">
        {badges.map((badge, index) => (
          <li key={index} className="badge-item">
            <div className="badge-details">
              <span className="badge-name">{badge.badgeName}</span>
              <span className="badge-date">{badge.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Badges;
