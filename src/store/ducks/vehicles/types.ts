export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  status: string;
}

export interface VehiclesState {
  data: Vehicle[];
  loading: boolean;
  error: string | null;
}
