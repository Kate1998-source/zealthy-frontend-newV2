import React from 'react';
import { getFieldDisplayName, getFieldIcon } from '../../utils/fieldNames';
import './FormComponents.css';

function BirthdateComponent({ value, onChange, error, required = false }) {
  const fieldName = 'birthdate';
  const displayName = getFieldDisplayName(fieldName);
  const icon = getFieldIcon(fieldName);

  return (
    <div className="form-component">
      <h3>
        {icon} {displayName} {required && <span className="required-asterisk">*</span>}
      </h3>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(fieldName, e.target.value)}
        required={required}
        className={`form-input ${error ? 'error' : ''}`}
        style={{ width: '200px' }}
      />
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {required && !value && !error && (
        <div className="help-text">
          Please select your {displayName.toLowerCase()} to continue
        </div>
      )}
    </div>
  );
}

export default BirthdateComponent;