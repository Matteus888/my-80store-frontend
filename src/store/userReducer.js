import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    firstname: null,
    lastname: null,
    publicId: null,
    role: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.firstname = action.payload.firstname;
      state.value.lastname = action.payload.lastname;
      state.value.publicId = action.payload.publicId;
      state.value.role = action.payload.role;
    },
  },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;
