import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehiclesState, Vehicle } from "./types";

// Função para sincronizar os dados com o localStorage
const syncWithLocalStorage = (data: Vehicle[]) => {
  localStorage.setItem("vehicles", JSON.stringify(data));
};

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
      const plateExists = state.data.some(
        (vehicle) => vehicle.plate === action.payload.plate
      );
      if (plateExists) {
        state.error = "A placa já está cadastrada.";
        return;
      }
      state.data.push(action.payload);
      syncWithLocalStorage(state.data);
    },
    removeVehicle: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((v) => v.id !== action.payload);
      syncWithLocalStorage(state.data);
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.data.findIndex(
        (vehicle) => vehicle.id === action.payload.id
      );
      if (index !== -1) {
        state.data[index] = action.payload;
        syncWithLocalStorage(state.data);
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.data = action.payload;
    },
  },
});

export const {
  addVehicle,
  removeVehicle,
  updateVehicle,
  setError,
  setVehicles,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
