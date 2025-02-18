import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    firstname: null,
    lastname: null,
    publicId: null,
    role: null,
    expiresAt: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.firstname = action.payload.firstname;
      state.value.lastname = action.payload.lastname;
      state.value.publicId = action.payload.publicId;
      state.value.role = action.payload.role;
      state.value.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 jour
    },
    logout: (state) => {
      state.value.firstname = null;
      state.value.lastname = null;
      state.value.publicId = null;
      state.value.role = null;
      state.value.expiresAt = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
