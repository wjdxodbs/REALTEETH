import { useNavigate } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { IoChevronForward } from 'react-icons/io5';
import { Card } from '@/shared/ui/Card';
import { Spinner } from '@/shared/ui/Spinner';
import { formatTemp } from '@/shared/lib/utils';
import { getWeatherEmoji } from '@/shared/lib/weatherBackground';
import { useCurrentWeather } from '@/entities/weather/model';
import type { Favorite } from '@/shared/types';

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: string) => void;
}

export function FavoriteCard({ favorite, onRemove }: FavoriteCardProps) {
  const navigate = useNavigate();
  const { data: weatherData, isLoading } = useCurrentWeather(
    favorite.lat,
    favorite.lon,
    true
  );

  return (
    <Card
      className="p-6 cursor-pointer hover:bg-white/10 hover:scale-[1.02] transition-all duration-200"
      onClick={() => navigate(`/detail/${favorite.id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-14 h-14 flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="text-5xl">
              {getWeatherEmoji(weatherData?.weather[0]?.icon || '')}
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-white">
              {favorite.name}
            </h3>
            <div className="text-3xl font-bold text-white">
              {isLoading ? '...' : weatherData ? formatTemp(weatherData.main.temp) : '--'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="text-yellow-400 text-2xl p-2 rounded-lg hover:bg-white/20 transition-all"
            style={{ filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(favorite.id);
            }}
          >
            <AiFillStar />
          </button>
          <IoChevronForward className="text-white text-2xl" />
        </div>
      </div>
    </Card>
  );
}
