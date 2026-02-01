import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { IoChevronForward, IoCheckmark, IoClose } from 'react-icons/io5';
import { HiOutlinePencil } from 'react-icons/hi';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Spinner } from '@/shared/ui/Spinner';
import { formatTemp } from '@/shared/lib/utils';
import { getWeatherEmoji } from '@/shared/lib/weatherBackground';
import { useCurrentWeather } from '@/entities/weather/model';
import type { Favorite } from '@/shared/types';

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
}

export function FavoriteCard({ favorite, onRemove, onUpdateName }: FavoriteCardProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const { data: weatherData, isLoading } = useCurrentWeather(
    favorite.lat,
    favorite.lon,
    true
  );

  // 표시 이름: 애칭이 있으면 애칭, 없으면 지역명(originalName)
  const displayName = (favorite.name?.trim() || favorite.originalName) || '이름 없음';

  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditValue(displayName);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const saveName = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const trimmed = editValue.trim();
    onUpdateName(favorite.id, trimmed || favorite.originalName);
    setIsEditing(false);
  };

  const cancelEdit = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setEditValue(displayName);
    setIsEditing(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveName();
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <Card
      className="p-6 cursor-pointer hover:bg-white/10 hover:scale-[1.02] transition-all duration-200"
      onClick={() => {
        if (isEditing) return;
        const params = new URLSearchParams({
          lat: String(favorite.lat),
          lon: String(favorite.lon),
          name: displayName,
        });
        navigate(`/detail?${params.toString()}`);
      }}
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
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-nowrap">
              {isEditing ? (
                <>
                  <div className="min-w-0 flex-1">
                    <Input
                      ref={inputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="text-xl font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="p-2 rounded-lg text-green-400 hover:bg-white/20 transition-all"
                      onClick={saveName}
                      title="확인"
                    >
                      <IoCheckmark className="text-2xl" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg text-red-400 hover:bg-white/20 transition-all"
                      onClick={cancelEdit}
                      title="취소"
                    >
                      <IoClose className="text-2xl" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white truncate">
                    {displayName}
                  </h3>
                  <button
                    className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10 transition-all flex-shrink-0"
                    onClick={startEditing}
                    title="이름 수정"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </button>
                </>
              )}
            </div>
            <div className="text-3xl font-bold text-white mt-0.5">
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
