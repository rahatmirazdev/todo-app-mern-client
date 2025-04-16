import React from 'react';

const DurationEstimateField = ({ value, onChange, name = "estimatedDuration" }) => {
    // Predefined duration options (in minutes)
    const durationOptions = [
        { label: '15 min', value: 15 },
        { label: '30 min', value: 30 },
        { label: '1 hour', value: 60 },
        { label: '2 hours', value: 120 },
        { label: '4 hours', value: 240 },
        { label: 'Full day', value: 480 }
    ];

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Duration
            </label>
            <div className="flex flex-wrap gap-2">
                {durationOptions.map(option => (
                    <button
                        key={option.value}
                        type="button"
                        className={`px-3 py-1.5 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 
                            ${value === option.value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => onChange({ target: { name, value: option.value } })}
                    >
                        {option.label}
                    </button>
                ))}

                {/* Custom duration input */}
                <div className="relative">
                    <input
                        type="number"
                        name={name}
                        value={!durationOptions.some(opt => opt.value === value) ? value : ''}
                        onChange={onChange}
                        placeholder="Custom"
                        className="pl-3 pr-12 py-1.5 w-24 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        min="1"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                        min
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DurationEstimateField;
