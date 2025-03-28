import React from 'react';

function Button({ text, onClick, className = '', type = 'button' }) { 
  return (
    <button
      onClick={onClick}
      type={type} 
      className={`text-white p-2 px-4 rounded-md transition font-[450] text-nowrap ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;
