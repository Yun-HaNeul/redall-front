import {useEffect, useState} from "react";
import {
    Container,
    Title,
    Text,
    Loader,
    Center,
    Card,
    Group,
    Stack,
    SimpleGrid,
    Paper,
    Badge,
} from "@mantine/core";
import BloodDropGauge from "../components/BloodDropGauge";
import {getSummary, getYearlyTrend, getRegionRanking} from "../api/statistics";
import type {
    StatisticSummary,
    YearlyStatistic,
    RegionStatistic,
} from "../types/statistics";
import YearlyTrendChart from "../components/YearlyTrendChart.tsx";
import RegionRankChart from "../components/RegionRankChart.tsx";
import KoreaChoroplethMap from "../components/KoreaChoroplethMap.tsx";
import BloodTypeSection from "../components/BloodTypeSection.tsx";

/**
 * 헌혈 통계 대시보드.
 * 물방울 게이지 + 요약 카드 + 연도별 추이 + 지역별 순위.
 */
function StatisticsPage() {
    const [summary, setSummary] = useState<StatisticSummary | null>(null);
    const [yearly, setYearly] = useState<YearlyStatistic[]>([]);
    const [regions, setRegions] = useState<RegionStatistic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 요약 먼저 가져오고, 그 연도로 지역 순위 조회
        getSummary()
            .then((res) => {
                setSummary(res.data);
                return getRegionRanking(res.data.year);
            })
            .then((res) => setRegions(res.data))
            .catch(() => setSummary(null))
            .finally(() => setLoading(false));

        getYearlyTrend()
            .then((res) => setYearly(res.data))
            .catch(() => setYearly([]));
    }, []);

    if (loading) {
        return (
            <Center h="60vh">
                <Loader/>
            </Center>
        );
    }

    if (!summary) {
        return (
            <Container my={40}>
                <Text c="dimmed">통계 데이터를 불러올 수 없습니다.</Text>
            </Container>
        );
    }

    // 연도별 추이 차트용: 최대값 기준으로 막대 높이 비율 계산
    const maxCount = Math.max(...yearly.map((y) => y.donationCount), 1);

    // 지역 순위 차트용: 최대 헌혈률 기준
    const maxRate = Math.max(...regions.map((r) => r.donationRate), 1);

    // 숫자 포맷 (283만 건 → 읽기 쉽게)
    const formatCount = (n: number) => (n / 10000).toFixed(1) + "만";

    return (
        <Container size="md" my={30}>
            <Title order={2} mb="xs">
                헌혈 통계
            </Title>
            <Text c="dimmed" size="sm" mb="lg">
                전국 헌혈 참여 현황 ({summary.year}년 기준)
            </Text>

            {/* 상단: 물방울 + 요약 카드 */}
            <SimpleGrid cols={{base: 1, sm: 3}} mb="lg">
                {/* 물방울 게이지 */}
                <Paper withBorder p="md" radius="md">
                    <Center>
                        <Stack align="center" gap={4}>
                            <BloodDropGauge percent={summary.donationRate} size={120}/>
                            <Text size="xs" c="dimmed">
                                인구 대비 헌혈률
                            </Text>
                        </Stack>
                    </Center>
                </Paper>

                {/* 총 헌혈실적 */}
                <Paper withBorder p="md" radius="md">
                    <Stack gap={4}>
                        <Text size="xs" c="dimmed">
                            총 헌혈실적
                        </Text>
                        <Text size="28px" fw={500}>
                            {formatCount(summary.donationCount)}
                        </Text>
                        <Text size="xs" c="dimmed">
                            건 ({summary.year}년)
                        </Text>
                    </Stack>
                </Paper>

                {/* 작년 대비 */}
                <Paper withBorder p="md" radius="md">
                    <Stack gap={4}>
                        <Text size="xs" c="dimmed">
                            작년 대비
                        </Text>
                        <Text
                            size="28px"
                            fw={500}
                            c={
                                summary.changePercent === null
                                    ? "dimmed"
                                    : summary.changePercent >= 0
                                        ? "teal"
                                        : "red"
                            }
                        >
                            {summary.changePercent === null
                                ? "-"
                                : `${summary.changePercent > 0 ? "+" : ""}${summary.changePercent}%`}
                        </Text>
                        {summary.previousCount && (
                            <Text size="xs" c="dimmed">
                                {formatCount(summary.previousCount)} →{" "}
                                {formatCount(summary.donationCount)}
                            </Text>
                        )}
                    </Stack>
                </Paper>
            </SimpleGrid>

            {/* 연도별 추이 */}
            <Card withBorder radius="md" p="lg" mb="lg">
                <Text fw={500} mb="md">
                    연도별 헌혈실적 추이
                </Text>
                <YearlyTrendChart data={yearly}/>
            </Card>

            {/* 지역 지도 */}
            <Card withBorder radius="md" p="lg" mb="lg">
                <Text fw={500} mb="md">
                    시·도별 헌혈율 지도 ({summary.year}년)
                </Text>
                <KoreaChoroplethMap data={regions}/>
            </Card>

            {/* 지역별 순위 */}
            <Card withBorder radius="md" p="lg">
                <Text fw={500} mb="md">
                    시·도별 헌혈률 순위 ({summary.year}년)
                </Text>
                <RegionRankChart data={regions}/>
            </Card>

            {/* 혈액형 분포 */}
            <div style={{marginTop: 24}}>
                <BloodTypeSection/>
            </div>
        </Container>
    );
}

export default StatisticsPage;