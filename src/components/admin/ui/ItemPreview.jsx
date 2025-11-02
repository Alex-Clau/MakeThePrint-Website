function ItemPreview({ formData }) {
    return (
        <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl">
                <h3 className="text-white font-bold mb-4 text-center">Live Preview</h3>

                {/* PREVIEW CARD */}
                <div className="bg-white/10 rounded-lg shadow-lg overflow-hidden transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">

                    {/* Image */}
                    <div className="w-full aspect-square overflow-hidden bg-slate-100">
                        {formData.image ? (
                            <img
                                src={formData.image}
                                alt={formData.name || 'Item'}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-slate-200">
                                No image
                            </div>
                        )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col justify-between p-4 gap-3 flex-1">

                        {/* Name */}
                        <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-2">
                            {formData.name || 'Item Name'}
                        </h3>

                        <div>
                            {/* Price + Like */}
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-lg font-bold text-orange-500">
                                    ${formData.price || '0.00'}
                                </p>
                            </div>

                            {/* Button */}
                            <button
                                disabled
                                className="cursor-pointer w-full px-4 py-2 bg-orange-500 text-white font-bold rounded-lg opacity-75 cursor-not-allowed"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <p className="font-semibold text-blue-900 mb-2">Fill Status:</p>
                    <ul className="space-y-1 text-xs text-blue-800">
                        <li className={formData.name ? '✓ text-green-600' : ''}>
                            {formData.name ? '✓' : 'o'} Name: {formData.name || '(empty)'}
                        </li>
                        <li className={formData.price ? '✓ text-green-600' : ''}>
                            {formData.price ? '✓' : 'o'} Price: ${formData.price || '(empty)'}
                        </li>
                        <li className={formData.category ? '✓ text-green-600' : ''}>
                            {formData.category ? '✓' : 'o'} Category: {formData.category || '(empty)'}
                        </li>
                        <li className={formData.description ? '✓ text-green-600' : ''}>
                            {formData.description ? '✓' : 'o'} Description: {formData.description ? '(filled)' : '(empty)'}
                        </li>
                        <li className={formData.image ? '✓ text-green-600' : ''}>
                            {formData.image ? '✓' : 'o'} Image: {formData.image ? '(added)' : '(empty)'}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default ItemPreview;