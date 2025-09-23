import React from 'react';

const LoadingSpinner = ({ size = 'large', className = '' }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`loading-spinner ${sizeClasses[size]}`}></div>
        </div>
    );
};

export default LoadingSpinner;
