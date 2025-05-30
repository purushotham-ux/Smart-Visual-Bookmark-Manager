import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth, 
  User,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8xAK2aJVvn95WTwbGID8QgNCmGIcEc3E",
  authDomain: "smart-bookmark-manager.firebaseapp.com",
  projectId: "smart-bookmark-manager",
  storageBucket: "smart-bookmark-manager.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "322263149732",
  appId: "1:322263149732:web:bb481ef1a0195f3cb8ca31",
  measurementId: "G-KYS84RS0NY"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const analytics: Analytics = getAnalytics(app);
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
export const githubProvider: GithubAuthProvider = new GithubAuthProvider();
export const storage = getStorage(app);

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firebase persistence failed to initialize: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required for persistence
      console.warn('Firebase persistence failed to initialize: Browser not supported');
    }
  });

// Enable local persistence for Auth
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper functions for authentication
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to sign in with Google');
    }
  }
};

export const signInWithGithub = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with GitHub', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to sign in with GitHub');
    }
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error signing in with email', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to sign in with email and password');
    }
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's display name and photo URL
    await updateProfile(result.user, {
      displayName: displayName,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`
    });
    return result.user;
  } catch (error) {
    console.error('Error registering with email', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to register with email and password');
    }
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to send password reset email');
    }
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No user is currently logged in');
    }
    
    // Re-authenticate user first
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Then update password
    await updatePassword(user, newPassword);
    
  } catch (error) {
    console.error('Error updating password:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to update password');
    }
  }
};

export default app; 