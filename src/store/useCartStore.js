import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "@/components/ui/sonner";

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      // Add item to cart
      addToCart: (product) => {
        const { cartItems } = get();
        console.log("addToCart called with:", product); // Debug log
        const existingItem = cartItems.find(
          (item) => item._id === product._id && item.type === product.type
        );

        if (existingItem) {
          console.log("Existing item found, incrementing quantity:", existingItem);
          const updatedItems = cartItems.map((item) =>
            item._id === product._id && item.type === product.type
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          set({ cartItems: updatedItems });
          toast.success(`${product.title} quantity updated in cart.`);
        } else {
          console.log("Adding new item:", product);
          set({ cartItems: [...cartItems, { ...product, quantity: 1 }] });
          toast.success(`${product.title} added to cart.`);
        }
      },

      // Remove item from cart
      removeFromCart: (productId, type) => {
        console.log("removeFromCart called with:", { productId, type });
        const { cartItems } = get();
        console.log("Current cart items:", cartItems);
        const updatedItems = cartItems.filter(
          (item) => !(item._id === productId && item.type === type)
        );
        if (updatedItems.length === cartItems.length) {
          console.warn("No item found to remove for:", { productId, type });
          toast.error("Failed to remove item from cart.");
        } else {
          console.log("Cart items after removal:", updatedItems);
          set({ cartItems: updatedItems });
          toast.success("Item removed from cart.");
        }
      },

      // Update item quantity
      updateQuantity: (productId, type, operation) => {
        console.log("updateQuantity called with:", { productId, type, operation });
        const { cartItems } = get();
        const updatedItems = cartItems
          .map((item) => {
            if (item._id === productId && item.type === type) {
              const newQty =
                operation === "inc" ? item.quantity + 1 : item.quantity - 1;
              return { ...item, quantity: Math.max(newQty, 0) };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);
        set({ cartItems: updatedItems });
        toast.success("Cart updated.");
      },

      // Clear cart
      clearCart: () => {
        console.log("clearCart called");
        set({ cartItems: [] });
        toast.success("Cart cleared.");
      },

      // Get cart total
      getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // Get cart count (for navbar)
      getCartCount: () => {
        const { cartItems } = get();
        return cartItems.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: localStorage, // Updated to `storage` as per latest Zustand API
    }
  )
);

export default useCartStore;