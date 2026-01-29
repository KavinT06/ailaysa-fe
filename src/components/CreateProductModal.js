'use client';

import { useState } from 'react';
import useProductStore from '@/store/productStore';

const CATEGORIES = ['electronics', 'jewelery', "men's clothing", "women's clothing"];

export default function CreateProductModal({ onClose }) {
    const { addProduct } = useProductStore();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: 'electronics',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) return 'Title is required';
        if (!formData.price || parseFloat(formData.price) <= 0) return 'Valid price is required';
        if (!formData.description.trim()) return 'Description is required';
        if (!formData.image.trim()) return 'Image URL is required';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = {
                title: formData.title,
                price: parseFloat(formData.price),
                description: formData.description,
                category: formData.category,
                image: formData.image
            };

            const response = await fetch('https://fakestoreapi.com/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to create product');

            const data = await response.json();
            addProduct({ ...payload, id: data.id || Math.random() });
            onClose();
        } catch (err) {
            console.error('Error creating product:', err);
            setError('Failed to create product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Create Product</h2>
                        <p className="text-blue-100 text-sm mt-1">Add a new item to catalog</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-600 p-2 rounded-full transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <InputField
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Product title"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            prefix="$"
                        />

                        <SelectField
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            options={CATEGORIES}
                        />
                    </div>

                    <TextAreaField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Product description"
                        rows="3"
                    />

                    <InputField
                        label="Image URL"
                        name="image"
                        type="url"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />

                    {formData.image && (
                        <ImagePreview src={formData.image} alt="Preview" />
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Sub-components for reusability
function InputField({ label, prefix, ...props }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
            <div className={prefix ? 'relative' : ''}>
                {prefix && <span className="absolute left-4 top-3 text-gray-600 font-medium">{prefix}</span>}
                <input
                    {...props}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 ${prefix ? 'pl-8' : ''}`}
                />
            </div>
        </div>
    );
}

function TextAreaField({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
            <textarea
                {...props}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none text-gray-900"
            />
        </div>
    );
}

function SelectField({ label, name, value, onChange, options }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900"
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}

function ImagePreview({ src, alt }) {
    return (
        <div className="flex justify-center mt-3">
            <img
                src={src}
                alt={alt}
                className="h-24 object-contain rounded-lg border border-gray-200"
                onError={(e) => (e.target.style.display = 'none')}
            />
        </div>
    );
}
