import { useContext, useState } from "react";
import { ItemsContext } from "../../context/items-context/ItemsContext.jsx";
import EditItemModal from "../ui/EditItemModal.jsx";
import RemoveItemModal from "../ui/RemoveItemModal.jsx";

function ManageItems() {
    const { allItems, removeItem, updateItem } = useContext(ItemsContext);
    const [editingId, setEditingId] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const editingItem = allItems.find(item => item.id === editingId);
    const removingItem = allItems.find(item => item.id === removingId);

    const handleEdit = (id) => {
        setEditingId(id);
        setShowEditModal(true);
    };

    const handleRemove = (id) => {
        setRemovingId(id);
        setShowRemoveModal(true);
    };

    const handleSaveEdit = async (formData) => {
        if (editingItem) {
            const updatedItem = {
                ...editingItem,
                ...formData,
            };
            await updateItem(editingId, updatedItem);
        }
    };

    const handleConfirmRemove = (id) => {
        removeItem(id);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingId(null);
    };

    const handleCloseRemoveModal = () => {
        setShowRemoveModal(false);
        setRemovingId(null);
    };

    return (
        <div className="text-white">
            <h2 className="text-xl font-bold mb-4">Manage Items</h2>

            {allItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <p>No items yet. Add one to get started!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {allItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white/10 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-white/15 transition-all"
                        >
                            {/* Item Info */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1 min-w-0">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white truncate mr-2">{item.name}</h3>

                                    {/* Show price on mobile, full details on desktop */}
                                    <div className="md:hidden flex gap-2 text-sm text-gray-300 mb-2">
                                        <span className="text-orange-500 font-bold">${item.price}</span>
                                        <span className="capitalize">{item.category}</span>
                                    </div>

                                    <div className="hidden md:flex gap-4 text-sm text-gray-300">
                                        <span>ID: {item.id}</span>
                                        <span className="capitalize">{item.category}</span>
                                        <span className="text-orange-500">${item.price}</span>
                                    </div>

                                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">{item.description}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleEdit(item.id)}
                                    className="cursor-pointer px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition-all text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="cursor-pointer px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <EditItemModal
                isOpen={showEditModal}
                item={editingItem}
                onClose={handleCloseEditModal}
                onSave={handleSaveEdit}
            />

            {/* Remove Modal */}
            <RemoveItemModal
                isOpen={showRemoveModal}
                item={removingItem}
                onClose={handleCloseRemoveModal}
                onConfirm={handleConfirmRemove}
            />
        </div>
    );
}

export default ManageItems;