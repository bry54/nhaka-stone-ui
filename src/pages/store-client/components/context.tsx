'use client';

import * as React from 'react';

// Cart item interface
export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

// Define the state interface
interface StoreClientState {
  isWishlistSheetOpen: boolean;
  isCartSheetOpen: boolean;
  isProductDetailsSheetOpen: boolean;
  productDetailsId: string | null;
  cartItems: CartItem[];
}

// Define the action types
type StoreClientAction =
  | { type: 'SHOW_WISHLIST_SHEET' }
  | { type: 'CLOSE_WISHLIST_SHEET' }
  | { type: 'SHOW_CART_SHEET' }
  | { type: 'CLOSE_CART_SHEET' }
  | { type: 'SHOW_PRODUCT_DETAILS_SHEET'; productId: string }
  | { type: 'CLOSE_PRODUCT_DETAILS_SHEET' }
  | { type: 'ADD_TO_CART'; item: CartItem }
  | { type: 'UPDATE_CART_ITEM_QUANTITY'; productId: string; quantity: number }
  | { type: 'REMOVE_CART_ITEM'; productId: string };

// Initial state
const initialState: StoreClientState = {
  isWishlistSheetOpen: false,
  isCartSheetOpen: false,
  isProductDetailsSheetOpen: false,
  productDetailsId: null,
  cartItems: [],
};

// Reducer to manage state
function storeClientReducer(
  state: StoreClientState,
  action: StoreClientAction,
): StoreClientState {
  switch (action.type) {
    case 'SHOW_WISHLIST_SHEET':
      return { ...state, isWishlistSheetOpen: true };
    case 'CLOSE_WISHLIST_SHEET':
      return { ...state, isWishlistSheetOpen: false };
    case 'SHOW_CART_SHEET':
      return { ...state, isCartSheetOpen: true };
    case 'CLOSE_CART_SHEET':
      return { ...state, isCartSheetOpen: false };
    case 'SHOW_PRODUCT_DETAILS_SHEET':
      return {
        ...state,
        isProductDetailsSheetOpen: true,
        productDetailsId: action.productId,
      };
    case 'CLOSE_PRODUCT_DETAILS_SHEET':
      return {
        ...state,
        isProductDetailsSheetOpen: false,
        productDetailsId: null,
      };
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cartItems.findIndex(
        item => item.productId === action.item.productId
      );

      let updatedCartItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + action.item.quantity,
        };
      } else {
        // Add new item
        updatedCartItems = [...state.cartItems, action.item];
      }

      return {
        ...state,
        cartItems: updatedCartItems,
        isCartSheetOpen: false,
      };
    }
    case 'UPDATE_CART_ITEM_QUANTITY': {
      const updatedCartItems = state.cartItems.map(item =>
        item.productId === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return {
        ...state,
        cartItems: updatedCartItems,
      };
    }
    case 'REMOVE_CART_ITEM': {
      const updatedCartItems = state.cartItems.filter(
        item => item.productId !== action.productId
      );
      return {
        ...state,
        cartItems: updatedCartItems,
      };
    }
    default:
      return state;
  }
}

// Context interface
interface StoreClientContextValue {
  state: StoreClientState;
  showWishlistSheet: () => void;
  closeWishlistSheet: () => void;
  showCartSheet: () => void;
  closeCartSheet: () => void;
  showProductDetailsSheet: (productId: string) => void;
  closeProductDetailsSheet: () => void;
  handleAddToCart: (item: CartItem) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeCartItem: (productId: string) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

// Create context
const StoreClientContext = React.createContext<
  StoreClientContextValue | undefined
>(undefined);

// Provider component
export function StoreClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(storeClientReducer, initialState);

  const showWishlistSheet = () => dispatch({ type: 'SHOW_WISHLIST_SHEET' });
  const closeWishlistSheet = () => dispatch({ type: 'CLOSE_WISHLIST_SHEET' });
  const showCartSheet = () => dispatch({ type: 'SHOW_CART_SHEET' });
  const closeCartSheet = () => dispatch({ type: 'CLOSE_CART_SHEET' });
  const showProductDetailsSheet = (productId: string) =>
    dispatch({ type: 'SHOW_PRODUCT_DETAILS_SHEET', productId });
  const closeProductDetailsSheet = () =>
    dispatch({ type: 'CLOSE_PRODUCT_DETAILS_SHEET' });
  const handleAddToCart = (item: CartItem) =>
    dispatch({ type: 'ADD_TO_CART', item });
  const updateCartItemQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', productId, quantity });
  const removeCartItem = (productId: string) =>
    dispatch({ type: 'REMOVE_CART_ITEM', productId });

  // Helper function to get total cart count
  const getCartCount = () => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Helper function to get cart total price
  const getCartTotal = () => {
    return state.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const value: StoreClientContextValue = {
    state,
    showWishlistSheet,
    closeWishlistSheet,
    showCartSheet,
    closeCartSheet,
    showProductDetailsSheet,
    closeProductDetailsSheet,
    handleAddToCart,
    updateCartItemQuantity,
    removeCartItem,
    getCartCount,
    getCartTotal,
  };

  return (
    <StoreClientContext.Provider value={value}>
      {children}
    </StoreClientContext.Provider>
  );
}

// Custom hook to access context
export function useStoreClient() {
  const context = React.useContext(StoreClientContext);
  if (!context) {
    throw new Error('useStoreGood must be used within a StoreClientProvider');
  }
  return context;
}
