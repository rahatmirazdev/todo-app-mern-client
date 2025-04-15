import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosPublic from '../services/api/axiosPublic';
import axiosPrivate from '../services/api/axiosPrivate';
import { loginWithGoogle as firebaseLoginWithGoogle } from '../services/firebase/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const checkLoggedIn = async () => {
            setLoading(true);
            try {
                const storedUser = localStorage.getItem('userInfo');
                const storedToken = localStorage.getItem('userToken');

                if (storedUser && storedToken) {
                    // Validate token with backend
                    const response = await axiosPrivate.get('/auth/validate-token');
                    if (response.data.valid) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Token invalid, clear storage
                        localStorage.removeItem('userInfo');
                        localStorage.removeItem('userToken');
                    }
                }
            } catch (error) {
                console.error('Error validating auth token:', error);
                localStorage.removeItem('userInfo');
                localStorage.removeItem('userToken');
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const response = await axiosPublic.post('/auth/login', {
                email,
                password
            });

            const { token, ...userData } = response.data;

            localStorage.setItem('userToken', token);
            localStorage.setItem('userInfo', JSON.stringify(userData));

            setUser(userData);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    }, []);

    const loginWithGoogle = useCallback(async () => {
        setLoading(true);
        try {
            // Call Firebase Google login
            const result = await firebaseLoginWithGoogle();
            const firebaseUser = result.user;

            // Get Firebase auth ID token
            const idToken = await firebaseUser.getIdToken();

            try {
                // Try to connect to the backend
                const response = await axiosPublic.post('/auth/google-login', {
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    profilePicture: firebaseUser.photoURL,
                    firebaseUid: firebaseUser.uid,
                    idToken: idToken
                });

                // Using the response from the backend
                const { token, ...userData } = response.data;

                // Store user info in localStorage
                localStorage.setItem('userToken', token);
                localStorage.setItem('userInfo', JSON.stringify(userData));

                setUser(userData);
                return true;
            } catch (backendError) {
                console.warn('Backend connection failed, using fallback method', backendError);

                // Fallback to direct Firebase authentication - this works without backend
                const userData = {
                    _id: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    profilePicture: firebaseUser.photoURL,
                    lastLogin: new Date().toISOString()
                };

                // Store in localStorage
                localStorage.setItem('userToken', idToken);
                localStorage.setItem('userInfo', JSON.stringify(userData));

                // Set the user in state
                setUser(userData);
                console.warn('User authenticated with Firebase only - login status will not persist in database');
                return true;
            }
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (userData) => {
        setLoading(true);
        try {
            const response = await axiosPublic.post('/users', userData);

            const { token, ...registeredUser } = response.data;

            localStorage.setItem('userToken', token);
            localStorage.setItem('userInfo', JSON.stringify(registeredUser));

            setUser(registeredUser);
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async (allDevices = false) => {
        setLoading(true);
        try {
            await axiosPrivate.post('/auth/revoke-token', {});
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userToken');
            setUser(null);
            setLoading(false);
            window.location.href = '/';
        }
    }, []);

    const updateProfile = useCallback(async (updateData) => {
        setLoading(true);
        try {
            const response = await axiosPrivate.put('/users/profile', updateData);

            const { token, ...updatedUser } = response.data;

            localStorage.setItem('userToken', token);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            setUser(updatedUser);
            return true;
        } catch (error) {
            console.error('Profile update error:', error);
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
    }), [user, loading, login, loginWithGoogle, register, logout, updateProfile]);

    // Don't render children until authentication check is complete
    if (loading && !user) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
