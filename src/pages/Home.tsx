import React from "react";
import VehicleForm from "../components/VehicleForm";
import VehicleList from "../components/VehicleList";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-0">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 mt-3.5">
        FIPE PARK - Gerenciamento de Veículos
      </h1>
      <VehicleForm />
      <VehicleList />
    </div>
  );
};

export default Home;
