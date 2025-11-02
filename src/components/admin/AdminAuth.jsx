import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firestore/firebaseConfig.js";
import ErrorMessage from "../ui/ErrorMessage.jsx";

function AdminAuth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/hidden-admin", { replace: true });
        } catch {
            setError("Invalid email or password");
            setPassword("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black/30">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mx-10 w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-slate-900">Admin Access</h1>

                <ErrorMessage message={error} />

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all"
                >
                    {loading ? "Signing in..." : "Access Admin"}
                </button>
            </form>
        </div>
    );
}

export default AdminAuth;