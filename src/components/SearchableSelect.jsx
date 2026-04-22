import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export default function SearchableSelect({ options, value, onChange, placeholder, hasError }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Also close on escape
    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div
                className={`w-full p-2 flex justify-between items-center bg-white cursor-pointer rounded-lg ${hasError ? 'border-red-500 border-2' : 'border'} focus-within:ring-2 ${hasError ? 'focus-within:ring-red-500' : 'focus-within:ring-[#C89F74]'}`}
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <div className="truncate flex-1 text-gray-800">
                    {value || <span className="text-gray-500">{placeholder}</span>}
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg flex flex-col" style={{ maxHeight: '300px' }}>
                    <div className="p-2 border-b flex items-center sticky top-0 bg-white rounded-t-lg">
                        <Search size={16} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            className="w-full outline-none text-sm bg-transparent"
                            placeholder="Ketik untuk mencari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <div className="overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className={`p-2.5 text-sm cursor-pointer hover:bg-gray-100 ${value === option ? 'bg-[#f4ebe1] font-semibold text-[#8b6540]' : 'text-gray-700'}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-gray-500 text-sm text-center">Tidak ada hasil ditemukan</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
