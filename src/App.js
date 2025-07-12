import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import DataTable from './components/DataTable';
import './App.css';

// Mock API functions (replace with your actual API)
const mockAPI = {
  getAdminConfig: async () => {
    const saved = localStorage.getItem('admin_config');
    if (saved) {
      return JSON.parse(saved);
    }
    return { 2: ['ABOUT_ME', 'ADDRESS'], 3: ['BIRTHDATE'] };
  },
  
  checkEmailExists: async (email) => {
    // Simulate checking if email exists
    const existingEmails = JSON.parse(localStorage.getItem('existing_emails') || '[]');
    return existingEmails.includes(email);
  },
  
  registerCompleteUser: async (userData) => {
    // Simulate user registration
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const newUser = { ...userData, id: Date.now() };
    users.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(users));
    
    // Add email to existing emails
    const existingEmails = JSON.parse(localStorage.getItem('existing_emails') || '[]');
    existingEmails.push(userData.email);
    localStorage.setItem('existing_emails', JSON.stringify(existingEmails));
    
    return newUser;
  }
};

// Form Components
function AboutMeComponent({ value, onChange }) {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
        📝 Tell us about yourself
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange('aboutMe', e.target.value)}
        placeholder="Write a brief description about yourself..."
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '12px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '16px',
          fontFamily: 'inherit',
          resize: 'vertical',
          boxSizing: 'border-box'
        }}
      />
      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        {value.length}/500 characters
      </div>
    </div>
  );
}

function AddressComponent({ values, onChange }) {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
      <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>
        🏠 Your Address
      </label>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        <input
          type="text"
          value={values.streetAddress || ''}
          onChange={(e) => onChange('streetAddress', e.target.value)}
          placeholder="Street Address"
          style={{
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '16px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
          <input
            type="text"
            value={values.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="City"
            style={{
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          
          <input
            type="text"
            value={values.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="State"
            style={{
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          
          <input
            type="text"
            value={values.zip || ''}
            onChange={(e) => onChange('zip', e.target.value)}
            placeholder="ZIP"
            style={{
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>
    </div>
  );
}

function BirthdateComponent({ value, onChange }) {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
        🎂 Your Birthdate
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange('birthdate', e.target.value)}
        style={{
          padding: '12px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '16px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}

function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [adminConfig, setAdminConfig] = useState({ 2: [], 3: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdminConfig();
    restoreProgress();
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (userData.email && currentStep > 1) {
      localStorage.setItem('zealthy_user_data', JSON.stringify(userData));
      localStorage.setItem('zealthy_current_step', currentStep.toString());
      console.log('Progress saved:', currentStep);
    }
  }, [userData, currentStep]);

  const loadAdminConfig = async () => {
    try {
      const config = await mockAPI.getAdminConfig();
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
      const emailExists = await mockAPI.checkEmailExists(email);
      if (emailExists) {
        setError('❌ This email is already registered. Please use a different email.');
        return;
      }

      const newUserData = { email, password };
      setUserData(newUserData);
      setCurrentStep(2);
      console.log('Moving to step 2');
      
    } catch (error) {
      console.error('Step 1 error:', error);
      setError('❌ Failed to validate email. Please try again.');
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

      const result = await mockAPI.registerCompleteUser(completeUserData);
      console.log('Registration successful:', result);
      
      alert(`🎉 Registration Complete! User ID: ${result.id}`);
      
      // Clear saved data
      localStorage.removeItem('zealthy_user_data');
      localStorage.removeItem('zealthy_current_step');
      setCurrentStep(1);
      setUserData({});
      setError('');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(`❌ Registration failed: ${error.message || error}`);
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
    
    // Default components if admin config is empty
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
    <div className="App">
      <header className="App-header">
        <h1>🎯 Zealthy Onboarding</h1>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          {[1, 2, 3].map(step => (
            <div key={step} style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: currentStep >= step ? '#007bff' : '#ccc',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {step}
            </div>
          ))}
        </div>

        {/* Debug Info - Development Only */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '10px', 
            marginBottom: '20px',
            fontSize: '12px',
            borderRadius: '5px'
          }}>
            <strong>Debug:</strong> Step {currentStep} | Email: {userData.email || 'None'} | 
            Keys: {Object.keys(userData).join(', ')}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            border: '1px solid #f5c6cb',
            fontWeight: 'bold'
          }}>
            {error}
          </div>
        )}
        
        {/* Step 1: Email/Password */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Step 1: Create Account</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              We'll check if your email is available before proceeding.
            </p>
            
            <form onSubmit={handleStep1Submit} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={userData.email || ''}
                  placeholder="Email" 
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '5px', 
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="password" 
                  name="password"
                  defaultValue={userData.password || ''}
                  placeholder="Password (min 6 characters)" 
                  minLength="6"
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '5px', 
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  backgroundColor: loading ? '#6c757d' : '#007bff',
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '🔍 Checking Email...' : '✅ Check Email & Continue →'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Dynamic Components */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Step 2: Tell Us About Yourself</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Your progress is automatically saved. Safe to refresh the page.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '30px', 
              maxWidth: '600px', 
              margin: '20px auto' 
            }}>
              {renderComponents(2)}
            </div>
            
            <button 
              onClick={handleNextStep}
              style={{ 
                padding: '12px 30px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Next Step →
            </button>
          </div>
        )}

        {/* Step 3: Final Step */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Step 3: Final Step!</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Complete your registration. This will save all data to the database.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '30px', 
              maxWidth: '600px', 
              margin: '20px auto' 
            }}>
              {renderComponents(3)}
            </div>
            
            {/* Data Preview */}
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '15px', 
              borderRadius: '5px', 
              margin: '20px auto',
              maxWidth: '600px',
              border: '1px solid #c3e6c3'
            }}>
              <h4 style={{ marginTop: 0, color: '#155724' }}>📋 Review Your Information:</h4>
              <div style={{ textAlign: 'left', color: '#155724' }}>
                <p><strong>Email:</strong> {userData.email}</p>
                {userData.aboutMe && <p><strong>About Me:</strong> {userData.aboutMe.length > 50 ? userData.aboutMe.substring(0, 50) + '...' : userData.aboutMe}</p>}
                {userData.streetAddress && <p><strong>Address:</strong> {userData.streetAddress}{userData.city ? `, ${userData.city}` : ''}{userData.state ? ` ${userData.state}` : ''}{userData.zip ? ` ${userData.zip}` : ''}</p>}
                {userData.birthdate && <p><strong>Birthdate:</strong> {userData.birthdate}</p>}
              </div>
            </div>
            
            <button 
              onClick={handleNextStep}
              disabled={loading}
              style={{ 
                padding: '15px 35px', 
                backgroundColor: loading ? '#6c757d' : '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '20px'
              }}
            >
              {loading ? '💾 Saving to Database...' : '🎉 Complete Registration'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div style={{ marginTop: '40px' }}>
          <nav>
            <Link to="/admin" style={{ color: '#007bff', textDecoration: 'none', marginRight: '20px' }}>
              🔧 Admin Dashboard
            </Link>
            <Link to="/data" style={{ color: '#007bff', textDecoration: 'none' }}>
              📊 View Data
            </Link>
            {currentStep > 1 && (
              <>
                {' | '}
                <button 
                  onClick={clearProgress}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  🔄 Start Over
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
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
