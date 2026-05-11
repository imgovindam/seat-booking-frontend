



import { configureStore } from "@reduxjs/toolkit";
import seatReducer from "./seatSlice";
import movieReducer from "./movieSlice";
import showReducer from "./showSlice";
import locationReducer from "./locationSlice";
import bookingReducer from "./bookingSlice";
export const store = configureStore({
  reducer: {
    seats: seatReducer,
    movies: movieReducer,
    shows: showReducer,
    location: locationReducer,
     bookings: bookingReducer,
  },
});
