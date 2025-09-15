import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: 'Razorpay',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(
        (x) => x.product === item.product && x.size === item.size
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product && x.size === existItem.size
            ? item
            : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const { productId, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => !(x.product === productId && x.size === size)
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateCartQuantity: (state, action) => {
      const { productId, size, qty } = action.payload;
      const item = state.cartItems.find(
        (x) => x.product === productId && x.size === size
      );
      if (item) {
        item.qty = qty;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;