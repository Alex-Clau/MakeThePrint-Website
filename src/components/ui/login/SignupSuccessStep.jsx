function SignupSuccessStep({ onReset }) {
    return (
        <div className="text-center space-y-4">
            <div className="text-5xl mb-4 text-green-400">✓</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Account Created!</h3>
            <p className="text-gray-300 mb-6">Your account has been successfully created. You can now sign in.</p>
            <button
                onClick={onReset}
                className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95"
            >
                Go to Sign In
            </button>
        </div>
    );
}

export default SignupSuccessStep;