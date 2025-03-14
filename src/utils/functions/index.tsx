export const maskPlate = (plate: string) => {
  return plate
    .toUpperCase()
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 7);
};

export const maskYear = (year: string) => {
  return year.replace(/\D/g, "").slice(0, 4);
};

export const loadVehiclesFromLocalStorage = () => {
  const storedVehicles = localStorage.getItem("vehicles");
  return storedVehicles ? JSON.parse(storedVehicles) : [];
};

export const saveVehiclesToLocalStorage = (vehicles: any) => {
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
};
