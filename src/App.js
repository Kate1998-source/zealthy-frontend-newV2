import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getAdminConfig, checkEmailExists, registerCompleteUser } from './api';
import AdminDashboard from './components/AdminDashboard';
import DataTable from './components/DataTable';
import './App.css';

// Form Components
function AboutMeComponent({ value, onChange }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px', 
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '12px', 
        fontWeight: '600', 
        color: '#374151',
        fontSize: '16px' 
      }}>
        Tell us about yourself
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange('aboutMe', e.target.value)}
        placeholder="Write a brief description about yourself..."
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '15px',
          fontFamily: 'inherit',
          resize: 'vertical',
          boxSizing: 'border-box',
          lineHeight: '1.5',
          transition: 'border-color 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
          }
        }}
        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
      />
      <div style={{ 
        fontSize: '13px', 
        color: '#6b7280', 
        marginTop: '8px',
        textAlign: 'right'
      }}>
        {value.length}/500 characters
      </div>
    </div>
  );
}

function AddressComponent({ values, onChange }) {
  const inputStyle = {
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease-in-out'
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px', 
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '20px', 
        fontWeight: '600', 
        color: '#374151',
        fontSize: '16px' 
      }}>
        Your Address
      </label>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        <input
          type="text"
          value={values.streetAddress || ''}
          onChange={(e) => onChange('streetAddress', e.target.value)}
          placeholder="Street Address"
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
          <input
            type="text"
            value={values.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="City"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          
          <input
            type="text"
            value={values.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="State"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          
          <input
            type="text"
            value={values.zip || ''}
            onChange={(e) => onChange('zip', e.target.value)}
            placeholder="ZIP"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
      </div>
    </div>
  );
}

function BirthdateComponent({ value, onChange }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px', 
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '12px', 
        fontWeight: '600', 
        color: '#374151',
        fontSize: '16px' 
      }}>
        Your Birthdate
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange('birthdate', e.target.value)}
        style={{
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '15px',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease-in-out'
        }}
        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
      />
    </div>
  );
}

function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [adminConfig, setAdminConfig] = useState({ 
    2: ['ABOUT_ME', 'ADDRESS'], 
    3: ['BIRTHDATE'] 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdminConfig();
    restoreProgress();
  }, []);

  useEffect(() => {
    if (userData.email && currentStep > 1) {
      localStorage.setItem('zealthy_user_data', JSON.stringify(userData));
      localStorage.setItem('zealthy_current_step', currentStep.toString());
      console.log('Progress saved:', currentStep);
    }
  }, [userData, currentStep]);

  const loadAdminConfig = async () => {
    try {
      const config = await getAdminConfig();
      setAdminConfig(config);
      console.log('Admin config loaded:', config);
    } catch (error) {
      console.error('Admin config failed:', error);
      setAdminConfig({
        2: ['ABOUT_ME', 'ADDRESS'],
        3: ['BIRTHDATE']
      });
    }
  };

  const restoreProgress = () => {
    console.log('Restoring progress...');
    
    const savedData = localStorage.getItem('zealthy_user_data');
    const savedStep = localStorage.getItem('zealthy_current_step');
    
    if (savedData && savedStep) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.email) {
          setUserData(parsedData);
          setCurrentStep(parseInt(savedStep));
          console.log('Progress restored - Step:', savedStep);
        }
      } catch (error) {
        console.error('Restore error:', error);
        localStorage.removeItem('zealthy_user_data');
        localStorage.removeItem('zealthy_current_step');
      }
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('Step 1 submit:', email);

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setError('This email is already registered. Please use a different email.');
        return;
      }

      const newUserData = { email, password };
      setUserData(newUserData);
      setCurrentStep(2);
      console.log('Moving to step 2');
      
    } catch (error) {
      console.error('Step 1 error:', error);
      setError('Failed to validate email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (field, value) => {
    console.log(`Field "${field}" changed:`, value);
    const newUserData = { ...userData, [field]: value };
    setUserData(newUserData);
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      console.log('Moving to step 3');
      setCurrentStep(3);
    } else if (currentStep === 3) {
      console.log('Completing registration');
      handleCompleteRegistration();
    }
  };

  const handleCompleteRegistration = async () => {
    setLoading(true);
    setError('');

    console.log('Starting registration...');
    console.log('User data:', userData);

    try {
      const completeUserData = {
        email: userData.email,
        password: userData.password,
        aboutMe: userData.aboutMe || null,
        streetAddress: userData.streetAddress || null,
        city: userData.city || null,
        state: userData.state || null,
        zip: userData.zip || null,
        birthdate: userData.birthdate || null
      };

      console.log('Sending to backend:', completeUserData);

      const result = await registerCompleteUser(completeUserData);
      console.log('Registration successful:', result);
      
      alert(`Registration Complete! User ID: ${result.id}`);
      
      localStorage.removeItem('zealthy_user_data');
      localStorage.removeItem('zealthy_current_step');
      setCurrentStep(1);
      setUserData({});
      setError('');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(`Registration failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearProgress = () => {
    if (window.confirm('Start over? All progress will be lost.')) {
      localStorage.removeItem('zealthy_user_data');
      localStorage.removeItem('zealthy_current_step');
      setCurrentStep(1);
      setUserData({});
      setError('');
    }
  };

  const renderComponents = (pageNumber) => {
    const components = adminConfig[pageNumber] || [];
    
    if (components.length === 0) {
      if (pageNumber === 2) {
        return [
          <AboutMeComponent
            key="about-me"
            value={userData.aboutMe || ''}
            onChange={handleDataChange}
          />,
          <AddressComponent
            key="address"
            values={userData}
            onChange={handleDataChange}
          />
        ];
      } else if (pageNumber === 3) {
        return [
          <BirthdateComponent
            key="birthdate"
            value={userData.birthdate || ''}
            onChange={handleDataChange}
          />
        ];
      }
    }
    
    return components.map(componentType => {
      switch (componentType) {
        case 'ABOUT_ME':
          return (
            <AboutMeComponent
              key="about-me"
              value={userData.aboutMe || ''}
              onChange={handleDataChange}
            />
          );
        case 'ADDRESS':
          return (
            <AddressComponent
              key="address"
              values={userData}
              onChange={handleDataChange}
            />
          );
        case 'BIRTHDATE':
          return (
            <BirthdateComponent
              key="birthdate"
              value={userData.birthdate || ''}
              onChange={handleDataChange}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '20px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h1 style={{ 
            margin: 0,
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            textAlign: 'center'
          }}>
            Zealthy Onboarding
          </h1>
        </div>
      </div>

      <div style={{ 
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Progress Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px', 
          marginBottom: '40px' 
        }}>
          {[1, 2, 3].map((step, index) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: currentStep >= step ? '#3b82f6' : '#e5e7eb',
                color: currentStep >= step ? 'white' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '18px',
                transition: 'all 0.3s ease'
              }}>
                {step}
              </div>
              {index < 2 && (
                <div style={{ 
                  width: '60px',
                  height: '2px',
                  backgroundColor: currentStep > step ? '#3b82f6' : '#e5e7eb',
                  marginLeft: '20px',
                  transition: 'all 0.3s ease'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ 
            color: '#dc2626', 
            backgroundColor: '#fef2f2', 
            padding: '16px 20px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: '1px solid #fecaca',
            fontSize: '15px'
          }}>
            {error}
          </div>
        )}
        
        {/* Step 1: Email/Password */}
        {currentStep === 1 && (
          <div style={{ 
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                Create Your Account
              </h2>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '16px',
                margin: 0
              }}>
                We'll check if your email is available before proceeding
              </p>
            </div>
            
            <form onSubmit={handleStep1Submit} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={userData.email || ''}
                  placeholder="Enter your email" 
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    border: '1px solid #d1d5db',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease-in-out'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Password
                </label>
                <input 
                  type="password" 
                  name="password"
                  defaultValue={userData.password || ''}
                  placeholder="Enter your password (min 6 characters)" 
                  minLength="6"
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    border: '1px solid #d1d5db',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease-in-out'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '14px 20px', 
                  backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#2563eb';
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#3b82f6';
                }}
              >
                {loading ? 'Checking Email...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Dynamic Components */}
        {currentStep === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                Tell Us About Yourself
              </h2>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '16px',
                margin: 0
              }}>
                Your progress is automatically saved
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px',
              marginBottom: '32px'
            }}>
              {renderComponents(2)}
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={handleNextStep}
                style={{ 
                  padding: '14px 32px', 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                Continue to Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Final Step */}
        {currentStep === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                Almost Done!
              </h2>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '16px',
                margin: 0
              }}>
                Complete your registration to save all data
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px',
              marginBottom: '32px'
            }}>
              {renderComponents(3)}
            </div>
            
            {/* Data Preview */}
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              padding: '24px', 
              borderRadius: '12px', 
              marginBottom: '32px',
              border: '1px solid #bbf7d0'
            }}>
              <h4 style={{ 
                marginTop: 0, 
                marginBottom: '16px',
                color: '#166534',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Review Your Information
              </h4>
              <div style={{ color: '#166534', lineHeight: '1.6' }}>
                <p style={{ margin: '8px 0' }}><strong>Email:</strong> {userData.email}</p>
                {userData.aboutMe && (
                  <p style={{ margin: '8px 0' }}>
                    <strong>About Me:</strong> {userData.aboutMe.length > 50 ? userData.aboutMe.substring(0, 50) + '...' : userData.aboutMe}
                  </p>
                )}
                {userData.streetAddress && (
                  <p style={{ margin: '8px 0' }}>
                    <strong>Address:</strong> {userData.streetAddress}
                    {userData.city ? `, ${userData.city}` : ''}
                    {userData.state ? ` ${userData.state}` : ''}
                    {userData.zip ? ` ${userData.zip}` : ''}
                  </p>
                )}
                {userData.birthdate && (
                  <p style={{ margin: '8px 0' }}>
                    <strong>Birthdate:</strong> {userData.birthdate}
                  </p>
                )}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={handleNextStep}
                disabled={loading}
                style={{ 
                  padding: '16px 40px', 
                  backgroundColor: loading ? '#9ca3af' : '#dc2626', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#b91c1c';
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#dc2626';
                }}
              >
                {loading ? 'Saving to Database...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ 
          textAlign: 'center',
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <nav style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <Link 
              to="/admin" 
              style={{ 
                color: '#3b82f6', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '15px'
              }}
            >
              Admin Dashboard
            </Link>
            <Link 
              to="/data" 
              style={{ 
                color: '#3b82f6', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '15px'
              }}
            >
              View Data
            </Link>
            {currentStep > 1 && (
              <button 
                onClick={clearProgress}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '500'
                }}
              >
                Start Over
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingWizard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/data" element={<DataTable />} />
      </Routes>
    </Router>
  );
}

export default App;
