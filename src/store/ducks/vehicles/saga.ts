import { call, put, takeLatest } from "redux-saga/effects";
import { addVehicle } from "./slice";
import { Vehicle } from "./types";

function* fetchVehicles() {
  try {
    const response: Vehicle[] = yield call(() =>
      JSON.parse(localStorage.getItem("vehicles") || "[]")
    );
    yield put(addVehicle(response));
  } catch (error) {
    console.error("Erro ao buscar veículos", error);
  }
}

export function* vehicleSaga() {
  yield takeLatest("vehicles/fetchVehicles", fetchVehicles);
}
