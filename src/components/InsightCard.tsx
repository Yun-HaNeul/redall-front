import {useState} from "react";
import {getDonationInsight} from "../api/donation.ts";
import {Button, Card, Group, Loader, Stack, Text} from "@mantine/core";

function InsightCard(){
    const [insight, setInsight] = useState<String | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await getDonationInsight();
            setInsight(res.data.insight);
        }catch {
            setInsight("인사이트를 생성하지 못했어요. 잠시 후 다시 시도해주세요.")
        }finally {
            setLoading(false);
        }
    };

    return (
        <Card withBorder radius="md" p="lg" style={{background: "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)", borderColor: '#ffc9c9'}}>
            <Group justify="space-between" mb={insight || loading ? "md" : 0}>
            <Group gap="xs">
                <Text fw={600}>
                    ✨ AI 헌혈 인사이트
                </Text>
            </Group>
            {!insight && !loading && (
                <Button size="sm" color="red" variant="light" onClick={handleGenerate}>분석 받기</Button>
            )}
            </Group>

            {loading && (
                <Group gap="xs">
                    <Loader size="sm" color="red"/>
                    <Text size="sm" c="dimmed">
                         ✨ AI가 헌혈 기록을 분석하고 있어요 ✨
                    </Text>
                </Group>
            )}

            {insight && !loading && (
                <Stack gap="sm">
                    <Text size="sm" style={{ lineHeight: 1.7}}>
                        {insight}
                    </Text>
                    <Button size="xs" variant="subtle" color="gray" onClick={handleGenerate} style={{ alignSelf: "flex-start" }}>
                        다시 분석
                    </Button>
                </Stack>
            )}
        </Card>
    );
}

export default InsightCard;