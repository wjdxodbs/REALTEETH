/**
 * 날씨 코드에 따른 배경 그라디언트 반환
 */
export function getWeatherBackground(weatherCode?: string): string {
  if (!weatherCode) {
    return "from-orange-400 via-orange-300 to-blue-200"; // 기본
  }

  // Clear sky (맑음)
  if (weatherCode.includes("01")) {
    return "from-orange-400 via-orange-300 to-blue-200";
  }

  // Few clouds (약간 흐림)
  if (weatherCode.includes("02")) {
    return "from-blue-400 via-blue-300 to-gray-200";
  }

  // Scattered/Broken clouds (흐림)
  if (weatherCode.includes("03") || weatherCode.includes("04")) {
    return "from-gray-400 via-gray-300 to-blue-300";
  }

  // Rain (비)
  if (weatherCode.includes("09") || weatherCode.includes("10")) {
    return "from-slate-600 via-slate-500 to-blue-400";
  }

  // Thunderstorm (천둥번개)
  if (weatherCode.includes("11")) {
    return "from-gray-700 via-gray-600 to-purple-500";
  }

  // Snow (눈)
  if (weatherCode.includes("13")) {
    return "from-cyan-200 via-blue-100 to-white";
  }

  // Mist/Fog (안개)
  if (weatherCode.includes("50")) {
    return "from-gray-300 via-gray-200 to-blue-200";
  }

  return "from-orange-400 via-orange-300 to-blue-200"; // 기본
}

/**
 * 날씨 아이콘 이모지 반환
 */
export function getWeatherEmoji(icon: string): string {
  if (icon.includes("01")) return "☀️"; // clear
  if (icon.includes("02")) return "⛅"; // few clouds
  if (icon.includes("03")) return "☁️"; // scattered clouds
  if (icon.includes("04")) return "☁️"; // broken clouds
  if (icon.includes("09")) return "🌧️"; // shower rain
  if (icon.includes("10")) return "🌦️"; // rain
  if (icon.includes("11")) return "⛈️"; // thunderstorm
  if (icon.includes("13")) return "❄️"; // snow
  if (icon.includes("50")) return "🌫️"; // mist
  return "☀️";
}
