import React, { useState, useEffect } from 'react';

const APIDebugTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    // Test 1: Direct fetch to known working endpoint
    try {
      console.log('🧪 Test 1: Direct fetch to /api/users');
      const response = await fetch('https://zealthy-onboarding-backend-production.up.railway.app/api/users');
      const data = await response.text();
      results.directFetch = {
        status: response.status,
        data: data,
        success: true
      };
      console.log('✅ Direct fetch success:', results.directFetch);
    } catch (error) {
      results.directFetch = {
        error: error.message,
        success: false
      };
      console.error('❌ Direct fetch failed:', error);
    }

    // Test 2: Test CORS preflight
    try {
      console.log('🧪 Test 2: CORS preflight test');
      const response = await fetch('https://zealthy-onboarding-backend-production.up.railway.app/api/users', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      results.corsTest = {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        success: true
      };
      console.log('✅ CORS test success:', results.corsTest);
    } catch (error) {
      results.corsTest = {
        error: error.message,
        success: false
      };
      console.error('❌ CORS test failed:', error);
    }

    // Test 3: Test with axios (your actual API)
    try {
      console.log('🧪 Test 3: Axios test');
      const axios = await import('axios');
      const response = await axios.default.get('https://zealthy-onboarding-backend-production.up.railway.app/api/users');
      results.axiosTest = {
        status: response.status,
        data: response.data,
        success: true
      };
      console.log('✅ Axios test success:', results.axiosTest);
    } catch (error) {
      results.axiosTest = {
        error: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : null,
        success: false
      };
      console.error('❌ Axios test failed:', error);
    }

    // Test 4: Test your API functions
    try {
      console.log('🧪 Test 4: Your getAllUsers function');
      const { getAllUsers } = await import('../api');
      const data = await getAllUsers();
      results.apiFunction = {
        data: data,
        success: true
      };
      console.log('✅ API function success:', results.apiFunction);
    } catch (error) {
      results.apiFunction = {
        error: error.message,
        success: false
      };
      console.error('❌ API function failed:', error);
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔧 API Debug Test</h2>
      <p><strong>Current URL:</strong> {window.location.origin}</p>
      <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 100)}...</p>
      
      <button onClick={runTests} disabled={loading} style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: loading ? 'not-allowed' : 'pointer',
        marginBottom: '20px'
      }}>
        {loading ? '🔄 Testing...' : '🧪 Run Tests Again'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h3>Test Results:</h3>
          
          {/* Test 1: Direct Fetch */}
          <div style={{ 
            backgroundColor: testResults.directFetch?.success ? '#d4edda' : '#f8d7da',
            padding: '15px', 
            margin: '10px 0', 
            borderRadius: '5px',
            border: `1px solid ${testResults.directFetch?.success ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            <h4>🧪 Test 1: Direct Fetch</h4>
            {testResults.directFetch?.success ? (
              <div>
                <p>✅ <strong>Success!</strong></p>
                <p><strong>Status:</strong> {testResults.directFetch.status}</p>
                <p><strong>Data:</strong> {testResults.directFetch.data}</p>
              </div>
            ) : (
              <div>
                <p>❌ <strong>Failed:</strong> {testResults.directFetch?.error}</p>
              </div>
            )}
          </div>

          {/* Test 2: CORS */}
          <div style={{ 
            backgroundColor: testResults.corsTest?.success ? '#d4edda' : '#f8d7da',
            padding: '15px', 
            margin: '10px 0', 
            borderRadius: '5px',
            border: `1px solid ${testResults.corsTest?.success ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            <h4>🧪 Test 2: CORS Preflight</h4>
            {testResults.corsTest?.success ? (
              <div>
                <p>✅ <strong>Success!</strong></p>
                <p><strong>Status:</strong> {testResults.corsTest.status}</p>
                <p><strong>Access-Control-Allow-Origin:</strong> {testResults.corsTest.headers['access-control-allow-origin'] || 'Not set'}</p>
                <p><strong>Access-Control-Allow-Methods:</strong> {testResults.corsTest.headers['access-control-allow-methods'] || 'Not set'}</p>
              </div>
            ) : (
              <div>
                <p>❌ <strong>Failed:</strong> {testResults.corsTest?.error}</p>
              </div>
            )}
          </div>

          {/* Test 3: Axios */}
          <div style={{ 
            backgroundColor: testResults.axiosTest?.success ? '#d4edda' : '#f8d7da',
            padding: '15px', 
            margin: '10px 0', 
            borderRadius: '5px',
            border: `1px solid ${testResults.axiosTest?.success ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            <h4>🧪 Test 3: Axios Request</h4>
            {testResults.axiosTest?.success ? (
              <div>
                <p>✅ <strong>Success!</strong></p>
                <p><strong>Status:</strong> {testResults.axiosTest.status}</p>
                <p><strong>Data:</strong> {JSON.stringify(testResults.axiosTest.data)}</p>
              </div>
            ) : (
              <div>
                <p>❌ <strong>Failed:</strong> {testResults.axiosTest?.error}</p>
                {testResults.axiosTest?.response && (
                  <div>
                    <p><strong>Status:</strong> {testResults.axiosTest.response.status}</p>
                    <p><strong>Status Text:</strong> {testResults.axiosTest.response.statusText}</p>
                    <p><strong>Response Data:</strong> {JSON.stringify(testResults.axiosTest.response.data)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Test 4: API Function */}
          <div style={{ 
            backgroundColor: testResults.apiFunction?.success ? '#d4edda' : '#f8d7da',
            padding: '15px', 
            margin: '10px 0', 
            borderRadius: '5px',
            border: `1px solid ${testResults.apiFunction?.success ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            <h4>🧪 Test 4: Your API Function</h4>
            {testResults.apiFunction?.success ? (
              <div>
                <p>✅ <strong>Success!</strong></p>
                <p><strong>Data:</strong> {JSON.stringify(testResults.apiFunction.data)}</p>
              </div>
            ) : (
              <div>
                <p>❌ <strong>Failed:</strong> {testResults.apiFunction?.error}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>🔄 Running tests...</p>
        </div>
      )}
    </div>
  );
};

export default APIDebugTest;
