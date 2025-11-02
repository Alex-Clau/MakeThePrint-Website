import ErrorMessage from "../ErrorMessage.jsx";

function OrderFormStep({ formData, error, loading, isReady, isAuthenticated, onInputChange, onSubmit }) {
    return (
        <div id="order" className="w-full max-w-md mx-auto mb-16">
            <form onSubmit={onSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Place an Order</h3>

                {error && <ErrorMessage message={error} />}

                <div>
                    <label className="block text-white font-bold mb-2">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onInputChange}
                        placeholder="John Doe"
                        disabled={!isReady || !isAuthenticated}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-white font-bold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onInputChange}
                        placeholder="your@email.com"
                        disabled={!isReady || !isAuthenticated}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-white font-bold mb-2">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={onInputChange}
                        placeholder="Your phone number"
                        disabled={!isReady || !isAuthenticated}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-white font-bold mb-2">Order Details</label>
                    <textarea
                        name="orderDetails"
                        value={formData.orderDetails}
                        onChange={onInputChange}
                        placeholder="Describe your order..."
                        rows="4"
                        disabled={!isReady || !isAuthenticated}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-secondary transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !isReady}
                    className="cursor-pointer w-full px-6 py-3 font-bold bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {!isReady ? 'Loading...' : !isAuthenticated ? 'Login to Order' : loading ? 'Submitting...' : 'Submit Order'}
                </button>
            </form>
        </div>
    );
}

export default OrderFormStep;