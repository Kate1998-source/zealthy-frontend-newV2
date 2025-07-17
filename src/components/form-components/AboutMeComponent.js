import React from 'react';
import { getFieldDisplayName, getFieldIcon } from '../../utils/fieldNames';
import { getFieldPlaceholder } from '../../utils/validationUtils';
import './FormComponents.css';

function AboutMeComponent({ value, onChange, error, required = false }) {
  const fieldName = 'aboutMe';
  const displayName = getFieldDisplayName(fieldName);
  const icon = getFieldIcon(fieldName);
  const placeholder = getFieldPlaceholder(fieldName, required);
  
  return (
    <div className="form-component">
      <h3>
        {icon} {displayName} {required && <span className="required-asterisk">*</span>}
      </h3>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(fieldName, e.target.value)}
        placeholder={placeholder}
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