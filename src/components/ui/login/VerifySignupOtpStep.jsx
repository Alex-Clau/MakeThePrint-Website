import { Shield } from 'lucide-react';
import ErrorMessage from '../ErrorMessage';

function VerifySignupOtpStep({ email, otp, error, loading, onOtpChange, onVerify, onBack }) {
    return (
        <div className="space-y-4">
            {error && <ErrorMessage message={error} />}

            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-center">
                <Shield className="mx-auto mb-2 text-blue-400" size={32} />
                <p className="text-white font-medium">Verify your email</p>
                <p className="text-gray-400 text-sm mt-1">
                    We sent a 6-digit code to {email}
                </p>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    disabled={loading}
                    maxLength={6}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition disabled:opacity-50"
                />
            </div>

            <button
                onClick={onVerify}
                disabled={loading || otp.length !== 6}
                className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 disabled:scale-100"
            >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <button
                type="button"
                onClick={onBack}
                disabled={loading}
                className="cursor-pointer w-full text-yellow-500 hover:text-yellow-400 py-2 text-sm transition disabled:opacity-50"
            >
                Change Email
            </button>
        </div>
    );
}

export default VerifySignupOtpStep;