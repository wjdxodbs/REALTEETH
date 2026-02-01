// OpenWeatherMap API 설정
export const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";
export const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// 즐겨찾기 설정
export const MAX_FAVORITES = 6;
export const FAVORITES_STORAGE_KEY = "weather-app-favorites";

// 기본 위치 (서울)
export const DEFAULT_LOCATION = {
  lat: 37.5665,
  lon: 126.978,
  name: "서울특별시",
};

// 날씨 아이콘 URL
export const getWeatherIconUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;
