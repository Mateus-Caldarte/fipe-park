import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeVehicle,
  updateVehicle,
  setVehicles,
} from "../../../../store/ducks/vehicles/slice";
import { VehiclesState } from "../../../../store/ducks/vehicles/types";
import { maskPlate, maskYear } from "../../../../utils/functions";
import { FaTimes } from "react-icons/fa";

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
    status: "Disponível",
  });
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    const storedVehicles = localStorage.getItem("vehicles");
    if (storedVehicles) {
      dispatch(setVehicles(JSON.parse(storedVehicles)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (editingVehicle) {
      setFormValues({
        brand: editingVehicle.brand,
        model: editingVehicle.model,
        plate: editingVehicle.plate,
        year: editingVehicle.year,
        color: editingVehicle.color,
        status: editingVehicle.status || "Disponível",
      });
    }
  }, [editingVehicle]);

  const startEditing = (vehicle: any) => {
    setEditingVehicle(vehicle);
  };

  const handleSave = () => {
    if (
      !formValues.brand ||
      !formValues.model ||
      !formValues.plate ||
      !formValues.year ||
      !formValues.color ||
      !formValues.status
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const plateExists = data.some(
      (vehicle) => vehicle.plate === formValues.plate
    );

    if (
      plateExists &&
      (!editingVehicle || editingVehicle.plate !== formValues.plate)
    ) {
      alert(
        "A placa já está cadastrada. Por favor, insira uma placa diferente."
      );
      return;
    }

    if (editingVehicle) {
      const updatedVehicle = { ...editingVehicle, ...formValues };
      dispatch(updateVehicle(updatedVehicle));

      const updatedVehicles = data.map((vehicle) =>
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      );
      localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
    } else {
      const newVehicle = { ...formValues, id: new Date().toISOString() };
      dispatch(updateVehicle(newVehicle));

      const updatedVehicles = [...data, newVehicle];
      localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
    }

    setEditingVehicle(null);
    setFormValues({
      brand: "",
      model: "",
      plate: "",
      year: "",
      color: "",
      status: "Disponível",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "plate") {
      updatedValue = maskPlate(value);
    } else if (name === "year") {
      updatedValue = maskYear(value);
      const currentYear = new Date().getFullYear().toString();
      if (updatedValue > currentYear) {
        updatedValue = currentYear;
      }
    } else if (name === "color") {
      updatedValue = value.toUpperCase();
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: updatedValue,
    }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeVehicle(id));

    const updatedVehicles = data.filter((vehicle) => vehicle.id !== id);
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
  };

  const filteredVehicles = statusFilter
    ? data.filter((vehicle) => vehicle.status === statusFilter)
    : data;

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
      {data.length > 0 && (
        <div className="mb-4">
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border-2 p-2 rounded-md"
          >
            <option value="">Todos</option>
            <option value="Disponível">Disponível</option>
            <option value="Vendido">Vendido</option>
            <option value="Em manutenção">Em manutenção</option>
          </select>
        </div>
      )}

      <ul className="space-y-4">
        {filteredVehicles.length === 0 ? (
          <li className="text-center text-gray-500">
            Nenhum veículo encontrado com esse status.
          </li>
        ) : (
          filteredVehicles.map((vehicle) => (
            <li
              key={vehicle.id}
              className="bg-gray-100 p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-lg">
                    {vehicle.brand} - {vehicle.model}
                  </span>
                  <br />
                  <span className="text-gray-500">
                    {vehicle.plate} • {vehicle.year} • {vehicle.color}
                  </span>
                  <br />
                  <span className="text-gray-700">{vehicle.status}</span>
                </div>
                <div className="flex">
                  <button
                    onClick={() => startEditing(vehicle)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemove(vehicle.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {editingVehicle && (
        <div className="fixed inset-0 w-full h-full bg-gradient-to-r from-blue-500 p-12 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setEditingVehicle(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              Editar Veículo
            </h3>
            <div className="grid gap-4">
              <input
                type="text"
                name="brand"
                value={formValues.brand}
                readOnly
                className="border-2 p-2 rounded-md bg-gray-300 cursor-not-allowed text-black"
              />
              <input
                type="text"
                name="model"
                value={formValues.model}
                readOnly
                className="border-2 p-2 rounded-md bg-gray-300 cursor-not-allowed text-black"
              />
              <input
                type="text"
                name="plate"
                value={formValues.plate}
                onChange={handleChange}
                className="border-2 p-2 rounded-md text-black"
              />
              <input
                type="text"
                name="year"
                value={formValues.year}
                onChange={handleChange}
                className="border-2 p-2 rounded-md text-black"
              />
              <input
                type="text"
                name="color"
                value={formValues.color}
                onChange={handleChange}
                className="border-2 p-2 rounded-md text-black"
              />
              <select
                name="status"
                value={formValues.status}
                onChange={handleChange}
                className="border-2 p-2 rounded-md text-black"
              >
                <option value="Disponível">Disponível</option>
                <option value="Vendido">Vendido</option>
                <option value="Em manutenção">Em manutenção</option>
              </select>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
