import React from 'react';

export default function NavItem({ icon, label, isActive, onClick }) {
    return (
        <button onClick={onClick} className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-[#C89F74] text-white shadow-md' : 'hover:bg-gray-200 text-gray-700'}`}>
            {React.cloneElement(icon, { className: 'w-5 h-5 mr-3' })}
            <span className="font-semibold">{label}</span>
        </button>
    );
}
