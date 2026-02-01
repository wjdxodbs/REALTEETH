export interface SearchResult {
  fullName: string; // "서울특별시-종로구-청운동"
  displayName: string; // "서울특별시 종로구 청운동"
  city: string; // "서울특별시"
  district?: string; // "종로구"
  dong?: string; // "청운동"
}

// korea_districts.json 데이터를 동적으로 로드
let koreaDistricts: string[] | null = null;

async function loadKoreaDistricts(): Promise<string[]> {
  if (koreaDistricts) {
    return koreaDistricts;
  }

  try {
    const response = await fetch('/korea_districts.json');
    koreaDistricts = await response.json();
    return koreaDistricts!;
  } catch (error) {
    console.error('korea_districts.json 로드 실패:', error);
    return [];
  }
}

/**
 * korea_districts.json에서 검색어와 매칭되는 지역 찾기
 */
export async function searchKoreaDistricts(query: string, limit = 10): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const districts = await loadKoreaDistricts();
  const normalizedQuery = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  for (const district of districts) {
    // 검색어가 포함되어 있는지 확인
    if (district.toLowerCase().includes(normalizedQuery)) {
      const parts = district.split('-');
      
      results.push({
        fullName: district,
        displayName: district.replace(/-/g, ' '),
        city: parts[0] || '',
        district: parts[1],
        dong: parts[2],
      });

      if (results.length >= limit) {
        break;
      }
    }
  }

  return results;
}

/**
 * 지역명으로 좌표 가져오기 (OpenWeatherMap Geocoding API 사용)
 */
export async function getCoordinatesByDistrict(
  districtName: string
): Promise<{ lat: number; lon: number } | null> {
  try {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        districtName
      )},KR&limit=1&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Geocoding API 요청 실패');
    }

    const data = await response.json();
    
    if (data.length > 0) {
      return {
        lat: data[0].lat,
        lon: data[0].lon,
      };
    }

    return null;
  } catch (error) {
    console.error('좌표 가져오기 실패:', error);
    return null;
  }
}
