import {useState} from "react";


export function useMyLocation(){
    const [location, setLocation] = useState<{ lat: number; lon: number} | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getLocation = () => {
        setError("");
        setLoading(true);

        // 브라우저가 위치 기능을 지원하는지 확인
        if (!navigator.geolocation) {
            setError("이 브라우저는 위치 기능을 지원하지 않습니다.");
            setLoading(false);
            return;
        }

        // 현재 위치 요청 (사용자가 권한 허용할 시)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setLoading(false);
            },
            () => {
                setError("위치를 가져올 수 없습니다. 위치 권한을 허용해 주세요.");
                setLoading(false);
            }
        );
    };

    return { location, getLocation, loading, error};
}