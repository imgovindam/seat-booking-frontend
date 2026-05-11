import { createSlice } from "@reduxjs/toolkit";



const locationSlice = createSlice({
  name: "location",
  initialState: {
    city: localStorage.getItem("userCity") || "Select Location",
  },
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload;
      localStorage.setItem("userCity", action.payload);
    },
    setSearchQuery: (state, action) => {
    state.searchQuery = action.payload; // Add this reducer
  },
  },
});

export const { setCity ,setSearchQuery} = locationSlice.actions;
export default locationSlice.reducer;