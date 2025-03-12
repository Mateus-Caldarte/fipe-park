import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addVehicle } from "../store/ducks/vehicles/slice";
import {
  fetchBrandsByType,
  fetchModels,
  fetchYears,
  fetchValue,
} from "../services/api";
import { FaSpinner } from "react-icons/fa";

const VehicleForm: React.FC = () => {
  const dispatch = useDispatch();

  const [vehicle, setVehicle] = useState({
    brand: "",
    model: "",
    year: "",
    plate: "",
    color: "",
    status: "Disponível",
    value: 0,
    vehicleType: "",
  });

  const [brands, setBrands] = useState<{ label: string; value: string }[]>([]);
  const [models, setModels] = useState<{ label: string; value: string }[]>([]);
  const [years, setYears] = useState<{ label: string; value: string }[]>([]);
  const [loading] = useState(false);
  const [isBrandLoading, setIsBrandLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);

  useEffect(() => {
    const loadBrands = async () => {
      if (vehicle.vehicleType) {
        setIsBrandLoading(true);
        try {
          const data = await fetchBrandsByType(vehicle.vehicleType);
          setBrands(data);
        } catch (error) {
          setBrands([]);
        } finally {
          setIsBrandLoading(false);
        }
      } else {
        setBrands([]);
      }
    };
    loadBrands();
  }, [vehicle.vehicleType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleTypeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedVehicleType = e.target.value;
    setVehicle({
      ...vehicle,
      vehicleType: selectedVehicleType,
      brand: "",
      model: "",
      year: "",
      value: 0,
    });
  };

  const handleBrandChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    setVehicle({ ...vehicle, brand: brandId, model: "", year: "", value: 0 });

    if (vehicle.vehicleType && brandId) {
      setIsModelLoading(true);
      try {
        const data = await fetchModels(vehicle.vehicleType, brandId);
        if (data && Array.isArray(data)) {
          const formattedModels = data.map(
            (item: { label: string; value: string }) => ({
              label: item.label,
              value: item.value,
            })
          );
          setModels(formattedModels);
        } else {
          setModels([]);
        }
      } catch (error) {
        setModels([]);
      } finally {
        setIsModelLoading(false);
      }
    } else {
      setModels([]);
    }
  };

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    setVehicle({ ...vehicle, model: modelId, year: "", value: 0 });

    if (vehicle.brand && modelId) {
      try {
        const data = await fetchYears(vehicle.brand, modelId);
        setYears(data);
      } catch (error) {
        setYears([]);
      }
    } else {
      setYears([]);
    }
  };

  const handleYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setVehicle({ ...vehicle, year });

    if (vehicle.brand && vehicle.model && year) {
      try {
        const valueData = await fetchValue(vehicle.brand, vehicle.model, year);
        setVehicle((prev) => ({ ...prev, value: valueData.valor }));
      } catch (error) {
        setVehicle((prev) => ({ ...prev, value: 0 }));
      }
    } else {
      setVehicle((prev) => ({ ...prev, value: 0 }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addVehicle({ ...vehicle, id: new Date().toISOString() }));
  };

  return (
    <div className="w-full h-full bg-gradient-to-r from-blue-500 p-12 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-3/4 lg:w-2/3 xl:w-1/2 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Adicionar Veículo
        </h2>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="vehicleType"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Tipo de Veículo
            </label>
            <select
              name="vehicleType"
              id="vehicleType"
              className="block w-full mt-2 p-4 rounded-lg border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleVehicleTypeChange}
              value={vehicle.vehicleType}
            >
              <option value="">Selecione o Tipo de Veículo</option>
              <option value="carros">Carros</option>
              <option value="motos">Motos</option>
              <option value="caminhoes">Caminhões</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Marca
            </label>
            <select
              name="brand"
              id="brand"
              className="block w-full mt-2 p-4 rounded-lg border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleBrandChange}
              value={vehicle.brand}
              disabled={isBrandLoading || !vehicle.vehicleType}
            >
              <option value="">Selecione a Marca</option>
              {brands.map((brand) => (
                <option key={brand.value} value={brand.value}>
                  {brand.label}
                </option>
              ))}
            </select>

            {isBrandLoading && (
              <div className="text-center mt-2 text-gray-500">
                <FaSpinner className="animate-spin inline-block mr-2" />
                Carregando marcas...
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="model"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Modelo
            </label>
            <select
              name="model"
              id="model"
              className="block w-full mt-2 p-4 rounded-lg border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleModelChange}
              value={vehicle.model}
              disabled={isModelLoading || !vehicle.brand}
            >
              <option value="">Selecione o Modelo</option>
              {models.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>

            {isModelLoading && (
              <div className="text-center mt-2 text-gray-500">
                <FaSpinner className="animate-spin inline-block mr-2" />
                Carregando modelos...
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Ano
            </label>
            <select
              name="year"
              id="year"
              className="block w-full mt-2 p-4 rounded-lg border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleYearChange}
              value={vehicle.year}
              disabled={!vehicle.model}
            >
              <option value="">Selecione o Ano</option>
              {years.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="plate"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Placa
            </label>
            <input
              id="plate"
              name="plate"
              className="block w-full mt-2 p-4 rounded-lg border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Placa"
              onChange={handleChange}
              value={vehicle.plate}
            />
          </div>

          <div>
            <label
              htmlFor="color"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Cor
            </label>
            <input
              id="color"
              name="color"
              className="block w-full mt-2 p-4 rounded-lg border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cor"
              onChange={handleChange}
              value={vehicle.color}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              className="block w-full mt-2 p-4 rounded-lg border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={vehicle.status}
            >
              <option value="Disponível">Disponível</option>
              <option value="Indisponível">Indisponível</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="value"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Valor
            </label>
            <input
              id="value"
              name="value"
              type="number"
              className="block w-full mt-2 p-4 rounded-lg border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Valor"
              onChange={handleChange}
              value={vehicle.value}
              disabled
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-500 text-white font-semibold text-lg rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={
              loading || !vehicle.brand || !vehicle.model || !vehicle.year
            }
          >
            {loading ? (
              <FaSpinner className="animate-spin inline-block mr-2" />
            ) : (
              "Adicionar Veículo"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
