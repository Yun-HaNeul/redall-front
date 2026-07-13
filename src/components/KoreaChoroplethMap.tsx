import {useState, useRef} from "react";
import {Box, Text, Paper, Button, Group} from "@mantine/core";
import {
    KOREA_SIDO_PATHS,
    KOREA_VIEWBOX,
    REGION_MARKER_POS,
} from "../resource/koreaMapPaths";
import type {RegionStatistic} from "../types/statistics";

const SIDO_TO_REGION: Record<string, string> = {
    서울: "서울",
    부산: "부산",
    대구: "대구·경북",
    경북: "대구·경북",
    인천: "인천",
    광주: "광주·전남",
    전남: "광주·전남",
    대전: "대전·세종·충남",
    세종: "대전·세종·충남",
    충남: "대전·세종·충남",
    울산: "울산",
    경기: "경기",
    강원: "강원",
    충북: "충북",
    전북: "전북",
    경남: "경남",
    제주: "제주",
};

// 원본 viewBox 파싱
const [BASE_X, BASE_Y, BASE_W, BASE_H] = KOREA_VIEWBOX.split(" ").map(Number);

interface Props {
    data: RegionStatistic[];
    onRegionClick?: (region: string) => void;
}

function KoreaChoroplethMap({data, onRegionClick}: Props) {
    const [hovered, setHovered] = useState<string | null>(null);

    // 줌/이동 상태
    const [zoom, setZoom] = useState(1);          // 1 = 원본
    const [offset, setOffset] = useState({x: 0, y: 0});
    const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

    const dataMap = new Map(data.map((d) => [d.region, d]));
    const rates = data.map((d) => d.donationRate);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);

    const getColor = (rate: number | undefined) => {
        if (rate === undefined) return "#F1F0EC";
        if (maxRate === minRate) return "#F5A3A3";
        const ratio = (rate - minRate) / (maxRate - minRate);
        if (ratio > 0.75) return "#D9534F";
        if (ratio > 0.5) return "#EE8383";
        if (ratio > 0.25) return "#F7B5B5";
        return "#FCDDDD";
    };

    const hoveredStat = hovered ? dataMap.get(hovered) : null;

    // 현재 viewBox (줌·이동 반영)
    const vw = BASE_W / zoom;
    const vh = BASE_H / zoom;
    const vx = BASE_X + (BASE_W - vw) / 2 + offset.x;
    const vy = BASE_Y + (BASE_H - vh) / 2 + offset.y;
    const viewBox = `${vx} ${vy} ${vw} ${vh}`;

    // 휠로 확대/축소
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom((z) => Math.max(1, Math.min(6, z * delta)));
    };

    // 드래그로 이동
    const handleMouseDown = (e: React.MouseEvent) => {
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            ox: offset.x,
            oy: offset.y,
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragRef.current) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        // 화면 픽셀 → SVG 좌표로 환산
        const scale = vw / (e.currentTarget as HTMLElement).clientWidth;
        setOffset({
            x: dragRef.current.ox - dx * scale,
            y: dragRef.current.oy - dy * scale,
        });
    };

    const handleMouseUp = () => {
        dragRef.current = null;
    };

    const resetView = () => {
        setZoom(1);
        setOffset({x: 0, y: 0});
    };

    const renderDropMarker = (
        region: string,
        stat: RegionStatistic,
        x: number,
        y: number
    ) => {
        // 줌에 따라 마커 크기 조절 (확대해도 마커가 너무 커지지 않게)
        const scale = 1 / Math.sqrt(zoom);
        const w = 45 * scale;
        const h = 55 * scale;
        const clipId = `drop-${region.replace(/[^a-zA-Z0-9]/g, "")}`;

        const fillRatio = Math.min(1, stat.donationRate / maxRate);
        const innerTop = 4 * scale;
        const innerBottom = h - 2 * scale;
        const fillH = (innerBottom - innerTop) * fillRatio;
        const fillY = innerBottom - fillH;

        const dropPath = `M${w / 2} ${2 * scale} C${w / 2} ${2 * scale} ${w - 3 * scale} ${h * 0.45} ${w - 3 * scale} ${h * 0.62} A${w / 2 - 3 * scale} ${w / 2 - 3 * scale} 0 1 1 ${3 * scale} ${h * 0.62} C${3 * scale} ${h * 0.45} ${w / 2} ${2 * scale} ${w / 2} ${2 * scale} Z`;

        return (
            <g
                key={region}
                transform={`translate(${x - w / 2}, ${y - h / 2})`}
                style={{cursor: onRegionClick ? "pointer" : "default"}}
                onMouseEnter={() => setHovered(region)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onRegionClick?.(region)}
            >
                <defs>
                    <clipPath id={clipId}>
                        <path d={dropPath}/>
                    </clipPath>
                </defs>
                <rect x="0" y="0" width={w} height={h} fill="#ffffff" clipPath={`url(#${clipId})`}/>
                <rect
                    x="0"
                    y={fillY}
                    width={w}
                    height={innerBottom - fillY}
                    fill="#D9534F"
                    clipPath={`url(#${clipId})`}
                />
                <path
                    d={dropPath}
                    fill="none"
                    stroke="#B03A3A"
                    strokeWidth={1.5 * scale}
                    style={{filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))"}}
                />
                {/* 수치 - 흰 글자 + 어두운 외곽선으로 항상 보이게 */}
                <text
                    x={w / 2}
                    y={h * 0.6}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14 * scale}
                    fontWeight="700"
                    fill="#ffffff"
                    stroke="#B03A3A"
                    strokeWidth={2.5 * scale}
                    paintOrder="stroke"
                >
                    {stat.donationRate}
                </text>
            </g>
        );
    };

    return (
        <Box style={{position: "relative"}}>
            {/* 줌 컨트롤 */}
            <Group
                gap="xs"
                style={{position: "absolute", top: 12, left: 12, zIndex: 10}}
            >
                <Button
                    size="xs"
                    variant="default"
                    onClick={() => setZoom((z) => Math.min(6, z * 1.3))}
                >
                    +
                </Button>
                <Button
                    size="xs"
                    variant="default"
                    onClick={() => setZoom((z) => Math.max(1, z / 1.3))}
                >
                    −
                </Button>
                <Button size="xs" variant="default" onClick={resetView}>
                    초기화
                </Button>
            </Group>

            <Box
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    cursor: dragRef.current ? "grabbing" : "grab",
                    overflow: "hidden",
                    borderRadius: 12,
                }}
            >
                <svg
                    viewBox={viewBox}
                    style={{
                        width: "100%",
                        height: 620,
                        display: "block",
                        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {KOREA_SIDO_PATHS.map((sido) => {
                        const region = SIDO_TO_REGION[sido.name];
                        const stat = region ? dataMap.get(region) : undefined;
                        const isHovered = hovered === region;

                        return (
                            <path
                                key={sido.code}
                                d={sido.d}
                                fill={getColor(stat?.donationRate)}
                                stroke="#ffffff"
                                strokeWidth={(isHovered ? 3 : 1.5) / zoom}
                                strokeLinejoin="round"
                                style={{
                                    cursor: onRegionClick && region ? "pointer" : "default",
                                    opacity: isHovered ? 0.9 : 1,
                                    transition: "opacity 0.15s",
                                }}
                                onMouseEnter={() => setHovered(region ?? null)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => region && onRegionClick?.(region)}
                            />
                        );
                    })}

                    {Object.entries(REGION_MARKER_POS).map(([region, pos]) => {
                        const stat = dataMap.get(region);
                        if (!stat) return null;
                        return renderDropMarker(region, stat, pos.x, pos.y);
                    })}
                </svg>
            </Box>

            {hoveredStat && (
                <Paper
                    withBorder
                    p="sm"
                    radius="md"
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "white",
                        minWidth: 150,
                    }}
                >
                    <Text fw={600} size="sm">
                        {hoveredStat.region}
                    </Text>
                    <Text size="xs" c="dimmed">
                        헌혈률 {hoveredStat.donationRate}%
                    </Text>
                    <Text size="xs" c="dimmed">
                        {(hoveredStat.donationCount / 10000).toFixed(1)}만 건
                    </Text>
                </Paper>
            )}

            <Box
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 12,
                }}
            >
                <Text size="xs" c="dimmed">
                    낮음
                </Text>
                {["#FCDDDD", "#F7B5B5", "#EE8383", "#D9534F"].map((c) => (
                    <div
                        key={c}
                        style={{width: 30, height: 12, background: c, borderRadius: 3}}
                    />
                ))}
                <Text size="xs" c="dimmed">
                    높음
                </Text>
            </Box>
        </Box>
    );
}

export default KoreaChoroplethMap;