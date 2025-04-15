/**
 * Checks if all required Firebase environment variables are set
 * @returns {boolean} True if all required variables are set
 */
export const validateFirebaseConfig = () => {
    const requiredVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = requiredVars.filter(
        varName => !import.meta.env[varName]
    );

    if (missingVars.length > 0) {
        console.error('Missing Firebase environment variables:', missingVars);
        return false;
    }

    return true;
};

/**
 * Verify all required configurations for the app
 */
export const verifyAppConfig = () => {
    const isFirebaseConfigValid = validateFirebaseConfig();

    if (!isFirebaseConfigValid) {
        console.warn('Firebase configuration is incomplete. Authentication features may not work properly.');
    }

    return {
        isFirebaseConfigValid
    };
};
