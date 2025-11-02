import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/ui/login/LoginForm';
import SignupForm from '../components/ui/login/SignupForm.jsx';
import LoginHeader from '../components/ui/login/LoginHeader';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../components/firestore/firebaseConfig.js";
import AuthToggle from "../components/ui/login/AuthToggle.jsx";
import LoginFooter from "../components/ui/login/LoginFooter.jsx";
import { ensureUserDocument } from "../components/firestore/firestoreUserSetup.js";

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateLoginForm = () => {
        if (!formData.email.trim() || !formData.password.trim()) {
            setError('Please fill in all fields');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email');
            return false;
        }
        return true;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLoginForm()) return;

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);

            // Ensure user document exists
            try {
                await ensureUserDocument(userCredential.user);
            } catch (docErr) {
                console.error("Could not create user document:", docErr);
            }

            setFormData({ email: '', password: '' });
            navigate('/');
        } catch (err) {
            const errorMap = {
                'auth/user-not-found': 'Email not found. Please sign up first.',
                'auth/wrong-password': 'Incorrect password. Please try again.',
                'auth/invalid-credential': 'Invalid email or password. Please try again.',
            };
            setError(errorMap[err.code] || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSuccess = () => {
        // After successful signup with OTP verification, switch to login
        setIsLogin(true);
        setError('');
        setFormData({ email: '', password: '' });
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData(isLogin ? { email: '', password: '' } : { email: '', password: '' });
    };

    return (
        <div className="min-h-screen bg-black/20 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <LoginHeader isLogin={isLogin} />

                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        {isLogin ? 'Login' : 'Create Account'}
                    </h2>

                    {isLogin ? (
                        <LoginForm
                            formData={formData}
                            loading={loading}
                            error={error}
                            onChange={handleChange}
                            onSubmit={handleLoginSubmit}
                        />
                    ) : (
                        <SignupForm onSuccess={handleSignupSuccess} />
                    )}

                    <AuthToggle
                        isLogin={isLogin}
                        loading={loading}
                        onToggle={toggleAuthMode}
                    />
                </div>

                <LoginFooter />
            </div>
        </div>
    );
}