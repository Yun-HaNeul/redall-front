import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
import {useEffect, useState} from "react";
import type {Donation, DonationAvailability, DonationSummary} from "../types/donation.ts";
import {deleteDonation, getAvailability, getDonationSummary, getMyDonations} from "../api/donation.ts";
import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Center,
    Container,
    Group,
    Loader, Paper,
    SimpleGrid,
    Stack,
    Text,
    Title
} from "@mantine/core";
import AvailabilityCard from "../components/AvailabilityCard.tsx";
import DonationForm from "../components/DonationForm.tsx";

function DonationPage() {
    const navigate = useNavigate();
    const {isAuthenticated, loading: authLoading} = useAuth();

    const [donations, setDonations] = useState<Donation[]>([]);
    const [availability, setAvailability] = useState<DonationAvailability[]>([]);
    const [summary, setSummary] = useState<DonationSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [formOpened, setFormOpened] = useState(false);
    const [editing, setEditing] = useState<Donation | null>(null);

    // 로그인 체크
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login", {replace: true});
        }
    }, [authLoading, isAuthenticated, navigate]);

    const loadData = () => {
        Promise.all([getMyDonations(), getAvailability(), getDonationSummary()])
            .then(([d, a, s]) => {
                setDonations(d.data);
                setAvailability(a.data);
                setSummary(s.data);
            })
            .catch(() => [])
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadData()
        }
    }, [isAuthenticated]);

    const handleDelete = async (id: number) => {
        if (!confirm("이 기록을 삭제할까요?")) return;
        try {
            await deleteDonation(id);
            loadData();
        } catch {
            alaert("삭제에 실패했습니다.");
        }
    };

    if (loading || authLoading) {
        return (
            <Center h="60vh">
                <Loader/>
            </Center>
        )
    }

    return (
        <Container size="md" my={30}>
            <Group justify="space-between" mb="lg">
                <div>
                    <Title order={2}>나의 현황</Title>
                    <Text c="dimmed" size="sm">
                        헌혈 기록과 다음 헌혈 가능일을 확인하세요
                    </Text>
                </div>
                <Button variant="light" color="red" onClick={() => {
                    setEditing(null);
                    setFormOpened(true);
                }}>
                    ➕ 기록 추가
                </Button>
            </Group>

            {/* 요약 */}
            {summary && (
                <Paper withBorder p="md" radius="md" mb="lg">
                    <Group>
                        <div>
                            <Text size="xs" c="dimmed">
                                총 헌혈 횟수
                            </Text>
                            <Text size="xl" fw={600}>
                                {summary.totalCount}회
                            </Text>
                        </div>
                        {summary.lastDonationDate && (
                            <div style={{marginLeft: 32}}>
                                <Text size="xs" c="dimmed">
                                    마지막 헌혈
                                </Text>
                                <Text size="sm">
                                    {summary.lastDonationDate} ({summary.lastDonationType})
                                </Text>

                            </div>
                        )}
                    </Group>
                </Paper>
            )}

            {/* 가능일 (핵심) */}
            <Text fw={500} mb="sm">
                다음 헌혈 가능일
            </Text>
            <SimpleGrid cols={{base: 1, sm: 2}} mb="xl">
                {availability.map((a) => (
                    <AvailabilityCard key={a.type} data={a}/>
                ))}
            </SimpleGrid>

            {/* 기록 목록 */}
            <Text fw={500} mb="sm">
                헌혈 기록 ({donations.length})
            </Text>
            {donations.length === 0 ? (
                <Card withBorder radius="md" p="xl">
                    <Center>
                        <Stack align="center" gap="xs">
                            <Text c="dimmed">아직 헌혈 기록이 없어요</Text>
                            <Button
                                variant="light"
                                color="red"
                                size="sm"
                                onClick={() => setFormOpened(true)}
                            >
                                첫 기록 추가하기
                            </Button>
                        </Stack>
                    </Center>
                </Card>
            ) : (
                <Stack gap="xs">
                    {donations.map((d) => (
                        <Card key={d.id} withBorder radius="md" p="md">
                            <Group justify="space-between">
                                <div>
                                    <Group gap="xs">
                                        <Badge color="gray" variant="light" size="sm">
                                            {d.sequence}회차
                                        </Badge>
                                        <Text fw={500}>{d.donationDate}</Text>
                                        <Badge color="red" variant="light" size="md">
                                            {d.donationTypeName} {d.typeSequence}회
                                        </Badge>
                                    </Group>
                                    <Text size="sm" c="dimmed">
                                        {d.placeName}
                                    </Text>
                                    {d.memo && (
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {d.memo}
                                        </Text>
                                    )}
                                </div>
                                <Group>
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        onClick={() => {
                                            setEditing(d);
                                            setFormOpened(true);
                                        }}
                                    >
                                        ✎
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="subtle"
                                        color="grey"
                                        onClick={() => handleDelete(d.id)}
                                    >
                                        ✕
                                    </ActionIcon>
                                </Group>

                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}

            <DonationForm opened={formOpened} oonClose={() => {
                setFormOpened(false);
                setEditing(null);
            }}
                          onSuccess={loadData}
                          editing={editing}
            />
        </Container>
    )
}

export default DonationPage;