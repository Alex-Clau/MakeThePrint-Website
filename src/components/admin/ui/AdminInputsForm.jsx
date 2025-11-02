import InputForm from "../../ui/forms/InputForm.jsx";
import ImageUpload from "./ImageUpload.jsx";

function AdminInputsForm({ formData, handleChange, onUploadSuccess }) {
    return (
        <>
            <InputForm
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Product name"
                variant="dark"
            />

            <InputForm
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
                placeholder="0.00"
                variant="dark"
            />

            <InputForm
                label="Description"
                name="description"
                type="textarea"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Product description"
                rows={6}
                variant="dark"
            />

            <InputForm
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Product category"
                variant="dark"
            />

            <ImageUpload
                image={formData.image}
                onUploadSuccess={onUploadSuccess}
                variant="dark"
            />
        </>
    );
}

export default AdminInputsForm;