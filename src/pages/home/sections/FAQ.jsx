import React, { useState } from 'react';

const FAQ = () => {
    const faqs = [
        {
            question: "How does Taski differ from other task management apps?",
            answer: "Taski focuses on simplicity and productivity insights. Our analytics help you understand your work habits while maintaining an intuitive interface that doesn't get in your way."
        },
        {
            question: "Can I use Taski on multiple devices?",
            answer: "Yes! Taski works on desktop, tablet, and mobile devices. Your tasks sync automatically across all platforms, so you can stay productive anywhere."
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We use industry-standard encryption for all data, and your information is never shared with third parties. We take your privacy seriously."
        },
        {
            question: "Can I collaborate with my team?",
            answer: "Yes, our Team plan includes collaboration features that let you assign tasks, share projects, and track team progress together."
        },
        {
            question: "What happens when my trial ends?",
            answer: "When your 14-day trial ends, you can choose to upgrade to a paid plan or downgrade to our Free plan. You won't lose any data if you choose to downgrade."
        },
        {
            question: "How do I cancel my subscription?",
            answer: "You can cancel your subscription anytime from your account settings. We don't lock you into contracts, and you'll continue to have access until the end of your billing period."
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-7 md:px-7">
                <div className="text-center mb-16">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                        Have questions? We're here to help.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden"
                            >
                                <button
                                    className="flex justify-between items-center w-full p-6 text-left"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <h3 className="font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                                    <svg
                                        className={`w-5 h-5 text-gray-500 dark:text-gray-300 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-60 pb-6' : 'max-h-0'}`}
                                >
                                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
