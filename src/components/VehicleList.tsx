import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeVehicle, updateVehicle } from "../store/ducks/vehicles/slice";
import { VehiclesState } from "../store/ducks/vehicles/types";

const VehicleList: React.FC = () => {
  const { data } = useSelector(
    (state: { vehicles: VehiclesState }) => state.vehicles
  );
  const dispatch = useDispatch();

  const [editingVehicle, setEditingVehicle] = useState<null | any>(null);
  const [formValues, setFormValues] = useState({
    brand: "",
    model: "",
    plate: "",
    year: "",
    color: "",
  });

  const startEditing = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setFormValues({
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate,
      year: vehicle.year,
      color: vehicle.color,
    });
  };

  const handleSave = () => {
    if (editingVehicle) {
      const existingVehicle = data.find(
        (v) => v.brand === formValues.brand && v.model === formValues.model
      );

      if (existingVehicle) {
        const updatedVehicle = { ...existingVehicle, ...formValues };
        dispatch(updateVehicle(updatedVehicle));
      } else {
        const newVehicle = {
          ...formValues,
          id: `${formValues.brand}-${formValues.model}`,
          status: "available",
        };
        dispatch(updateVehicle(newVehicle));
      }

      setEditingVehicle(null);
      setFormValues({
        brand: "",
        model: "",
        plate: "",
        year: "",
        color: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeVehicle(id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Lista de Veículos Cadastrados
      </h2>

      {editingVehicle && (
        <div className="bg-gray-200 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Editar Veículo
          </h3>
          <div className="grid gap-4">
            <input
              type="text"
              name="brand"
              value={formValues.brand}
              onChange={handleChange}
              placeholder="Marca"
              className="border-2 p-2 rounded-md"
            />
            <input
              type="text"
              name="model"
              value={formValues.model}
              onChange={handleChange}
              placeholder="Modelo"
              className="border-2 p-2 rounded-md"
            />
            <input
              type="text"
              name="plate"
              value={formValues.plate}
              onChange={handleChange}
              placeholder="Placa"
              className="border-2 p-2 rounded-md"
            />
            <input
              type="text"
              name="year"
              value={formValues.year}
              onChange={handleChange}
              placeholder="Ano"
              className="border-2 p-2 rounded-md"
            />
            <input
              type="text"
              name="color"
              value={formValues.color}
              onChange={handleChange}
              placeholder="Cor"
              className="border-2 p-2 rounded-md"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {data.length === 0 ? (
          <li className="text-center text-gray-500">
            Nenhum veículo cadastrado.
          </li>
        ) : (
          data.map((vehicle) => (
            <li
              key={vehicle.id}
              className="bg-gray-100 p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center shadow-md"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-0">
                <div className="mr-4">
                  <span className="font-semibold text-lg">
                    {vehicle.brand} - {vehicle.model}
                  </span>
                  <br />
                  <span className="text-gray-500">
                    {vehicle.plate} • {vehicle.year} • {vehicle.color}
                  </span>
                </div>
                <button
                  onClick={() => startEditing(vehicle)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all mb-2 md:mb-0 mr-4 ml-7"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemove(vehicle.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                >
                  Remover
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default VehicleList;
