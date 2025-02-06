import React from 'react';
const Feedback = ({ accuracy, cpm, errors }) => {
  return (
    <div className="feedback-container">
      <h2>Typing Results</h2>
      <div className="feedback-stats">
        <p><strong>Accuracy:</strong> <span className="stat-value">{accuracy}%</span></p>
        <p><strong>Speed:</strong> <span className="stat-value">{cpm} CPM</span></p>
        <p><strong>Total Errors:</strong> <span className="error-count">{errors.length}</span></p>
      </div>

      {errors.length > 0 && (
        <div className="error-section">
          <h3>Mismatches</h3>
          <ul className="error-list">
            {errors.map((error, index) => (
              <li key={index} className="error-item">
                <strong>Position {error.position}:</strong> 
                <span className="expected"> Expected "{error.expected}"</span>,  
                <span className="actual"> Actual "{error.actual}"</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Feedback;
