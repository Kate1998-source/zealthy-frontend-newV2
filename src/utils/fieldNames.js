
export const getFieldDisplayName = (field) => {
  const displayNames = {
    email: 'Email Address',
    password: 'Password',
    aboutMe: 'About Me',
    streetAddress: 'Street Address',
    city: 'City',
    state: 'State',
    zip: 'ZIP Code',
    birthdate: 'Birthdate'
  };
  return displayNames[field] || field;
};