import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
    return (
        <section className="py-20 bg-indigo-600 dark:bg-indigo-800">
            <div className="container mx-auto px-7 md:px-7 text-center">
                <h2 className="font-bold text-white mb-6 max-w-4xl mx-auto">
                    Ready to transform your productivity?
                </h2>

                <p className="text-indigo-100 max-w-2xl mx-auto mb-10">
                    Join thousands of users who have already transformed how they manage tasks and achieve their goals.
                </p>

                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/register" className="px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg transition-all duration-300 hover:bg-indigo-50 hover:scale-105">
                        Get Started Free
                    </Link>
                    <Link to="/login" className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white transition-all duration-300 hover:bg-indigo-700 hover:scale-105">
                        Sign In
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTA;
