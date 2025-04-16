import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            content: "Taski has completely transformed how I manage my daily work. I've never been so organized and productive!",
            author: "Sarah Johnson",
            role: "Marketing Director",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg"
        },
        {
            content: "The analytics feature gives me insights into how I'm spending my time. I've eliminated hours of wasted effort.",
            author: "David Chen",
            role: "Software Engineer",
            avatar: "https://randomuser.me/api/portraits/men/2.jpg"
        },
        {
            content: "As a student, Taski helps me balance assignments, study sessions, and extracurriculars. My grades have improved!",
            author: "Emma Rodriguez",
            role: "Graduate Student",
            avatar: "https://randomuser.me/api/portraits/women/3.jpg"
        }
    ];

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-7 md:px-7">
                <div className="text-center mb-16">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                        Thousands of people are using Taski to transform their productivity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm"
                        >
                            <div className="flex items-center mb-4">
                                {/* Star rating */}
                                <div className="flex mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>

                            <blockquote className="mb-8 text-gray-600 dark:text-gray-300">"{testimonial.content}"</blockquote>

                            <div className="flex items-center">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.author}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{testimonial.author}</div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
