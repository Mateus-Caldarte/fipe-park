import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehiclesState, Vehicle } from "./types";

const initialState: VehiclesState = {
  data: JSON.parse(localStorage.getItem("vehicles") || "[]"),
  loading: false,
  error: null,
};

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.data.push(action.payload);
      localStorage.setItem("vehicles", JSON.stringify(state.data));
    },
    removeVehicle: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((v) => v.id !== action.payload);
      localStorage.setItem("vehicles", JSON.stringify(state.data));
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.data.findIndex(
        (vehicle) => vehicle.id === action.payload.id
      );
      if (index !== -1) {
        state.data[index] = action.payload;
        localStorage.setItem("vehicles", JSON.stringify(state.data));
      }
    },
  },
});

export const { addVehicle, removeVehicle, updateVehicle } =
  vehicleSlice.actions;
export default vehicleSlice.reducer;
