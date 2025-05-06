import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth, 
  User
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

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

export const registerWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
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

export default app; 