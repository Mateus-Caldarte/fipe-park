import axios from "axios";

const baseURL = "https://brasilapi.com.br/api/fipe/";

export const fetchBrandsByType = async (vehicleType: string) => {
  try {
    const response = await axios.get(`${baseURL}marcas/v1/${vehicleType}`);
    return response.data.map((item: { nome: string; valor: string }) => ({
      label: item.nome,
      value: item.valor,
    }));
  } catch (error) {
    return [];
  }
};

export const fetchModels = async (vehicleType: string, brandId: string) => {
  try {
    const response = await axios.get(
      `${baseURL}veiculos/v1/${vehicleType}/${brandId}`
    );
    if (response.data && Array.isArray(response.data)) {
      return response.data.map((item: { modelo: string }) => ({
        label: item.modelo,
        value: item.modelo,
      }));
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};
