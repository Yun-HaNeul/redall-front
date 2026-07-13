import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
import {Box, Button, Container, Group, Text} from "@mantine/core";

/**
 * 공통 헤더
 * 로고(홈) , 메뉴, 로그인/로그아웃 버튼
 * @constructor
 */

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, isAuthenticated, logout} = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // 현재 페이지 표시용
    const isActive = (path: string) => location.pathname === path;

    return (
        <Box
            style={{
                borderBottom: "1px solid #e9ecef",
                backgroundColor: "white",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <Container size="lg" py="sm">
                <Group justify="space-between">
                    {/* 로고 */}
                    <Text
                        fw={700}
                        size="lg"
                        c="red"
                        style={{cursor: "pointer"}}
                        onClick={() => navigate(isAuthenticated ? "/main" : "/login")}
                    >
                        redall
                    </Text>

                    {/* 메뉴 */}
                    <Group gap="xs">
                        <Button
                            variant={isActive("/blood-centers") ? "light" : "subtle"}
                            color="red"
                            size="sm"
                            onClick={() => navigate("/blood-centers")}
                        >
                            헌혈의 집
                        </Button>
                        <Button
                            variant={isActive("/statistics") ? "light" : "subtle"}
                            color="red"
                            size="sm"
                            onClick={() => navigate("/statistics")}
                        >
                            헌혈 통계
                        </Button>
                    </Group>

                    {/* 로그인 상태 */}
                    <Group gap="xs">
                        {isAuthenticated ? (
                            <>
                                <Text size="sm" c="dimmed">
                                    {user?.name}님
                                </Text>
                                <Button variant="light" color="gray" size="sm" onClick={handleLogout}>
                                    로그아웃
                                </Button>
                            </>
                        ) : (
                            <Button variant="light" color="red" size="sm" onClick={() => navigate("/login")}>
                                로그인
                            </Button>
                        )}
                    </Group>
                </Group>
            </Container>
        </Box>
    );

}

export default Header;