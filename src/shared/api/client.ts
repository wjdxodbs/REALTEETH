import axios from "axios";
import { WEATHER_API_BASE_URL } from "../constants";

export const apiClient = axios.create({
  baseURL: WEATHER_API_BASE_URL,
  timeout: 10000,
});
