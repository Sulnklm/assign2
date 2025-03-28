// src/components/Button.js
import React from 'react';

function Button({ text, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`text-white p-2 px-4 rounded-md transition font-[450] text-nowrap ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;
