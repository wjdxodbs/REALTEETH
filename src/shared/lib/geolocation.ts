import type { Location } from "../types";
import { getAddressFromCoords } from "./kakaoGeocoding";

/**
 * 현재 위치 가져오기
 * 주소는 카카오 로컬 API로 "서울특별시 관악구 ○○동" 형식 표시, 실패 시 OpenWeather 역지오코딩 사용
 */
export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation을 지원하지 않는 브라우저입니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // 1) 카카오 좌표→주소 (서울특별시 관악구 ○○동 형식)
        const kakaoName = await getAddressFromCoords(latitude, longitude);
        if (kakaoName) {
          resolve({ lat: latitude, lon: longitude, name: kakaoName });
          return;
        }

        // 2) 카카오 실패 시 OpenWeather 역지오코딩
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
          );
          const data = await response.json();
          resolve({
            lat: latitude,
            lon: longitude,
            name: data[0]?.local_names?.ko || data[0]?.name || "현재 위치",
          });
        } catch {
          resolve({
            lat: latitude,
            lon: longitude,
            name: "현재 위치",
          });
        }
      },
      (error) => {
        reject(new Error("위치 정보를 가져올 수 없습니다: " + error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}
