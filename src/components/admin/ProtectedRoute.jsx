import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firestore/firebaseConfig.js";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [user, loading] = useAuthState(auth);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/hidden-admin-auth" replace />;

    return children;
}

export default ProtectedRoute;