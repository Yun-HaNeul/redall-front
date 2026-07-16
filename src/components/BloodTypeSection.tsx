import {useAuth} from "../context/AuthContext.tsx";
import {useEffect, useState} from "react";
import type {BloodTypeInsight, BloodTypeStat} from "../types/bloodType.ts";
import {getBloodTypeDistribution} from "../api/Statistics.ts";
import {getBloodTypeInsight} from "../api/bloodType.ts";
import {Alert, Badge, Card, Group, Paper, Text} from "@mantine/core";
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

function BloodTypeSection() {
    const {isAuthenticated} = useAuth();
    const [distribution, setDistribution] = useState<BloodTypeStat>([]);
    const [myInsight, setMyInsight] = useState<BloodTypeInsight | null>(null);

    useEffect(() => {
        // 전체 분포 (공개)
        getBloodTypeDistribution()
            .then((res) => setDistribution(res.data))
            .catch(() => setDistribution([]));

        // 내 혈액형 (로그인 시)
        if (isAuthenticated) {
            getBloodTypeInsight()
                .then((res) => {
                    if (res.data) setMyInsight(res.data);
                })
                .catch(() => {
                });
        }
    }, [isAuthenticated]);

    // RH+ 만 차트에 , RH-는 값이 작아서 별도 표시
    const mainTypes = distribution.filter((d) => d.rhType === "POSITIVE");
    const rareTypes = distribution.filter((d) => d.rhType === "NEGATIVE");

    // 차트 데이터
    const chartData = mainTypes.map((d) => ({
        name: `${d.bloodType}형`,
        비율: d.ratio,
        isMine:
            myInsight?.bloodType === d.bloodType && myInsight?.rhType === "POSITIVE",
    }));

    return (
        <Card withBorder radius="md" p="lg">
            <Text fw={500} mb="md">
                혈액형별 헌혈 분포
            </Text>

            {/* 내 혈액형 인사이트 */}
            {myInsight && (
                <Alert
                    color={myInsight.isRare ? "red" : "blue"}
                    mb="md"
                    radius="md"
                >
                    <Group gap="xs" mb={4}>
                        <Text fw={600} size="sm">
                            내 혈액형: {myInsight.displayName}
                        </Text>
                        {myInsight.isRare && (
                            <Badge color="red" size="sm">
                                희귀
                            </Badge>
                        )}
                    </Group>
                    <Text size="sm">{myInsight.message}</Text>
                </Alert>
            )}

            {/* 분포 차트 (RH+ 기준) */}
            <ResponsiveContainer width="100%" height={260}>
                <BarChart
                    data={chartData}
                    margin={{top: 20, right: 10, bottom: 0, left: 0}}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" vertical={false}/>
                    <XAxis dataKey="name" tick={{fontSize: 12}}/>
                    <YAxis
                        tick={{fontSize: 12}}
                        unit="%"
                        domain={[0, 40]}
                        allowDataOverflow={false}
                    />
                    <Tooltip
                        formatter={(value: number) => [`${value}%`, "헌혈 비율"]}
                        contentStyle={{fontSize: 13, borderRadius: 8}}
                    />
                    <Bar dataKey="비율" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, idx) => (
                            <Cell key={idx} fill={entry.isMine ? "#A32D2D" : "#F09595"}/>
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <Text size="xs" c="dimmed" ta="center" mt={4}>
                RH+ 기준 · 내 혈액형은 진한 색으로 표시
            </Text>

            {/* RH- 희귀 혈액형 */}
            {rareTypes.length > 0 && (
                <Paper withBorder p="sm" radius="md" mt="md" bg="#fff5f5">
                    <Text size="xs" fw={500} mb={6}>
                        RH- 희귀 혈액형 (전체의 약 0.4%)
                    </Text>
                    <Group gap="xs">
                        {rareTypes.map((r) => (
                            <Badge key={r.displayName} color="red" variant="light" size="sm">
                                {r.bloodType}형 {r.ratio}%
                            </Badge>
                        ))}
                    </Group>
                </Paper>
            )}
        </Card>
    );
}

export default BloodTypeSection;