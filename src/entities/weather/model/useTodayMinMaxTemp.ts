import { useQuery } from "@tanstack/react-query";
import { getTodayMinMaxTemp } from "../api/weatherApi";

export function useTodayMinMaxTemp(lat: number, lon: number, enabled = true) {
  return useQuery({
    queryKey: ["weather", "minmax", lat, lon],
    queryFn: () => getTodayMinMaxTemp(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: 30 * 60 * 1000, // 30분
  });
}
