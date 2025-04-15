import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        profilePicture: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                profilePicture: user.profilePicture || "",
                password: "",
                confirmPassword: "",
            });
        }
    }, [user]);

    // If no user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords don't match" });
            return false;
        }

        if (formData.password && formData.password.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters" });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Only include password if it was changed
            const updatedData = {
                name: formData.name,
                email: formData.email,
                profilePicture: formData.profilePicture,
            };

            if (formData.password) {
                updatedData.password = formData.password;
            }

            await updateProfile(updatedData);
            setMessage({
                type: "success",
                text: "Profile updated successfully",
            });
            setFormData({
                ...formData,
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("Update failed:", error);
            setMessage({
                type: "error",
                text: error.message || "Failed to update profile",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-10">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
                    <div className="w-32 h-32 overflow-hidden rounded-full border-4 border-indigo-600 dark:border-indigo-400">
                        <img
                            src={
                                formData.profilePicture ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&size=128&background=0D8ABC&color=fff`
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {user.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {user.email}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Update Profile</h2>

                    {message.text && (
                        <div
                            className={`mb-4 p-3 rounded-md ${message.type === "error"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

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

                        <div className="mb-4">
                            <label htmlFor="profilePicture" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Profile Picture URL
                            </label>
                            <input
                                type="text"
                                id="profilePicture"
                                name="profilePicture"
                                value={formData.profilePicture}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                placeholder="https://example.com/your-picture.jpg"
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Leave empty to use default avatar
                            </p>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Leave empty to keep current password"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 disabled:opacity-70"
                        >
                            {loading ? "Updating..." : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
