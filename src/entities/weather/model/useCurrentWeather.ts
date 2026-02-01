import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "../api";

export function useCurrentWeather(lat: number, lon: number, enabled = true) {
  return useQuery({
    queryKey: ["weather", "current", lat, lon],
    queryFn: () => getCurrentWeather(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: 5 * 60 * 1000, // 5분
  });
}
