import { fetchApi } from './client';

export const weatherApi = {
  getForecast: (lat: number, lon: number) => 
    fetchApi<any>(`/weather?lat=${lat}&lon=${lon}`),
};
