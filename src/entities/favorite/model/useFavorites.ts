import { useState, useEffect } from 'react';
import type { Favorite } from '@/shared/types';
import { MAX_FAVORITES, FAVORITES_STORAGE_KEY } from '@/shared/constants';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // LocalStorage에서 즐겨찾기 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('즐겨찾기 불러오기 실패:', error);
      }
    }
  }, []);

  // LocalStorage에 저장
  const saveFavorites = (newFavorites: Favorite[]) => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  // 즐겨찾기 추가
  const addFavorite = (favorite: Omit<Favorite, 'id' | 'addedAt'>) => {
    if (favorites.length >= MAX_FAVORITES) {
      throw new Error(`즐겨찾기는 최대 ${MAX_FAVORITES}개까지 등록할 수 있습니다.`);
    }

    const newFavorite: Favorite = {
      ...favorite,
      id: `${Date.now()}-${Math.random()}`,
      addedAt: Date.now(),
    };

    saveFavorites([...favorites, newFavorite]);
  };

  // 즐겨찾기 삭제
  const removeFavorite = (id: string) => {
    saveFavorites(favorites.filter((f) => f.id !== id));
  };

  // 즐겨찾기 이름 수정
  const updateFavoriteName = (id: string, name: string) => {
    saveFavorites(
      favorites.map((f) => (f.id === id ? { ...f, name } : f))
    );
  };

  // 즐겨찾기 여부 확인
  const isFavorite = (lat: number, lon: number) => {
    return favorites.some(
      (f) => Math.abs(f.lat - lat) < 0.01 && Math.abs(f.lon - lon) < 0.01
    );
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateFavoriteName,
    isFavorite,
    count: favorites.length,
    maxCount: MAX_FAVORITES,
    isFull: favorites.length >= MAX_FAVORITES,
  };
}
