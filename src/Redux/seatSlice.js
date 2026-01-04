import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../api";

// async thunks
export const fetchSeats = createAsyncThunk(
  "seats/fetchSeats",
  async () => {
    const data = await apiRequest("/seats");
    return data.seats;
  }
);

export const bookSeat = createAsyncThunk(
  "seats/bookSeat",
  async (seatId) => {
    const data = await apiRequest("/seats/book", "POST", { seatId });
    return data.message;
  }
);

export const unbookSeat = createAsyncThunk(
  "seats/unbookSeat",
  async (seatId) => {
    const data = await apiRequest("/seats/unbook", "PATCH", { seatId });
    return data.message;
  }
);

const seatSlice = createSlice({
  name: "seats",
  initialState: {
    seats: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchSeats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeats.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load seats";
      });
  },
});

export default seatSlice.reducer;
