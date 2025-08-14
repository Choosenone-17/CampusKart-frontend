import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function AddProductModal({ isOpen, onClose, onProductAdded }) {
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "other",
    condition: "good",
    sellerName: "",
    contactMethod: "email",
    contactDetails: "",
    images: [],
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null; 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file); 
        const res = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedUrls.push(res.data.url);
      }

      // Create product
      const productData = {
        ...form,
        price: Number(form.price),
        images: uploadedUrls,
      };

      const res = await axios.post("/api/products", productData);

     
      if (onProductAdded) onProductAdded(res.data);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });

      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Add Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
  <input
    name="title"
    value={form.title}
    onChange={handleChange}
    placeholder="Title"
    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
  />
  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    placeholder="Description"
    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
  />
  <input
    name="price"
    value={form.price}
    onChange={handleChange}
    placeholder="Price"
    type="number"
    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
  />

  {/* Category */}
  <select
    name="category"
    value={form.category}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value="textbooks">Textbooks</option>
    <option value="electronics">Electronics</option>
    <option value="dorm-items">Dorm Items</option>
    <option value="supplies">Supplies</option>
    <option value="clothing">Clothing</option>
    <option value="furniture">Furniture</option>
    <option value="other">Other</option>
  </select>

  {/* Condition */}
  <select
    name="condition"
    value={form.condition}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value="new">New</option>
    <option value="like-new">Like New</option>
    <option value="good">Good</option>
    <option value="fair">Fair</option>
    <option value="poor">Poor</option>
  </select>

  <input
    name="sellerName"
    value={form.sellerName}
    onChange={handleChange}
    placeholder="Seller Name"
    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
  />

  {/* Contact */}
  <select
    name="contactMethod"
    value={form.contactMethod}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value="email">Email</option>
    <option value="phone">Phone</option>
    <option value="whatsapp">WhatsApp</option>
    <option value="telegram">Telegram</option>
  </select>
  <input
    name="contactDetails"
    value={form.contactDetails}
    onChange={handleChange}
    placeholder="Contact Details"
    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
  />

  {/* Image Upload */}
  <input
    type="file"
    multiple
    onChange={handleFileChange}
    className="w-full text-gray-900 dark:text-white bg-white dark:bg-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
  />

  <button
    type="submit"
    disabled={loading}
    className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded"
  >
    {loading ? "Saving..." : "Add Product"}
  </button>
</form>

      </div>
    </div>
  );
}
