
import { User } from '../models/User';

export const validateComponents = (components, userData) => {
  const validationErrors = {};
  const user = new User(userData);
  
  components.forEach(componentType => {
    switch (componentType) {
      case 'ABOUT_ME':
        const aboutMeValidation = user.validateAboutMe();
        if (!aboutMeValidation.isValid) {
          validationErrors.aboutMe = aboutMeValidation.message;
        }
        break;
        
      case 'ADDRESS':
        const addressValidation = user.validateAddress();
        if (!addressValidation.isValid) {
          Object.assign(validationErrors, addressValidation.errors);
        }
        break;
        
      case 'BIRTHDATE':
        const birthdateValidation = user.validateBirthdate();
        if (!birthdateValidation.isValid) {
          validationErrors.birthdate = birthdateValidation.message;
        }
        break;
        
      default:
        break;
    }
  });
  
  return validationErrors;
};

export const getPageDescription = (components) => {
  if (components.length > 1) {
    return "All fields are required. Your progress is automatically saved.";
  } else if (components.includes('ABOUT_ME')) {
    return "Tell us about yourself. Your progress is automatically saved.";
  } else if (components.includes('ADDRESS')) {
    return "Please provide your address information. Your progress is automatically saved.";
  } else if (components.includes('BIRTHDATE')) {
    return "Please provide your birthdate. Your progress is automatically saved.";
  } else {
    return "Your progress is automatically saved.";
  }
};

/**
 * Validate a single field using User model validation
 */
export const validateField = (fieldName, value, allData = {}) => {
  const userData = { ...allData, [fieldName]: value };
  const user = new User(userData);

  switch (fieldName) {
    case 'email':
      return user.validateEmail();
    case 'password':
      return user.validatePassword();
    case 'aboutMe':
      return user.validateAboutMe();
    case 'birthdate':
      return user.validateBirthdate();
    case 'streetAddress':
    case 'city':
    case 'state':
    case 'zip':
      const addressValidation = user.validateAddress();
      return {
        isValid: !addressValidation.errors[fieldName],
        message: addressValidation.errors[fieldName] || null
      };
    default:
      return { isValid: true, message: null };
  }
};

/**
 * Get placeholder text for a field
 */
export const getFieldPlaceholder = (fieldName, required = false) => {
  const placeholders = {
    email: 'Enter your email address',
    password: 'Enter your password (min 6 characters)',
    aboutMe: 'Tell us about yourself...',
    streetAddress: 'Street Address',
    city: 'City',
    state: 'State',
    zip: 'ZIP Code',
    birthdate: 'Select your birthdate'
  };

  const placeholder = placeholders[fieldName] || fieldName;
  return required ? `${placeholder} (Required)` : placeholder;
};

/**
 * Get help text for a field
 */
export const getFieldHelpText = (fieldName) => {
  const helpTexts = {
    password: 'Password must be at least 6 characters long',
    aboutMe: 'Tell us about your interests, background, or anything you\'d like to share',
    state: 'Use 2-letter state code (e.g., CA)',
    zip: 'Format: 12345 or 12345-6789',
    birthdate: 'You must be at least 13 years old'
  };

  return helpTexts[fieldName] || null;
};