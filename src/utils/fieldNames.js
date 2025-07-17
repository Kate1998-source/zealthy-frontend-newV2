// src/utils/fieldNames.js
export const getFieldDisplayName = (field) => {
  const displayNames = {
    email: 'Email Address',
    password: 'Password',
    aboutMe: 'About Me',
    streetAddress: 'Street Address',
    city: 'City',
    state: 'State',
    zip: 'ZIP Code',
    birthdate: 'Birthdate',
    address: 'Address'
  };
  return displayNames[field] || field;
};

export const getFieldIcon = (field) => {
  const icons = {
    email: '📧',
    password: '🔒',
    aboutMe: '📝',
    streetAddress: '🏠',
    city: '🏙️',
    state: '📍',
    zip: '📮',
    birthdate: '🎂',
    address: '🏠'
  };
  return icons[field] || '📄';
};