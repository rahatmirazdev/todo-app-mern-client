import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto my-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center mb-6">About Taski</h1>

            <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
                Taski is a powerful task management application designed to transform how you organize work and life.
                Our mission is to help you streamline tasks, boost productivity, and achieve more with less stress.
            </p>

            <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="md:w-1/2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Our Story</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Taski was born from a simple observation: most people struggle to organize their tasks effectively.
                        Our team of productivity enthusiasts set out to create a solution that combines powerful features with
                        an intuitive interface. The result is an application that adapts to your workflow, not the other way around.
                    </p>
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Our Approach</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We believe task management should be simple yet powerful. Taski offers advanced features without
                        overwhelming complexity, giving you insights into your productivity patterns while maintaining an
                        experience that feels natural and intuitive.
                    </p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-medium text-gray-800 dark:text-white">Smart Task Management</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pl-7">Organize tasks with priorities, due dates, and categories. Never miss a deadline again.</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-medium text-gray-800 dark:text-white">Calendar Integration</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pl-7">Seamlessly sync with your calendar to see all your tasks alongside your events and meetings.</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-medium text-gray-800 dark:text-white">Productivity Analytics</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pl-7">Gain insights into your productivity patterns with detailed analytics and reports.</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        <h3 className="font-medium text-gray-800 dark:text-white">Team Collaboration</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pl-7">Share tasks and projects with team members for seamless collaboration.</p>
                </div>
            </div>

            <div className="mt-10 text-center">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Ready to get started?</h2>
                <div className="flex justify-center space-x-4">
                    <Link to="/register" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        Sign Up Free
                    </Link>
                    <Link to="/login" className="px-6 py-3 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-600 dark:border-indigo-400 transition-colors">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
