import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../api";






export const fetchShows = createAsyncThunk(


  "shows/fetchShows",
  async ({ movieId, city }) => {
    const data = await apiRequest(`/shows/${movieId}?city=${city}`);


  console.log("movieId:", movieId);
console.log("city:", city);
    return data.shows;

    
  }


);

const showSlice = createSlice({
  name: "shows",
  initialState: { shows: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchShows.fulfilled, (state, action) => {
      state.shows = action.payload;
    });
  },
});

export default showSlice.reducer;
