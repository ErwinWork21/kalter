import React from 'react';

export default function SummaryPair({ label, value, isBold = false }) {
    return (
        <div className={`flex justify-between items-center ${isBold ? 'font-bold text-base' : ''}`}>
            <p className="text-gray-600">{label}</p>
            <p className="text-right">{value}</p>
        </div>
    );
}
