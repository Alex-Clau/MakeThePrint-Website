import {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import {auth, db} from "./firebaseConfig.js";
import {doc, getDoc, setDoc} from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function useAuthCheck() {
    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            setIsReady(true);
        });
        return () => unsubscribe();
    }, []);

    const requireAuth = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return false;
        }
        return true;
    };

    return {isReady, isAuthenticated, requireAuth};
}

export function useAuthUser() {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // ensure the Firestore document is created
                const name = await fetchUserName(currentUser.uid);
                setUserName(name || currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
            } else {
                setUserName('');
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, userName, loading };
}

export async function fetchUserName(uid) {
    if (!uid) return 'User';

    try {
        const userDoc = await getDoc(doc(db, 'users', uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.name || userData.displayName || 'User';
        }

        return 'User';
    } catch (error) {
        return 'User';
    }
}

export async function checkEmailExists(email) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        return !querySnapshot.empty; // true if any user found with this email
    } catch (error) {
        //  assume email doesn't exist
        return false;
    }
}

export async function createUserAccount(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
        });

        return user;
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('This email is already registered');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('Password should be at least 6 characters');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Invalid email address');
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error('Network error. Please check your connection');
        }

        throw new Error('Failed to create account. Please try again');
    }
}