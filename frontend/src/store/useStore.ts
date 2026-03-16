import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/auth';

export interface CartItem {
  id: string;
  productId: number;
  variantId?: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
  slug: string;
  storeSlug: string;
}

interface CartState {
  items: CartItem[];
  cartOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
}

interface UIState {
  sidebarOpen: boolean;
  searchOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
}

type StoreState = CartState & AuthState & UIState;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart State
      items: [],
      cartOpen: false,

      addItem: (item: CartItem) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      cartCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

      cartTotal: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      toggleCart: () => set({ cartOpen: !get().cartOpen }),
      setCartOpen: (open: boolean) => set({ cartOpen: open }),

      // Auth State
      user: null,
      isAuthenticated: false,

      setUser: (user: User | null) =>
        set({ user, isAuthenticated: !!user }),

      loginUser: (user: User) =>
        set({ user, isAuthenticated: true }),

      logoutUser: () =>
        set({ user: null, isAuthenticated: false }),

      // UI State
      sidebarOpen: true,
      searchOpen: false,

      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

      toggleSearch: () => set({ searchOpen: !get().searchOpen }),
      setSearchOpen: (open: boolean) => set({ searchOpen: open }),
    }),
    {
      name: 'shopsmooth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useStore;
