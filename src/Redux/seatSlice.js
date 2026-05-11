// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiRequest } from "../api";

// // async thunks
// // export const fetchSeats = createAsyncThunk("seats/fetchSeats", async () => {
// //   const data = await apiRequest("/seats");
// //   return data.seats;
// // });



// export const fetchSeats = createAsyncThunk(
//   "seats/fetchSeats",
//   async (showId) => {
//     const data = await apiRequest(`/seats/${showId}`);
//     return data.seats;
//   }
// );

// export const lockSeat = createAsyncThunk("seats/lockSeat", async (seatId) => {
//   const data = await apiRequest("/seats/lock", "POST", { seatId });
//   return data.seat;
// });

// export const bookSeat = createAsyncThunk("seats/bookSeat", async (seatId) => {
//   const data = await apiRequest("/seats/book", "POST", { seatId });
//   return data.seat;
// });

// export const unbookSeat = createAsyncThunk(
//   "seats/unbookSeat",
//   async (seatId) => {
//     const data = await apiRequest("/seats/unbook", "PATCH", { seatId });
//     return data.seat;
//   },
// );

// const seatSlice = createSlice({
//   name: "seats",
//   initialState: {
//     seats: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // fetch
//       .addCase(fetchSeats.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSeats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.seats = action.payload;
//       })
//       .addCase(fetchSeats.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to load seats";
//       })

//       //lock seat
//       .addCase(lockSeat.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(lockSeat.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedSeat = action.payload;

//         const index = state.seats.findIndex(
//           (seat) => seat._id === updatedSeat._id,
//         );

//         if (index !== -1) {
//           state.seats[index] = updatedSeat;
//         }
//       })
//       .addCase(lockSeat.rejected, (state) => {
//         state.loading = false;
//         state.error = "Fiailed to lock this seat";
//       })

//       .addCase(bookSeat.fulfilled, (state, action) => {
//         state.loading = false;

//         const updatedSeat = action.payload;

//         const index = state.seats.findIndex(
//           (seat) => seat._id === updatedSeat._id,
//         );

//         if (index !== -1) {
//           state.seats[index] = updatedSeat;
//         }
//       })
//       .addCase(bookSeat.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to book seat";
//       })
// //** unbook the seat */
//       .addCase(unbookSeat.fulfilled, (state, action) => {
//         state.loading = false;

//         const updatedSeat = action.payload;

//         const index = state.seats.findIndex(
//           (seat) => seat._id === updatedSeat._id,
//         );

//         if (index !== -1) {
//           state.seats[index] = updatedSeat;
//         }
//       })
//       .addCase(unbookSeat.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to unbook seat";
//       })

      
//   },
// });

// export default seatSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../api";

/* ─── Async Thunks ────────────────────────────────────────────── */

export const fetchSeats = createAsyncThunk(
  "seats/fetchSeats",
  async (showId, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/seats/${showId}`);
      // ✅ FIX 1: controller returns { status, seats } — extract correctly
      return data.seats ?? data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const lockSeat = createAsyncThunk(
  "seats/lockSeat",
  async (seatId, { rejectWithValue }) => {
    try {
      // ✅ FIX 2: was POST — controller uses findOneAndUpdate with PATCH semantics
      // Using PATCH to match REST convention; update your seatRoutes.js to match
      const data = await apiRequest("/seats/lock", "PATCH", { seatId });
      return data.seat;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const bookSeat = createAsyncThunk(
  "seats/bookSeat",
  async (seatId, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/seats/book", "PATCH", { seatId });
      return data.seat;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const unbookSeat = createAsyncThunk(
  "seats/unbookSeat",
  async (seatId, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/seats/unbook", "PATCH", { seatId });
      return data.seat;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ─── Helper: update a seat in the array by _id ──────────────── */
const applySeatUpdate = (state, action) => {
  state.loading = false;
  const updated = action.payload;
  if (!updated?._id) return;
  const idx = state.seats.findIndex((s) => s._id === updated._id);
  if (idx !== -1) state.seats[idx] = updated;
};

/* ─── Slice ───────────────────────────────────────────────────── */
const seatSlice = createSlice({
  name: "seats",
  initialState: {
    seats: [],
    loading: false,
    error: null,
  },
  reducers: {
 
    optimisticLock(state, action) {
      const id = action.payload;
      const seat = state.seats.find((s) => s._id === id);
      if (seat && seat.status === "available") {
        seat.status = "locked";
        seat.lockedAt = new Date().toISOString();
      }
    },
    // revert if server rejects
    revertSeat(state, action) {
      const { id, previousStatus } = action.payload;
      const seat = state.seats.find((s) => s._id === id);
      if (seat) {
        seat.status = previousStatus;
        seat.lockedAt = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* ── fetchSeats ── */
      .addCase(fetchSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ FIX 4: guard against non-array payload (prevents .map crash)
        state.seats = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load seats";
      })

      /* ── lockSeat ── */
      .addCase(lockSeat.pending, (state) => {
        state.loading = true;
      })
      .addCase(lockSeat.fulfilled, applySeatUpdate)
      .addCase(lockSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to lock seat";
      })

      /* ── bookSeat ── */
      // ✅ FIX 5: was missing .pending handler
      .addCase(bookSeat.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookSeat.fulfilled, applySeatUpdate)
      .addCase(bookSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to book seat";
      })

      /* ── unbookSeat ── */
      // ✅ FIX 5: was missing .pending handler
      .addCase(unbookSeat.pending, (state) => {
        state.loading = true;
      })
      .addCase(unbookSeat.fulfilled, applySeatUpdate)
      .addCase(unbookSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to unbook seat";
      });
  },
});

export const { optimisticLock, revertSeat } = seatSlice.actions;
export default seatSlice.reducer;