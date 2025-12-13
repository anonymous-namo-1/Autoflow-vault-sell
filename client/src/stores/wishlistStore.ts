import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  hasItem: (productId: string) => boolean;
  itemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (!get().hasItem(item.productId)) {
          set((state) => ({
            items: [...state.items, item],
          }));
        }
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      toggleItem: (item) => {
        if (get().hasItem(item.productId)) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },
      clearWishlist: () => set({ items: [] }),
      hasItem: (productId) => get().items.some((i) => i.productId === productId),
      itemCount: () => get().items.length,
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
