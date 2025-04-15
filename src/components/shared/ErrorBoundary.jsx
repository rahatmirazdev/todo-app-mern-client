import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console or an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorDisplay
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                />
            );
        }

        return this.props.children;
    }
}

// Use a function component for the error display to use hooks
const ErrorDisplay = ({ error, errorInfo, resetError }) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        resetError();
        navigate(-1);
    };

    const handleGoHome = () => {
        resetError();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen p-6 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h2>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-4">
                    <p className="text-red-700 dark:text-red-300 font-medium">{error?.toString()}</p>
                </div>

                {process.env.NODE_ENV !== 'production' && errorInfo && (
                    <div className="mb-4 mt-4">
                        <details className="cursor-pointer">
                            <summary className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                                Error Details (for developers)
                            </summary>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-xs text-gray-800 dark:text-gray-300">
                                {errorInfo.componentStack}
                            </pre>
                        </details>
                    </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;
