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
            className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
        >
            {/* Image Container */}
            <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                        isWishlisted
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {isWishlisted ? '❤️' : '🤍'}
                </button>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>

            {/* Content Container */}
            <div className="p-5">
                {/* Title */}
                <h3 className="font-semibold text-base text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                </h3>

                {/* Price and Actions */}
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
                    
                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 active:scale-95 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        🗑️
                    </button>
                </div>

                {/* View Details Indicator */}
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-blue-600 text-sm font-medium">View Details →</p>
                </div>
            </div>
        </div>
    );
}
