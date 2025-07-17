
import React from 'react';

export const FormInput = ({ 
  type = "text",
  value, 
  onChange, 
  error, 
  required = false,
  placeholder,
  className = "",
  label,
  helpText,
  ...props 
}) => {
  const inputClassName = type === 'textarea' 
    ? `form-textarea ${error ? 'error' : ''} ${className}`
    : `form-input ${error ? 'error' : ''} ${className}`;
  
  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClassName}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClassName}
          {...props}
        />
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div className="help-text">
          {helpText}
        </div>
      )}
    </div>
  );
};