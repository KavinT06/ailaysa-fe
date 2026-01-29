import { create } from 'zustand';

const useProductStore = create((set) => ({
  products: [],
  wishlist: [],
  selectedCategory: 'all',
  nextCustomId: 10000,
  deletedProductIds: [],
  
  setProducts: (products) => set((state) => ({
    // Filter out products that have been deleted locally
    products: products.filter(p => !state.deletedProductIds.includes(p.id))
  })),
  
  addProduct: (product) => set((state) => {
    // Ensure unique ID - if ID conflicts, use custom ID
    const existingIds = state.products.map(p => p.id);
    const finalProduct = existingIds.includes(product.id)
      ? { ...product, id: state.nextCustomId }
      : product;
    
    return {
      products: [finalProduct, ...state.products],
      nextCustomId: state.nextCustomId + 1
    };
  }),
  
  deleteProduct: (productId) => set((state) => ({
    products: state.products.filter((p) => p.id !== productId),
    deletedProductIds: [...state.deletedProductIds, productId]
  })),
  
  toggleWishlist: (productId) => set((state) => {
    const isWishlisted = state.wishlist.includes(productId);
    const newWishlist = isWishlisted
      ? state.wishlist.filter((id) => id !== productId)
      : [...state.wishlist, productId];
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    return { wishlist: newWishlist };
  }),
  
  loadWishlist: () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    set({ wishlist });
  },
  
  setCategory: (category) => set({ selectedCategory: category })
}));

export default useProductStore;
