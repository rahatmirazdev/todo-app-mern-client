import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "forever",
            description: "Perfect for individuals just getting started with task management.",
            features: [
                "Up to 50 tasks",
                "Basic categorization",
                "7-day task history",
                "Email support"
            ],
            cta: "Get Started",
            highlighted: false
        },
        {
            name: "Pro",
            price: "$9",
            period: "/month",
            description: "Everything you need for advanced personal productivity.",
            features: [
                "Unlimited tasks",
                "Advanced analytics",
                "Recurring tasks",
                "Calendar integration",
                "Priority support",
                "Dark mode"
            ],
            cta: "Try Pro Free",
            highlighted: true
        },
        {
            name: "Team",
            price: "$19",
            period: "/month",
            description: "Boost your team's productivity with collaborative features.",
            features: [
                "Everything in Pro",
                "Team collaboration",
                "Shared projects",
                "Role management",
                "Team analytics",
                "API access"
            ],
            cta: "Contact Sales",
            highlighted: false
        }
    ];

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-7 md:px-7">
                <div className="text-center mb-16">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                        Choose the plan that fits your needs. All plans include a 14-day free trial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`${plan.highlighted ? 'relative border-2 border-indigo-500 dark:border-indigo-600' : 'border border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 transition-transform duration-300 hover:-translate-y-1`}
                        >
                            {plan.highlighted && (
                                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            )}
                            <div className="text-center mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                <div className="mb-2">
                                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                                    <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/register"
                                className={`block w-full py-3 px-4 text-center rounded-lg ${plan.highlighted ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white'} transition-colors font-medium`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
