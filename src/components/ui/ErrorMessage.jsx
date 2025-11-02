import { AlertCircle } from 'lucide-react';

function ErrorMessage({ message, dark = false }) {
    if (!message) return null;

    return (
        <div className={`mb-4 p-3 rounded text-sm flex gap-2 items-center ${
            dark
                ? 'bg-red-500/20 border border-red-500 text-red-300'
                : 'bg-red-100 border border-red-300 text-red-700'
        }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {message}
        </div>
    );
}

export default ErrorMessage;