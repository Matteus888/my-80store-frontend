import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    firstname: null,
    lastname: null,
    publicId: null,
    role: null,
    expiresAt: null,
    cart: {
      items: [],
      totalPrice: 0,
    },
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const { firstname, lastname, publicId, role, cart } = action.payload;
      state.user.firstname = firstname;
      state.user.lastname = lastname;
      state.user.publicId = publicId;
      state.user.role = role;
      state.user.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 jour

      state.user.cart.items = cart?.items || [];
      state.user.cart.totalPrice = cart?.totalPrice || 0;
    },
    logout: (state) => {
      state.user = { ...initialState.user };
    },
    updateCart: (state, action) => {
      state.user.cart.items = action.payload.items || [];
      state.user.cart.totalPrice = action.payload.totalPrice || 0;
    },
    clearCart: (state) => {
      state.user.cart.items = [];
      state.user.cart.totalPrice = 0;
    },
  },
});

export const loginAndFetchCart = (userData) => async (dispatch) => {
  try {
    const res = await fetch("https://my-80store-backend.vercel.app/api/carts?action=get", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const cartData = await res.json();
      dispatch(
        login({ ...userData, cart: { items: cartData.cart?.items || [], totalPrice: cartData.cart?.totalPrice || 0 } }),
      );
    } else {
      dispatch(login({ ...userData, cart: { items: [], totalPrice: 0 } }));
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    dispatch(login({ ...userData, cart: { items: [], totalPrice: 0 } }));
  }
};

export const { login, logout, updateCart, clearCart } = userSlice.actions;
export default userSlice.reducer;
