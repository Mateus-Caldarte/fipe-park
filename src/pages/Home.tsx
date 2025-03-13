import React, { useState, useEffect } from "react";
import VehicleForm from "../components/atomic/organisms/VehicleForm/VehicleForm";
import VehicleList from "../components/atomic/organisms/VehiclesList/VehicleList";
import { FaTimes } from "react-icons/fa";

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-0">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 mt-3.5">
        FIPE PARK - Gerenciamento de Veículos
      </h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Consultar veículos cadastrados
      </button>

      <VehicleForm />

      {isModalOpen && (
        <div className="fixed inset-0 w-full h-full bg-gradient-to-r from-blue-500 p-12 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              Veículos Cadastrados
            </h2>
            <div className="max-h-[70vh] overflow-y-auto">
              <VehicleList />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
