
import React from 'react';
import AboutMeComponent from '../form-components/AboutMeComponent';
import AddressComponent from '../form-components/AddressComponent';
import BirthdateComponent from '../form-components/BirthdateComponent';

const COMPONENT_MAP = {
  ABOUT_ME: AboutMeComponent,
  ADDRESS: AddressComponent,
  BIRTHDATE: BirthdateComponent
};

const getFieldNameFromComponent = (componentType) => {
  const mapping = {
    ABOUT_ME: 'aboutMe',
    BIRTHDATE: 'birthdate'
  };
  return mapping[componentType];
};

export const DynamicComponentRenderer = ({ 
  components, 
  userData, 
  errors, 
  onChange, 
  required = true 
}) => {
  return components.map(componentType => {
    const Component = COMPONENT_MAP[componentType];
    if (!Component) return null;

    // Special handling for AddressComponent which expects different props structure
    if (componentType === 'ADDRESS') {
      return (
        <Component
          key="address"
          values={userData}
          onChange={onChange}
          errors={errors}
          required={required}
        />
      );
    }

    // Handle other components with standard prop structure
    const fieldName = getFieldNameFromComponent(componentType);
    return (
      <Component
        key={componentType.toLowerCase()}
        value={userData[fieldName] || ''}
        onChange={onChange}
        error={errors[fieldName]}
        required={required}
      />
    );
  });
};