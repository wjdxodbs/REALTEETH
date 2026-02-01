import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card } from "@/shared/ui/Card";
import { Spinner } from "@/shared/ui/Spinner";
import { formatTemp } from "@/shared/lib/utils";
import { getWeatherEmoji } from "@/shared/lib/weatherBackground";
import {
  useCurrentWeather,
  useTodayMinMaxTemp,
  useForecast,
} from "@/entities/weather/model";
import { useFavorites } from "@/entities/favorite/model";

const now = Math.floor(Date.now() / 1000);

function formatForecastTime(dt: number): string {
  const date = new Date(dt * 1000);
  const hour = date.getHours();
  const isNow = Math.abs(dt - now) < 7200; // 2시간 이내면 "지금"
  return isNow ? "지금" : `${hour}시`;
}

export function DetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");
  const nameParam = searchParams.get("name") ?? "";

  const lat = latParam ? parseFloat(latParam) : NaN;
  const lon = lonParam ? parseFloat(lonParam) : NaN;
  const hasValidCoords = !Number.isNaN(lat) && !Number.isNaN(lon);

  useEffect(() => {
    if (!hasValidCoords) {
      navigate("/", { replace: true });
    }
  }, [hasValidCoords, navigate]);

  const location = {
    lat,
    lon,
    name: nameParam || "위치",
  };

  const { data: weatherData, isLoading } = useCurrentWeather(
    location.lat,
    location.lon,
    hasValidCoords
  );

  const { data: minMaxData } = useTodayMinMaxTemp(
    location.lat,
    location.lon,
    hasValidCoords
  );

  const { data: forecastData } = useForecast(
    location.lat,
    location.lon,
    hasValidCoords
  );

  // 시간별 예보: 최대 8개 (24시간, 3시간 간격)
  const hourlyList = forecastData?.list?.slice(0, 8) ?? [];
  const chartData = hourlyList.map((item) => ({
    time: formatForecastTime(item.dt),
    temp: Math.round(item.main.temp),
    fullTemp: item.main.temp,
  }));

  const tempMin = minMaxData?.temp_min ?? weatherData?.main.temp_min ?? 0;
  const tempMax = minMaxData?.temp_max ?? weatherData?.main.temp_max ?? 0;

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isDetailLocationFavorite = hasValidCoords && isFavorite(location.lat, location.lon);

  const handleToggleDetailFavorite = () => {
    if (!hasValidCoords) return;

    if (isDetailLocationFavorite) {
      const favoriteToRemove = favorites.find(
        (f) =>
          Math.abs(f.lat - location.lat) < 0.01 &&
          Math.abs(f.lon - location.lon) < 0.01
      );
      if (favoriteToRemove) {
        removeFavorite(favoriteToRemove.id);
      }
    } else {
      try {
        addFavorite({
          name: location.name,
          originalName: location.name,
          lat: location.lat,
          lon: location.lon,
        });
      } catch (error) {
        alert(error instanceof Error ? error.message : "즐겨찾기 추가 실패");
      }
    }
  };

  if (!hasValidCoords) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-blue-200 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더: 뒤로가기 | 현재 위치(또는 지역명) | 별 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <span className="text-2xl">←</span>
            <span className="text-lg font-semibold">돌아가기</span>
          </button>
          <div className="flex items-center gap-2">
            <HiOutlineLocationMarker className="text-2xl text-white" />
            <span className="text-lg font-semibold text-white">
              {location.name}
            </span>
          </div>
          <button
            className={`text-3xl p-2 rounded-lg hover:bg-white/20 transition-all ${
              isDetailLocationFavorite ? "text-yellow-400" : "text-white/50"
            }`}
            style={{ filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))" }}
            onClick={handleToggleDetailFavorite}
          >
            {isDetailLocationFavorite ? (
              <AiFillStar />
            ) : (
              <AiOutlineStar />
            )}
          </button>
        </div>

        {/* 현재 날씨 카드 - 이미지 형식: 아이콘 → 온도 → 흐림 → 최저/최고 */}
        <Card className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : weatherData ? (
            <div className="flex flex-col items-center text-center">
              {/* 날씨 아이콘 (상단 중앙) */}
              <div className="text-9xl mb-4">
                {getWeatherEmoji(weatherData.weather[0]?.icon || "")}
              </div>
              {/* 현재 온도 */}
              <div className="text-8xl font-bold text-white mb-2">
                {formatTemp(weatherData.main.temp)}
              </div>
              {/* 날씨 설명 (흐림 등) */}
              <div className="text-2xl text-white/90 mb-8">
                {weatherData.weather[0]?.description || "맑음"}
              </div>
              {/* 당일 최저 / 최고 기온 (화살표 아이콘, 하단 한 줄) */}
              <div className="flex items-center justify-center gap-8 text-white/90 w-full pt-6 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <TiArrowSortedDown className="text-2xl text-blue-400 flex-shrink-0" />
                  <span>최저 {formatTemp(tempMin)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TiArrowSortedUp className="text-2xl text-red-400 flex-shrink-0" />
                  <span>최고 {formatTemp(tempMax)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-white">
              <p>날씨 정보를 불러올 수 없습니다</p>
            </div>
          )}
        </Card>

        {/* 시간별 예보 */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">시간별 예보</h2>

          {hourlyList.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-white/70">
              <Spinner />
            </div>
          ) : (
            <>
              {/* 시간별 예보 리스트 - 8열 그리드로 차트와 X축 맞춤 */}
              <div className="grid grid-cols-8 gap-2 pb-4">
                {hourlyList.map((item) => {
                  const timeStr = formatForecastTime(item.dt);
                  const isNow = timeStr === "지금";
                  return (
                    <div
                      key={item.dt}
                      className={`min-w-0 text-center rounded-xl p-3 ${
                        isNow ? "bg-white/20" : ""
                      }`}
                    >
                      <div className="text-white/90 text-sm mb-1 truncate">
                        {timeStr}
                      </div>
                      <div className="text-2xl sm:text-3xl mb-1">
                        {getWeatherEmoji(item.weather[0]?.icon || "")}
                      </div>
                      <div className="text-base sm:text-lg font-bold text-white">
                        {formatTemp(item.main.temp)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 온도 차트 - 위 리스트와 같은 8열 위치에 맞춤 */}
              <div className="h-44 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tick={false}
                      tickLine={false}
                    />
                    <YAxis
                      width={32}
                      stroke="rgba(255,255,255,0.8)"
                      tick={{ fill: "rgba(255,255,255,0.9)", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}°`}
                      domain={["dataMin - 2", "dataMax + 2"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth={2}
                      dot={{ fill: "rgba(255,255,255,0.9)", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
