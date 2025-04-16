import React from 'react';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            title: 'Create tasks',
            description: 'Add new tasks with detailed descriptions, due dates, priority levels, and categories.'
        },
        {
            number: '02',
            title: 'Organize and prioritize',
            description: 'Sort your tasks by priority, deadline, or custom categories to focus on what matters most.'
        },
        {
            number: '03',
            title: 'Track progress',
            description: 'Monitor your completion rate and productivity patterns with visual analytics.'
        },
        {
            number: '04',
            title: 'Accomplish more',
            description: 'Celebrate completed tasks and build momentum to achieve your goals faster.'
        }
    ];

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-7 md:px-7">
                <div className="text-center mb-16">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                        Follow these simple steps to transform how you manage tasks and boost your productivity.
                    </p>
                </div>

                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-100 dark:bg-indigo-900/30 -translate-x-1/2"></div>

                    <div className="space-y-12 relative">
                        {steps.map((step, index) => (
                            <div key={index} className="md:flex items-center">
                                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:order-2 md:pl-12'}`}>
                                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm mb-6 md:mb-0">
                                        <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-2">{step.number}</div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                                    </div>
                                </div>

                                {/* Center dot */}
                                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-500 dark:bg-indigo-600 border-4 border-white dark:border-gray-900 z-10"></div>

                                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-2' : 'md:pr-12'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
