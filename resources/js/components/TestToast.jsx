import React from 'react';
import toast from 'react-hot-toast';

const TestToast = () => {
    const showTestToast = () => {
        toast.error('Test toast message - Please login to browse our products');
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <button 
                onClick={showTestToast}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
                Test Toast
            </button>
        </div>
    );
};

export default TestToast;
