// LoadingFallback.jsx
import { Loader } from 'lucide-react';

function LoadingFallback() {
    return (
        <div className="w-full min-h-screen bg-products-night flex items-center justify-center">
            <div className="text-center">
                {/* Spinner */}
                <div className="flex justify-center mb-6">
                    <Loader size={48} className="text-secondary animate-spin" />
                </div>

                {/* Text */}
                <p className="text-white text-xl font-medium">Loading...</p>
                <p className="text-white/60 text-sm mt-2">Please wait while we fetch the data</p>
            </div>
        </div>
    );
}

export default LoadingFallback;