import type {RegionStatistic} from "../types/statistics.ts";
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

/**
 * 시·도별 헌혈률 순위 (가로 막대 차트).
 */
interface Props {
    data: RegionStatistic[];
}

function RegionRankChart({data}: Props) {
    const chartData = data.map((d) => ({
        region: d.region,
        헌혈률: d.donationRate,
    }));

    return (
        <ResponsiveContainer width="100%" height={data.length * 34 + 30}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{top: 5, right: 30, bottom: 5, left: 10}}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" horizontal={false}/>
                <XAxis type="number" tick={{fontSize: 12}} unit="%"/>
                <YAxis
                    type="category"
                    dataKey="region"
                    tick={{fontSize: 12}}
                    width={90}
                />
                <Tooltip
                    formatter={(value: number) => [`${value}%`, "헌혈률"]}
                    contentStyle={{fontSize: 13, borderRadius: 8}}
                />
                <Bar dataKey="헌혈률" radius={[0, 4, 4, 0]}>
                    {chartData.map((_, idx) => (
                        <Cell key={idx} fill={idx < 3 ? "#E24B4A" : "#F09595"}/>
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default RegionRankChart;