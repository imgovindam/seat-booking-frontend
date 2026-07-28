import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../api";

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ showId, seatIds, guestName, guestEmail }, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/payment/create-order", "POST", { showId, seatIds, guestName, guestEmail });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/payment/verify", "POST", payload);
      return data; // { success, booking }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    order: null,
    bookingId: null,
    confirmedBooking: null,
  },
  reducers: {
    resetPaymentState(state) {
      state.loading = false;
      state.error = null;
      state.order = null;
      state.bookingId = null;
      state.confirmedBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.bookingId = action.payload.bookingId;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create order";
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.confirmedBooking = action.payload.booking;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Payment verification failed";
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;