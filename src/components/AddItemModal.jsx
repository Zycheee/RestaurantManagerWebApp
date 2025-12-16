import React, { useState, useEffect } from "react";

function AddItemModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    quantity: "",
    price: "",
    status: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        image: initialData.image || null,
        name: initialData.name || "",
        quantity: initialData.quantity?.toString() || "",
        price: initialData.price?.toString() || "",
        status: initialData.status ?? true,
      });
    } else {
      setFormData({
        image: null,
        name: "",
        quantity: "",
        price: "",
        status: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null; // Don't render if closed

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
    ...formData,
    price: parseFloat(formData.price),
    quantity: parseInt(formData.quantity, 10),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#141D30] rounded-3xl p-8 w-96 text-white"
      >
        <h2 className="text-2xl mb-6 font-bold">
          {initialData ? "Edit Item" : "Add New Item"}
        </h2>

        <label className="block mb-4">
          <div className="flex items-center space-x-4">
            <span>Item Image</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              id="file-upload"
              onChange={handleChange}
              className="hidden"
            />

            {/* Custom button */}
            <label
              htmlFor="file-upload"
              className="inline-block mt-2 px-4 py-2 bg-[#212E4A] rounded cursor-pointer hover:bg-[#2b3b60] transition"
            >
              Choose File
            </label>
          </div>

          {/* Show file name ONLY after selection */}
          {formData.image && (
            <p className="mt-2 text-sm text-gray-300 truncate">
              {formData.image.name}
            </p>
          )}
        </label>

        <label className="block mb-4">
          Item Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 rounded bg-[#212E4A] text-white"
            required
          />
        </label>

        <label className="block mb-4">
          Quantity
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min={0}
            className="w-full px-3 py-2 mt-1 rounded bg-[#212E4A] text-white"
            required
          />
        </label>

        <label className="block mb-4">
          Price
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min={0}
            step="0.01"
            className="w-full px-3 py-2 mt-1 rounded bg-[#212E4A] text-white"
            required
          />
        </label>

        <label className="flex items-center gap-2 mb-6">
          <span>Status: {formData.status ? "Available" : "Out of Stock"}</span>
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="toggle-checkbox"
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 rounded bg-[#BF7000] hover:bg-[#a66500] transition cursor-pointer">
            {initialData ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItemModal;
