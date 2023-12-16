import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: window.localStorage.getItem("mode") || "dark",
  userId: "",
  loggedIn: true
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      window.localStorage.setItem("mode", state.mode);
    },
    setUserId: (state, action) => {
      state.userId = action.payload.userId
      
    }
  },
});


export const { setMode, setUserId } = globalSlice.actions;

export default globalSlice.reducer;
