import React from 'react';
import '../css/ProgressTracker.css'

const ProgressTracker = ({ waterIntake, dailyGoal,resetProgress }) => {
  const percentage = (waterIntake /(1000*dailyGoal)) * 100;

  return (
    <div className="progress-tracker">
      <h2>Daily Progress</h2>
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p>{waterIntake} ml / {dailyGoal} liters {percentage.toFixed(2)} %</p>
      <div className="reset-buttons">
                  <button onClick={resetProgress}>Reset Daily Progress</button>
                </div>
    </div>
  );
};

export default ProgressTracker;
