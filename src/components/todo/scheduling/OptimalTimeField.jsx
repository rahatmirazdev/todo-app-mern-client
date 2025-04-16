import React from 'react';

const OptimalTimeField = ({ value, onChange, name = "optimalTimeOfDay" }) => {
    // Time of day options
    const timeOptions = [
        { label: 'Morning', value: 'morning', icon: '☀️' },
        { label: 'Afternoon', value: 'afternoon', icon: '🌤️' },
        { label: 'Evening', value: 'evening', icon: '🌙' },
        { label: 'Any time', value: 'any', icon: '🕒' }
    ];

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Optimal Time of Day
            </label>
            <div className="flex flex-wrap gap-2">
                {timeOptions.map(option => (
                    <button
                        key={option.value}
                        type="button"
                        className={`px-3 py-1.5 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${value === option.value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => onChange({ target: { name, value: option.value } })}
                    >
                        <span className="mr-1">{option.icon}</span> {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OptimalTimeField;
