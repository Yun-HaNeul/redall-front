import {useKakaoMap} from "../hook/useKakaoMap.ts";
import {useEffect, useState} from "react";
import type {BloodCenter, BloodCenterNearby} from "../types/bloodCenter.ts";
import {getBloodCenter, getNearestBloodCenters} from "../api/BloodCenter.ts";
import {
    Container,
    Title,
    Text,
    Loader,
    Center,
    Button,
    Group,
    Card,
    Stack,
    Badge,
    Alert,
} from "@mantine/core";
import {useMyLocation} from "../hook/useMyLocation.ts";


function BloodCenterMapPage() {
    const {mapRef, map} = useKakaoMap();
    const {location, getLocation, loading: locLoading, error: locError} = useMyLocation();

    const [centers, setCenters] = useState<BloodCenter[]>([]);
    const [nearby, setNearby] = useState<BloodCenterNearby>([]);
    const [loading, setLoading] = useState(true);

    // 마커 기억 후 지울 때
    const [markers, setMarkers] = useState<any[]>([]);

    //  1.  백엔드에서 헌혈의 집 목록 가져오기
    useEffect(() => {
        getBloodCenter()
            .then((res) => setCenters(res.data))
            .catch(() => setCenters([]))
            .finally(() => setLoading(false));
    }, []);

    // 2. 내 위치 확인되면 -> 주변 검색
    useEffect(() => {
        if (!location) return;
        getNearestBloodCenters(location.lat, location.lon, 10)
            .then((res) => setNearby(res.data))
            .catch(() => setNearby([]));
    }, [location]);

    //  3. 마커 찍기
    useEffect(() => {
        if (!map) return;

        // 기존 마커 제거
        markers.forEach((m) => m.setMap(null));

        const dataToShow = nearby.length > 0 ? nearby : centers;
        if (dataToShow.length === 0) return;

        const newMarkers: any[] = [];
        let openInfoWindow: any = null;

        dataToShow.forEach((center) => {
            const position = new window.kakao.maps.LatLng(
                center.lat,
                center.lon,
            );
            const marker = new window.kakao.maps.Marker({position});
            marker.setMap(map);

            const infoWindow = new window.kakao.maps.InfoWindow({
                content: `
                    <div style="
                      padding: 12px 14px;
                      min-width: 200px;
                      max-width: 240px;
                      font-family: -apple-system, sans-serif;
                      line-height: 1.5;
                    ">
                      <div style="
                        font-size: 14px;
                        font-weight: 700;
                        color: #e03131;
                        margin-bottom: 6px;
                      ">
                        ${center.name}
                      </div>
                      <div style="font-size: 12px; color: #495057; margin-bottom: 3px;">
                        📍 ${center.address}
                      </div>
                      <div style="font-size: 12px; color: #495057;">
                        ☎ ${center.tel}
                      </div>
                    </div>
                  `,
            });
            window.kakao.maps.event.addListener(marker, "click", () => {
                if (openInfoWindow) {
                    openInfoWindow.close();
                }
                infoWindow.open(map, marker);
                openInfoWindow = infoWindow;
            });

            newMarkers.push(marker);
        });

        setMarkers(newMarkers);

        // 내 위치가 있으면 지도 중심을 그쪽으로
        if (location) {
            map.setCenter(new window.kakao.maps.LatLng(location.lat, location.lon));
            map.setLevel(6);
        }
    }, [map, centers, nearby]);

    return (
        <Container size="lg" my={30}>
            <Title order={2} mb="xs">
                헌혈의 집 찾기
            </Title>
            <Text c="dimmed" size="sm" mb="md">
                전국 헌혈의 집 {centers.length}곳. 내 주변에서 찾아보세요.
            </Text>

            <Group mb="md">
                <Button onClick={getLocation} loading={locLoading}>
                    내 주변 헌혈의 집 찾기
                </Button>
                {nearby.length > 0 && (
                    <Text size="sm" c="dimmed">
                        가까운 {nearby.length}곳을 찾았어요
                    </Text>
                )}
            </Group>

            {locError && (
                <Alert color="red" mb="md">
                    {locError}
                </Alert>
            )}

            {loading && (
                <Center h={200}>
                    <Loader/>
                </Center>
            )}

            {/* 지도 */}
            <div
                ref={mapRef}
                style={{width: "100%", height: "500px", borderRadius: "8px"}}
            />

            {/* 주변 검색 결과 목록 */}
            {nearby.length > 0 && (
                <Stack mt="md" gap="xs">
                    <Title order={4}>가까운 헌혈의 집</Title>
                    {nearby.map((c) => (
                        <Card key={c.id} withBorder padding="sm" radius="md">
                            <Group justify="space-between">
                                <div>
                                    <Text fw={500}>{c.name}</Text>
                                    <Text size="xs" c="dimmed">{c.address}</Text>
                                    <Text size="xs" c="dimmed">{c.tel}</Text>
                                </div>
                                <Badge color="red" variant="light">
                                    {c.distanceKm} km
                                </Badge>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}
        </Container>
    );
}

export default BloodCenterMapPage;