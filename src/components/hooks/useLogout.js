import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from "../firestore/firebaseConfig.js";

export function useLogout() {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
            throw err;
        }
    };

    return { logout };
}