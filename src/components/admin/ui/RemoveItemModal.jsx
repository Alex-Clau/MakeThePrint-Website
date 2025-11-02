import Modal from "../../ui/modals/Modal.jsx";

function RemoveItemModal({ isOpen, item, onClose, onConfirm }) {
    const handleConfirm = () => {
        onConfirm(item.id);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <button
                onClick={onClose}
                className="absolute top-2 md:top-4 right-2 md:right-4 text-gray-500 hover:text-gray-700 text-xl md:text-2xl"
            >
                ✕
            </button>

            <div className="space-y-6 px-2 md:px-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Remove Item?</h2>
                    <p className="text-slate-600">
                        Are you sure you want to remove <span className="font-bold text-slate-900">"{item?.name}"</span>? This action cannot be undone.
                    </p>
                </div>

                {/* Item Preview */}
                {item && (
                    <div className="bg-slate-100 rounded-lg p-4 flex gap-4">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900">{item.name}</h3>
                            <p className="text-sm text-slate-600 capitalize">{item.category}</p>
                            <p className="text-sm font-bold text-orange-500 mt-1">${item.price}</p>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                    <button
                        onClick={onClose}
                        className="cursor-pointer flex-1 px-4 py-2 bg-slate-300 text-slate-900 font-bold rounded-lg hover:bg-slate-400 transition-all text-sm md:text-base"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="cursor-pointer flex-1 px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all text-sm md:text-base"
                    >
                        Remove Item
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default RemoveItemModal;