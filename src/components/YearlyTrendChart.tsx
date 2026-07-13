import type {YearlyStatistic} from "../types/statistics.ts";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";


/**
 * 연도별 헌혈실적 추이 (막대 차트)
 */
interface Props {
    data: YearlyStatistic[];
}

function YearlyTrendChart({ data }: Props){
    // 만 단위로 변환
    const chartData = data.map((d) => ({
        year: `${d.year}년`,
        헌혈실적: Math.round(d.donationCount / 10000),
        헌혈율: d.donationRate,
    }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }}/>
                <YAxis
                    tick={{ fontSize: 12 }}
                    label={{ value: "만 건", angle: -90, position: "insideLeft", fontSize: 11}}
                />
                <Tooltip
                    formatter={(value: number) => [`${value}만 건`, "헌혈실적"]}
                    contentStyle={{ fontSize: 13, borderRadius: 8}}
                />
                <Bar dataKey="헌혈실적" fill="#E24B4A" radius={[4, 4, 0, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default YearlyTrendChart;
