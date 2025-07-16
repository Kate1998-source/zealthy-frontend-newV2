// src/models/User.js - Enhanced with required field validation
export class User {
  constructor(data = {}) {
    this.email = data.email || '';
    this.password = data.password || '';
    this.aboutMe = data.aboutMe || '';
    this.streetAddress = data.streetAddress || '';
    this.city = data.city || '';
    this.state = data.state || '';
    this.zip = data.zip || '';
    this.birthdate = data.birthdate || '';
  }

  // Form validation methods
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) return { isValid: false, message: 'Email is required' };
    if (!emailRegex.test(this.email)) return { isValid: false, message: 'Please enter a valid email address' };
    return { isValid: true };
  }

  validatePassword() {
    if (!this.password) return { isValid: false, message: 'Password is required' };
    if (this.password.length < 6) return { isValid: false, message: 'Password must be at least 6 characters' };
    return { isValid: true };
  }

  validateAboutMe() {
    // Make About Me required
    if (!this.aboutMe || this.aboutMe.trim() === '') {
      return { isValid: false, message: 'Please tell us about yourself' };
    }
    if (this.aboutMe.length < 10) {
      return { isValid: false, message: 'Please write at least 10 characters about yourself' };
    }
    if (this.aboutMe.length > 500) {
      return { isValid: false, message: 'About me must be 500 characters or less' };
    }
    return { isValid: true };
  }

  validateAddress() {
    const errors = {};
    
    // Make all address fields required
    if (!this.streetAddress || this.streetAddress.trim() === '') {
      errors.streetAddress = 'Street address is required';
    } else if (this.streetAddress.length < 5) {
      errors.streetAddress = 'Street address must be at least 5 characters';
    }
    
    if (!this.city || this.city.trim() === '') {
      errors.city = 'City is required';
    } else if (this.city.length < 2) {
      errors.city = 'City must be at least 2 characters';
    }
    
    if (!this.state || this.state.trim() === '') {
      errors.state = 'State is required';
    } else if (this.state.length !== 2) {
      errors.state = 'State must be 2 characters (e.g., CA)';
    }
    
    if (!this.zip || this.zip.trim() === '') {
      errors.zip = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(this.zip)) {
      errors.zip = 'ZIP code must be in format 12345 or 12345-6789';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  validateBirthdate() {
    // Make birthdate required
    if (!this.birthdate || this.birthdate.trim() === '') {
      return { isValid: false, message: 'Birthdate is required' };
    }
    
    const birthDate = new Date(this.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 13) return { isValid: false, message: 'You must be at least 13 years old' };
    if (age > 120) return { isValid: false, message: 'Please enter a valid birthdate' };
    
    return { isValid: true };
  }

  // Validate specific step with required fields
  validateStep(step) {
    switch (step) {
      case 1:
        const emailValidation = this.validateEmail();
        const passwordValidation = this.validatePassword();
        return {
          isValid: emailValidation.isValid && passwordValidation.isValid,
          errors: {
            email: emailValidation.isValid ? null : emailValidation.message,
            password: passwordValidation.isValid ? null : passwordValidation.message
          }
        };
      
      case 2:
        const aboutMeValidation = this.validateAboutMe();
        const addressValidation = this.validateAddress();
        return {
          isValid: aboutMeValidation.isValid && addressValidation.isValid,
          errors: {
            aboutMe: aboutMeValidation.isValid ? null : aboutMeValidation.message,
            ...addressValidation.errors
          }
        };
      
      case 3:
        const birthdateValidation = this.validateBirthdate();
        return {
          isValid: birthdateValidation.isValid,
          errors: {
            birthdate: birthdateValidation.isValid ? null : birthdateValidation.message
          }
        };
      
      default:
        return { isValid: true, errors: {} };
    }
  }

  // Check if step has all required data
  hasRequiredDataForStep(step) {
    switch (step) {
      case 1:
        return this.email && this.password && this.password.length >= 6;
      case 2:
        return this.aboutMe && this.aboutMe.trim() !== '' && 
               this.streetAddress && this.streetAddress.trim() !== '' &&
               this.city && this.city.trim() !== '' &&
               this.state && this.state.trim() !== '' &&
               this.zip && this.zip.trim() !== '';
      case 3:
        return this.birthdate && this.birthdate.trim() !== '';
      default:
        return false;
    }
  }

  // Get user data for API submission
  toAPIFormat() {
    return {
      email: this.email,
      password: this.password,
      aboutMe: this.aboutMe || null,
      streetAddress: this.streetAddress || null,
      city: this.city || null,
      state: this.state || null,
      zip: this.zip || null,
      birthdate: this.birthdate || null
    };
  }

  // Update field and return new instance
  updateField(field, value) {
    const newData = { ...this, [field]: value };
    return new User(newData);
  }
}