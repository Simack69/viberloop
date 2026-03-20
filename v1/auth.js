/**
 * Viberloop Bio - Authentication Module
 * Implements Firebase Authentication with role-based access control
 */

// ==================== AUTHENTICATION STATE ====================
let auth;
let firestore;
let currentUser = null;
let currentUserRole = null;

/**
 * Initialize Firebase Authentication and Firestore
 */
async function initializeAuth() {
    try {
        auth = firebase.auth();
        firestore = firebase.firestore();

        console.log('✅ Firebase Auth initialized');

        // Listen for authentication state changes
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log('👤 User logged in:', user.email);
                await loadUserRole(user.uid);
            } else {
                console.log('👋 User logged out');
                currentUser = null;
                currentUserRole = null;
                showLoginScreen();
            }
        });
    } catch (error) {
        console.error('❌ Auth initialization error:', error);
        throw error;
    }
}

/**
 * Load user role from Firestore
 */
async function loadUserRole(uid) {
    try {
        const userDoc = await firestore.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            throw new Error('User profile not found. Please contact administrator.');
        }

        const userData = userDoc.data();
        currentUserRole = userData.role;
        currentUser = auth.currentUser;

        console.log('✅ User role loaded:', currentUserRole);

        // Proceed to app
        login(currentUserRole);
    } catch (error) {
        console.error('❌ Error loading user role:', error);
        alert(error.message);
        await signOut();
    }
}

/**
 * Sign in with email and password
 */
async function signInWithEmailAndPassword(email, password, selectedRole) {
    try {
        // Show loading state
        showLoadingState('Signing in...');

        // Sign in with Firebase Auth
        const userCredential = await auth.signInWithEmailAndPassword(email, password);

        // Load user profile
        const userDoc = await firestore.collection('users')
            .doc(userCredential.user.uid)
            .get();

        if (!userDoc.exists) {
            throw new Error('User profile not found');
        }

        const userData = userDoc.data();

        // Verify role matches
        if (userData.role !== selectedRole) {
            await auth.signOut();
            throw new Error(`Your account is not authorized for ${selectedRole} role`);
        }

        // Check if account is active
        if (userData.status !== 'active') {
            await auth.signOut();
            throw new Error('Your account is not active. Please contact administrator.');
        }

        console.log('✅ Sign in successful');
        hideLoadingState();

        // Auth state listener will handle the rest

    } catch (error) {
        hideLoadingState();
        console.error('❌ Sign in error:', error);

        // User-friendly error messages
        let errorMessage = error.message;
        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address format.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later.';
        }

        alert('Sign In Failed\n\n' + errorMessage);
        throw error;
    }
}

/**
 * Register new user (Admin only)
 */
async function registerUser(email, password, role, name) {
    try {
        showLoadingState('Creating account...');

        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        // Create user profile in Firestore
        await firestore.collection('users').doc(userCredential.user.uid).set({
            email: email,
            name: name,
            role: role,
            status: 'active',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: currentUser ? currentUser.uid : 'system'
        });

        // Send email verification
        await userCredential.user.sendEmailVerification();

        console.log('✅ User registered successfully:', email);
        hideLoadingState();

        alert(`Account created successfully!\n\nEmail: ${email}\nRole: ${role}\n\nA verification email has been sent to ${email}`);

        return userCredential.user;
    } catch (error) {
        hideLoadingState();
        console.error('❌ Registration error:', error);

        let errorMessage = error.message;
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'An account with this email already exists.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please use at least 6 characters.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address format.';
        }

        alert('Registration Failed\n\n' + errorMessage);
        throw error;
    }
}

/**
 * Sign out current user
 */
async function signOut() {
    try {
        await auth.signOut();
        console.log('✅ Sign out successful');

        // Clear state
        currentUser = null;
        currentUserRole = null;

        // Show login screen
        showLoginScreen();
    } catch (error) {
        console.error('❌ Sign out error:', error);
        alert('Sign out failed: ' + error.message);
    }
}

/**
 * Reset password
 */
async function resetPassword(email) {
    try {
        showLoadingState('Sending reset email...');

        await auth.sendPasswordResetEmail(email);

        hideLoadingState();
        alert(`Password reset email sent!\n\nPlease check ${email} for instructions to reset your password.`);

    } catch (error) {
        hideLoadingState();
        console.error('❌ Password reset error:', error);

        let errorMessage = error.message;
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address format.';
        }

        alert('Password Reset Failed\n\n' + errorMessage);
    }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return currentUser !== null;
}

/**
 * Check if user has specific role
 */
function hasRole(role) {
    return currentUserRole === role;
}

/**
 * Get current user data
 */
function getCurrentUser() {
    return {
        uid: currentUser?.uid,
        email: currentUser?.email,
        role: currentUserRole
    };
}

/**
 * Protect a function with authentication check
 */
function requireAuth(fn) {
    return function(...args) {
        if (!isAuthenticated()) {
            alert('You must be signed in to perform this action');
            showLoginScreen();
            return;
        }
        return fn.apply(this, args);
    };
}

/**
 * Show loading state
 */
function showLoadingState(message) {
    const loadingDiv = document.getElementById('authLoading');
    if (loadingDiv) {
        loadingDiv.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${message}`;
        loadingDiv.classList.remove('hidden');
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const loadingDiv = document.getElementById('authLoading');
    if (loadingDiv) {
        loadingDiv.classList.add('hidden');
    }
}

/**
 * Show login screen
 */
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('appScreen').classList.add('hidden');
}

// Initialize auth when page loads
window.addEventListener('DOMContentLoaded', () => {
    initializeAuth().catch(error => {
        console.error('Failed to initialize auth:', error);
        alert('Authentication system failed to initialize. Please refresh the page.');
    });
});
