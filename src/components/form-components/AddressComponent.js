// src/components/form-components/AddressComponent.js - Enhanced with required validation
import React from 'react';
import './FormComponents.css';

function AddressComponent({ values, onChange, errors = {}, required = false }) {
  return (
    <div className="form-component">
      <h3>
        🏠 Address Information {required && <span className="required-asterisk">*</span>}
      </h3>
      <div className="address-grid">
        <div className="field-container">
          <input
            type="text"
            value={values?.streetAddress || ''}
            onChange={(e) => onChange('streetAddress', e.target.value)}
            placeholder={required ? "Street Address (Required)" : "Street Address"}
            required={required}
            className={`form-input ${errors.streetAddress ? 'error' : ''}`}
          />
          {errors.streetAddress && (
            <div className="error-message">
              {errors.streetAddress}
            </div>
          )}
        </div>
        
        <div className="address-row">
          <div className="field-container">
            <input
              type="text"
              value={values?.city || ''}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder={required ? "City (Required)" : "City"}
              required={required}
              className={`form-input ${errors.city ? 'error' : ''}`}
            />
            {errors.city && (
              <div className="error-message small">
                {errors.city}
              </div>
            )}
          </div>
          
          <div className="field-container">
            <input
              type="text"
              value={values?.state || ''}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder={required ? "State (Required)" : "State"}
              maxLength={2}
              required={required}
              className={`form-input ${errors.state ? 'error' : ''}`}
            />
            {errors.state && (
              <div className="error-message small">
                {errors.state}
              </div>
            )}
          </div>
          
          <div className="field-container">
            <input
              type="text"
              value={values?.zip || ''}
              onChange={(e) => onChange('zip', e.target.value)}
              placeholder={required ? "ZIP (Required)" : "ZIP"}
              required={required}
              className={`form-input ${errors.zip ? 'error' : ''}`}
            />
            {errors.zip && (
              <div className="error-message small">
                {errors.zip}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressComponent;