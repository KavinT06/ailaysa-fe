'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useProductStore from '@/store/productStore';
import ProductCard from '@/components/ProductCard';
import CreateProductModal from '@/components/CreateProductModal';

export default function ProductsPage() {
    const router = useRouter();
    const { isAuthenticated, isInitialized, logout, checkAuth, user } = useAuthStore();
    const { products, setProducts, selectedCategory, setCategory, loadWishlist, deletedProductIds } = useProductStore();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const categories = ['all', 'electronics', 'jewelery', "men's clothing", "women's clothing"];

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login');
        }
    }, [isInitialized, isAuthenticated, router]);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            loadWishlist();
            fetchProducts();
        }
    }, [isInitialized, isAuthenticated, selectedCategory, loadWishlist]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const url = selectedCategory === 'all'
                ? 'https://fakestoreapi.com/products'
                : `https://fakestoreapi.com/products/category/${selectedCategory}`;

            const response = await fetch(url);
            const data = await response.json();
            // Filter out deleted products
            const filteredData = data.filter(p => !deletedProductIds.includes(p.id));
            setProducts(filteredData);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!isInitialized || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            + Create Product
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setCategory(category)}
                            className={`px-4 py-2 rounded-lg capitalize transition ${selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                {loading ? (
                    <div className="text-center py-12">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {showModal && <CreateProductModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
