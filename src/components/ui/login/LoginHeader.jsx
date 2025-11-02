function LoginHeader({ isLogin }) {
    return (
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
                Make<span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">ThePrint</span>
            </h1>
            <p className="text-gray-300 text-sm">
                {isLogin ? 'Welcome back' : 'Join our community'}
            </p>
        </div>
    );
}

export default LoginHeader;
