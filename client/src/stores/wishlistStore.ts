import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from '@/lib/queryClient';

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
  isLoading: boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  hasItem: (productId: string) => boolean;
  itemCount: () => number;
  syncWithServer: () => Promise<void>;
  addToServer: (productId: string) => Promise<void>;
  removeFromServer: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
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
      
      syncWithServer: async () => {
        try {
          set({ isLoading: true });
          const response = await fetch('/api/user/wishlist', { credentials: 'include' });
          if (response.ok) {
            const serverItems = await response.json();
            const items: WishlistItem[] = serverItems.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              name: item.product?.name || '',
              price: parseFloat(item.product?.price || '0'),
              originalPrice: item.product?.originalPrice ? parseFloat(item.product.originalPrice) : undefined,
              image: item.product?.images?.[0],
            }));
            set({ items });
          }
        } catch (error) {
          console.error('Failed to sync wishlist with server:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      addToServer: async (productId: string) => {
        try {
          await apiRequest('POST', '/api/user/wishlist', { productId });
        } catch (error) {
          console.error('Failed to add to wishlist on server:', error);
        }
      },
      
      removeFromServer: async (productId: string) => {
        try {
          await apiRequest('DELETE', `/api/user/wishlist/${productId}`);
        } catch (error) {
          console.error('Failed to remove from wishlist on server:', error);
        }
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
