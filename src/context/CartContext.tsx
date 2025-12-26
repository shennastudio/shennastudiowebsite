'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Simple Product type (compatible with Prisma schema)
interface Product {
  id: number | string;
  name: string;
  sku: string;
  basePrice: number;
  inStock?: boolean;
  images?: { url?: string | null }[];
  conservationInfo?: {
    donationPercentage?: number | null;
    conservationFocus?: string | null;
  };
}

// Product variant type
export interface PayloadProductVariant {
  id?: string | null;
  variantName: string;
  sku: string;
  price: number;
  stock: number;
  size?: ('small' | 'medium' | 'large') | null;
  color?: string | null;
  material?: string | null;
  images?: { url?: string | null }[];
}

// Cart item type
export interface PayloadCartItem {
  id: string; // Unique cart item identifier (variantId or productId)
  productId: number | string;
  productName: string;
  productSku: string;
  variantId?: string | null; // Variant ID if using variant, null if base product
  variantName?: string | null;
  variantSku?: string | null;
  price: number; // Variant price or base price
  quantity: number;
  stock: number;
  imageUrl?: string | null;
  // Conservation info
  conservationDonationPercentage?: number | null;
  conservationFocus?: string | null;
}

// Cart state
interface CartState {
  items: PayloadCartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isOpen: boolean;
  // Guest checkout info (optional, for non-logged-in users)
  guestEmail?: string | null;
  guestName?: string | null;
}

// Cart actions
type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; variant?: PayloadProductVariant | null; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_GUEST_INFO'; payload: { email?: string; name?: string } }
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'RECALCULATE_TOTALS' };

// Helper function to get image URL
function getImageUrl(product: Product, variant?: PayloadProductVariant | null): string | null {
  // Try variant images first
  if (variant?.images && variant.images.length > 0) {
    const url = variant.images[0]?.url;
    if (url) return url;
  }

  // Fall back to product images
  if (product.images && product.images.length > 0) {
    const url = product.images[0]?.url;
    if (url) return url;
  }

  return null;
}

// Helper function to calculate totals
function calculateTotals(items: PayloadCartItem[]): { subtotal: number; shipping: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.95; // Free shipping over $50
  const tax = subtotal * 0.0825; // 8.25% tax
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, variant, quantity } = action.payload;

      // Generate unique ID: use variant ID if exists, otherwise use product ID
      const itemId = variant?.id || `product-${product.id}`;
      const price = variant?.price || product.basePrice;
      const stock = variant?.stock || (product.inStock ? 999 : 0); // Assume high stock if no variant

      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);

      let newItems: PayloadCartItem[];

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        const newItem: PayloadCartItem = {
          id: itemId,
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          variantId: variant?.id || null,
          variantName: variant?.variantName || null,
          variantSku: variant?.sku || null,
          price,
          quantity,
          stock,
          imageUrl: getImageUrl(product, variant),
          conservationDonationPercentage: product.conservationInfo?.donationPercentage || null,
          conservationFocus: product.conservationInfo?.conservationFocus || null,
        };

        newItems = [...state.items, newItem];
      }

      const totals = calculateTotals(newItems);

      newState = {
        ...state,
        items: newItems,
        ...totals,
      };
      break;
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(newItems);

      newState = {
        ...state,
        items: newItems,
        ...totals,
      };
      break;
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0); // Remove items with 0 quantity

      const totals = calculateTotals(newItems);

      newState = {
        ...state,
        items: newItems,
        ...totals,
      };
      break;
    }

    case 'CLEAR_CART':
      newState = {
        ...state,
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      };
      break;

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_GUEST_INFO':
      newState = {
        ...state,
        guestEmail: action.payload.email || state.guestEmail,
        guestName: action.payload.name || state.guestName,
      };
      break;

    case 'LOAD_CART':
      return action.payload;

    case 'RECALCULATE_TOTALS': {
      const totals = calculateTotals(state.items);
      newState = {
        ...state,
        ...totals,
      };
      break;
    }

    default:
      return state;
  }

  // Persist to localStorage after state changes
  // (TOGGLE_CART and LOAD_CART return early and don't reach this point)
  if (typeof window !== 'undefined') {
    localStorage.setItem('shenna-cart', JSON.stringify(newState));
  }

  return newState;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  isOpen: false,
  guestEmail: null,
  guestName: null,
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (product: Product, variant?: PayloadProductVariant | null, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setGuestInfo: (email?: string, name?: string) => void;
  syncWithPayload: (userId?: number) => Promise<void>;
  recalculateTotals: () => void;
} | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('shenna-cart');
      if (savedCart) {
        try {
          const parsedCart: CartState = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
    }
  }, []);

  const addItem = (product: Product, variant: PayloadProductVariant | null = null, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, variant, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shenna-cart');
    }
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setGuestInfo = (email?: string, name?: string) => {
    dispatch({ type: 'SET_GUEST_INFO', payload: { email, name } });
  };

  const recalculateTotals = () => {
    dispatch({ type: 'RECALCULATE_TOTALS' });
  };

  // Sync cart with Payload API (for logged-in users)
  // TODO: Implement backend cart sync endpoint at /api/cart/sync
  // For now, this is a no-op function to prevent runtime errors
  const syncWithPayload = async (userId?: number) => {
    if (!userId) {
      console.warn('Cannot sync cart: No user ID provided');
      return;
    }

    // Currently disabled - cart is client-side only
    // To enable:
    // 1. Create /src/app/api/cart/sync/route.ts endpoint
    // 2. Implement Payload CMS cart collection
    // 3. Add authentication middleware
    // 4. Uncomment the code below

    console.log('Cart sync not implemented - cart is client-side only');
    return;

    /* Commented out until backend endpoint is created
    try {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          items: state.items,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync cart with server');
      }

      const data = await response.json();

      if (data.cart) {
        dispatch({ type: 'LOAD_CART', payload: data.cart });
      }

      console.log('Cart synced successfully with Payload');
    } catch (error) {
      console.error('Failed to sync cart with Payload:', error);
    }
    */
  };

  const value = {
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setGuestInfo,
    syncWithPayload,
    recalculateTotals,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export type { CartState, CartAction };