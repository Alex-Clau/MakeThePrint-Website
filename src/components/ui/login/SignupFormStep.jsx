import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useState } from 'react';
import ErrorMessage from '../ErrorMessage';

function SignupFormStep({ formData, loading, error, onChange, onSubmit }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && <ErrorMessage message={error} />}

            <div className="relative">
                <User className="absolute left-3 top-3.5 text-yellow-500" size={20} />
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={onChange}
                    disabled={loading}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition disabled:opacity-50"
                />
            </div>

            <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-yellow-500" size={20} />
                <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={onChange}
                    disabled={loading}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition disabled:opacity-50"
                />
            </div>

            <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-yellow-500" size={20} />
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={onChange}
                    disabled={loading}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition disabled:opacity-50"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="cursor-pointer absolute right-3 top-3.5 text-yellow-500 hover:text-yellow-600 transition disabled:opacity-50"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-yellow-500" size={20} />
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    disabled={loading}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition disabled:opacity-50"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 disabled:scale-100"
            >
                {loading ? 'Processing...' : 'Send Verification Code'}
            </button>
        </form>
    );
}

export default SignupFormStep;