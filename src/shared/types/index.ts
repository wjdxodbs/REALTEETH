// 날씨 데이터 타입
export interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
}

// 위치 타입
export interface Location {
  lat: number;
  lon: number;
  name: string;
}

// 즐겨찾기 타입
export interface Favorite {
  id: string;
  name: string;
  originalName: string;
  lat: number;
  lon: number;
  addedAt: number;
}
