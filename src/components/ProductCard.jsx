'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useProductStore from '@/store/productStore';

export default function ProductCard({ product }) {
    const router = useRouter();
    const { deleteProduct, toggleWishlist, wishlist } = useProductStore();
    const isWishlisted = wishlist.includes(product.id);

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            await fetch(`https://fakestoreapi.com/products/${product.id}`, {
                method: 'DELETE'
            });
            deleteProduct(product.id);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    return (
        <div
            onClick={() => router.push(`/products/${product.id}`)}
            className="group bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 transform relative"
        >
            {/* Category Badge */}
            <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-blue-100 to-pink-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm capitalize">
                {product.category}
            </span>

            {/* Wishlist Button */}
            <button
                onClick={handleWishlist}
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 text-xl
                    ${isWishlisted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                aria-label="Add to wishlist"
            >
                {isWishlisted ? '❤️' : '🤍'}
            </button>

            {/* Image Container */}
            <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-t-2xl"></div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col gap-2">
                {/* Title */}
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[48px]">
                    {product.title}
                </h3>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-1 text-yellow-500 text-sm mb-1">
                        <span className="text-base">⭐</span>
                        <span className="font-semibold">{product.rating.rate}</span>
                        <span className="text-gray-400">({product.rating.count})</span>
                    </div>
                )}

                {/* Price and Actions */}
                <div className="flex justify-between items-center mt-2">
                    <span className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-lg shadow-sm">
                        ${product.price.toFixed(2)}
                    </span>
                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 active:scale-95 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        aria-label="Delete product"
                    >
                        🗑️
                    </button>
                </div>

                {/* View Details Indicator */}
                <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-blue-600 text-sm font-medium">View Details →</p>
                </div>
            </div>
        </div>
    );
}
