
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