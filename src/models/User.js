// src/models/User.js
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
    if (this.aboutMe && this.aboutMe.length > 500) {
      return { isValid: false, message: 'About me must be 500 characters or less' };
    }
    return { isValid: true };
  }

  validateAddress() {
    const errors = {};
    
    if (this.streetAddress && this.streetAddress.length < 5) {
      errors.streetAddress = 'Street address must be at least 5 characters';
    }
    
    if (this.state && this.state.length !== 2) {
      errors.state = 'State must be 2 characters (e.g., CA)';
    }
    
    if (this.zip && !/^\d{5}(-\d{4})?$/.test(this.zip)) {
      errors.zip = 'ZIP code must be in format 12345 or 12345-6789';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  validateBirthdate() {
    if (!this.birthdate) return { isValid: true }; // Optional field
    
    const birthDate = new Date(this.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 13) return { isValid: false, message: 'You must be at least 13 years old' };
    if (age > 120) return { isValid: false, message: 'Please enter a valid birthdate' };
    
    return { isValid: true };
  }

  // Validate specific step
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

  // Check if user has required data for a step
  hasRequiredDataForStep(step) {
    switch (step) {
      case 1:
        return this.email && this.password;
      case 2:
        return true; // Step 2 fields are optional
      case 3:
        return true; // Step 3 fields are optional
      default:
        return false;
    }
  }
}