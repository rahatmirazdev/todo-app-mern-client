import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase.config';

// Login with email and password
export const loginWithEmailPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Register with email and password
export const registerWithEmailPassword = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// Login with Google
export const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    // Add additional scopes if needed
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

    // Make sure to select account every time
    provider.setCustomParameters({
        prompt: 'select_account'
    });

    return signInWithPopup(auth, provider);
};

// Password reset
export const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
};

// Logout
export const logout = () => {
    return signOut(auth);
};