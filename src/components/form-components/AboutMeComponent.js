
import React from 'react';
import './FormComponents.css';

function AboutMeComponent({ value, onChange, error, required = false }) {
  return (
    <div className="form-component">
      <h3>
        📝 About Me {required && <span className="required-asterisk">*</span>}
      </h3>
      <textarea
        value={value || ''}
        onChange={(e) => onChange('aboutMe', e.target.value)}
        placeholder={required ? "Tell us about yourself... (Required)" : "Tell us about yourself..."}
        rows="4"
        maxLength={500}
        required={required}
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