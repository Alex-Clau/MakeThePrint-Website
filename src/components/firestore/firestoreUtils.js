import {collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc} from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

export const fetchCollection = async (collectionName) => {
    try {
        const colRef = collection(db, collectionName);
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(d => ({ docId: d.id, ...d.data() }));
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        throw error;
    }
};

export const addDocument = async (collectionName, data, customFields = {}) => {
    try {
        const dataWithDefaults = {
            ...data,
            ...customFields,
            lastModified: new Date()
        };
        const docRef = await addDoc(collection(db, collectionName), dataWithDefaults);
        return { docId: docRef.id, ...dataWithDefaults };
    } catch (error) {
        console.error(`Error adding document to ${collectionName}:`, error);
        throw error;
    }
};

export const removeDocument = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return true;
    } catch (error) {
        console.error(`Error deleting document from ${collectionName}:`, error);
        throw error;
    }
};

export const updateDocument = async (collectionName, docId, newData) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
            ...newData,
            lastModified: new Date()
        });
        return true;
    } catch (error) {
        console.error(`Error updating document in ${collectionName}:`, error);
        throw error;
    }
};

// add or remove a favorite
export async function toggleFavoriteInFirestore(item) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const favoriteRef = doc(db, "favorites", user.uid, "items", item.id);

    if (item.like) {
        // if liked now, add to Firestore
        await setDoc(favoriteRef, {
            ...item,
            createdAt: new Date(),
        });
    } else {
        // unlike
        await deleteDoc(favoriteRef);
    }
}

export async function loadUserFavorites() {
    const user = auth.currentUser;
    if (!user) return [];

    const favCol = collection(db, "favorites", user.uid, "items");
    const snapshot = await getDocs(favCol);
    return snapshot.docs.map(doc => doc.data());
}