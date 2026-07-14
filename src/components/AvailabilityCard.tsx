import type {DonationAvailability} from "../types/donation.ts";
import {JSX} from "react";
import {Badge, Card, Group, Progress, Stack, Text} from "@mantine/core";

/**
 * 헌혈 종류별 가능 여부 카드
 */
interface Props {
    data: DonationAvailability
}

function AvailabilityCard({ data }: Props){
    // 상태에 따른 색 / 문구
    const getStatus = () => {
        if (data.limitReached) {
            return { color: "gray", label: "연간 한도 초과"};
        }
        if (data.canDonate) {
            return { color: "teal", label: "지금 가능"};
        }
        return { color: "orange", label: `D-${data.dDay}`};
    };

    const status = getStatus();

    return (
        <Card
            withBorder
            radius="md"
            p="md"
            style={{
                borderColor: data.canDonate ? "#12b886" : undefined,
                borderWidth: data.canDonate ? 2 : 1,
            }}
        >
            <Stack gap="xs">
                <Group justify="space-between">
                    <Text fw={600}>{data.typeName}</Text>
                    <Badge color={status.color} variant={data.canDonate ? "filled" : "light"}>
                        {status.label}
                    </Badge>
                </Group>

                {!data.canDonate && data.reason && (
                    <Text size="xs" c="dimmed">
                        {data.reason}
                    </Text>
                )}

                {data.canDonate && (
                    <Text size="xs" c="teal">
                        지금 헌혈할 수 있어요!🙏
                    </Text>
                )}

                {/* 연간 횟수 진행 */}
                <Stack gap={4}>
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                            올해 헌혈
                        </Text>
                        <Text size="xs" c="dimmed">
                            {data.countThisYear} / {data.yearlyLimit} 회
                        </Text>
                    </Group>
                    <Progress
                        value={(data.countThisYear / data.yearlyLimit) * 100}
                        color={data.limitReached ? "grey" : "red"}
                        size="sm"
                        />
                </Stack>

                {!data.canDonate && !data.limitReached && (
                    <Text size="xs" c="dimmed">
                        가능일: {data.availableDate}
                    </Text>
                )}
            </Stack>
        </Card>
    )
}


export default AvailabilityCard;