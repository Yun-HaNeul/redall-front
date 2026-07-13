import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Title, Text, Button, Group, Paper, Stack,
  Card, SimpleGrid, Loader, Center,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";

/**
 * 메인 페이지 (로그인 후 진입).
 * Context에서 로그인 사용자 정보를 가져와 보여준다.
 */
function MainPage() {
  const navigate = useNavigate();
  const { user, loading, logout, isAuthenticated } = useAuth();

  // 로딩 끝났는데 로그인 안 된 상태면 로그인 화면으로
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="md" my={40}>
      <Paper withBorder p="lg" radius="md" mb="xl">
        <Stack gap="xs">
          <Text size="lg" fw={500}>{user?.name}님, 환영합니다 👋</Text>
          <Text c="dimmed" size="sm">아이디: {user?.username}</Text>
          <Text c="dimmed" size="sm">권한: {user?.roles.join(", ")}</Text>
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Card withBorder padding="lg" radius="md">
          <Text fw={500} mb={4}>헌혈 내역</Text>
          <Text size="sm" c="dimmed">준비 중입니다</Text>
        </Card>
        <Card withBorder padding="lg" radius="md"
              style={{cursor: "pointer"}}
              onClick={() => navigate("/blood-centers")}
        >
          <Text fw={500} mb={4}>헌혈의 집 찾기</Text>
          <Text size="sm" c="dimmed">지도에서 찾기</Text>
        </Card>
        <Card withBorder padding="lg" radius="md" style={{ cursor: "pointer" }} onClick={() => navigate("/statistics")}>
          <Text fw={500} mb={4}>헌혈 통계</Text>
          <Text size="sm" c="dimmed">전국 헌혈 현황</Text>
        </Card>
      </SimpleGrid>
    </Container>
  );
}

export default MainPage;