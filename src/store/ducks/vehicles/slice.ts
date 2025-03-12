import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehiclesState, Vehicle } from "./types";

const initialState: VehiclesState = {
  data: [],
  loading: false,
  error: null,
};

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.data.push(action.payload);
    },
    removeVehicle: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((v) => v.id !== action.payload);
    },
  },
});

export const { addVehicle, removeVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
