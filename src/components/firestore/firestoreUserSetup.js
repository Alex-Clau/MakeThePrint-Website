import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

export async function ensureUserDocument(user) {
    if (!user) return null;

    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // create user document if it doesn't exist
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email?.split('@')[0] || 'User',
                createdAt: new Date(),
                lastLogin: new Date()
            };
            await setDoc(userRef, userData);
            return userData;
        } else {
            // update last login for existing users
            await updateDoc(userRef, {
                lastLogin: new Date()
            });
            return userDoc.data();
        }
    } catch (error) {
        console.error("Error ensuring user document:", error);
        // don't want to break auth flow
        return null;
    }
}

// check if user document exists
export async function checkUserDocumentExists(uid) {
    if (!uid) return false;

    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists();
    } catch (error) {
        console.error("Error checking user document:", error);
        return false;
    }
}