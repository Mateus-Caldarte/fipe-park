import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import vehicleReducer from "./ducks/vehicles/slice";
import { vehicleSaga } from "./ducks/vehicles/saga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    vehicles: vehicleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(vehicleSaga);

export default store;
