const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY || "";

/** 카카오 API 시도명 → "서울특별시" 형식 매핑 */
const REGION_1_DISPLAY_NAMES: Record<string, string> = {
  서울: "서울특별시",
  부산: "부산광역시",
  대구: "대구광역시",
  인천: "인천광역시",
  광주: "광주광역시",
  대전: "대전광역시",
  울산: "울산광역시",
  세종: "세종특별자치시",
  경기: "경기도",
  강원: "강원특별자치도",
  충북: "충청북도",
  충남: "충청남도",
  전북: "전북특별자치도",
  전남: "전라남도",
  경북: "경상북도",
  경남: "경상남도",
  제주: "제주특별자치도",
};

interface KakaoAddressDocument {
  address?: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  };
}

interface KakaoCoord2AddressResponse {
  documents: KakaoAddressDocument[];
}

/**
 * 위·경도 좌표를 카카오 로컬 API로 주소 변환
 * "서울특별시 관악구 봉천동" 형식으로 반환
 */
export async function getAddressFromCoords(
  lat: number,
  lon: number
): Promise<string | null> {
  if (!KAKAO_REST_API_KEY) {
    return null;
  }

  try {
    const url = new URL("https://dapi.kakao.com/v2/local/geo/coord2address.json");
    url.searchParams.set("x", String(lon));
    url.searchParams.set("y", String(lat));
    url.searchParams.set("input_coord", "WGS84");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: KakaoCoord2AddressResponse = await response.json();
    const doc = data.documents?.[0];
    const addr = doc?.address;

    if (!addr?.region_1depth_name) {
      return null;
    }

    const region1 = REGION_1_DISPLAY_NAMES[addr.region_1depth_name] ?? addr.region_1depth_name;
    const region2 = addr.region_2depth_name?.trim() ?? "";
    const region3 = addr.region_3depth_name?.trim() ?? "";

    const parts = [region1, region2, region3].filter(Boolean);
    return parts.join(" ") || null;
  } catch {
    return null;
  }
}
