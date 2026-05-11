import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../api";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async () => {
    const data = await apiRequest("/movies");
    return data;
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: { movies: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export default movieSlice.reducer;
