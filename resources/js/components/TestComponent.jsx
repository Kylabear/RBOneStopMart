import React from 'react';

const TestComponent = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            zIndex: 9999,
            fontSize: '18px',
            textAlign: 'center'
        }}>
            <h1>React is Working!</h1>
            <p>If you can see this, React is loading properly.</p>
        </div>
    );
};

export default TestComponent;
