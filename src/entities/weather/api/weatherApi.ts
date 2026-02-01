import { apiClient } from "@/shared/api/client";
import { WEATHER_API_KEY } from "@/shared/constants";

export interface WeatherApiResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  dt: number;
}

export interface ForecastApiResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}

/**
 * 현재 날씨 조회
 */
export async function getCurrentWeather(lat: number, lon: number) {
  const response = await apiClient.get<WeatherApiResponse>("/weather", {
    params: {
      lat,
      lon,
      appid: WEATHER_API_KEY,
      units: "metric",
      lang: "kr",
    },
  });

  return response.data;
}

/**
 * 5일 예보 조회 (당일 최저/최고 기온 계산용)
 */
export async function getForecast(lat: number, lon: number) {
  const response = await apiClient.get<ForecastApiResponse>("/forecast", {
    params: {
      lat,
      lon,
      appid: WEATHER_API_KEY,
      units: "metric",
      lang: "kr",
    },
  });

  return response.data;
}

/**
 * 당일의 최저/최고 기온 계산
 */
export async function getTodayMinMaxTemp(lat: number, lon: number) {
  const forecastData = await getForecast(lat, lon);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime() / 1000;
  const tomorrowTimestamp = todayTimestamp + 86400; // +24시간

  // 오늘 날짜의 예보만 필터링
  const todayForecasts = forecastData.list.filter(
    (item) => item.dt >= todayTimestamp && item.dt < tomorrowTimestamp
  );

  if (todayForecasts.length === 0) {
    return null;
  }

  // 오늘의 최저/최고 기온 계산
  const temps = todayForecasts.map((item) => item.main.temp);
  const temp_min = Math.min(...temps);
  const temp_max = Math.max(...temps);

  return { temp_min, temp_max };
}
