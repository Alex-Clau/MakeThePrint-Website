function AuthToggle({ isLogin, loading, onToggle }) {
    return (
        <div className="mt-6 text-center border-t border-slate-700 pt-6">
            <p className="text-gray-400 text-sm mb-3">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
                onClick={onToggle}
                disabled={loading}
                className="cursor-pointer text-yellow-500 hover:text-yellow-600 font-semibold transition disabled:opacity-50"
            >
                {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
        </div>
    );
}

export default AuthToggle;