// src/components/form-components/AboutMeComponent.js
import React from 'react';
import './FormComponents.css';

function AboutMeComponent({ value, onChange, error }) {
  return (
    <div className="form-component">
      <h3>📝 About Me</h3>
      <textarea
        value={value || ''}
        onChange={(e) => onChange('aboutMe', e.target.value)}
        placeholder="Tell us about yourself..."
        rows="4"
        maxLength={500}
        className={`form-textarea ${error ? 'error' : ''}`}
      />
      <div className="character-counter">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="counter-text">
          {(value || '').length}/500 characters
        </div>
      </div>
    </div>
  );
}

export default AboutMeComponent;