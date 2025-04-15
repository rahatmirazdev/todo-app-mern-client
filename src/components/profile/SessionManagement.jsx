import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const SessionManagement = () => {
    const { getUserSessions, revokeSession, logout, sessions } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        setError("");
        try {
            await getUserSessions();
        } catch (err) {
            setError("Failed to load sessions");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeSession = async (sessionId) => {
        setLoading(true);
        setError("");
        try {
            await revokeSession(sessionId);
        } catch (err) {
            setError("Failed to revoke session");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutAllDevices = async () => {
        if (window.confirm("Are you sure you want to log out from all devices?")) {
            setLoading(true);
            setError("");
            try {
                await logout(true);
            } catch (err) {
                setError("Failed to logout from all devices");
                console.error(err);
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Active Sessions</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 dark:bg-gray-600">
                                <tr>
                                    <th className="py-2 px-4 text-left">Device</th>
                                    <th className="py-2 px-4 text-left">IP Address</th>
                                    <th className="py-2 px-4 text-left">Login Time</th>
                                    <th className="py-2 px-4 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.length > 0 ? (
                                    sessions.map((session) => (
                                        <tr key={session._id} className="border-b dark:border-gray-600">
                                            <td className="py-2 px-4">{session.userAgent || "Unknown device"}</td>
                                            <td className="py-2 px-4">{session.ipAddress || "Unknown"}</td>
                                            <td className="py-2 px-4">{formatDate(session.createdAt)}</td>
                                            <td className="py-2 px-4">
                                                <button
                                                    onClick={() => handleRevokeSession(session._id)}
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                                            No active sessions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleLogoutAllDevices}
                            disabled={loading || sessions.length === 0}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            Logout from all devices
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SessionManagement;
