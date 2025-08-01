import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cartItems: [],

  addToCart: (product) => {
    const existing = get().cartItems.find((item) => item._id === product._id);
    if (existing) {
      // If already in cart, increase quantity
      const updatedCart = get().cartItems.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      set({ cartItems: updatedCart });
    } else {
      // Add new product with quantity 1
      set({ cartItems: [...get().cartItems, { ...product, quantity: 1 }] });
    }
  },

  removeFromCart: (id) => {
    set({ cartItems: get().cartItems.filter((item) => item._id !== id) });
  },

  clearCart: () => {
    set({ cartItems: [] });
  },
}));

export default useCartStore;
