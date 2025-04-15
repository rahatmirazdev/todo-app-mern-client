import React from 'react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto my-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center mb-6">About Our Application</h1>

            <p className="mb-4">
                This is a MERN (MongoDB, Express, React, Node.js) stack application that demonstrates user authentication,
                profile management, and protected routes.
            </p>

            <p className="mb-4">
                The application includes features such as:
            </p>

            <ul className="list-disc list-inside mb-4 space-y-2">
                <li>User registration and login</li>
                <li>JWT authentication</li>
                <li>Protected routes</li>
                <li>User profile management</li>
                <li>Dark/Light theme toggle</li>
                <li>Responsive design</li>
            </ul>

            <p className="mb-4">
                This starter pack can be used as a foundation for building more complex applications
                with authentication and user management features.
            </p>

            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Tech Stack:</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <span className="font-semibold">MongoDB</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <span className="font-semibold">Express.js</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Backend</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <span className="font-semibold">React</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Frontend</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <span className="font-semibold">Node.js</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Runtime</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
