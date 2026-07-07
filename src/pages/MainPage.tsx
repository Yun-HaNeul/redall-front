import {useNavigate} from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Paper,
  Stack,
  Card,
  SimpleGrid,
} from "@mantine/core";
import {isLoggedIn, logout} from "../utils/auth.ts";
import {useEffect} from "react";


function MainPage() {
    const navigate = useNavigate();

    // 로그인 안 했으면 로그인 화면으로
    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login", {replace: true});
        }
    }, [navigate()]);

    const handleLogout = () => {
        logout();
        navigate("/login", {replace: true});
    }

    return (
        <Container size="md" my={40}>
            {/* 상단 헤더 */}
            <Group justify="space-between" mb="xl">
                <Title order={2}>redall</Title>
                <Button variant="light" color="red" onClick={handleLogout}>
                    로그아웃
                </Button>
            </Group>

            {/* 환영 메시지 */}
            <Paper withBorder p="lg" radius="md" mb="xl">
                <Stack gap="xs">
                    <Text size="lg" fw={500}>
                        환영합니다 👋
                    </Text>
                    <Text c="dimmed" size="sm">
                        redall 헌혈 정보 플랫폼입니다. 로그인에 성공했습니다.
                    </Text>
                </Stack>
            </Paper>

            {/* 앞으로 들어올 헌혈 도메인 기능 자리 (지금은 안내만) */}
            <SimpleGrid cols={{base: 1, sm: 3}}>
                <Card withBorder padding="lg" radius="md">
                    <Text fw={500} mb={4}>
                        헌혈 내역
                    </Text>
                    <Text size="sm" c="dimmed">
                        준비 중입니다
                    </Text>
                </Card>
                <Card withBorder padding="lg" radius="md">
                    <Text fw={500} mb={4}>
                        헌혈의 집 찾기
                    </Text>
                    <Text size="sm" c="dimmed">
                        준비 중입니다
                    </Text>
                </Card>
                <Card withBorder padding="lg" radius="md">
                    <Text fw={500} mb={4}>
                        헌혈 통계
                    </Text>
                    <Text size="sm" c="dimmed">
                        준비 중입니다
                    </Text>
                </Card>
            </SimpleGrid>
        </Container>
    );
}

export default MainPage;