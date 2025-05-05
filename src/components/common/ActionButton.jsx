import React from 'react';

const ActionButton = ({ onClick, children, variant = 'primary', size = 'sm', className = '' }) => (
  <button
    className={`btn btn-${variant} btn-${size} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default ActionButton;
