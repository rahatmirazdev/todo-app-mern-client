import { useNavigate, useRouteError } from 'react-router-dom';

const ErrorElement = () => {
    const navigate = useNavigate();
    const error = useRouteError();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-lg w-full text-center">
                <div className="mb-8">
                    <div className="text-center">
                        <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
                        <div className="h-1 w-24 bg-indigo-500 mx-auto mb-6"></div>
                        <h2 className="text-3xl font-semibold text-gray-800 mb-3">Oops! Page not found</h2>
                        <p className="text-gray-600 mb-8">
                            {error?.statusText || error?.message ||
                                "The page you're looking for doesn't exist or has been moved."}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorElement;