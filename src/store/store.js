import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Make sure this is correctly imported

const store = configureStore({
  reducer: {
    auth: authReducer, // Ensure 'auth' matches the state slice name
  },
});

export default store;
