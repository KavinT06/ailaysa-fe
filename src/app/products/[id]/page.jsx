'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import useProductStore from '@/store/productStore';

export default function ProductDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { deleteProduct, toggleWishlist, wishlist } = useProductStore();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleted, setDeleted] = useState(false);

    const isWishlisted = product && wishlist.includes(product.id);

    useEffect(() => {
        fetchProduct();
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${params.id}`);
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`https://fakestoreapi.com/products/${params.id}`, {
                method: 'DELETE'
            });
            deleteProduct(parseInt(params.id));
            setDeleted(true);
            setTimeout(() => router.push('/products'), 800);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleWishlist = () => {
        if (product) {
            toggleWishlist(product.id);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div><p className="mt-4 text-gray-600">Loading product...</p></div></div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><p className="text-2xl text-gray-600">Product not found</p><button onClick={() => router.push('/products')} className="mt-4 text-blue-600 hover:text-blue-700">Back to Products</button></div></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <button
                        onClick={() => router.push('/products')}
                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
                        <span className="ml-2">Back to Products</span>
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800">Product Details</h2>
                    <div></div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-12">
                        {/* Image Section */}
                        <div className="flex items-center justify-center">
                            <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col justify-between">
                            {/* Title and Category */}
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight flex-1 mr-4">{product.title}</h1>
                                    <button
                                        onClick={handleWishlist}
                                        className={`flex-shrink-0 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 text-2xl ${
                                            isWishlisted
                                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                : 'bg-white text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        {isWishlisted ? '❤️' : '🤍'}
                                    </button>
                                </div>

                                {/* Category Badge */}
                                <div className="mb-6">
                                    <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold capitalize shadow-sm">
                                        📦 {product.category}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <p className="text-5xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600 mt-2">Free shipping on orders over $50</p>
                                </div>

                                {/* Rating */}
                                {product.rating && (
                                    <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <p className="flex items-center text-lg text-gray-800">
                                            <span className="text-2xl mr-2">⭐</span>
                                            <span className="font-semibold">{product.rating.rate}</span>
                                            <span className="text-gray-600 ml-2">/ 5.0</span>
                                            <span className="text-gray-500 ml-2">({product.rating.count} reviews)</span>
                                        </p>
                                    </div>
                                )}

                                {/* Description */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                                    <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t-2 border-gray-100">
                                <button
                                    onClick={handleDelete}
                                    disabled={deleted}
                                    className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 text-white shadow-lg hover:shadow-xl ${
                                        deleted
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                                    }`}
                                >
                                    <span className="mr-2">🗑️</span>
                                    {deleted ? 'Deleting...' : 'Delete Product'}
                                </button>
                                
                                <button
                                    onClick={() => router.push('/products')}
                                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-lg hover:shadow-xl"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
