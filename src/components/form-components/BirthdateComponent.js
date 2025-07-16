// src/components/form-components/BirthdateComponent.js
import React from 'react';
import './FormComponents.css';

function BirthdateComponent({ value, onChange, error }) {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="form-component">
      <h3>🎂 Birthdate</h3>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange('birthdate', e.target.value)}
        max={maxDateString}
        className={`form-input ${error ? 'error' : ''}`}
        style={{ width: '200px' }}
      />
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default BirthdateComponent;