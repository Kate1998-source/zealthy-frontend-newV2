import React from 'react';
import './FormComponents.css';

function BirthdateComponent({ value, onChange, error, required = false }) {
  return (
    <div className="form-component">
      <h3>
        🎂 Birthdate {required && <span className="required-asterisk">*</span>}
      </h3>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange('birthdate', e.target.value)}
        required={required}
        className={`form-input ${error ? 'error' : ''}`}
        style={{ width: '200px' }}
      />
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {required && !value && (
        <div className="help-text">
          Please select your birthdate to continue
        </div>
      )}
    </div>
  );
}

export default BirthdateComponent;