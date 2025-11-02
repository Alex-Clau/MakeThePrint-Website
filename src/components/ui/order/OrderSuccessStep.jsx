function OrderSuccessStep({ onReset }) {
    return (
        <div id="order" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center">
            <div className="text-5xl mb-4 text-yellow-500">✓</div>
            <h3 className="text-2xl font-bold text-yellow-500 mb-2">Order Received!</h3>
            <p className="text-white/90 mb-6">Thank you! We'll review your order and contact you shortly.</p>
            <button
                onClick={onReset}
                className="cursor-pointer w-full px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-bold"
            >
                Submit Another Order
            </button>
        </div>
    );
}

export default OrderSuccessStep;