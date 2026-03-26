import React, { useEffect } from 'react';

export default function Toast({ show, message, type = 'success', duration = 3000, onClose }) {
    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

    return (
        <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg`}>
            {message}
        </div>
    );
}

