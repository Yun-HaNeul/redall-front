/**
 *  카카오 SDK는 전역 (window.kakao)에 들어오므로 타입을 any로 둔다
 */
import {useEffect, useRef, useState} from "react";


declare global {
    interface Window {
        kakao: any;
    }
}

export function useKakaoMap(){
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);

    useEffect(() => {
        // SDK가 아직 안 불러와졌으면 대기
        if(!window.kakao || !window.kakao.maps) {
            return;
        }

        // kakao.maps.load: SDK 준비되면 콜백 실행
        window.kakao.maps.load(() => {
            if(!mapRef.current) return;

            // 지도 옵션: 중심 좌표(서울시청), 확대 레벨
            const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 8,
            };

            // 지도 생성
            const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
            setMap(kakaoMap);
        })
    }, []);

    return { mapRef, map };
}