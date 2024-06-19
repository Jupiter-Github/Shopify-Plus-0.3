import { configureStore } from "@reduxjs/toolkit";
import { EcomReducer } from "./EcomReducer";

const store = configureStore({
  reducer: EcomReducer,
});
export { store };
