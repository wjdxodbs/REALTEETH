import { useState, useEffect } from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { Skeleton } from "@/shared/ui/Skeleton";
import { FavoriteCard } from "@/widgets/favorites";
import { formatTemp } from "@/shared/lib/utils";
import { getCurrentLocation } from "@/shared/lib/geolocation";
import { getWeatherEmoji } from "@/shared/lib/weatherBackground";
import { useCurrentWeather, useTodayMinMaxTemp } from "@/entities/weather/model";
import { useFavorites } from "@/entities/favorite/model";
import type { Location } from "@/shared/types";
import { DEFAULT_LOCATION } from "@/shared/constants";

export function MainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // 즐겨찾기 관리
  const { favorites, count, maxCount, addFavorite, removeFavorite, isFavorite } = useFavorites();

  // 현재 위치가 즐겨찾기에 있는지 확인
  const isCurrentLocationFavorite = currentLocation
    ? isFavorite(currentLocation.lat, currentLocation.lon)
    : false;

  // 현재 위치 즐겨찾기 토글
  const handleToggleCurrentLocationFavorite = () => {
    if (!currentLocation) return;

    if (isCurrentLocationFavorite) {
      const favoriteToRemove = favorites.find(
        (f) =>
          Math.abs(f.lat - currentLocation.lat) < 0.01 &&
          Math.abs(f.lon - currentLocation.lon) < 0.01
      );
      if (favoriteToRemove) {
        removeFavorite(favoriteToRemove.id);
      }
    } else {
      try {
        addFavorite({
          name: currentLocation.name,
          originalName: currentLocation.name,
          lat: currentLocation.lat,
          lon: currentLocation.lon,
        });
      } catch (error) {
        alert(error instanceof Error ? error.message : '즐겨찾기 추가 실패');
      }
    }
  };

  // 현재 위치 가져오기
  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        setCurrentLocation(location);
      })
      .catch((error) => {
        console.error("위치 가져오기 실패:", error);
        // 기본 위치(서울) 사용
        setCurrentLocation(DEFAULT_LOCATION);
      })
      .finally(() => {
        setIsLoadingLocation(false);
      });
  }, []);

  // 날씨 데이터 가져오기
  const { data: weatherData, isLoading: isLoadingWeather } = useCurrentWeather(
    currentLocation?.lat || 0,
    currentLocation?.lon || 0,
    !!currentLocation,
  );

  // 당일 최저/최고 기온 가져오기
  const { data: minMaxData } = useTodayMinMaxTemp(
    currentLocation?.lat || 0,
    currentLocation?.lon || 0,
    !!currentLocation,
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-blue-200 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TiWeatherPartlySunny className="text-5xl text-white" />
            <h1 className="text-4xl font-bold text-white">날씨</h1>
          </div>
          <button
            className="text-white text-3xl hover:rotate-180 transition-transform duration-500"
            onClick={() => window.location.reload()}
          >
            <MdRefresh />
          </button>
        </div>

        {/* 검색바 */}
        <Input
          type="text"
          placeholder="도시 검색 (예: 서울, 부산, Jeju)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* 현재 위치 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineLocationMarker className="text-3xl text-white" />
            <h2 className="text-2xl font-bold text-white">현재 위치</h2>
          </div>

          <Card className="p-8">
            {isLoading ? (
              <>
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <Skeleton className="h-9 w-40 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-11 w-11 rounded-lg flex-shrink-0" />
                </div>

                <div className="flex items-center gap-8 mb-8">
                  <Skeleton className="h-24 w-24 flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-[72px] w-40 mb-2" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>

                {/* 구분선 */}
                <div className="border-t border-white/20 mb-6"></div>

                <div className="flex items-center gap-8 text-white/80">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 flex-shrink-0" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 flex-shrink-0" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </>
            ) : weatherData ? (
              <>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {currentLocation?.name || "현재 위치"}
                    </h3>
                    <p className="text-white/80 text-sm">Current Location</p>
                  </div>
                  <button
                    className={`text-3xl p-2 rounded-lg hover:bg-white/20 transition-all ${
                      isCurrentLocationFavorite ? 'text-yellow-400' : 'text-white/50'
                    }`}
                    style={{ filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))' }}
                    onClick={handleToggleCurrentLocationFavorite}
                  >
                    {isCurrentLocationFavorite ? (
                      <AiFillStar />
                    ) : (
                      <AiOutlineStar />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-8 mb-8">
                  <div className="text-8xl">
                    {getWeatherEmoji(weatherData.weather[0]?.icon || "")}
                  </div>
                  <div>
                    <div className="text-7xl font-bold text-white">
                      {formatTemp(weatherData.main.temp)}
                    </div>
                    <div className="text-2xl text-white/90 mt-2">
                      {weatherData.weather[0]?.description || "맑음"}
                    </div>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="border-t border-white/20 mb-6"></div>

                <div className="flex items-center gap-8 text-white/80">
                  <div className="flex items-center gap-2">
                    <TiArrowSortedDown className="text-2xl text-blue-400" />
                    <span>최저 {formatTemp(minMaxData?.temp_min ?? weatherData.main.temp_min)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TiArrowSortedUp className="text-2xl text-red-400" />
                    <span>최고 {formatTemp(minMaxData?.temp_max ?? weatherData.main.temp_max)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-white">
                <p>날씨 정보를 불러올 수 없습니다</p>
              </div>
            )}
          </Card>
        </div>

        {/* 즐겨찾기 */}
        {favorites.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-white">즐겨찾기</h2>
              <span className="text-white/70 text-sm">
                {count}/{maxCount}
              </span>
            </div>

            <div className="space-y-4">
              {favorites.map((favorite) => (
                <FavoriteCard
                  key={favorite.id}
                  favorite={favorite}
                  onRemove={removeFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {favorites.length === 0 && (
          <div className="text-center py-20 text-white/70">
            <p className="text-lg">도시를 검색하고 즐겨찾기에 추가해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
