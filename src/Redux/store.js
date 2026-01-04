import { configureStore } from "@reduxjs/toolkit";
import seatReducer from "./seatSlice";

export const store = configureStore({
  reducer: {
    seats: seatReducer,
  },
});
