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
            {/* Attractive Navbar/Header */}
            <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xl rounded-b-3xl">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                            <span className="text-2xl font-bold text-blue-600">🛒</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-lg">Ailaysa Shop</h1>
                            <p className="text-xs text-white/80 font-medium mt-1">Welcome, {user?.email}</p>
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-white/90 text-blue-700 px-5 py-2 rounded-xl font-bold shadow-md hover:bg-blue-600 hover:text-white transition-all duration-200 border-2 border-blue-200 hover:border-blue-700 flex items-center gap-2"
                        >
                            <span className="text-lg">＋</span> <span>Create Product</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-white/90 text-gray-700 px-5 py-2 rounded-xl font-bold shadow-md hover:bg-pink-600 hover:text-white transition-all duration-200 border-2 border-pink-200 hover:border-pink-600 flex items-center gap-2"
                        >
                            <span className="text-lg">🚪</span> <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Attractive Category Filter */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-3 flex-wrap justify-center">
                    {categories.map((category) => {
                        let icon = '';
                        switch (category) {
                            case 'all': icon = '🌈'; break;
                            case 'electronics': icon = '💻'; break;
                            case 'jewelery': icon = '💍'; break;
                            case "men's clothing": icon = '👔'; break;
                            case "women's clothing": icon = '👗'; break;
                            default: icon = '🛒';
                        }
                        return (
                            <button
                                key={category}
                                onClick={() => setCategory(category)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold capitalize shadow-md border-2 transition-all duration-200 text-base
                                    ${selectedCategory === category
                                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-transparent scale-105 shadow-lg'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-105'}
                                `}
                            >
                                <span className="text-lg">{icon}</span>
                                <span>{category}</span>
                            </button>
                        );
                    })}
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
