import {doc, getDoc, setDoc} from "firebase/firestore";
import {db} from "./firebaseConfig.js";

export const getFeaturedCategory = async () => {
    try {
        const settingsRef = doc(db, 'settings', 'featured');
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
            return settingsSnap.data().category || 'all';
        }
        return 'all';
    } catch (error) {
        // Silently fail on permission errors
        if (error.code !== 'permission-denied') {
            console.error("Error fetching featured category:", error);
        }
        return 'all';
    }
};

export const setFeaturedCategory = async (category) => {
    try {
        const settingsRef = doc(db, 'settings', 'featured');
        await setDoc(settingsRef, {
            category: category,
            lastModified: new Date()
        });
        return true;
    } catch (error) {
        // Silently fail on permission errors - DON'T throw
        if (error.code !== 'permission-denied') {
            console.error("Error setting featured category:", error);
        }
        return false;  // Just return false, don't throw
    }
};