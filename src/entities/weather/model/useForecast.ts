import { useQuery } from "@tanstack/react-query";
import { getForecast } from "../api/weatherApi";

export function useForecast(lat: number, lon: number, enabled = true) {
  return useQuery({
    queryKey: ["weather", "forecast", lat, lon],
    queryFn: () => getForecast(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: 30 * 60 * 1000, // 30분
  });
}
