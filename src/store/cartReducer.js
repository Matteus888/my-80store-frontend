import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.slug === product.slug);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    removeFromCart: (state, action) => {
      const slug = action.payload;
      state.items = state.items.filter((item) => item.slug !== slug);
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    updateQuantity: (state, action) => {
      const { slug, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.slug === slug);
      if (existingItem && quantity > 0) {
        existingItem.quantity = quantity;
      } else {
        state.items = state.items.filter((item) => item.slug !== slug);
      }
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
