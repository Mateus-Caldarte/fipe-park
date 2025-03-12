import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeVehicle } from "../store/ducks/vehicles/slice";
import { VehiclesState } from "../store/ducks/vehicles/types";

const VehicleList: React.FC = () => {
  const { data } = useSelector(
    (state: { vehicles: VehiclesState }) => state.vehicles
  );
  const dispatch = useDispatch();

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Lista de Veículos
      </h2>
      <ul className="space-y-4">
        {data.map((vehicle) => (
          <li
            key={vehicle.id}
            className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <span className="font-semibold">
                {vehicle.brand} - {vehicle.model}
              </span>{" "}
              <br />
              <span className="text-gray-500">
                {vehicle.plate} • {vehicle.year} • {vehicle.color}
              </span>
            </div>
            <button
              onClick={() => dispatch(removeVehicle(vehicle.id))}
              className="btn-danger"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleList;
