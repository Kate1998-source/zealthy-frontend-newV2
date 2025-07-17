import React from 'react';
import { getFieldDisplayName, getFieldIcon } from '../../utils/fieldNames';
import { getFieldPlaceholder } from '../../utils/validationUtils';
import './FormComponents.css';

function AddressComponent({ values, onChange, errors = {}, required = false }) {
  const renderField = (fieldKey, isFullWidth = false, maxLength = null) => {
    const placeholder = getFieldPlaceholder(fieldKey, required);
    const error = errors[fieldKey];
    const value = values?.[fieldKey] || '';

    return (
      <div key={fieldKey} className="field-container">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          className={`form-input ${error ? 'error' : ''}`}
        />
        {error && (
          <div className={`error-message ${isFullWidth ? '' : 'small'}`}>
            {error}
          </div>
        )}
      </div>
    );
  };

  const addressIcon = getFieldIcon('address');

  return (
    <div className="form-component">
      <h3>
        {addressIcon} Address Information {required && <span className="required-asterisk">*</span>}
      </h3>
      <div className="address-grid">
        {/* Street Address - Full Width */}
        {renderField('streetAddress', true)}
        
        {/* City, State, ZIP - Row */}
        <div className="address-row">
          {renderField('city')}
          {renderField('state', false, 2)}
          {renderField('zip')}
        </div>
      </div>
    </div>
  );
}

export default AddressComponent;