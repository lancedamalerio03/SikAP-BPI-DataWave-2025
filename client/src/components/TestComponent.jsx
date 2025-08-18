// client/src/components/TestComponent.jsx
import React from 'react';

const TestComponent = () => {
  console.log('TestComponent is rendering');
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1>Test Component Works!</h1>
      <p>If you can see this, React is working.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default TestComponent;