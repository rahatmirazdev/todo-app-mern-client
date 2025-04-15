import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initializeApi } from "../../services/api/apiStatus";
import { useForm } from "../../hooks/useForm";

const Login = () => {
    const { formData, handleChange } = useForm({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { user, login, loginWithGoogle } = useAuth();
    const [backendStatus, setBackendStatus] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [popupOpen, setPopupOpen] = useState(false);

    // Check backend availability on component mount
    useEffect(() => {
        const checkStatus = async () => {
            const { isBackendAvailable, message } = await initializeApi();
            setBackendStatus(isBackendAvailable);
            if (!isBackendAvailable) {
                setStatusMessage(message);
                setError("Backend server is unavailable. Only Google login is available.");
            }
        };
        checkStatus();
    }, []);

    // Redirect if already logged in
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError("");

        if (!backendStatus) {
            setError("Backend server is unavailable. Please use Google login instead.");
            return;
        }

        setLoading(true);

        try {
            await login(formData.email, formData.password);
            // Redirect to dashboard after successful login
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            setError(error.message || "Failed to login. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }, [formData, backendStatus, login, navigate]);

    const handleGoogleLogin = useCallback(async () => {
        setError("");
        setGoogleLoading(true);
        setPopupOpen(true); // Set popup state to true when opening

        try {
            await loginWithGoogle();
            navigate("/dashboard");
        } catch (error) {
            console.error("Google login failed:", error);

            // Handle specific popup closure error
            if (error.code === 'auth/popup-closed-by-user') {
                setError("Login popup was closed. Please try again.");
            }
            // Show more specific error if it's a COOP issue
            else if (error.message?.includes("Cross-Origin-Opener-Policy")) {
                setError("Authentication popup was blocked. Please allow popups for this site.");
            }
            else {
                setError(error.message || "Failed to login with Google");
            }
        } finally {
            setGoogleLoading(false);
            setPopupOpen(false); // Reset popup state
        }
    }, [loginWithGoogle, navigate]);

    // Return a simple loading state if popup is open to prevent UI issues
    if (popupOpen) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-800 dark:text-gray-200 text-lg">Authenticating with Google...</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Please complete authentication in the popup window</p>
                </div>
            </div>
        );
    }

    // Rest of your component remains the same
    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-center mb-6 text-2xl font-bold text-gray-900 dark:text-white">Login</h1>

            {/* Backend status warning */}
            {!backendStatus && (
                <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md">
                    <p className="font-medium">⚠️ {statusMessage}</p>
                    <p className="text-sm mt-1">Firebase authentication will work, but backend features will be limited.</p>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-70"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="mt-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300 disabled:opacity-70"
                >
                    {googleLoading ? (
                        <span>Connecting...</span>
                    ) : (
                        <>
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                </g>
                            </svg>
                            Sign in with Google
                        </>
                    )}
                </button>
            </div>

            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
};

export default Login;
