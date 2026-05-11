import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../api";

/* ─── Thunks ──────────────────────────────────────────────────── */

export const createBooking = createAsyncThunk(
  "bookings/create",
  async ({ showId, seatIds }, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/bookings/create", "POST", { showId, seatIds });
      return data.booking;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBooking = createAsyncThunk(
  "bookings/fetchOne",
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/bookings/${bookingId}`);
      return data.booking;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/bookings/my-bookings");
      return data.bookings;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/bookings/${bookingId}/cancel`, "PATCH");
      return data.booking;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ─── Slice ───────────────────────────────────────────────────── */

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    current:    null,   // single booking being viewed (checkout/confirm page)
    myBookings: [],     // all bookings for logged-in user
    loading:    false,
    error:      null,
  },
  reducers: {
    clearCurrentBooking(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ── createBooking ── */
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload; // navigate to checkout with this
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? "Failed to create booking";
      })

      /* ── fetchBooking ── */
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      /* ── fetchMyBookings ── */
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ── cancelBooking ── */
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        // update in myBookings list if present
        const idx = state.myBookings.findIndex(
          (b) => b._id === action.payload._id
        );
        if (idx !== -1) state.myBookings[idx] = action.payload;
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;