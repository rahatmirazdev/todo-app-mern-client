import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <div className=' bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800'>
            <div className="relative overflow-hidden min-h-screen flex items-center">
                <div className="w-full px-7 py-16 relative z-10">
                    <div className="container mx-auto md:px-7">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            {/* Text content - left side */}
                            <div className="md:w-1/2 mb-12 md:mb-0 animate-fade-in-up">
                                <h1 className="font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                    Master Your Tasks, <br />
                                    <span className="text-indigo-600 dark:text-indigo-400">Elevate Your Day</span>
                                </h1>

                                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                    Taski transforms the way you organize work and life. Streamline tasks, boost productivity, and achieve more with less stress.
                                </p>

                                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                                    <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 hover:scale-105">
                                        Get Started Free
                                    </Link>
                                    <Link to="/login" className="px-8 py-4 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-600 dark:border-indigo-400 transition-all duration-300 hover:scale-105">
                                        Sign In
                                    </Link>
                                </div>

                                <div className="mt-8 flex items-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                                    <div className="flex -space-x-2">
                                        {[...Array(4)].map((_, i) => (
                                            <img
                                                key={i}
                                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                                                src={`https://randomuser.me/api/portraits/women/${i + 10}.jpg`}
                                                alt="User avatar"
                                            />
                                        ))}
                                    </div>
                                    <p className="ml-4 text-sm text-gray-600 dark:text-gray-400">Join <span className="text-indigo-600 dark:text-indigo-400">10,000+</span> users organizing their lives</p>
                                </div>
                            </div>

                            {/* App visualization - right side */}
                            <div className="md:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <div className="relative perspective">
                                    {/* Main task card */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 z-20 relative animate-float">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Today's Tasks</h3>
                                            <span className="text-sm text-indigo-600 dark:text-indigo-400">80% Complete</span>
                                        </div>

                                        <div className="space-y-4">
                                            {['Finish project proposal', 'Team meeting at 2 PM', 'Review client feedback'].map((task, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center animate-slide-in-right"
                                                    style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${index < 2 ? 'bg-indigo-100 border-indigo-500 dark:bg-indigo-900/30 dark:border-indigo-600' : 'border-gray-300 dark:border-gray-600'}`}>
                                                        {index < 2 && (
                                                            <svg
                                                                className="w-3 h-3 text-indigo-600 dark:text-indigo-400 animate-draw-check"
                                                                style={{ animationDelay: `${0.7 + (index * 0.1)}s` }}
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className={`ml-3 text-sm ${index < 2 ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>{task}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-indigo-600 h-2.5 rounded-full animate-grow-width"
                                                style={{ width: '0%', animationDelay: '0.8s' }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Secondary task cards - positioned behind for depth */}
                                    <div
                                        className="absolute top-4 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-5/6 h-full -z-10 rotate-3 animate-float-delayed"
                                    >
                                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
                                        <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
                                        <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    </div>

                                    <div
                                        className="absolute top-8 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-5/6 h-full -z-10 -rotate-3 animate-float-reverse"
                                    >
                                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
                                        <div className="h-2 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
                                        <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Animation dots showing activity */}
                                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"
                                            style={{ animationDelay: `${i * 0.3}s` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats section */}
                        <div
                            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up"
                            style={{ animationDelay: '1.2s' }}
                        >
                            {[
                                { value: '97%', label: 'User satisfaction' },
                                { value: '10k+', label: 'Active users' },
                                { value: '50M+', label: 'Tasks completed' }
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm"
                                >
                                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{stat.value}</div>
                                    <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero