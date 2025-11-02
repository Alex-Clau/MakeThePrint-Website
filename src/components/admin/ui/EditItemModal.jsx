import { useState, useEffect } from "react";
import Modal from "../../ui/modals/Modal.jsx";
import InputForm from "../../ui/forms/InputForm.jsx";
import ImageUpload from "./ImageUpload.jsx";

function EditItemModal({ isOpen, item, onClose, onSave }) {
    const [editFormData, setEditFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (item) {
            setEditFormData({
                name: item.name,
                price: item.price,
                description: item.description,
                category: item.category,
                image: item.image,
            });
        }
    }, [item]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = ({ info }) => {
        setEditFormData(prev => ({
            ...prev,
            image: info.secure_url
        }));
    };

    const handleSaveEdit = async () => {
        setIsSaving(true);
        try {
            await onSave(editFormData);
            onClose();
        } catch (error) {
            console.error("Error saving item:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <button
                onClick={onClose}
                className="cursor-pointer absolute top-2 md:top-4 right-2 md:right-4 text-gray-500 hover:text-gray-700 text-xl md:text-2xl"
            >
                ✕
            </button>

            <div className="space-y-4 px-2 md:px-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Edit Item</h2>

                <InputForm
                    label="Item Name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    variant="light"
                    placeholder="Item name"
                />

                <InputForm
                    label="Price"
                    name="price"
                    type="number"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    variant="light"
                    placeholder="0.00"
                />

                <InputForm
                    label="Category"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditChange}
                    variant="light"
                    placeholder="Category"
                />

                <InputForm
                    label="Description"
                    name="description"
                    type="textarea"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    variant="light"
                    placeholder="Item description"
                    rows={4}
                />

                <ImageUpload
                    image={editFormData.image}
                    onUploadSuccess={handleImageUpload}
                    variant="light"
                />

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="cursor-pointer flex-1 px-4 py-2 bg-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="cursor-pointer flex-1 px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default EditItemModal;