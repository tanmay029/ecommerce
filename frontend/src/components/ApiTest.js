import React, { useState } from 'react';
import { productsAPI } from '../api/api';

const ApiTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testProductsList = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getProducts();
      console.log('Products list response:', response);
      setResult({ type: 'success',  response });
    } catch (error) {
      console.error('Products list error:', error);
      setResult({ type: 'error', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSingleProduct = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getProduct('1');
      console.log('Single product response:', response);
      setResult({ type: 'success',  response });
    } catch (error) {
      console.error('Single product error:', error);
      setResult({ type: 'error', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Test Component</h3>
      <div>
        <button onClick={testProductsList} disabled={loading}>
          Test Products List
        </button>
        <button onClick={testSingleProduct} disabled={loading} style={{ marginLeft: '10px' }}>
          Test Single Product
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h4>Result:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
