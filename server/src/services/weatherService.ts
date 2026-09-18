import axios from 'axios';

export class WeatherService {
  /**
   * Proxies Open-Meteo API to avoid client-side CORS issues if they arise,
   * and allows server-side caching in the future.
   */
  static async getForecast(lat: number, lon: number) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', lat.toString());
    url.searchParams.set('longitude', lon.toString());
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m');
    url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_days', '5');

    const response = await axios.get(url.toString());
    return response.data;
  }
}
